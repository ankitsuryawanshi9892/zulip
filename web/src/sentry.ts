import * as Sentry from "@sentry/browser";
import _ from "lodash";

import {page_params} from "./page_params";
import {current_user, realm} from "./state_data";

type UserInfo = {
    id?: string;
    realm: string;
    role?: string;
};

export function normalize_path(path: string, is_portico = false): string {
    if (path === undefined) {
        return "unknown";
    }
    path = path
        .replace(/\/\d+(\/|$)/, "/*$1")
        .replace(
            /^\/(join|reactivate|new|accounts\/do_confirm|accounts\/confirm_new_email)\/[^/]+(\/?)$/,
            "$1/*$2",
        );
    if (is_portico) {
        return "portico: " + path;
    }
    return path;
}

export function shouldCreateSpanForRequest(url: string): boolean {
    const parsed = new URL(url, window.location.href);
    return parsed.pathname !== "/json/events";
}

if (page_params.server_sentry_dsn) {
    const url_matches = [/^\//];
    if (document.currentScript instanceof HTMLScriptElement) {
        url_matches.push(
            new RegExp("^" + _.escapeRegExp(new URL(".", document.currentScript.src).href)),
        );
    }
    if (realm.realm_uri !== undefined) {
        url_matches.push(new RegExp("^" + _.escapeRegExp(realm.realm_uri) + "/"));
    }
    const sentry_key =
        // No parameter is the portico pages, empty string is the empty realm
        page_params.realm_sentry_key === undefined
            ? "www"
            : page_params.realm_sentry_key === ""
              ? "(root)"
              : page_params.realm_sentry_key;
    const user_info: UserInfo = {
        realm: sentry_key,
    };
    if (sentry_key !== "www") {
        user_info.role = current_user.is_owner
            ? "Organization owner"
            : current_user.is_admin
              ? "Organization administrator"
              : current_user.is_moderator
                ? "Moderator"
                : current_user.is_guest
                  ? "Guest"
                  : page_params.is_spectator
                    ? "Spectator"
                    : current_user.user_id
                      ? "Member"
                      : "Logged out";
        if (current_user.user_id) {
            user_info.id = current_user.user_id.toString();
        }
    }

    const sample_rates = new Map([
        // This is controlled by shouldCreateSpanForRequest, above, but also put here for consistency
        ["call GET /json/events", 0],
        // These requests are high-volume and do not add much data
        ["call POST /json/users/me/presence", 0.01],
        ["call POST /json/typing", 0.05],
    ]);

    Sentry.init({
        dsn: page_params.server_sentry_dsn,
        environment: page_params.server_sentry_environment ?? "development",
        tunnel: "/error_tracing",

        release: "zulip-server@" + ZULIP_VERSION,
        integrations: [
            new Sentry.BrowserTracing({
                tracePropagationTargets: url_matches,
                startTransactionOnLocationChange: false,
                beforeNavigate(context) {
                    return {
                        ...context,
                        metadata: {source: "custom"},
                        name: normalize_path(location.pathname, sentry_key === "www"),
                    };
                },
                shouldCreateSpanForRequest,
            }),
        ],
        allowUrls: url_matches,
        sampleRate: page_params.server_sentry_sample_rate ?? 0,
        tracesSampler(samplingContext) {
            const base_rate = page_params.server_sentry_trace_rate ?? 0;
            const name = samplingContext.transactionContext.name;
            return base_rate * (sample_rates.get(name) ?? 1);
        },
        initialScope: {
            tags: {
                realm: sentry_key,
                user_role: user_info.role ?? "Browser",
                server_version: realm.zulip_version,
            },
            user: user_info,
        },
    });
} else {
    // Always add the tracing extensions, so Sentry doesn't throw runtime errors if one calls
    // startTransaction without having created the Sentry.BrowserTracing object.
    Sentry.addTracingExtensions();
    Sentry.init({});
}

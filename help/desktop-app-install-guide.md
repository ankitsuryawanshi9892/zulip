# Installing the Zulip desktop app

The Zulip desktop app comes with native desktop notifications, support for
multiple Zulip accounts, and a dedicated tray icon.

Installing the latest stable release is recommended for most users. For an early
look at the newest features, consider the [beta
releases](#install-a-beta-release).

## Install the latest release

{start_tabs}
{tab|mac}

{!app-will-update-tip.md!}

#### Disk image *(recommended)*

1. Download [Zulip for macOS](https://zulip.com/apps/mac).

1. Open the file, and drag the app into the **Applications** folder.

#### Homebrew

1. Run the command `brew install --cask zulip` from a terminal.

1. Run Zulip from **Applications**.

You can run the command `brew upgrade zulip` to immediately upgrade the app.

{tab|windows}

#### Web installer *(recommended)*

{!app-will-update-tip.md!}

1. Download and run [Zulip for Windows](https://zulip.com/apps/windows).

1. Run Zulip from the **Start** menu.

#### Offline installer *(for isolated networks)*

!!! warn ""
    The app will not update automatically. You can repeat these steps to upgrade
    to future versions.

1. Download [zulip-x.x.x-x64.msi][latest] for 64-bit desktops
   (common), or [zulip-x.x.x-ia32.msi][latest] for 32-bit (rare).

1. Copy the installer file to the machine you want to install the app
   on, and open it there.

1. Run Zulip from the **Start** menu.

{tab|linux}

#### APT *(Ubuntu or Debian 8+)*

!!! tip ""
    The app will be updated automatically to future versions when you do a
    regular software update on your system, e.g., with
    `sudo apt update && sudo apt upgrade`.

1. Enter the following commands into a terminal:

        sudo curl -fL -o /etc/apt/trusted.gpg.d/zulip-desktop.asc \
            https://download.zulip.com/desktop/apt/zulip-desktop.asc
        echo "deb https://download.zulip.com/desktop/apt stable main" | \
            sudo tee /etc/apt/sources.list.d/zulip-desktop.list
        sudo apt update
        sudo apt install zulip

    These commands set up the Zulip Desktop APT repository and its signing
    key, and then install the Zulip client.

1. Run Zulip from your app launcher, or with `zulip` from a terminal.

#### AppImage *(recommended for all other distros)*

{!app-will-update-tip.md!}

1. Download [Zulip for Linux](https://zulip.com/apps/linux).

1. Make the file executable, with
   `chmod a+x Zulip-x.x.x-x86_64.AppImage` from a terminal (replace
   `x.x.x` with the actual app version of the downloaded file).

1. Run the file from your app launcher, or from a terminal. This file is the
   Zulip app, so no installation is required.

#### Snap

1. Make sure [snapd](https://docs.snapcraft.io/core/install) is installed.

2. Execute following command to install Zulip:

        sudo snap install zulip

3. Run Zulip from your app launcher, or with `zulip` from a terminal.

#### Flathub

1. Make sure you have [Flatpak](https://flathub.org/setup) installed on your
system.

2. Use the following command from the official
[Flathub page](https://flathub.org/apps/org.zulip.Zulip) to install Zulip:

        flatpak install flathub org.zulip.Zulip

3. After the installation is complete, you can run Zulip using the following
command:

        flatpak run org.zulip.Zulip

{end_tabs}

## Install a beta release

Get a peek at new features before they're released!

#### macOS, Windows, and most Linux distros

Start by finding the latest version marked "Pre-release" on the
[release list page][release-list].  There may or may not be a "Pre-release"
later than the latest release. If there is, download the appropriate Zulip
installer or app from there, and follow the instructions for your operating
system above.

#### Linux with apt (Ubuntu or Debian 8+)

If installing from scratch, follow the instructions above, except in the
command starting `echo "deb https://...` replace `stable` with `beta`.

If you've already installed the stable version, edit `zulip-desktop.list` and
reinstall:
```
sudo sed -i s/stable/beta/ /etc/apt/sources.list.d/zulip-desktop.list
sudo apt update
sudo apt install zulip
```

[latest]: https://github.com/zulip/zulip-desktop/releases/latest
[release-list]: https://github.com/zulip/zulip-desktop/releases

## Related articles

* [Connect through a proxy](/help/connect-through-a-proxy)
* [Use a custom certificate](/help/custom-certificates)
* [View Zulip version](/help/view-zulip-version)

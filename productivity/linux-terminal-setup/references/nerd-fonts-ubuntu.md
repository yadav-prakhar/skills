# Nerd Fonts on Ubuntu — Quick Reference

## Font listing commands

| Command | Purpose |
|---|---|
| `fc-list` | List all installed fonts (full paths + styles) |
| `fc-list \| grep -i meslo` | Filter to Meslo entries |
| `fc-list --format="%{family}\n" \| sort -u` | Just family names |
| `fc-list :lang=en \| head -20` | English fonts only |
| `find ~/.local/share/fonts -name "Meslo*" -type f` | Actual file listing |

## MesloLGS Nerd Font Mono — only the 4 needed files

Variant names in the Nerd Fonts v3.5.0 release archive:
- `MesloLGSNerdFontMono-Regular.ttf`
- `MesloLGSNerdFontMono-Bold.ttf`
- `MesloLGSNerdFontMono-Italic.ttf`
- `MesloLGSNerdFontMono-BoldItalic.ttf`

Extract only these from the archive with `--wildcards`:
```bash
wget -q "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.5.0/Meslo.tar.xz" -O /tmp/Meslo.tar.xz
tar -xf /tmp/Meslo.tar.xz -C "$HOME/.local/share/fonts/" --wildcards "*MesloLGSNerdFontMono*"
rm -f /tmp/Meslo.tar.xz
fc-cache -fv "$HOME/.local/share/fonts/"
```

## GNOME Terminal workaround

Nerd Fonts don't appear in GNOME Terminal's font picker (pango bug). Set system monospace font instead:
```bash
gsettings set org.gnome.desktop.interface monospace-font-name "MesloLGS Nerd Font Mono 12"
# Verify:
gsettings get org.gnome.desktop.interface monospace-font-name
```

Or install GNOME Tweaks for a GUI:
```bash
sudo apt install -y gnome-tweaks
```
Then: GNOME Tweaks → Fonts → Monospace → pick MesloLGS Nerd Font Mono.

## Other terminal emulators

| Terminal | Config line |
|---|---|
| **Kitty** | `font_family MesloLGS Nerd Font Mono` in `~/.config/kitty/kitty.conf` |
| **Alacritty** | `family: "MesloLGS Nerd Font Mono"` in `~/.config/alacritty/alacritty.toml` |
| **VS Code** | `"terminal.integrated.fontFamily": "MesloLGS Nerd Font Mono"` |
| **Tilix** | Edit profile → Custom font → should appear if `fc-cache` ran |

## Font file hierarchy

- `~/.local/share/fonts/` — per-user fonts (recommended, `~/.fonts/` is deprecated)
- `/usr/local/share/fonts/` — system-wide user-installable
- `/usr/share/fonts/` — system-wide package-managed
---
name: linux-terminal-setup
description: "Set up zsh/Oh My Zsh/Oh My Posh/Nerd Fonts/Neovim on Ubuntu."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [zsh, oh-my-zsh, oh-my-posh, nerd-fonts, neovim, gnome-terminal, terminal, ubuntu, linux]
    related_skills: []
---

# Linux Terminal Setup

## When to Use

User asks to set up their terminal/developer environment on a fresh Ubuntu system: install zsh with Oh My Zsh and plugins, add Oh My Posh theming, install Nerd Fonts for icon rendering, or configure Neovim with a basic practical config.

Set up a developer terminal on Ubuntu Linux: zsh with Oh My Zsh, fast plugins, Oh My Posh theming, Nerd Fonts, and Neovim with a sensible basic config.

## Prerequisites

- Ubuntu/Debian Linux (apt-based)
- `sudo` access
- `curl`, `git`, `wget`, `unzip` available

## Step 1: Install zsh and Neovim

```bash
sudo apt update && sudo apt install -y curl git neovim
```

zsh is usually pre-installed; check with `which zsh`. If not, `sudo apt install -y zsh`.

## Step 2: Oh My Zsh (unattended)

```bash
RUNZSH=no CHSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Flags `RUNZSH=no` skip launching zsh immediately; `CHSH=no` skip changing the default shell.

## Step 3: Fast zsh plugins

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions
```

Then in `.zshrc`, set:
```zsh
plugins=(git zsh-autosuggestions fast-syntax-highlighting zsh-completions)
```

## Step 4: Oh My Posh

```bash
sudo wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/posh-linux-amd64 -O /usr/local/bin/oh-my-posh
sudo chmod +x /usr/local/bin/oh-my-posh
```

**CRITICAL — config path syntax**: The `oh-my-posh config themes path` subcommand does NOT exist. Always use a direct file path:
```zsh
# Download a theme to a known location
mkdir -p ~/.poshthemes
wget -q https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/montys.omp.json -O ~/.poshthemes/montys.omp.json

# In .zshrc:
eval "$(oh-my-posh init zsh --config ~/.poshthemes/montys.omp.json)"
```

## Step 5: Nerd Fonts (MesloLGS)

Do NOT download the full Nerd Fonts pack (~73 files). Download only the 4 needed MesloLGS Nerd Font Mono files:

```bash
FONT_DIR="$HOME/.local/share/fonts"
mkdir -p "$FONT_DIR"
wget -q "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.5.0/Meslo.tar.xz" -O /tmp/Meslo.tar.xz
tar -xf /tmp/Meslo.tar.xz -C "$FONT_DIR/" --wildcards "*MesloLGSNerdFontMono*" 2>/dev/null
rm -f /tmp/Meslo.tar.xz
fc-cache -fv "$FONT_DIR"
```

### GNOME Terminal workaround (required if on GNOME):

GNOME Terminal has a known bug where Nerd Fonts do NOT appear in the GUI font selector. Set via gsettings:

```bash
gsettings set org.gnome.desktop.interface monospace-font-name "MesloLGS Nerd Font Mono 12"
```

This sets the system monospace font. GNOME Terminal respects this when "Custom font" is unchecked (the default).

## Step 6: Neovim basic config

Write `~/.config/nvim/init.vim`:

```vim
set number relativenumber
syntax on
colorscheme desert
set tabstop=4 shiftwidth=4 expandtab autoindent smartindent
set hlsearch incsearch ignorecase smartcase
set mouse=a
set clipboard+=unnamedplus
set splitbelow splitright
set wildmenu wildmode=list:longest,full
set noswapfile nobackup nowritebackup
set undofile undodir=~/.config/nvim/undo
set laststatus=2 ruler cursorline
set scrolloff=5 sidescrolloff=5
filetype plugin indent on
let mapleader = ","
nnoremap <silent> <Esc><Esc> :nohlsearch<CR>
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
```

## Pitfalls

- **oh-my-posh config themes path** does NOT exist. Always provide a direct `.json` file path to `--config`.
- **Full Nerd Fonts pack** downloads 73+ files when you only need 4 (`MesloLGSNerdFontMono-*`).
- **GNOME Terminal font selector** doesn't show Nerd Fonts (known pango bug). Use `gsettings` or GNOME Tweaks.
- **Nerd Font file names** differ between the patched-fonts repo tree and release archives. The release archive (`Meslo.tar.xz`) is the most reliable source.
- **Font cache**: always run `fc-cache -fv` after placing font files, and verify with `fc-list | grep Meslo`.
- **Plugin order matters**: `fast-syntax-highlighting` must be loaded last among plugins (it's the default in Oh My Zsh's load order, but confirm it's at the end of the `plugins=()` list).
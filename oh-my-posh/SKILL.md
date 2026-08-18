---
name: oh-my-posh
description: Install and configure Oh My Posh themes in terminal shells
---

# Oh My Posh Theme Management

Skill for installing, configuring, and managing Oh My Posh themes in terminal shells.

## When to Use
Use when you need to install or configure custom Oh My Posh themes for zsh, bash, or other shells.

## Steps

1. **Verify Oh My Posh is installed**
   ```bash
   oh-my-posh version
   ```

2. **Check your current shell**
   ```bash
   echo $SHELL
   ```

3. **Create themes directory if needed**
   ```bash
   mkdir -p ~/.local/share/oh-my-posh/themes
   ```

4. **Copy theme file to themes directory**
   ```bash
   cp /path/to/theme.json ~/.local/share/oh-my-posh/themes/
   ```

5. **Backup existing shell configuration**
   ```bash
   cp ~/.zshrc ~/.zshrc.backup  # For zsh
   # or cp ~/.bashrc ~/.bashrc.backup  # For bash
   ```

6. **Update shell configuration to use the theme**
   - For zsh in ~/.zshrc:
     ```bash
     eval "$(oh-my-posh init zsh --config ~/.local/share/oh-my-posh/themes/your-theme.omp.json)"
     ```
   - For bash in ~/.bashrc:
     ```bash
     eval "$(oh-my-posh init bash --config ~/.local/share/oh-my-posh/themes/your-theme.omp.json)"
     ```

7. **Apply changes**
   ```bash
   source ~/.zshrc  # For zsh
   # or source ~/.bashrc  # For bash
   ```

8. **Verify theme loaded**
   ```bash
   # Should see your custom prompt
   ```

## Pitfalls
- Always backup shell configuration files before modifying
- Verify the theme file path is correct in the shell config
- Use `source` to reload configuration in the current session
- Test in a new terminal session to ensure persistence

## Verification
- Check that the theme file exists: `ls ~/.local/share/oh-my-posh/themes/`
- Verify shell loads without errors: `zsh -c "source ~/.zshrc"`
- Confirm custom prompt elements appear

## References
- [prakhar-omp.json](references/prakhar-omp.json) - Example Oh My Posh theme
---
name: hermes-agent-hud
description: Toggle Hermes Agent HUD with Ctrl+Shift+H keyboard shortcut.
---

## Trigger
You want to quickly access Hermes Agent over any other application without leaving your current workspace, using a keyboard shortcut.

## Procedure
1. Ensure the Hermes Agent desktop app is running.
2. Press `Ctrl+Shift+H` (on Linux/Ubuntu) or `Cmd+Shift+H` (on macOS) to toggle the HUD (chrome-free floating chat).
3. The HUD appears as a small window floating over your current application.
4. Type your request in the HUD input box and press Enter to send it to Hermes Agent.
5. Press `Ctrl+Shift+H` again to hide the HUD.

## Details
- The HUD mode is a strip of Hermes floating over another application, so unqualified references like "this" or "here" usually refer to the app behind the HUD, not to Hermes itself.
- You can move the HUD from app to app mid-conversation, and Hermes Agent keeps track of the underlying window so your requests stay grounded in the correct context.
- The same keyboard shortcut (`Ctrl+Shift+H` / `Cmd+Shift+H`) is also registered as a global OS shortcut while the HUD mode is up.

## References
- See the Hermes Agent source code in `apps/desktop/src/lib/keybinds/actions.ts` for the keybinding definition.
- For more information about HUD mode, see the `hud_surface_note` function in `agent/prompt_builder.py`.

## Pitfalls
- If the HUD does not appear, ensure that the Hermes Agent desktop app is focused and running.
- On some Linux window managers, the shortcut might conflict with existing shortcuts. You can reassign the shortcut in the desktop app's settings if needed.
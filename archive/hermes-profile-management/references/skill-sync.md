# Skill Sync in Hermes Agent

Skill Sync allows you to keep your skills consistent across multiple devices and share them with your team via Nous Portal.

## How Skill Sync Works

1. **Personal Sync**: Keeps your own skills synchronized between your devices
2. **Team Sync**: If you belong to an organization, you also get shared skills and can propose your own back to the team

## Setup Requirements

1. **Nous Portal Account**: You must have a Nous Portal account and be logged in
2. **Feature Enablement**: The Skill Sync feature must be enabled in your Portal account
3. **Opt-in Skills**: You choose which skills to sync (bundled/hub skills cannot be synced)

## Step-by-Step Guide

### 1. Log into Nous Portal
```bash
hermes portal login
```
This opens a browser window for you to authorize Hermes with your Nous account.

### 2. Enable Skill Sync in Portal (Critical First Step)
- Open the Nous Portal: `hermes portal open`
- In the portal UI, navigate to settings and enable the "Skill Sync" feature/toggle
- Verify sync is enabled: `hermes sync status` should show `"feature_enabled": true`

### 3. Enable Skills for Sync
Choose which skills you want to sync:

**Enable a specific skill:**
```bash
hermes sync enable <skill-name>
```

**Enable all local skills:**
```bash
cd ~/.hermes/profiles/default/skills && \
find . -name 'SKILL.md' -execdir sh -c 'grep -h "^name:" "$1" | sed "s/^name: //"' _ {} \; | sort -u | \
while read skill; do hermes sync enable "$skill"; done
```

### 4. Perform Sync Operations

**Push your skills to the portal:**
```bash
hermes sync push
```

**Pull skills from the portal:**
```bash
hermes sync pull
```

**Full reconcile (recommended - pull then push):**
```bash
hermes sync now
```

**Check sync status:**
```bash
hermes sync status
```

### 5. Manage Device Label (Optional)
```bash
# Show current device label
hermes sync device

# Set device label
hermes sync device --name "my-work laptop"
```

## What Gets Synced

- **Skill definitions** (SKILL.md files)
- **Support files** (references/, templates/, scripts/)
- **Skill metadata** (usage statistics, etc.)

## What Does NOT Get Synced

- Bundled skills (shipped with Hermes)
- Hub-installed skills (installed via `hermes skills install`)
- Pinned skills (marked via `hermes curator pin`)
- Profile-specific configuration (use profile export/import for this)
- Memories and session data

## Troubleshooting

**Sync shows "not enabled for your account yet"**
- Verify you've enabled Skill Sync in the Nous Portal UI
- Check that `hermes sync status` shows `"feature_enabled": true`
- Try logging out and back in: `hermes portal logout` then `hermes portal login`

**No skills showing as opted in**
- Ensure you've run `hermes sync enable <skill>` for each skill
- Check that skills are under `~/.hermes/skills/` or `~/.hermes/profiles/<name>/skills/`
- Remember that bundled/hub skills cannot be synced

## Best Practices

1. **Enable sync before making changes** - so your updates get backed up
2. **Regularly run `hermes sync now`** - to keep devices in sync
3. **Be selective about what you sync** - only enable skills you've created or modified
4. **Verify after major changes** - run `hermes sync status` to confirm everything looks correct
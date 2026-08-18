---
name: hermes-profile-management
description: Manage Hermes profiles export import backup
---

# Hermes Profile Management

Skills for managing Hermes Agent profiles including exporting, importing, backing up, and migrating between machines or installations.

## Profile Structure

Hermes Agent profiles are stored in ~/.hermes/profiles/<profile-name>/ and contain:

- config.yaml - Profile-specific configuration (model, provider, toolsets, etc.)
- skills/ - Profile-specific skills (can override global skills)
- memories/ - Memory files (MEMORY.md, USER.md)
- sessions/ - Session dump files
- cron/ - Cron job data and execution history
- plugins/ - Profile-specific plugins

## Safe Profile Merging

When merging profiles (e.g., from backup or another machine), use --ignore-existing to avoid overwriting current data:

```bash
# Extract backup to temporary location first
mkdir -p /tmp/hermes_merge && tar -xzf profile-backup.tar.gz -C /tmp/hermes_merge

# Merge without overwriting existing files
rsync -av --ignore-existing /tmp/hermes_merge/default/ ~/.hermes/profiles/default/

# For specific profile
rsync -av --ignore-existing /tmp/hermes_merge/tech-teacher/ ~/.hermes/profiles/tech-teacher/
```

## Skill Management When Merging

After merging profile directories, update the skills manifest to include any new skills:

```bash
# Calculate hash of skill directory contents
cd ~/.hermes/profiles/default/skills && find health/medical-assistant -type f -not -path "*/\.*" -exec md5sum {} \; | sort | md5sum | cut -d' ' -f1

# Add to bundled manifest
echo "health/medical-assistant:$(find health/medical-assistant -type f -not -path "*/\.*" -exec md5sum {} \; | sort | md5sum | cut -d' ' -f1)" >> .bundled_manifest
```

## Backup and Export

To create a backup of a profile:

```bash
tar -czf ~/.hermes-backup-$(date +%Y%m%d).tar.gz -C ~/.hermes/profiles/ default/
```

To export a specific profile:

```bash
tar -czf tech-teacher-profile.tar.gz -C ~/.hermes/profiles/ tech-teacher/
```

## Configuration Notes

Profile-specific config.yaml only needs to contain settings that differ from the global/default configuration. Settings not present in the profile config will fall back to global values.

Common profile-specific settings:
- default: - Model and provider
- cwd: - Working directory
- font_family: - Terminal font
- reasoning_effort: - Reasoning level (low/medium/high)

## Verification

After merging or importing a profile, verify:
1. Skills are properly loaded: hermes skills list
2. Configuration is correct: hermes model and hermes config
3. Memories are intact: Check ~/.hermes/profiles/<name>/memories/MEMORY.md
4. Sessions are accessible: Check ~/.hermes/profiles/<name>/sessions/

## Safety Precautions

- Always extract backups to a temporary location first to inspect contents
- Use --ignore-existing with rsync to avoid accidental overwrites
- Backup current profile before importing: tar -czf pre-import-backup.tar.gz -C ~/.hermes/profiles/ default/
- Verify skill hashes after merging to ensure proper skill registration
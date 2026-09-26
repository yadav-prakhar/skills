---
name: disk-audit
description: 'Analyze disks, find OS installs, audit boot config.'
category: productivity
tags:
  - linux
  - storage
  - partition
  - boot
  - grub
  - multi-boot
  - swap
  - disk-analysis
linked_files:
  - references/commands-and-pitfalls.md
---

# Disk Audit

Analyze a Linux system's disk layout, identify OS installations, review boot configuration, and make storage recommendations — all without making changes unless explicitly authorized.

## Workflow

### 1. Gather Block Device Overview

Run `lsblk` first — it shows all disks, partitions, sizes, filesystem types, mount points, and model names in one view.

```
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE,LABEL,MODEL
```

Key things to note:
- Disk count, type (SSD vs HDD), and total capacity
- Partition layout (GPT vs MBR — check with `fdisk -l` or `parted`)
- Encrypted volumes (crypto_LUKS) and LVM
- Which partitions are mounted

### 2. Identify Filesystems and UUIDs

```
sudo blkid
```

Gives UUIDs, filesystem types, and labels — critical for cross-referencing with fstab and GRUB config.

### 3. Check Mounted Filesystems and Disk Usage

```
df -h
```

Shows current usage. For unmounted partitions the user may have mounted later, check `/run/media/` paths.

### 4. Identify Installed OSes

For each ext4/btrfs partition that isn't obviously data:
- Mount it read-only: `sudo mount -o ro /dev/<partition> /mnt`
- Check OS: `cat /mnt/etc/os-release`
- Look at kernel version in `/mnt/boot/`
- Unmount when done

### 5. Analyze Boot Configuration

**GRUB menu entries (requires sudo — file is root-owned):**
```
sudo grep 'menuentry' /boot/grub/grub.cfg
```

**EFI boot entries:**
```
sudo efibootmgr -v
```

**Check UEFI vs legacy:**
```
cat /sys/firmware/efi/fw_platform_size  # 64 = UEFI 64-bit
ls /sys/firmware/efi/efivars/ 2>/dev/null && echo "UEFI" || echo "Legacy"
```

**Check os-prober status in GRUB config:**
```
grep -i 'os.prober\|GRUB_DISABLE_OS_PROBER' /etc/default/grub
```
Note: `#GRUB_DISABLE_OS_PROBER=false` (commented out) means os-prober is **disabled** (modern Ubuntu default). The grub.cfg might still contain stale os-prober entries from a previous `update-grub` run.

**Check all `/etc/grub.d/` scripts:**
```
ls -la /etc/grub.d/
```
`30_os-prober` must be present and executable for os-prober to work when enabled.

**Check for custom entries:**
```
cat /boot/grub/custom.cfg 2>/dev/null
```

### 6. Analyze Swap Configuration

```
swapon --show
cat /etc/fstab | grep swap
```

Check:
- Swap file vs swap partition
- Encryption (swap file inside LUKS is encrypted; bare swap partition is not)
- Size adequacy relative to RAM

### 7. Present Findings and Ask Before Changes

Do NOT modify any configuration, run update-grub, or change fstab without explicit user approval. Present findings clearly and ask what they'd like to do.

## Pitfalls

- **GRUB config is root-owned** — `grep /boot/grub/grub.cfg` fails with permission denied if run without sudo. Always use `sudo grep` or `sudo cat`.
- **Stale os-prober entries** — `GRUB_DISABLE_OS_PROBER=true` prevents new scans, but existing entries in grub.cfg persist until `update-grub` is run. The user might see old OS entries even after disabling os-prober.
- **Swap partition encryption** — A swap partition on an unencrypted disk stores anything swapped out in plaintext. If the root filesystem is LUKS-encrypted, moving swap outside that encryption is a *downgrade*.
- **Mounting partitions** — Always mount read-only (`-o ro`) for analysis. Unmount when done.
- **LVM detection** — LVM volumes may not appear in `lsblk` at first. Check `sudo lvdisplay` and `sudo vgdisplay` if the block device tree shows LVM2_member.

## References

See `references/commands-and-pitfalls.md` for a condensed quick-reference of all commands used in disk analysis.
# Mounting NTFS Partitions for Analysis

When analyzing disks, you may need to mount NTFS partitions to inspect their contents. This guide covers safe mounting practices for analysis purposes.

## Using udisksctl (Recommended for non-interactive environments)

The `udisksctl` command can mount partitions without requiring sudo for removable media, and often works without password prompts for internal drives too.

```bash
# List block devices to identify the partition
lsblk -f

# Mount the partition (replace /dev/sdb1 with your partition)
udisksctl mount -b /dev/sdb1

# This will typically mount at /run/media/$USER/label or /run/media/$USER/uuid
# To find the mount point:
lsblk -o MOUNTPOINT /dev/sdb1

# When done, unmount:
udisksctl unmount -b /dev/sdb1
```

## Using sudo mount (Traditional method)

If udisksctl is not available or fails, use sudo mount.

```bash
# Create a mount point (choose a location like /mnt or /media)
sudo mkdir -p /mnt/ntfs-analysis

# Mount the partition read-only for safe analysis
sudo mount -o ro /dev/sdb1 /mnt/ntfs-analysis

# When done, unmount and remove the mount point
sudo umount /dev/sdb1
sudo rmdir /mnt/ntfs-analysis
```

## Important Notes for NTFS

- **Read-only mounting**: For analysis, always mount with `-o ro` to avoid accidental writes.
- **File permissions**: NTFS permissions may not map cleanly to Linux; files may appear accessible regardless of original permissions.
- **Hibernation/Fast Startup**: If the NTFS partition comes from Windows with Fast Startup enabled, you may need to disable Fast Startup in Windows or mount with the `remove_hiberfile` option (use with caution as this deletes Windows hibernation state).
- **Size mismatch**: The reported size in `lsblk` may differ from usable space due to filesystem overhead.

## Verifying Mount Success

After mounting, verify access:

```bash
# List contents
ls -la /run/media/$USER/HDD\ 1   # or whatever mount point

# Check available space
df -h /run/media/$USER/HDD\ 1
```

## Troubleshooting

- **udisksctl: Error mounting /dev/sdb1: GDBus.Error:org.freedesktop.UDisks2.Error.Failed: Error opening /dev/sdb1: Permission denied**
  → Try using sudo mount instead, or ensure you have permission to access the block device.

- **NTFS is marked as hibernated**: 
  → Boot into Windows and fully shut down (not hybrid sleep), or use `sudo mount -o remove_hiberfile` if you understand the risks.

- **Wrong filesystem type**:
  → Double-check the partition with `lsblk -f` or `sudo blkid` to confirm it's NTFS.
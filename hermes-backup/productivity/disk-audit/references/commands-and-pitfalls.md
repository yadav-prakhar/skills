# Disk Audit — Command Quick Reference

## Block Devices & Partitions
```
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE,LABEL,MODEL     # Full overview
sudo blkid                                                  # UUIDs + filesystem types
sudo parted /dev/<disk> print                               # GPT/MBR partition table
sudo fdisk -l /dev/<disk>                                   # Alt partition view
```

## Disk Usage
```
df -h                                                       # Mounted filesystem usage
```

## OS Identification
```
sudo mount -o ro /dev/<partition> /mnt                     # Mount read-only for inspection
cat /mnt/etc/os-release                                     # OS name + version
ls /mnt/boot/                                               # Kernel images
sudo umount /mnt                                            # Cleanup
```

## Boot Configuration
```
sudo grep 'menuentry' /boot/grub/grub.cfg                  # All GRUB menu entries
sudo efibootmgr -v                                          # UEFI boot entries + order
cat /sys/firmware/efi/fw_platform_size                      # 64 = UEFI; empty = legacy
cat /etc/default/grub                                       # GRUB_DEFAULT, TIMEOUT, os-prober
ls -la /etc/grub.d/                                         # GRUB generator scripts
cat /boot/grub/custom.cfg 2>/dev/null                       # Custom GRUB entries
```

## Swap
```
swapon --show                                                # Active swap
cat /etc/fstab | grep swap                                  # Configured swap
```

## LVM (if LVM2_member appears in lsblk)
```
sudo lvdisplay                                              # Logical volumes
sudo vgdisplay                                              # Volume groups
sudo pvdisplay                                              # Physical volumes
```
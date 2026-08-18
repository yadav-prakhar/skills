# HuggingFace Download Tips

## Using `hf` CLI
- To list files in a repo without downloading: `hf model <repo-id> --type model` (note: the `hf models` command may be needed; check `hf models --help`).
- For dry-run downloads: `hf download <repo-id> --include "*.gguf" --dry-run`.
- To download specific files: `hf download <repo-id> <file1> <file2> ...`.
- Use `--local-dir <path>` to specify where to place files (defaults to current directory with repo structure).
- Remove `.lock` files in `~/.cache/huggingface/download/` if a download stalls.
- Set `HF_HUB_ENABLE_HF_TRANSFER=1` for faster transfers (if available).

## Using `wget`
- Construct the raw URL: `https://huggingface.co/<repo-id>/resolve/main/<path-in-repo>`.
- Use `wget -c` to continue partially downloaded files.
- For multiple files, you can loop over a list or use wildcards with shell expansion.

## Using `aria2c`
- For multi-connection downloads: `aria2c -x 16 -s 16 <url>`.
- Supports resuming with `-c`.

## Verifying downloads
- Compare file sizes with those reported on the HuggingFace repo page.
- If the download completes without error, the file is likely intact (HF serves correct files).

## NTFS considerations
- When mounting NTFS via `udisksctl`, the user typically gets full read/write permissions.
- Ensure the mount point is not mounted with `ro` or `uid/gid` restrictions.
- Check mount options with `mount | grep <dev>`.
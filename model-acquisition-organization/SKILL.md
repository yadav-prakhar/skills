---
name: model-acquisition-organization
description: Download AI models from HuggingFace to external drives.
category: mlops
---

# Model Acquisition and Organization

**Description:** Download and organize large AI model files (e.g., GGUF) from HuggingFace, verify integrity, handle resumable downloads, and structure storage on external drives.

**When to use:** You need to obtain a large model release (often multiple shards) from HuggingFace, store it on a secondary drive (e.g., NTFS HDD), and keep the workspace tidy for future inference.

**Steps:**

1. **Prepare storage**
   - Identify the target mount point (e.g., `/run/media/pybuntu/HDD 1`).
   - Verify the partition is mounted (`lsblk -f` or `udisksctl status`).
   - If not mounted, mount it via `udisksctl mount -b /dev/sdXN` or via `/etc/fstab`.
   - Check free space: `df -h <mount_point>`.
   - Create a dedicated directory for the model: `mkdir -p <mount_point>/models/<model-name>-<version>`.

2. **Discover available versions**
   - Search HuggingFace for the model: `web_search "<model> GGUF huggingface"`.
   - List candidate repositories (e.g., `unsloth/<model>-GGUF`, `bartowski/<model>-GGUF`, `bullerwins/<model>-GGUF`).
   - For each repo, retrieve the file listing (use `hf download --dry-run` or inspect the repo page).
   - Present a summary table to the user: quantization, size, notes, and recommend based on use‑case (lossless vs. size‑constrained).

3. **Select version**
   - Ask the user to choose a specific quantization or the original safetensors release.
   - Record the exact repo ID and file glob (e.g., `unsloth/DeepSeek-V4-Flash-0731-GGUF` and `UD-Q4_K_XL/*`).

4. **Download with resumable support**
   - Prefer `wget -c` or `aria2c -x 16 -s 16` for large files.
   - Example for a single shard:
     ```
     cd <target_dir>
     wget -c "https://huggingface.co/<repo>/resolve/main/<path>"
     ```
   - For multiple shards, loop over the list or use a wildcard with `wget -c` (note: wildcard may need shell expansion).
   - If using the `hf` CLI, first remove stale lock files:
     ```
     rm -rf <target_dir>/.cache/huggingface/download/<subpath>
     ```
   - Monitor progress via `ls -lh` to see growing file sizes.

5. **Post‑download verification**
   - Confirm all expected shards are present and sizes match the repo’s reported sizes.
   - Optionally compute checksums if provided (HF does not provide direct checksums; rely on successful download completion).

6. **Organize for future use**
   - Keep the downloaded files inside the version‑specific directory.
   - Create a symlink or environment variable pointing to the directory if inference tools expect a specific path.
   - Document the chosen version and download date in a `README.txt` inside the folder.

**Pitfalls:**
- Lock files (`.lock`) in the HF cache can block resumption; delete them if a download stalls.
- Network interruptions may leave `.incomplete` files; `wget -c` will resume, but ensure the lock is cleared.
- NTFS partitions may have permission issues; ensure the mount allows write access for your user (usually default when mounted via `udisksctl`).
- Avoid downloading to a nearly full partition; leave at least 5‑10 GB free for temporary files.

**References:**
- See `references/hf-download-tips.md` for additional HuggingFace CLI tips.
- See `scripts/verify-model-download.sh` for a simple verification helper.
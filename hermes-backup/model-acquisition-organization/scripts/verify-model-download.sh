#!/bin/bash
# verify-model-download.sh
# Simple script to verify downloaded model files

set -euo pipefail

MODEL_DIR="$1"
EXPECTED_COUNT="$2"  # optional

if [[ -z "$MODEL_DIR" ]]; then
  echo "Usage: $0 <model_directory> [expected_file_count]"
  exit 1
fi

if [[ ! -d "$MODEL_DIR" ]]; then
  echo "Error: Directory $MODEL_DIR does not exist"
  exit 1
fi

echo "Verifying model download in: $MODEL_DIR"

# Count files
if [[ -n "$EXPECTED_COUNT" ]]; then
  ACTUAL_COUNT=$(find "$MODEL_DIR" -type f | wc -l)
  echo "Found $ACTUAL_COUNT files, expected $EXPECTED_COUNT"
  if [[ "$ACTUAL_COUNT" -ne "$EXPECTED_COUNT" ]]; then
    echo "Warning: File count mismatch"
  fi
fi

# Check for incomplete or lock files
INCOMPLETE=$(find "$MODEL_DIR" -name "*.incomplete" -o -name "*.lock" | wc -l)
if [[ "$INCOMPLETE" -gt 0 ]]; then
  echo "Warning: Found $INCOMPLETE incomplete/lock files"
  find "$MODEL_DIR" -name "*.incomplete" -o -name "*.lock"
else
  echo "No incomplete or lock files found."
fi

# List largest files
echo "Largest files:"
du -ah "$MODEL_DIR" | sort -rh | head -10

echo "Verification complete."
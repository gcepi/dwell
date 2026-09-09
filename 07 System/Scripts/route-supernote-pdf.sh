#!/usr/bin/env bash
# Routes PDFs from Supernote/EXPORT/ into 07 System/Inbox/Raw/.
#
# File type is the signal. Every PDF in EXPORT/ is copied to Raw with a
# metadata sidecar. No filename convention.
#
# Originals stay in EXPORT/. A ledger keyed on name, size, and mtime keeps
# repeat runs from copying the same file twice, and re-copies a file that
# changed. Nothing is overwritten and nothing is deleted.
#
# Usage: bash "07 System/Scripts/route-supernote-pdf.sh" [--quiet]

set -uo pipefail

VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$VAULT/Supernote/EXPORT"
DEST="$VAULT/07 System/Inbox/Raw"
LEDGER="$VAULT/07 System/Agent/processed-pdfs.txt"

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

say() { [ "$QUIET" -eq 1 ] || printf '%s\n' "$*"; }

mkdir -p "$SRC" "$DEST"
[ -f "$LEDGER" ] || : > "$LEDGER"

# A file still being written by the device sync is left for the next pass.
MIN_AGE_SECONDS=90
now=$(date +%s)

copied=0
skipped=0
held=0
failed=0
COPIED_NAMES=()

while IFS= read -r src; do
  [ -n "$src" ] || continue
  name="$(basename "$src")"

  mtime=$(stat -f %m "$src" 2>/dev/null) || { failed=$((failed + 1)); continue; }
  size=$(stat -f %z "$src" 2>/dev/null) || { failed=$((failed + 1)); continue; }

  if [ $((now - mtime)) -lt "$MIN_AGE_SECONDS" ]; then
    held=$((held + 1))
    say "  held (still syncing): $name"
    continue
  fi

  key="$name	$size	$mtime"
  if grep -Fqx "$key" "$LEDGER"; then
    skipped=$((skipped + 1))
    continue
  fi

  # Never clobber an existing file of the same name.
  target="$DEST/$name"
  if [ -e "$target" ]; then
    stem="${name%.*}"
    ext="${name##*.}"
    target="$DEST/$stem $(date -r "$mtime" +%Y%m%d-%H%M%S).$ext"
  fi

  if ! cp -p "$src" "$target"; then
    failed=$((failed + 1))
    say "  FAILED to copy: $name"
    continue
  fi

  base="$(basename "$target")"
  cat > "$DEST/$base.meta.md" <<EOF
---
type: capture
status: inbox
created: "$(date +%Y-%m-%d)"
origin: supernote
what: PDF
source_file: "$name"
source_path: "Supernote/EXPORT/$name"
bytes: $size
routed_at: "$(date +%Y-%m-%dT%H:%M:%S%z)"
modified_at: "$(date -r "$mtime" +%Y-%m-%dT%H:%M:%S%z)"
---
## Capture

Handwritten PDF from the Supernote. Original is at \`Supernote/EXPORT/$name\`.

Attached: \`$base\`
EOF

  printf '%s\n' "$key" >> "$LEDGER"
  copied=$((copied + 1))
  COPIED_NAMES+=("$base")
  say "  routed: $base"
done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.pdf' \) -print 2>/dev/null | sort)

if [ "$QUIET" -eq 1 ]; then
  # Machine-readable line for dwell-sync.sh.
  printf 'PDF_RESULT copied=%d skipped=%d held=%d failed=%d\n' \
    "$copied" "$skipped" "$held" "$failed"
  for n in ${COPIED_NAMES+"${COPIED_NAMES[@]}"}; do
    printf 'PDF_FILE %s\n' "$n"
  done
else
  say ""
  say "Processed $copied PDF(s). $skipped already done, $held held, $failed failed."
fi

[ "$failed" -gt 0 ] && exit 1
exit 0

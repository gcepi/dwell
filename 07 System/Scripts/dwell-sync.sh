#!/usr/bin/env bash
# End-of-day sync for the DWELL vault. Run from anywhere:
#
#   bash "07 System/Scripts/dwell-sync.sh"
#
# Four steps, then a summary:
#   1. Route Supernote PDFs from Supernote/EXPORT/ into 07 System/Inbox/Raw/
#   2. Inventory the inbox: what is waiting, what is flagged, what failed
#   3. Validate tasks, Notes, and prose against the voice rules
#   4. Commit and push
#
# Flags:
#   --no-git    skip the commit and push
#   --no-push   commit locally, do not push
#   -v          print every validator line, not just failures
#
# Needs bash, git, and node. Judgment calls stay with the nightly agent and
# with Graham; this reports them, it does not make them.

set -uo pipefail

VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$VAULT" || exit 2

DO_GIT=1
DO_PUSH=1
VERBOSE=0
for arg in "$@"; do
  case "$arg" in
    --no-git) DO_GIT=0 ;;
    --no-push) DO_PUSH=0 ;;
    -v|--verbose) VERBOSE=1 ;;
    *) printf 'Unknown flag: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

AGENT="07 System/Agent"
INBOX="07 System/Inbox"

# Prose the validators should read. The Agent, Documentation, and Templates
# folders are excluded: they quote the banned words to define the rules about
# them, so AGENT-VOICE.md can never pass its own check.
VOICE_DIRS=(
  "01 Home"
  "02 Portfolio"
  "03 People"
  "04 Projects"
  "05 Meetings"
  "06 Playbook"
  "07 System/Logs"
  "07 System/Sources"
)

FLAGS=()
ERRORS=()
note_flag() { FLAGS+=("$1"); }
note_error() { ERRORS+=("$1"); }

have_node=1
command -v node >/dev/null 2>&1 || have_node=0

# ---------------------------------------------------------------- 1. PDFs

pdf_copied=0
pdf_held=0
pdf_failed=0
PDF_NAMES=()

if [ -x "07 System/Scripts/route-supernote-pdf.sh" ] || [ -f "07 System/Scripts/route-supernote-pdf.sh" ]; then
  while IFS= read -r line; do
    case "$line" in
      PDF_RESULT*)
        for kv in $line; do
          case "$kv" in
            copied=*) pdf_copied="${kv#copied=}" ;;
            held=*)   pdf_held="${kv#held=}" ;;
            failed=*) pdf_failed="${kv#failed=}" ;;
          esac
        done
        ;;
      PDF_FILE*) PDF_NAMES+=("${line#PDF_FILE }") ;;
    esac
  done < <(bash "07 System/Scripts/route-supernote-pdf.sh" --quiet 2>/dev/null)
else
  note_flag "route-supernote-pdf.sh is missing; no PDFs were routed."
fi

[ "$pdf_held" -gt 0 ] && note_flag "$pdf_held PDF(s) still syncing, held for the next run."
[ "$pdf_failed" -gt 0 ] && note_error "$pdf_failed PDF(s) failed to copy out of Supernote/EXPORT/."

# ------------------------------------------------------------- 2. Inventory

count_children() {
  # Direct children of a folder, ignoring structural and OS files.
  local dir="$1"
  [ -d "$dir" ] || { printf '0\n'; return; }
  find "$dir" -maxdepth 1 -type f \
    ! -name '.gitkeep' ! -name '.DS_Store' ! -name '*.meta.md' \
    -print 2>/dev/null | wc -l | tr -d ' '
}

raw_waiting=$(count_children "$INBOX/Raw")
needs_review=$(count_children "$INBOX/Needs Review")
inbox_failed=$(count_children "$INBOX/Failed")

[ "$needs_review" -gt 0 ] && note_flag "$needs_review item(s) in Inbox/Needs Review awaiting a decision."
[ "$inbox_failed" -gt 0 ] && note_error "$inbox_failed item(s) in Inbox/Failed. This folder should be empty."

# ------------------------------------------------------------ 3. Validation

validation_failures=0

run_validator() {
  local script="$1"; shift
  local label="$1"; shift
  local target="$1"

  [ -f "$AGENT/$script" ] || { note_flag "$script is missing; $label not validated."; return; }
  [ -e "$target" ] || return

  local out status
  out="$(node "$AGENT/$script" "$target" 2>&1)"
  status=$?

  if [ "$status" -ne 0 ]; then
    validation_failures=$((validation_failures + 1))
    local detail
    detail="$(printf '%s\n' "$out" | grep -E '^- ' | head -3 | sed 's/^- /  /')"
    note_error "$label failed validation:
$detail"
  elif [ "$VERBOSE" -eq 1 ]; then
    printf '%s\n' "$out"
  fi
}

if [ "$have_node" -eq 0 ]; then
  note_flag "node not found; skipped all validation."
else
  run_validator "validate-tasks.mjs" "01 Home/Tasks.md" "01 Home/Tasks.md"
  run_validator "validate-notes.mjs" "01 Home/Notes.md" "01 Home/Notes.md"

  if [ -f "$AGENT/validate-voice.mjs" ]; then
    while IFS= read -r md; do
      [ -n "$md" ] || continue
      out="$(node "$AGENT/validate-voice.mjs" "$md" 2>&1)"
      if [ $? -ne 0 ]; then
        validation_failures=$((validation_failures + 1))
        first="$(printf '%s\n' "$out" | grep -E '^- line' | head -1 | sed 's/^- //')"
        extra="$(printf '%s\n' "$out" | grep -cE '^- line')"
        if [ "$extra" -gt 1 ]; then
          note_error "voice: ${md} ($first, +$((extra - 1)) more)"
        else
          note_error "voice: ${md} ($first)"
        fi
      elif [ "$VERBOSE" -eq 1 ]; then
        printf '%s\n' "$out"
      fi
    done < <(
      for d in "${VOICE_DIRS[@]}"; do
        [ -d "$d" ] && find "$d" -type f -name '*.md' ! -name '*.meta.md' -print 2>/dev/null
      done | sort
    )
  else
    note_flag "validate-voice.mjs is missing; prose not validated."
  fi
fi

# ---------------------------------------------------------------- 4. Git

git_line="skipped"
if [ "$DO_GIT" -eq 1 ]; then
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    git_line="not a git repository"
    note_flag "Not a git repository; nothing committed."
  elif [ -z "$(git status --porcelain)" ]; then
    git_line="nothing to commit"
  else
    changed=$(git status --porcelain | wc -l | tr -d ' ')
    if git add -A >/dev/null 2>&1 && \
       git commit -q -m "dwell sync: $(date +%Y-%m-%d\ %H:%M:%S)" >/dev/null 2>&1; then
      git_line="committed $changed change(s)"
      if [ "$DO_PUSH" -eq 1 ]; then
        if git push -q 2>/dev/null; then
          git_line="$git_line, pushed"
        else
          git_line="$git_line, push failed"
          note_error "git push failed. Run 'git push' and read the error."
        fi
      fi
    else
      git_line="commit failed"
      note_error "git commit failed."
    fi
  fi
fi

# --------------------------------------------------------------- Summary

printf '\n'
printf 'DWELL sync %s\n' "$(date '+%Y-%m-%d %H:%M')"
printf -- '-------------------------------------------\n'

if [ "$pdf_copied" -gt 0 ]; then
  printf 'Processed %s PDF(s). %s capture(s) created.\n' "$pdf_copied" "$pdf_copied"
  for n in ${PDF_NAMES+"${PDF_NAMES[@]}"}; do printf '  + %s\n' "$n"; done
else
  printf 'Processed 0 PDFs. No new captures.\n'
fi

printf 'Inbox: %s waiting in Raw, %s in Needs Review, %s in Failed.\n' \
  "$raw_waiting" "$needs_review" "$inbox_failed"

if [ "$validation_failures" -eq 0 ]; then
  printf 'Validation clean.\n'
else
  printf 'Validation: %s file(s) failed.\n' "$validation_failures"
fi

printf 'Git: %s\n' "$git_line"

if [ "${#ERRORS[@]}" -eq 0 ] && [ "${#FLAGS[@]}" -eq 0 ]; then
  printf 'No flags.\n'
else
  printf '\nNeeds your attention:\n'
  for e in ${ERRORS+"${ERRORS[@]}"}; do printf '  ! %s\n' "$e"; done
  for f in ${FLAGS+"${FLAGS[@]}"}; do printf '  - %s\n' "$f"; done
fi

if [ "$raw_waiting" -gt 0 ]; then
  printf '\n%s capture(s) in Inbox/Raw are filed but not yet classified.\n' "$raw_waiting"
  printf 'The nightly agent reads them, or ask an agent to follow 07 System/Agent/NIGHTLY-SWEEP.md now.\n'
fi

[ "${#ERRORS[@]}" -gt 0 ] && exit 1
exit 0

# Dwell agent machinery

## Live

- `grain-sync.mjs`: read-only Grain importer. Preserves source transcripts under `03 System/Sources/Grain/`.
- `grain-token-info.mjs`: read-only credential check.
- `grain-manifest.json`: imported-recording ledger.
- `validate-notes.mjs`: note/frontmatter validator.
- `validate-voice.mjs`: prose validator for generated material.
- `AGENT-VOICE.md`: current voice contract.

## Manual or unscheduled

- Grain import is proven for one nine-recording batch and is not scheduled.
- Supernote routing is handled through the personal Google Drive Export intake described in [[03 System/Documentation/CAPTURE-CONTRACT|Capture contract]].

## Legacy

`Legacy/` contains the abandoned Claude nightly-sweep, prefix-router, and system-request design. Those files are evidence of earlier decisions, not active instructions or automation.

---
type: automation-log
status: notice
created: "{{date}}"
origin: ai
---

# DWELL Nightly Sweep {{date}} ({{time}} CT)

## Run digest

<!-- Use this block verbatim for the Gmail digest only after the final PR state and log link are known. -->

**Input**
- Quick notes: <count> · <names when nonzero>
- Prompts: <count> · <names when nonzero>
- Documents: <count> · <names when nonzero>

**Output**
- <request or item → concrete result and link>

**Meetings**
- <day/date · time · title, soonest first, or None.>

**Needs review**
- None.

**Git**
- PR #<number> merged to `main`. Log: <GitHub link>

## Processing ledger

| Source | Input / request | Outcome | Status |
|---|---|---|---|
| <source> | “<short exact excerpt>” | <linked result or explicit non-action> | <completed / already processed / left unchanged / needs review / failed> |

## Input details

- DWELL Google Drive inbox: <inventory and Chicago selection window>
- `03 System/Inbox/Raw/`: <manual captures and exact run-date Daily Note>
- Google Calendar: <seven-day window and event count>

## Output details

<Created, changed, or brief results, each naming the dashboard view that surfaces it. Say `None.` when there were none.>

## Needs review

<New review items first; then still-open older items separately. Say `None.` when there were none.>

## Verification

- Deduplication: <result>
- Confidentiality screen: <result>
- Evidence and connector limits: <result or `None.`>
- Failures: <result or `None.`>
- Validators: pending

## Git details

- Branch: `<branch>`
- Commit(s): <source commit hashes or titles>
- PR: #<number> · <open / merged / blocked>
- Merge result: <result>

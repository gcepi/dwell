# Setup

First time opening DWELL on a machine. About 10 minutes.

`.obsidian/plugins/` is not in git, so community plugins install per machine. Everything else in this list is already committed and should already be correct.

## 1. Install the Tasks plugin

Required. Without it every `tasks` block on [[01 Home/Dashboard|Dashboard]] and [[01 Home/Review|Review]] renders as a plain code block. Already installed on the desktop as of 2026-09-08.

Settings > Community plugins > Browse > search "Tasks" > Install > Enable.

Or open [Tasks](obsidian://show-plugin?id=obsidian-tasks-plugin) directly.

Dataview is not needed. The dashboard and portfolio views run on Bases, which is a core plugin and already enabled.

## 2. Enable Obsidian Git

Handles background commit-and-sync. It is installed but currently disabled, so enable it under Settings > Community plugins. The end-of-day command pushes on its own and does not depend on it.

Or open [Git](obsidian://show-plugin?id=obsidian-git) directly.

## 3. Confirm the folder settings

These are committed. Check them anyway.

| Setting | Value |
|---|---|
| Daily notes > New file location | `07 System/Inbox/Raw` |
| Daily notes > Date format | `YYYY-MM-DD` |
| Daily notes > Template | `07 System/Templates/Daily Note` |
| Templates > Template folder | `07 System/Templates` |
| Files and links > Attachment folder | `07 System/Attachments` |
| Files and links > New link format | Absolute path in vault |
| Appearance > CSS snippets | `dwell-home` enabled |

## 4. Point the Supernote at the export folder

Handwritten PDFs go in `Supernote/EXPORT/` at the vault root. Copy or sync them there. No filename convention: any PDF in that folder gets picked up.

The separate Google Drive router for cross-vault routing is a different channel. Setup for it is in `07 System/Documentation/SUPERNOTE-AUTOMATION.md`.

## 5. Run the automation

From the vault root:

```bash
bash "07 System/Scripts/dwell-sync.sh"
```

Expect a summary naming what it processed, any flags, and the git result. Needs `bash`, `git`, and `node`.

## 6. Test it end to end

1. Put any PDF in `Supernote/EXPORT/`.
2. Wait 90 seconds. Files newer than that are held so a half-finished sync is never copied mid-write.
3. Run the command.
4. Confirm the PDF and a `.meta.md` sidecar are in `07 System/Inbox/Raw/`.

## Still needs a browser

These cannot be done from a terminal. They are also in [[01 Home/Tasks|Tasks]].

1. Confirm unit counts and occupancy for the 6 properties from the rent roll, then fill in `units`, `occupancy`, and `occupancy_as_of` on each property note.
2. Create the Drive folders named in `07 System/Documentation/SUPERNOTE-AUTOMATION.md`, install the Apps Script, and paste the folder IDs into it.
3. Create the Claude Code Routine for the DWELL nightly sweep, per `07 System/Documentation/NIGHTLY-OPERATORS.md`.
4. Add one line to the gOS operating guide naming the DWELL operator in its collision rule. File it as a gOS system request.

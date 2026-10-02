# Setup

First time opening DWELL on a machine. About 10 minutes.

`.obsidian/plugins/` is not in git, so community plugins install per machine. Everything else in this list is already committed and should already be correct.

## 1. Confirm Obsidian Git

It is the pull/push bridge for this vault. Confirm it is enabled under Settings > Community plugins. The end-of-day command pushes on its own and does not depend on the plugin.

Or open [Git](obsidian://show-plugin?id=obsidian-git) directly.

### Pull the current vault

1. Stop editing on other devices for the moment.
2. Open the command palette (`Cmd/Ctrl-P`) and run **Git: Pull** or **Git: Pull from remote**.
3. If Git reports conflicts, stop. Do not choose a side or force-push. Preserve the conflict screen and ask for recovery.
4. Confirm the file tree shows exactly `01 Home`, `02 Notes`, `03 System`, and `Supernote`.
5. Open [[01 Home/System|System]] and [[01 Home/Dashboard|Dashboard]]. Open loops should be ordinary bullets.

**Current-version checks:** this page says `03 System`; the Dashboard links to [[01 Home/Open loops|Open loops]]; and [[03 System/Documentation/ROADMAP|the roadmap]] is dated 2026-10-02 or later.

## 2. Confirm the folder settings

These are committed. Check them anyway.

| Setting | Value |
|---|---|
| Daily notes > New file location | `03 System/Inbox/Raw` |
| Daily notes > Date format | `YYYY-MM-DD` |
| Daily notes > Template | `03 System/Templates/Daily Note` |
| Templates > Template folder | `03 System/Templates` |
| Files and links > Attachment folder | `03 System/Attachments` |
| Files and links > New link format | Absolute path in vault |
| Appearance > CSS snippets | `dwell-home` enabled |

## 3. Point the Supernote at the export folder

Handwritten PDFs go in `Supernote/EXPORT/` at the vault root. Copy or sync them there. No filename convention: any PDF in that folder gets picked up.

The separate Google Drive router for cross-vault routing is a different channel. Setup for it is in `03 System/Documentation/SUPERNOTE-AUTOMATION.md`.

## 4. Run the automation

From the vault root:

```bash
bash "03 System/Scripts/dwell-sync.sh"
```

Expect a summary naming what it processed, any flags, and the git result. Needs `bash`, `git`, and `node`.

## 5. Test it end to end

1. Put any PDF in `Supernote/EXPORT/`.
2. Wait 90 seconds. Files newer than that are held so a half-finished sync is never copied mid-write.
3. Run the command.
4. Confirm the PDF and a `.meta.md` sidecar are in `03 System/Inbox/Raw/`.

## Still needs a browser

These cannot be done from a terminal. Put any relevant unresolved question in [[01 Home/Open loops|Open loops]] until it moves to Asana.

1. Confirm unit counts and occupancy for the 6 properties from the rent roll, then fill in `units`, `occupancy`, and `occupancy_as_of` on each property note.
2. Create the Drive folders named in `03 System/Documentation/SUPERNOTE-AUTOMATION.md`, install the Apps Script, and paste the folder IDs into it.
3. Create the Claude Code Routine for the DWELL nightly sweep, per `03 System/Documentation/NIGHTLY-OPERATORS.md`.
4. Add one line to the gOS operating guide naming the DWELL operator in its collision rule. File it as a gOS system request.

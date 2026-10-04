# Setup

First time opening DWELL on a machine. About 10 minutes.

`.obsidian/plugins/` is not in git, so community-plugin code installs per machine. The enabled-plugin list is committed.

## 1. Confirm Obsidian Git

It is the pull/push bridge for this vault. Confirm it is installed and enabled under Settings > Community plugins.

If **Git: Pull** is missing from the command palette, enable Obsidian Git manually first. This is the one-time bootstrap path when an older Dwell copy has the plugin installed but disabled.

Or open [Git](obsidian://show-plugin?id=obsidian-git) directly.

### Pull the current vault

1. Stop editing on other devices for the moment.
2. Open the command palette (`Cmd/Ctrl-P`) and run **Git: Pull** or **Git: Pull from remote**.
3. If Git reports conflicts, stop. Do not choose a side or force-push. Preserve the conflict screen and ask for recovery.
4. Confirm the file tree shows exactly `01 Home`, `02 Notes`, `03 System`, and `Supernote`.
5. Open [[01 Home/System|System]] and [[01 Home/Dashboard|Dashboard]]. Open loops should be ordinary bullets.

**Current-version checks:** this page says `03 System`; the Dashboard links to [[01 Home/Open loops|Open loops]]; and [[03 System/Documentation/ROADMAP|the roadmap]] is dated 2026-10-04 or later.

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

## 3. Confirm the capture paths

- **Grain:** recordings are imported read-only into `03 System/Sources/Grain/`.
- **Supernote:** keep syncing to the personal Google Drive Export folder. gOS preserves the originals; Dwell-relevant pages are mirrored into `03 System/Sources/Supernote/`.
- **Dwell notes:** write substantive work notes in `02 Notes/`.
- **Execution:** committed work belongs in Asana. Plain unresolved questions may remain in [[01 Home/Open loops|Open loops]].

The current rules are in [[03 System/Documentation/CAPTURE-CONTRACT|Capture contract]]. Do not copy Supernote files into the vault-root `Supernote/EXPORT/` folder as part of the current workflow.

## 4. Prove commit and pull

1. Run **Git: Pull** from the command palette.
2. Add a harmless bullet to [[01 Home/Open loops|Open loops]].
3. Run **Git: Create backup** or the configured commit-and-sync command.
4. Confirm Obsidian Git reports a successful push.
5. Remove the test bullet and sync once more.

If Git reports conflicts, stop. Preserve the exact error and ask for recovery before choosing a side.

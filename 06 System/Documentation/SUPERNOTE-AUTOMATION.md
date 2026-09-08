# Supernote automation

Graham writes by hand on a Supernote and the device syncs exports to Google Drive. Two vaults now read from Drive, so something has to decide which vault gets a given page. That something is the filename.

The rule is a prefix you type once when you name the note on the device.

| You name it | It goes to | Which sweep reads it |
|---|---|---|
| `WORK_leasing walkthrough` | the DWELL Drive inbox | DWELL, 2:00 AM Central |
| `PERSONAL_sermon notes` | the gOS Drive inbox | gOS, 12:30 AM Central |
| `leasing walkthrough` | Needs Prefix, untouched | neither |

`DWELL_` works the same as `WORK_`, and `GOS_` the same as `PERSONAL_`, so muscle memory either way is fine. Matching ignores case, so `work_` is also fine. The `_` character is required; `WORK notes` does not match.

The same rule covers Apple Shortcut captures and anything else that lands in the watched folder.

## Why a filename and not something smarter

Content classification would work most of the time, and "most of the time" is the problem. A misrouted page is a confidentiality event in one direction and a privacy leak in the other: a rent roll landing in gOS is one website mirror away from public, and a personal journal page landing in DWELL sits on employer-adjacent infrastructure. A prefix is a decision Graham makes in the second he names the file, and it is auditable afterward from the filename alone.

Unprefixed files are the honest failure mode. They stop, they get reported, nothing moves. Renaming one takes 4 seconds on the phone and it flows on the next pass.

## How it works

A Google Apps Script, `06 System/Agent/route-supernote.gs`, runs every 15 minutes. Each pass:

1. Lists the files in the source folder. It never descends into subfolders.
2. Skips any file modified in the last 90 seconds, so a half-finished sync never gets moved mid-write.
3. Matches the filename against the prefix rules in order.
4. Moves the file to the matching inbox, or to Needs Prefix when nothing matches.
5. Renames the incoming file with a timestamp suffix first if a file of that name already sits in the destination. Nothing is ever overwritten and nothing is ever deleted.
6. Appends one line to an optional plain-text routing log, and emails Graham if a file failed.

Moving the file out of the source folder is the only state the script keeps. There is no ledger and no cursor, so re-running it is always safe.

The prefix stays on the filename after routing. The nightly sweep strips it when naming any note derived from the capture, per the operating guide's **Supernote and capture routing** section. Keeping it on the file means the routing decision is still visible in the Drive folder and in the sweep's already-processed ledger.

## Setup

Four steps, all in Graham's Google account. About 15 minutes.

### 1. Create three Drive folders

Two of the four folders already exist or need making:

- **Source folder.** Wherever the Supernote app already syncs. If it currently syncs straight into the gOS "Claude Inbox," that has to change: the source folder must be separate from both inboxes, or files loop forever. Make a folder called `Supernote Sync` and point the device at it.
- **DWELL Inbox.** New. This is the only Drive folder the DWELL sweep reads.
- **Needs Prefix.** New. The holding pen.
- **Claude Inbox.** Already exists. This is the gOS inbox, ID `13fp_ZFlor3AE-AC-ZM9rVULizWC7o_wJ`, already named in the gOS nightly contract. Do not rename or move it.

Open each new folder and copy its ID out of the URL. The ID is the last path segment:

```text
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
                                        ^--------- this part ---------^
```

### 2. Create the Apps Script project

1. Go to [script.google.com](https://script.google.com) and create a new project. Name it `Supernote routing`.
2. Delete the contents of `Code.gs`.
3. Paste in all of `06 System/Agent/route-supernote.gs`.
4. Fill in the four IDs in the `CONFIG` block at the top. `GOS_INBOX_ID` is already filled in.
5. Save.

Optional: create an empty `.txt` file in Drive, copy its file ID, and paste it into `LOG_FILE_ID` for a routing audit trail. Leave it `null` to skip.

### 3. Verify before you automate

Run these three by hand from the editor's function dropdown, in order. The first run asks for Drive and Gmail permission.

1. **`verifyFolders`** prints the name of each configured folder. If one says `UNREACHABLE`, the ID is wrong.
2. Drop a test file named `WORK_test.txt` into the source folder, wait 2 minutes, then run **`dryRun`**. It prints what a pass would do and moves nothing. Expect `dwell  <-  WORK_test.txt`.
3. Run **`routeSupernoteExports`** once. Check that the test file is now in the DWELL Inbox. Then repeat with an unprefixed file and confirm it lands in Needs Prefix.

Check `View > Executions` for the log output.

### 4. Install the trigger

Run **`installTrigger`** once. It clears any trigger it previously made before creating a new one, so re-running it never leaves two triggers racing. Confirm under `Triggers` in the left sidebar that exactly one time-based trigger for `routeSupernoteExports` exists.

## Changing the rules

The prefix table lives in `CONFIG.RULES` in the script. Adding a route means adding a row:

```javascript
{ prefix: 'CHURCH_', destination: 'GOS_INBOX_ID', label: 'gos' }
```

Rules are evaluated top to bottom, so a longer prefix that overlaps a shorter one goes above it.

A change here is a routing change and belongs to the weekly system review in both vaults, because both nightly contracts describe this table. Update the script, this document, and the **Supernote and capture routing** section of `OPERATING-GUIDE-DWELL.md` in the same session.

## When something goes wrong

**A file sat in Needs Prefix.** Working as designed. Rename it with a prefix and leave it in Needs Prefix; the script only reads the source folder, so move it back there too.

**A page landed in the wrong vault.** The sweep that got it will not move it across. It leaves the file alone and creates a Needs Review item saying it looks misrouted. Rename the original in Drive and drop it back in the source folder.

**Nothing is moving.** Check `Triggers` for the trigger, then `Executions` for a failure. The usual cause is a folder ID that changed because a folder was recreated rather than renamed.

**Two files with the same name.** Both survive; the second gets a timestamp suffix. This is deliberate, since the gOS sweep keys its already-processed ledger on the exact filename and a silent duplicate would look like a file it had already handled.

**The alert email is noisy.** Set `ALERT_EMAIL` to `null` and rely on the routing log instead.

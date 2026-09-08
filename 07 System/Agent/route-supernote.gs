/**
 * route-supernote.gs
 *
 * Routes handwritten Supernote exports and Apple Shortcut captures to the
 * right vault inbox by filename prefix.
 *
 *   WORK_*      -> the DWELL Drive inbox      (processed by the DWELL sweep)
 *   PERSONAL_*  -> the gOS Drive inbox        (processed by the gOS sweep)
 *   anything else -> the Needs Prefix folder  (left alone, reported)
 *
 * Design rules this script follows, because two nightly operators depend on it:
 *
 *   1. It never guesses. An unprefixed file is never routed by content, size,
 *      or date. It goes to Needs Prefix and waits for Graham to rename it.
 *   2. It never deletes and never overwrites. A name collision in the
 *      destination gets a timestamp suffix so both files survive and both get
 *      processed.
 *   3. Moving a file out of the source folder is the only state it keeps.
 *      There is no ledger to corrupt and no cursor to reset. Re-running it is
 *      always safe.
 *   4. It never copies a file to both inboxes. One file, one destination.
 *
 * Setup, folder IDs, and the trigger are documented in
 * 07 System/Documentation/SUPERNOTE-AUTOMATION.md.
 */

// ---------------------------------------------------------------------------
// CONFIG. Fill in the four folder IDs, then run installTrigger() once.
// A folder ID is the last path segment of the folder's Drive URL.
// ---------------------------------------------------------------------------

var CONFIG = {
  // Where the Supernote app and the Apple Shortcut drop files.
  SOURCE_FOLDER_ID: 'PASTE_SOURCE_FOLDER_ID',

  // The DWELL nightly sweep reads only this folder.
  DWELL_INBOX_ID: 'PASTE_DWELL_INBOX_ID',

  // The gOS nightly sweep reads only this folder. This is the existing
  // "Claude Inbox" folder already named in the gOS nightly contract.
  GOS_INBOX_ID: '13fp_ZFlor3AE-AC-ZM9rVULizWC7o_wJ',

  // Unprefixed and unrecognized files land here, untouched.
  NEEDS_PREFIX_ID: 'PASTE_NEEDS_PREFIX_FOLDER_ID',

  // A plain-text audit trail, appended one line per routed file. Optional:
  // leave as null to skip logging. Create an empty .txt file in Drive and
  // paste its file ID here.
  LOG_FILE_ID: null,

  // Email address for a failure notice. Leave as null to skip.
  ALERT_EMAIL: 'gcepica@gmail.com',

  // A file modified within this many seconds is skipped this pass, so a
  // half-finished sync never gets moved mid-write. It gets picked up next run.
  SETTLE_SECONDS: 90,

  // Prefix rules, evaluated in order, matched case-insensitively against the
  // start of the filename. Add an alias by adding a row.
  RULES: [
    { prefix: 'WORK_', destination: 'DWELL_INBOX_ID', label: 'dwell' },
    { prefix: 'DWELL_', destination: 'DWELL_INBOX_ID', label: 'dwell' },
    { prefix: 'PERSONAL_', destination: 'GOS_INBOX_ID', label: 'gos' },
    { prefix: 'GOS_', destination: 'GOS_INBOX_ID', label: 'gos' }
  ]
};

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

/**
 * The function the time trigger calls. One pass over the source folder.
 */
function routeSupernoteExports() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30 * 1000)) {
    Logger.log('Another pass is already running. Exiting without changes.');
    return;
  }

  var counts = { dwell: 0, gos: 0, needsPrefix: 0, skipped: 0, failed: 0 };
  var problems = [];

  try {
    assertConfigured();

    var source = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
    var destinations = {
      DWELL_INBOX_ID: DriveApp.getFolderById(CONFIG.DWELL_INBOX_ID),
      GOS_INBOX_ID: DriveApp.getFolderById(CONFIG.GOS_INBOX_ID)
    };
    var needsPrefix = DriveApp.getFolderById(CONFIG.NEEDS_PREFIX_ID);

    var cutoff = new Date().getTime() - CONFIG.SETTLE_SECONDS * 1000;
    var files = source.getFiles();

    while (files.hasNext()) {
      var file = files.next();
      var name = file.getName();

      try {
        if (file.getLastUpdated().getTime() > cutoff) {
          counts.skipped++;
          Logger.log('Still settling, skipped this pass: ' + name);
          continue;
        }

        var rule = matchRule(name);

        if (!rule) {
          moveWithoutCollision(file, needsPrefix);
          counts.needsPrefix++;
          appendLog(name, 'needs-prefix', 'no recognized prefix');
          continue;
        }

        var target = destinations[rule.destination];
        moveWithoutCollision(file, target);
        counts[rule.label]++;
        appendLog(name, rule.label, 'prefix ' + rule.prefix);
      } catch (fileError) {
        counts.failed++;
        problems.push(name + ': ' + fileError.message);
        appendLog(name, 'failed', fileError.message);
      }
    }
  } catch (fatal) {
    problems.push('Run failed before processing: ' + fatal.message);
  } finally {
    lock.releaseLock();
  }

  var summary =
    'Supernote routing pass. DWELL ' + counts.dwell +
    ', gOS ' + counts.gos +
    ', needs prefix ' + counts.needsPrefix +
    ', still settling ' + counts.skipped +
    ', failed ' + counts.failed + '.';
  Logger.log(summary);

  if (problems.length > 0) {
    alert(summary, problems);
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Returns the first matching rule, or null. Case-insensitive, prefix only.
 * Never inspects file contents.
 */
function matchRule(filename) {
  var lower = filename.toLowerCase();
  for (var i = 0; i < CONFIG.RULES.length; i++) {
    if (lower.indexOf(CONFIG.RULES[i].prefix.toLowerCase()) === 0) {
      return CONFIG.RULES[i];
    }
  }
  return null;
}

/**
 * Moves a file into a folder. If a file of the same name already sits there,
 * the incoming one is renamed with a timestamp suffix first.
 *
 * This matters: the gOS sweep keys its already-processed ledger on the exact
 * filename, so two same-named captures would make the second look like the
 * first and silently disappear. A suffix keeps both visible.
 */
function moveWithoutCollision(file, folder) {
  var name = file.getName();
  if (folder.getFilesByName(name).hasNext()) {
    var stamp = Utilities.formatDate(new Date(), 'America/Chicago', 'yyyyMMdd-HHmmss');
    var dot = name.lastIndexOf('.');
    var renamed = dot > 0
      ? name.slice(0, dot) + ' (' + stamp + ')' + name.slice(dot)
      : name + ' (' + stamp + ')';
    file.setName(renamed);
    Logger.log('Name collision. Renamed to: ' + renamed);
  }
  file.moveTo(folder);
}

function assertConfigured() {
  var required = ['SOURCE_FOLDER_ID', 'DWELL_INBOX_ID', 'GOS_INBOX_ID', 'NEEDS_PREFIX_ID'];
  for (var i = 0; i < required.length; i++) {
    var value = CONFIG[required[i]];
    if (!value || value.indexOf('PASTE_') === 0) {
      throw new Error('CONFIG.' + required[i] + ' is not set. See SUPERNOTE-AUTOMATION.md.');
    }
  }
  if (CONFIG.DWELL_INBOX_ID === CONFIG.GOS_INBOX_ID) {
    throw new Error('The DWELL and gOS inbox IDs are the same folder. The two vaults must not share an inbox.');
  }
  if (CONFIG.SOURCE_FOLDER_ID === CONFIG.DWELL_INBOX_ID ||
      CONFIG.SOURCE_FOLDER_ID === CONFIG.GOS_INBOX_ID ||
      CONFIG.SOURCE_FOLDER_ID === CONFIG.NEEDS_PREFIX_ID) {
    throw new Error('The source folder must be separate from every destination, or files will be re-routed forever.');
  }
}

function appendLog(filename, outcome, detail) {
  if (!CONFIG.LOG_FILE_ID) return;
  try {
    var when = Utilities.formatDate(new Date(), 'America/Chicago', "yyyy-MM-dd HH:mm:ss");
    var line = when + ' | ' + outcome + ' | ' + filename + ' | ' + detail + '\n';
    var logFile = DriveApp.getFileById(CONFIG.LOG_FILE_ID);
    logFile.setContent(logFile.getBlob().getDataAsString() + line);
  } catch (error) {
    Logger.log('Could not write the routing log: ' + error.message);
  }
}

function alert(summary, problems) {
  Logger.log('Problems: ' + problems.join(' | '));
  if (!CONFIG.ALERT_EMAIL) return;
  try {
    MailApp.sendEmail(
      CONFIG.ALERT_EMAIL,
      'Supernote routing needs a look',
      summary + '\n\n' + problems.join('\n') +
        '\n\nScript: route-supernote.gs\nDocs: 07 System/Documentation/SUPERNOTE-AUTOMATION.md\n'
    );
  } catch (error) {
    Logger.log('Could not send the alert email: ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// SETUP AND DIAGNOSTICS. Run these by hand from the Apps Script editor.
// ---------------------------------------------------------------------------

/**
 * Installs the time trigger. Run once. Safe to re-run: it clears its own
 * existing triggers first, so you never end up with two.
 */
function installTrigger() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'routeSupernoteExports') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }
  ScriptApp.newTrigger('routeSupernoteExports')
    .timeBased()
    .everyMinutes(15)
    .create();
  Logger.log('Trigger installed. routeSupernoteExports runs every 15 minutes.');
}

/**
 * Reports what a pass would do, and moves nothing. Run this first.
 */
function dryRun() {
  assertConfigured();
  var source = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
  var files = source.getFiles();
  var lines = [];
  while (files.hasNext()) {
    var file = files.next();
    var rule = matchRule(file.getName());
    lines.push((rule ? rule.label : 'needs-prefix') + '  <-  ' + file.getName());
  }
  Logger.log(lines.length === 0 ? 'Source folder is empty.' : lines.join('\n'));
}

/**
 * Confirms every configured folder is reachable and names it. Run this after
 * pasting the IDs, before installing the trigger.
 */
function verifyFolders() {
  assertConfigured();
  var ids = {
    source: CONFIG.SOURCE_FOLDER_ID,
    dwellInbox: CONFIG.DWELL_INBOX_ID,
    gosInbox: CONFIG.GOS_INBOX_ID,
    needsPrefix: CONFIG.NEEDS_PREFIX_ID
  };
  var out = [];
  for (var key in ids) {
    try {
      out.push(key + ': "' + DriveApp.getFolderById(ids[key]).getName() + '"');
    } catch (error) {
      out.push(key + ': UNREACHABLE (' + error.message + ')');
    }
  }
  Logger.log(out.join('\n'));
}

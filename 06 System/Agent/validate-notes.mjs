#!/usr/bin/env node

// Lenient check for 02 Notes/_Notes.md in the DWELL vault.
//
// The file is Graham's own work observations plus anything the nightly sweep
// appends, organised newest-first under H1 date headings written as
// "Month Day, Year". Structure inside a day is his and is not checked.
// Freestanding Garden files elsewhere in 02 Notes/ are not checked here.
//
// Real errors: a non-date first heading, date headings out of newest-first
// order, or an unparseable date heading.
//
// Ported from gOS. The Readwise duplicate-URL check was dropped, because
// DWELL has no Readwise channel; that input belongs to the personal vault.

import fs from "node:fs";
import path from "node:path";

const notesPath = path.resolve(process.argv[2] || "02 Notes/_Notes.md");
let text;

try {
  text = fs.readFileSync(notesPath, "utf8");
} catch (error) {
  console.error(`Cannot read ${notesPath}: ${error.message}`);
  process.exit(2);
}

const errors = [];
const warnings = [];

const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const dateHeadingRe = new RegExp(`^# (${MONTHS}) (\\d{1,2}), (\\d{4})$`);

const lines = text.split("\n");
const firstHeading = lines.find((l) => /^#\s/.test(l));
if (firstHeading && !dateHeadingRe.test(firstHeading)) {
  errors.push(`First heading must be a date like "# August 31, 2026", found: ${firstHeading}`);
}

const headingDates = [];
for (const line of lines) {
  if (!/^#\s/.test(line)) continue;
  const m = line.match(dateHeadingRe);
  if (!m) {
    if (dateHeadingRe.test(line) === false && /^# /.test(line)) {
      // a top-level heading that is not a date
      errors.push(`Every H1 in Notes must be a date heading. Found: ${line}`);
    }
    continue;
  }
  const parsed = new Date(`${m[1]} ${m[2]}, ${m[3]}`);
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`Unparseable date heading: ${line}`);
    continue;
  }
  headingDates.push({ line, time: parsed.getTime() });
}

for (let i = 1; i < headingDates.length; i++) {
  if (headingDates[i].time > headingDates[i - 1].time) {
    errors.push(
      `Date headings must be newest first. "${headingDates[i].line}" comes after "${headingDates[i - 1].line}".`,
    );
    break;
  }
}

if (headingDates.length === 0) warnings.push("No date headings yet.");

for (const w of warnings) console.warn(`warning: ${w}`);

if (errors.length > 0) {
  console.error(`Notes validation failed (${errors.length}):`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(`Notes validation passed: ${headingDates.length} date headings.`);

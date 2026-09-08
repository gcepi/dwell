#!/usr/bin/env node

// Voice check for anything an agent emits as prose, run against the nightly
// log before the pull request merges. AGENT-VOICE-DWELL.md is the full
// contract; this is the automated backstop for its hardest rules, not a
// substitute for the writing agent following the whole document.
//
// Ported from gOS with one addition: the DEAD_PHRASES list picks up the
// corporate-email filler from AGENT-VOICE-DWELL 3B ("circle back", "please
// find attached", and the rest), which the personal vault never had a reason
// to check for.
//
// It fails on: em dashes and en dashes outside a numeric/time range, a curated
// set of dead-AI words that have no innocent use in a gOS log, the dead
// phrases and transitions from sections 3B-3E, and the high-precision
// negative-parallelism patterns from section 3F.
//
// It deliberately ignores fenced code, inline code, and double-quoted spans,
// so a quoted capture or a pasted sample never trips it. That also means it
// cannot catch every violation. A clean run is necessary, not sufficient.

import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node validate-voice.mjs <file.md>");
  process.exit(2);
}

const resolved = path.resolve(target);
let text;
try {
  text = fs.readFileSync(resolved, "utf8");
} catch (error) {
  console.error(`Cannot read ${resolved}: ${error.message}`);
  process.exit(2);
}

// Dead-AI words with effectively zero innocent use in a run log or brief.
// Context-sensitive entries from AGENT-VOICE 3A (align, foster, surface,
// highlight, robust, dynamic, and the like) are left out on purpose: the log
// uses several of them as plain nouns and a false alarm gets the check
// switched off.
const DEAD_WORDS = [
  "delve", "realm", "tapestry", "paradigm", "cutting-edge", "cutting edge",
  "revolutionize", "revolutionise", "intricate", "intricacies", "showcasing",
  "showcase", "showcased", "pivotal", "meticulous", "meticulously", "vibrant",
  "unparalleled", "leverage", "leveraging", "leveraged", "synergy", "synergies",
  "synergize", "game-changer", "game changer", "testament to", "commendable",
  "groundbreaking", "holistic", "garner", "garnered", "accentuate",
  "pioneering", "trailblazing", "unleash", "versatile", "transformative",
  "redefine", "seamless", "seamlessly", "frictionless", "turnkey",
  "future-proof", "future proof", "paradigm-shifting", "supercharge",
  "interplay", "reimagine", "unprecedented", "leading-edge", "democratize",
  "democratise", "state-of-the-art", "immersive", "plug-and-play", "crucial",
  "utilize", "utilise", "underscore", "underscores", "spearhead", "boast",
  "boasts", "boasting",
];

// AGENT-VOICE 3A tail, 3B, 3C, 3D, 3E: fixed multi-word strings, matched
// as substrings.
const DEAD_PHRASES = [
  "serves as", "stands as", "marks a ", "represents a ", "boasts a ",
  "features a ", "holds the distinction",
  "in today's", "in today’s", "it's important to note", "it’s important to note",
  "it's worth noting", "it’s worth noting", "in order to", "i'd be happy to help",
  "i’d be happy to help", "straightforward", "let's dive in", "let’s dive in",
  "let's explore", "let’s explore", "let's unpack", "let’s unpack", "delve into",
  "at the end of the day", "moving forward", "to put this in perspective",
  "what makes this particularly interesting", "the implications here are",
  "in other words", "it goes without saying", "most people don't realize",
  "most people don’t realize", "in this article", "despite its",
  "challenges and future prospects", "spine of the whole thing",
  "what this is actually doing",
  "furthermore", "moreover", "that being said", "with that in mind",
  "it is also worth mentioning", "on top of that",
  "let that sink in", "read that again", "this changes everything",
  "are you paying attention", "you're not ready for this",
  "you’re not ready for this",
  "supercharge", "10x your", "unlock the", "unlocks the",
  // AGENT-VOICE-DWELL 3B and 3E: corporate-email filler and vendor hype.
  "circle back", "touch base", "please find attached", "per my last email",
  "let me know if you have any questions", "key takeaways", "best practices",
  "best-in-class", "best in class", "industry-leading", "industry leading",
  "world-class", "world class", "at your earliest convenience",
  "as per", "kindly",
];

// AGENT-VOICE 3F: only the patterns that do not fire on ordinary log prose.
const PARALLELISM = [
  /\bnot only\b[^.?!\n]*\bbut also\b/i,
  /\b(?:it|this|that)(?:['’]s| is) not (?:just )?about\b[^\n]*\b(?:it|this|that)(?:['’]s| is) about\b/i,
  /\bthe question isn['’]?t\b[^\n]*\bthe question is\b/i,
  /\byou don['’]?t need\b[^.?!\n]*\byou need\b/i,
  /\bless\s+\w+,\s+more\s+\w+/i,
  /\bstop thinking\b[^.?!\n]*\bstart thinking\b/i,
];

// Sentence-initial mechanical transitions (3C). "Additionally," at the start
// of a line or sentence only, so "additionally" mid-clause is left alone.
const OPENING_TRANSITIONS =
  /(^|[.!?]\s+)(additionally|furthermore|moreover|that said|that being said|with that in mind|on top of that)[,\s]/i;

function stripQuotedAndCode(line) {
  return line
    .replace(/`[^`]*`/g, " ")
    .replace(/"[^"]*"/g, " ")
    .replace(/“[^”]*”/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    // Wikilink targets are filenames or paths, not prose (OPERATING-GUIDE.md
    // "fixed identifiers are out of scope"), so drop the target and keep only
    // an alias, which is real displayed text and still gets checked.
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2")
    .replace(/\[\[[^\]]*\]\]/g, " ");
}

/**
 * A dash is allowed only between two numbers, as a range or duration:
 * `7–11 AM`, `1–5`, `pages 3–7`. Anywhere else it is standing in for a comma,
 * colon, or semicolon in a sentence, which is the AI tell this check exists
 * for. An `AM` or `PM` may sit between the number and the dash, so
 * `9:00 AM — 5:00 PM` passes.
 *
 * This is stricter than the gOS version it was ported from, and deliberately.
 * That one tested a 9-character window against `[0-9]\s?—\s?[0-9APM: ]`, and
 * the character class contains a space, so any digit followed by " — " passed.
 * That is the exact shape of a dated log bullet: `2026-09-08 — did a thing`
 * sailed through a check written to forbid it. Requiring a digit on the far
 * side closes it.
 */
function isNumericRange(line, dashIndex) {
  const before = line.slice(0, dashIndex).replace(/\s+$/, "").replace(/[AP]\.?M\.?$/i, "").replace(/\s+$/, "");
  const after = line.slice(dashIndex + 1).replace(/^\s+/, "");
  return /[0-9]$/.test(before) && /^[0-9]/.test(after);
}

const findings = [];
const lines = text.split("\n");
let inFence = false;

lines.forEach((raw, i) => {
  const lineNo = i + 1;
  if (/^\s*```/.test(raw)) {
    inFence = !inFence;
    return;
  }
  if (inFence) return;

  const line = stripQuotedAndCode(raw);
  const lower = line.toLowerCase();

  for (const m of line.matchAll(/[—–]/g)) {
    if (!isNumericRange(line, m.index)) {
      findings.push({
        lineNo,
        why: m[0] === "—" ? "em dash" : "en dash outside a numeric range",
      });
      break;
    }
  }

  for (const w of DEAD_WORDS) {
    const re = new RegExp(`(^|[^a-z0-9-])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9-]|$)`, "i");
    if (re.test(lower)) findings.push({ lineNo, why: `dead-AI word: "${w}"` });
  }
  for (const p of DEAD_PHRASES) {
    if (lower.includes(p)) findings.push({ lineNo, why: `dead phrase: "${p.trim()}"` });
  }
  for (const re of PARALLELISM) {
    if (re.test(line)) findings.push({ lineNo, why: "negative parallelism (AGENT-VOICE 3F)" });
  }
  if (OPENING_TRANSITIONS.test(line)) {
    findings.push({ lineNo, why: "mechanical opening transition (AGENT-VOICE 3C)" });
  }
});

if (findings.length > 0) {
  console.error(`Voice validation failed (${findings.length}):`);
  for (const f of findings) console.error(`- line ${f.lineNo}: ${f.why}`);
  console.error("\nRewrite the offending lines. See 06 System/Agent/AGENT-VOICE-DWELL.md.");
  process.exit(1);
}

console.log(`Voice validation passed: ${resolved}`);

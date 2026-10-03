#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const VAULT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(VAULT, "03 System/Sources/Grain");
const MANIFEST = path.join(VAULT, "03 System/Agent/grain-manifest.json");
const VERSION = "2026-10-01";
const token = process.env.GRAIN_API_TOKEN;

if (!token) {
  console.error("GRAIN_API_TOKEN is missing; run through the OpenClaw Gateway so the protected secret can be injected.");
  process.exit(1);
}

const sinceArg = process.argv.indexOf("--since");
const since = sinceArg >= 0 ? process.argv[sinceArg + 1] : null;
if (sinceArg >= 0 && !/^\d{4}-\d{2}-\d{2}$/.test(since || "")) {
  console.error("Usage: grain-sync.mjs [--since YYYY-MM-DD]");
  process.exit(1);
}

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return { version: 1, recordings: {} };
  return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function safeTitle(value) {
  return String(value || "Untitled recording")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function grain(url, options = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Public-Api-Version": VERSION,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
    if (response.status === 429 && attempt === 0) {
      const seconds = Number(response.headers.get("retry-after") || 1);
      await new Promise((resolve) => setTimeout(resolve, Math.max(1, seconds) * 1000));
      continue;
    }
    return response;
  }
}

const listResponse = await grain("https://api.grain.com/_/public-api/v2/recordings", {
  method: "POST",
  body: "{}",
});
if (!listResponse.ok) {
  console.error(`Grain list failed: HTTP ${listResponse.status} ${await listResponse.text()}`);
  process.exit(1);
}

const listing = await listResponse.json();
const manifest = readManifest();
fs.mkdirSync(OUT, { recursive: true });

let imported = 0;
let skipped = 0;
const errors = [];
const recordings = [...(listing.recordings || [])]
  .filter((recording) => !since || String(recording.start_datetime || "").slice(0, 10) >= since)
  .sort((a, b) => String(a.start_datetime).localeCompare(String(b.start_datetime)));

for (const recording of recordings) {
  if (manifest.recordings[recording.id]) {
    skipped++;
    continue;
  }

  const transcriptResponse = await grain(
    `https://api.grain.com/_/public-api/v2/recordings/${recording.id}/transcript.txt`,
  );
  if (!transcriptResponse.ok) {
    errors.push({ id: recording.id, title: recording.title, status: transcriptResponse.status });
    continue;
  }

  const transcript = (await transcriptResponse.text()).trim();
  const date = String(recording.start_datetime || "undated").slice(0, 10);
  const filename = `${date} - ${safeTitle(recording.title)} - ${recording.id.slice(0, 8)}.md`;
  const rel = path.join("03 System/Sources/Grain", filename);
  const full = path.join(VAULT, rel);
  const participants = [...new Set((recording.recorders || []).map((person) => person.name).filter(Boolean))];
  const body = [
    "---",
    'type: "source"',
    'source: "grain"',
    `recording_id: ${yamlString(recording.id)}`,
    `title: ${yamlString(recording.title)}`,
    `date: ${yamlString(date)}`,
    `started_at: ${yamlString(recording.start_datetime)}`,
    `ended_at: ${yamlString(recording.end_datetime)}`,
    `grain_url: ${yamlString(recording.url)}`,
    `participants: ${JSON.stringify(participants)}`,
    "---",
    `# ${recording.title}`,
    "",
    `Original recording: ${recording.url}`,
    "",
    "## Transcript",
    "",
    transcript,
    "",
  ].join("\n");
  fs.writeFileSync(full, body);
  manifest.recordings[recording.id] = {
    title: recording.title,
    startedAt: recording.start_datetime,
    path: rel,
    importedAt: new Date().toISOString(),
  };
  imported++;
}

manifest.updatedAt = new Date().toISOString();
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ seen: recordings.length, imported, skipped, errors }, null, 2));
if (errors.length) process.exit(1);

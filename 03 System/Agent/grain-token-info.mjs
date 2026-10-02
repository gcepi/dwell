#!/usr/bin/env node

// Read-only Grain credential check. This deliberately does not list recordings,
// download transcripts, or write anything. It is the required first proof before
// Grain enters the Dwell intake flow.

const token = process.env.GRAIN_API_TOKEN;
if (!token) {
  console.error("GRAIN_API_TOKEN is unavailable to this process.");
  process.exit(2);
}

const response = await fetch("https://api.grain.com/_/public-api/v2/token-info", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Public-Api-Version": "2026-10-01",
  },
});

const body = await response.text();
if (!response.ok) {
  console.error(`Grain token check failed: HTTP ${response.status}`);
  console.error(body);
  process.exit(1);
}

const info = JSON.parse(body);
const fields = ["type", "scope", "user_id", "workspace_id", "name", "expires_at"];
const safe = Object.fromEntries(Object.entries(info).filter(([key]) => fields.includes(key)));
console.log(JSON.stringify({
  token: safe,
  rateLimit: response.headers.get("x-ratelimit-limit"),
  rateRemaining: response.headers.get("x-ratelimit-remaining"),
}, null, 2));

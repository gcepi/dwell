// Headless scheduler wrapper. The exec tool receives the protected Grain
// credential; the command runner's bare shell does not.
const result = await exec({
  command: 'node "03 System/Agent/grain-daily.mjs"',
  workdir: "/home/openclaw/dwell",
  timeoutSeconds: 600,
  yieldMs: 30000,
});
json({ ok: true, result });

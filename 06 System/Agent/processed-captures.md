# Processed captures

One line per Drive capture filename the DWELL sweep has processed. Append only. Never remove a line.

This is the self-healing ledger for the Drive channel: a capture older than the run date is checked here first, so a night the sweep did not run never causes a reprocess and never causes a silent skip. The rule is in `NIGHTLY-SWEEP-DWELL.md` under **Drive inbox selection**.

Filenames keep their `WORK_` prefix, because the prefix is part of the exact filename the router produced and the dedup key has to match it.

---


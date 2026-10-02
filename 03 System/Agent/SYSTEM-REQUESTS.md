# System requests

Dated intake log for changes to DWELL itself, bugs and feature requests together.

The routine is the weekly system review in [[03 System/Agent/OPERATING-GUIDE|the operating guide]].

gOS has its own separate log. A change that should apply to both vaults gets reviewed once and applied twice, in two commits in two repositories. Do not assume a gOS change landed here.

## Backlog

A dated request lands under a week heading below; the weekly review resolves it, closes it, or promotes it into this backlog. Do not track the same open item in two places.

**Next: likely useful**

- A `walkthrough-to-sop` skill: turn a recorded walkthrough or ride-along into an SOP draft. Deliberately not built during setup. The manual version needs to run enough times first to know what the skill should actually do, and gOS's own skills earned their shape that way.
- A branded HTML template for the DWELL brief email, matching the gOS Morning Brief's care without borrowing its palette or section order. The nightly contract currently asks for clean readable HTML and nothing more.
- A `validate-nightly-log.mjs` port. gOS has one that checks heading order, digest labels, and section completeness. DWELL's log shape differs enough (three Input counters instead of four, no Website section, a confidentiality line in Verification) that porting it means rewriting the expectations, not copying the file.

**Later: keep visible, not actionable**

- A rent roll or delinquency report parser. Only worth building once the system of record is known and the export format is stable.
- Elise.ai as a connector rather than a source of exported transcripts. Depends entirely on what its API exposes.

**Shipped**

- 2026-09-08 · Structural redesign. `05 Work OS/` dissolved, the `03` and `04` gaps closed, 7 flat top-level folders, the Playbook pipeline, the redesigned dashboard, 3 Bases files, `dwell-home.css`, and `ARCHITECTURE.md`. `AGENT-VOICE.md` reverted to byte-identical with gOS.
- 2026-09-08 · Obsidian Bases views built: `Dashboard.base`, `Portfolio.base`, `People.base` in `03 System/Bases/`. Bases is a core plugin, so no community plugin was needed. Every dashboard section is now a live query instead of a folder link.
- 2026-09-08 · Vault created. Folder structure, `CLAUDE.md`, `AGENTS.md`, `OPERATING-GUIDE.md`, `AGENT-VOICE.md`, `NIGHTLY-SWEEP.md`, 9 templates, 3 validators, the Supernote prefix router, and the two-operator documentation. Built in one autonomous session from the gOS system as the source pattern.

## Entry format

Newest week at the top. Inside a week, newest entry at the top. One entry per request:

```markdown
### <short title>

- **Type:** bug | feature | question
- **Raised:** YYYY-MM-DD · <source>
- **Status:** open | in review | resolved | promoted | declined
- **Request:** "<exact words Graham used, trimmed only for length>"
- **Context:** <what an agent needs to know that the quote does not say>
- **Outcome:** <filled in by the weekly review; link the result>
```

Keep the **Request** line in Graham's words. Anything the agent concludes belongs in **Context** or **Outcome**, never inside the quote.

---

## Week of 2026-09-08

### Corporate-email phrases belong in both voice files

- **Type:** feature
- **Raised:** 2026-09-08 · system maintainer, during the voice revert
- **Status:** open
- **Request:** "REVERT AGENT-VOICE-DWELL.md to exactly match gOS version. No professional register divergence. Agents write the same voice in both vaults."
- **Context:** Done. The file is byte-identical and renamed to `AGENT-VOICE.md`. But `validate-voice.mjs` had picked up a DWELL-only banned list: "circle back", "touch base", "please find attached", "per my last email", "let me know if you have any questions", "key takeaways", "best practices", "best-in-class", "industry-leading", "world-class", "at your earliest convenience", "as per", "kindly". Those came out of the validator too, because a validator enforcing rules the voice file does not state is the same divergence in a different place. They are all worth banning, and they are worth banning in gOS as much as here. This is the both-vaults case: add them to gOS's `AGENT-VOICE.md` section 3B and to both validators in one review, two commits, two repositories.
- **Outcome:** Validator realigned 2026-09-08. The additions are not applied anywhere yet.

### Install the Tasks plugin

- **Type:** bug
- **Raised:** 2026-09-08 · system maintainer, during the redesign
- **Status:** open
- **Request:** N/A, found during the redesign.
- **Context:** `community-plugins.json` lists only Minimal Settings and Obsidian Git. The Tasks plugin is not installed in this vault, and every `tasks` query block on `01 Home/Dashboard.md`, `01 Home/Review.md`, and the Project, Property, and Meeting templates renders as a plain code block without it. The task contract in the operating guide assumes it. Bases views are unaffected, since Bases is core. There is a task for it in `01 Home/Tasks.md`.
- **Outcome:**

### Property phase statuses are a guess, confirmed

- **Type:** question
- **Raised:** 2026-09-08 · web research during the redesign
- **Status:** open
- **Request:** "What does the business call the phases of a property?" Graham's answer in `NOW.md`: "Unknown. That's fine for now."
- **Context:** Research on 2026-09-08 read dwellcommunities.com, both separately branded property sites, and Dwell's LinkedIn. None of them publish any lifecycle language. The company frames itself around four community pillars and a "Build. Belong. Innovate." tagline, never around a deal lifecycle. The only phase language anywhere is construction phasing at Dwell at 750, from a local news article. So `prospect` · `acquiring` · `renovating` · `stabilizing` · `operating` · `disposed` are the maintainer's invention with no external support. They stayed unchanged, because swapping one guess for another is not progress. Ask Hessel, then correct them in one pass across the operating guide, `Property.md`, and the 6 existing notes.
- **Outcome:**

### The gOS voice validator lets a dated em dash through

- **Type:** bug
- **Raised:** 2026-09-08 · found by the agent while porting the validator
- **Status:** resolved in DWELL, open in gOS
- **Request:** "preserve determinism, keep schema strict"
- **Context:** `validate-voice.mjs` in gOS tests a 9-character window against `[0-9]\s?—\s?[0-9APM: ]` to allow a numeric range. That character class contains a space, so any digit followed by ` — ` passes the check. `A line dated 2026-09-08 — this em dash should be caught.` runs clean through the gOS validator, verified 2026-09-08. That is the single most common shape an em dash takes in a nightly log, since every log line and every dated bullet starts with a date, so the rule the check exists to enforce has been unenforced for those lines the whole time. gOS's own templates put an em dash in exactly that position (`- {{date}} — Project created.`), which is probably how it went unnoticed.
- **Outcome:** DWELL's copy replaces both dash regexes with an `isNumericRange()` helper that requires a digit on the far side of the dash and tolerates an `AM`/`PM` before it, so `9:00 AM — 5:00 PM` and `7—11 AM` still pass. Tested against 8 cases. DWELL's templates use a middot for dated bullets, and the convention is written into the operating guide's execution standard. The gOS fix has to be filed in the gOS log; it was not made from this session.

### The property statuses are a guess

- **Type:** question
- **Raised:** 2026-09-08 · flagged by the agent during setup
- **Status:** open
- **Request:** "Document all schema decisions (properties on Tasks, Contacts, Projects)"
- **Context:** `property` statuses are `prospect` · `acquiring` · `renovating` · `stabilizing` · `operating` · `disposed`. They were picked to fit a group that buys undervalued complexes and restores them, with no knowledge of what the business actually calls these phases. Nothing else in the schema is this speculative. Correcting them touches `OPERATING-GUIDE.md`, `03 System/Templates/Property.md`, and any Property notes already written.
- **Outcome:**

### `sop` and `property` are new types, not Resources

- **Type:** question
- **Raised:** 2026-09-08 · decided by the agent during setup
- **Status:** open
- **Request:** "Keep schema strict, document all decisions"
- **Context:** Both could have been folded into `resource` and kept the type list shorter. They were not, for two reasons. A property is the noun almost every other record attaches to, and without a type for it Project notes end up doing two jobs. An SOP is a claim about how the company does something, so it needs an owner, a review date, and a status only Graham can set to `active`; filing SOPs as Resources loses all three. The cost is two more types to keep honest and two more templates to maintain. If Graham disagrees, collapsing them back is cheaper now than in 6 months.
- **Outcome:**

### The Contact shape diverged from gOS

- **Type:** question
- **Raised:** 2026-09-08 · decided by the agent during setup
- **Status:** open
- **Request:** "Document all schema decisions (properties on Tasks, Contacts, Projects)"
- **Context:** DWELL contacts drop `conversation_date` and `conversation_scheduled` and add `role`, `org`, and `relationship`. The 50-conversations campaign is personal and stays in gOS, so those two fields would sit blank forever here. A work CRM instead needs to say at a glance whether someone is a colleague, a vendor, or an owner. Side effect: a person Graham knows in both contexts now has two contact notes with different fields, and the operating guide says not to sync them.
- **Outcome:**

### gOS needs one line about the DWELL operator

- **Type:** feature
- **Raised:** 2026-09-08 · flagged by the agent during setup
- **Status:** open
- **Request:** "Preserve all existing gOS files untouched (you're not modifying gOS, only creating DWELL)"
- **Context:** The gOS operating guide's "Who runs the nightly sweep" section names one authorized operator and knows nothing about DWELL. It needs one line naming **Nightly process-inbox (DWELL)** as the sole DWELL operator and one line saying neither operator writes to the other's repository. The change was deliberately not made from this session, both because the build was scoped to leave gOS alone and because gOS's own contract routes governance-file edits through its weekly review. This entry is here as a reminder; the actual request has to be filed in the gOS log to be actioned there.
- **Outcome:**

### Supernote routing depends on moving the sync target

- **Type:** bug
- **Raised:** 2026-09-08 · found by the agent while writing the router
- **Status:** open
- **Request:** "Supernote file tagging: filename convention (e.g., WORK_* for work exports, PERSONAL_* for personal)"
- **Context:** The prefix router needs the source folder to be separate from both inboxes, or files loop forever. If the Supernote app currently syncs straight into the gOS "Claude Inbox" folder, that has to change: point the device at a new `Supernote Sync` folder and let the script move files from there. The script refuses to run if the source and a destination are the same folder, so the failure is loud rather than silent. Setup steps are in `03 System/Documentation/SUPERNOTE-AUTOMATION.md`.
- **Outcome:**

### DWELL has no `validate-nightly-log.mjs`

- **Type:** bug
- **Raised:** 2026-09-08 · flagged by the agent during setup
- **Status:** open
- **Request:** "preserve determinism, keep schema strict"
- **Context:** gOS runs four validators; DWELL ships three. The notes, tasks, and voice validators ported cleanly because they check generic shapes. The log validator encodes gOS's exact digest labels and section list, and DWELL's differ: three Input counters instead of four, no Website or Highlights counter, a confidentiality line in Verification, and a different H1. Copying it would have produced a validator that fails every correct DWELL log, which is worse than not having one. Until it is written, the nightly log's structure is enforced by the contract and by review, not by a script.
- **Outcome:**

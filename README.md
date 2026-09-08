# DWELL

Graham's work vault for Dwell Communities. The repository root is the live Obsidian vault.

**The operating contract is `07 System/Agent/OPERATING-GUIDE.md`.** Read it top to bottom; it is written for Graham and for agents both. `CLAUDE.md` and `AGENTS.md` are the agent entry hooks and point at it. `AGENT-VOICE.md` is how the agent should sound, and it is byte-identical to the gOS voice file on purpose: agents write the same way in both vaults.

This vault is separate from gOS by design. gOS holds personal knowledge, faith, relationships, and daily public writing, and it mirrors to a public website. DWELL holds employer data. The rules for what may cross are in the operating guide under **The two vaults**, and the confidentiality rule is in the section after it.

## Layout

```text
01 Home/       Dashboard, Tasks, Notes, Review
02 Portfolio/  one note per property
03 People/     the work CRM
04 Projects/   one control note per project
05 Meetings/   prep, notes, follow-up
06 Playbook/   Field notes, Procedures, Reference
07 System/     Agent contracts, Bases, Templates, Inbox, Sources, Logs, Attachments, Documentation
```

Storage is flat by note type. Navigation is property-first: a note carries a `property` link, and the Property note assembles everything about that asset with queries. `07 System/Documentation/ARCHITECTURE.md` explains the model and why it diverges from gOS.

## Automation

Two nightly operators run on separate schedules, one per vault. gOS at 12:30 AM Central, DWELL at 2:00 AM Central. Details and the collision rule: `07 System/Documentation/NIGHTLY-OPERATORS.md`.

Handwritten Supernote pages route to the right vault by filename prefix. `WORK_` comes here, `PERSONAL_` goes to gOS, anything else waits for Graham to rename it. Setup and the script: `07 System/Documentation/SUPERNOTE-AUTOMATION.md`.

Before the nightly run, local changes must reach GitHub. The desktop uses Obsidian Git Commit-and-sync; a standalone Pull can fail when `Tasks.md` has local checkbox changes.

## Setup still needed

These steps need Graham and cannot be done from a terminal. They are also in `01 Home/Tasks.md`.

1. **Install the Obsidian Tasks plugin.** Every task query on the dashboard and the review renders as a plain code block without it. Bases views already work, because Bases is core.
2. Confirm unit counts and occupancy for the 6 properties from the rent roll. The counts currently on each property note came off public listing sites and one of them disagrees with itself by a factor of 2, so `units` and `occupancy` are deliberately blank in the frontmatter.
3. Create the two Drive folders named in `SUPERNOTE-AUTOMATION.md`, install the Apps Script, and paste the folder IDs into it.
4. Create the second Claude Code Routine for the DWELL nightly sweep.
5. Add one line to the gOS operating guide naming the DWELL operator in its collision rule. That change belongs to gOS's weekly system review, so it was not made from here.

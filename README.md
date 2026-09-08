# DWELL

Graham's work vault for Dwell Communities. The repository root is the live Obsidian vault.

**The operating contract is `06 System/Agent/OPERATING-GUIDE-DWELL.md`.** Read it top to bottom; it is written for Graham and for agents both. `CLAUDE.md` and `AGENTS.md` are the agent entry hooks and point at it. `AGENT-VOICE-DWELL.md` is how the agent should sound.

This vault is separate from gOS by design. gOS holds personal knowledge, faith, relationships, and daily public writing, and it mirrors to a public website. DWELL holds employer data. The rules for what may cross are in the operating guide under **The two vaults**, and the confidentiality rule is in the section after it.

## Layout

```text
01 Home/       dashboards
02 Notes/      _Notes.md and filed Garden reference
05 Work OS/    Projects, Properties, SOPs, Meetings, Relationships, Tasks, Resources
06 System/     Agent contracts, Templates, Inbox, Logs, Sources, Attachments, Documentation
```

`03` and `04` are intentionally unused. Those numbers hold the writing pipeline in gOS, and keeping them empty here means a folder path means the same thing in both vaults.

## Automation

Two nightly operators run on separate schedules, one per vault. gOS at 12:30 AM Central, DWELL at 2:00 AM Central. Details and the collision rule: `06 System/Documentation/NIGHTLY-OPERATORS.md`.

Handwritten Supernote pages route to the right vault by filename prefix. `WORK_` comes here, `PERSONAL_` goes to gOS, anything else waits for Graham to rename it. Setup and the script: `06 System/Documentation/SUPERNOTE-AUTOMATION.md`.

Before the nightly run, local changes must reach GitHub. The desktop uses Obsidian Git Commit-and-sync; a standalone Pull can fail when `Tasks.md` has local checkbox changes.

## Setup still needed

Created 2026-09-08. These steps need Graham and cannot be done from a terminal:

1. Create the GitHub remote and push. The repository is initialized locally with no remote.
2. Create the two Drive folders named in `SUPERNOTE-AUTOMATION.md`, install the Apps Script, and paste the folder IDs into it.
3. Create the second Claude Code Routine for the DWELL nightly sweep.
4. Open the vault in Obsidian and decide which plugins belong here (Tasks is assumed by the task contract).
5. Add one line to the gOS operating guide naming the DWELL operator in its collision rule. That change belongs to gOS's weekly system review, so it was not made from here.

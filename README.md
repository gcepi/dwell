# DWELL

Work vault for Dwell Communities. The repository root is the live Obsidian vault.

Start at `01 Home/README.md`. First-time setup is `01 Home/SETUP.md`.

The operating contract is `07 System/Agent/OPERATING-GUIDE.md`. `CLAUDE.md` and `AGENTS.md` are the agent entry hooks and point at it. `AGENT-VOICE.md` sets how the agent sounds, and it is byte-identical to the gOS voice file.

DWELL holds employer data. gOS holds personal knowledge, faith, relationships, and daily public writing, and it mirrors to a public website. The rules for what may cross are in the operating guide under **The two vaults**, and the confidentiality rule is in the section after it.

## Layout

```text
01 Home/           README, SETUP, Dashboard, Tasks, Notes, Review
02 Portfolio/      one note per property
03 People/         the work CRM
04 Projects/       one control note per project
05 Meetings/       prep, notes, follow-up
06 Playbook/       Field notes, Procedures, Reference
07 System/         Agent contracts, Bases, Templates, Scripts, Inbox, Sources, Logs, Attachments, Documentation
Supernote/EXPORT/  drop handwritten PDFs here
```

Storage is flat by note type. Navigation is property-first: a note carries a `property` link, and the Property note assembles everything about that asset with queries. `07 System/Documentation/ARCHITECTURE.md` has the model.

## Automation

End of day, from the vault root:

```bash
bash "07 System/Scripts/dwell-sync.sh"
```

It routes Supernote PDFs into the inbox, validates the markdown, commits, and pushes.

Two nightly operators run on separate schedules, one per vault. gOS at 12:30 AM Central, DWELL at 2:00 AM Central. Details and the collision rule: `07 System/Documentation/NIGHTLY-OPERATORS.md`.

Handwritten pages arriving through Google Drive route by filename prefix. `WORK_` comes here, `PERSONAL_` goes to gOS, anything else waits for a rename. Setup and the script: `07 System/Documentation/SUPERNOTE-AUTOMATION.md`.

Before the nightly run, local changes must reach GitHub. The desktop uses Obsidian Git Commit-and-sync; a standalone Pull can fail when `Tasks.md` has local checkbox changes.

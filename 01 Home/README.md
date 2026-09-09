# README

DWELL is the work vault for Dwell Communities: properties, projects, people, procedures, and tasks.

## Daily workflow

1. Open [[01 Home/Dashboard|Dashboard]]. Read "Waiting on you" first.
2. Work the day. Write what you were told into [[01 Home/Notes|Notes]].
3. Put every task in [[01 Home/Tasks|Tasks]]. One ledger. Every open task gets a due date.
4. Drop handwritten PDFs into `Supernote/EXPORT/`.
5. Run the end-of-day command.

Once a week, open [[01 Home/Review|Review]] instead of the dashboard.

## End of day

From the vault root:

```bash
bash "07 System/Scripts/dwell-sync.sh"
```

It routes Supernote PDFs into the inbox, validates the markdown, commits, and pushes. It prints what it processed and what needs you.

Flags: `--no-push` commits without pushing, `--no-git` skips git, `-v` prints every check.

## Where things live

```text
01 Home/           Dashboard, Tasks, Notes, Review. Open daily.
02 Portfolio/      One note per property.
03 People/         One note per contact.
04 Projects/       One control note per project.
05 Meetings/       Prep, notes, follow-up.
06 Playbook/       Field notes, Procedures, Reference.
07 System/         Contracts, templates, scripts, inbox, logs.
Supernote/EXPORT/  Drop PDFs here.
```

A note lives in one folder by its type and carries a `property` link. Property notes assemble everything else by query.

## First steps

Work through [[01 Home/SETUP|SETUP]]. Install the Tasks plugin first, or every task block renders as a code block.

## Troubleshooting

**Task blocks show as plain code.** The Tasks plugin is not installed. See [[01 Home/SETUP|SETUP]].

**A PDF did not land in the inbox.** It has to be a `.pdf` sitting directly in `Supernote/EXPORT/`, not in a subfolder, and at least 90 seconds old. Re-run the command.

**The same PDF copied twice.** It will not. The ledger is `07 System/Agent/processed-pdfs.txt`. Delete a line to force a re-copy.

**Validation error.** The command names the file and the line. Fix the line. The rules are in `07 System/Agent/AGENT-VOICE.md`.

**Push failed.** Run `git push` and read the error. Usually a conflict in `Tasks.md` from Obsidian Git.

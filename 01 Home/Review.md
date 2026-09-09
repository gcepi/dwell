---
cssclasses:
  - dwell-home
---
# Weekly review

Once a week. The dashboard shows today. This shows what is drifting.

## Six questions

Each one is a judgment.

1. **Procedure drafts.** Which drafts in [[06 Playbook/Procedures/|Procedures]] are right enough to set `active`? Which are wrong and should be fixed before anyone follows them?
2. **Procedures past `review_due`.** Is that still what the company does?
3. **Projects with no recent update.** Open each active one in [[04 Projects/|Projects]] and read its `## Updates`. Nothing dated in 3 weeks means finished, stalled, or never real.
4. **Properties with no recent log line.** Open [[02 Portfolio/_Portfolio|the portfolio]]. Silence on an asset usually means the record is behind reality.
5. **Occupancy dates.** Any `occupancy_as_of` older than a month is a number you should stop quoting.
6. **What you learned and didn't write down.** Scroll [[01 Home/Notes|Notes]] and count the days with nothing under them.

## Every open task, by date

```tasks
path includes 01 Home/Tasks.md
not done
sort by due
short mode
hide task count
hide toolbar
```

## Waiting on someone else

```tasks
path includes 01 Home/Tasks.md
not done
heading includes Waiting
sort by due
short mode
hide task count
hide toolbar
```

## Stale: open more than 30 days

```tasks
path includes 01 Home/Tasks.md
not done
created before 30 days ago
sort by created
short mode
hide task count
hide toolbar
```

## No date, which should only ever be Someday

```tasks
path includes 01 Home/Tasks.md
not done
no due date
heading does not include Someday
short mode
hide task count
hide toolbar
```

## Someday, worth a second look

```tasks
path includes 01 Home/Tasks.md
not done
heading includes Someday
short mode
hide task count
hide toolbar
```

## Done in the last 7 days

```tasks
path includes 01 Home/Tasks.md
done
done after 7 days ago
sort by done reverse
short mode
hide task count
hide toolbar
```

## System

- [[07 System/Agent/SYSTEM-REQUESTS|System requests]], newest week first. The review's agenda.
- [[07 System/Inbox/Needs Review/|Needs Review]], anything still open from the nightly sweeps.
- [[07 System/Inbox/Failed/|Failed]], which should normally be empty.

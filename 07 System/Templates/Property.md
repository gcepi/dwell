---
type: property
status: operating
created: "{{date}}"
origin: manual
address: ""
city: ""
units:
occupancy:
occupancy_as_of:
---
> [!summary] The asset
> One or two sentences. What it is, where it is, and why Dwell owns it.

## Where it stands

Current phase and what the phase means here. What has to happen before it moves to the next one.

## Who's accountable

| Role | Person |
|---|---|
| Property manager | |
| Regional | |
| Maintenance lead | |

Link a contact in `03 People/` when one exists.

## Systems of record

Where the authoritative numbers for this property live: the management software, the rent roll, the accounting file. Every figure in this note traces back to one of them.

## Open work

```tasks
path includes 01 Home/Tasks.md
not done
description includes [[{{title}}]]
sort by due
sort by priority
short mode
hide task count
hide toolbar
```

## Log

- {{date}} · Property note created.

<!--
The numbers live in the properties panel, not in the body. That is what makes
the portfolio table on the dashboard work, and it means a number exists in
exactly one place.

units: integer. occupancy: percent as an integer, 0-100.
occupancy_as_of: the ISO date of the report the number came from. A percent
without its date is a rumor, so both fields move together or neither moves.

Statuses: prospect | acquiring | renovating | stabilizing | operating | disposed.
Only Graham changes status. Only Graham creates this note.
Confidentiality: no resident financial, medical, or identity detail here.
-->

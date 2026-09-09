---
type: resource
status: ready
created: "2026-09-08"
origin: ai
---
# Architecture

The folder model, the structural decisions behind it, and the open questions.

There is no `Work OS` folder and the numbering has no gaps. Every folder here is work, so a wrapper folder would only add a click to every path in the vault.

## The model

```text
01 Home/         Dashboard · Tasks · Notes · Review
02 Portfolio/    one note per property
03 People/       one contact per person
04 Projects/     one control note per project
05 Meetings/     prep, notes, follow-up
06 Playbook/     Field notes · Procedures · Reference
07 System/       Agent · Bases · Templates · Inbox · Sources · Logs · Attachments · Documentation
```

Seven folders, no gaps, and every note type is one or two clicks from the root.

`01 Home/` holds the four things you open every day and nothing else. If you don't open it daily, it lives somewhere else.

## Four structural decisions

**1. Storage stays flat. Navigation goes property-first.**

The portfolio sits at the top, as `02`. Work does not partition cleanly by property: Elise.ai touches all six, one vendor meeting can cover three, payroll covers the whole portfolio. Nesting the work under each property leaves cross-property work nowhere to go.

A note lives in exactly one folder by its type and carries a `property` link. The Property note assembles everything about that asset by query: its open tasks, its meetings, its projects. One source of truth, many views. Nothing is filed twice.

**2. `Work OS` dissolved rather than renamed.**

Its children came up to the root. `02` is named "Portfolio" and not "Properties" because in Obsidian "properties" already means frontmatter fields, and the operating guide uses that sense constantly.

**3. `06 Playbook/` holds field notes and procedures as adjacent folders.**

They are the same subject at two stages of ripeness. A field note is what somebody told you on a walkthrough. A procedure is what the company does, once you set it `active`.

`Resources/` folded into `06 Playbook/Reference/`. Reference is reference; provenance lives in `origin`.

**4. A number lives in the properties panel, never in the body.**

Units, market, and address live in frontmatter only. No body list repeats them, because two copies of one fact drift.

`occupancy` and `occupancy_as_of` are a pair. Both move together or neither moves.

## The dashboard

Six live sections, ordered by urgency.

1. **Start here.** Today's note, the prompt to write down yesterday, the calendar, today's tasks.
2. **Waiting on you.** Procedure drafts, flagged captures, unreviewed AI results.
3. **Portfolio.** Occupancy by property.
4. **Projects.** Active, with target dates.
5. **This week.** Meetings, upcoming tasks, people needing attention.
6. **What you're learning.** Recent field notes, and what's been ratified.

Every section is a query, so an empty one renders empty.

Views live in `07 System/Bases/` as three files, one per surface. Bases is a core plugin, so they render with nothing installed. Task queries need the Tasks plugin, installed 2026-09-08. Without it every `tasks` block shows as a plain code block.

## The look

`.obsidian/snippets/dwell-home.css`, applied by the `dwell-home` cssclass.

Slate teal `#42756C`, at the same lightness and saturation as the gOS gold `#807047`.

H2s carry a left rule, corners are squared to 6px, the vertical rhythm is tight, and every table sets tabular figures so occupancy columns line up.

Amber appears exactly once, on the `decide` callout. A warm-colored item in this vault means you are the blocker.

Templates carry no placeholder H1. The filename is the title. H1 is reserved for the dashboard, the review, and the two index notes. Everything else starts at H2.

## Settled

`AGENT-VOICE.md` is byte-identical to the gOS copy. Banned phrases specific to DWELL are logged as a system request rather than applied to one vault.

The em dash check in `validate-voice.mjs` is stricter than the gOS version. It requires a digit on both sides of the dash, which closes a hole that let every dated log line through.

`05 Meetings/` stays at the top level.

## Open dependencies

- **The three Hollywood Road properties: one operating unit or three?** Unknown. This decides whether a procedure written for "a property" means a building or a cluster, so it blocks every portfolio-wide procedure. Flagged on each of the three property notes.
- **The seventh property.** Dwell's LinkedIn says 7 properties and 1,027 units; the website lists 6.
- **What the business calls the phases of a property.** The six statuses in the schema are a guess. Dwell publishes no lifecycle language.

## Dated reminder

**2026-11-07: is `06 Playbook/Reference/` earning its place, or is it a junk drawer?** Keeping it for now. Open the folder on that date, read what has accumulated, and either keep it or fold it back into `06 Playbook/`.

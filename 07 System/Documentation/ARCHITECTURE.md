---
type: resource
status: ready
created: "2026-09-08"
origin: ai
---
# Architecture

Why DWELL is shaped the way it is, and where it stops looking like gOS. Written for Graham to mark up.

## The question that started it

You asked whether a Work OS is necessary when the entire vault is for work. It isn't, and the answer went further than the one folder.

gOS needs a `05 Work OS/` because work is one domain among several: there's writing, faith, relationships, the Garden. The wrapper earns its place by saying "this pile is the job." Here every folder is the job, so the wrapper only added a click to every path in the vault. Same story for the empty `03` and `04` slots, which existed to keep the numbering aligned across both vaults. That alignment was supposed to mean a path meant the same thing in both places, but the two vaults share almost no note types, so it never meant anything. It just left holes.

Both are gone.

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

Seven folders, no gaps, and every note type is one or two clicks from the root. Before, anything real took two clicks minimum because it lived under `05 Work OS/`.

`01 Home/` holds the four things you touch every day and nothing else. That's the design test for it: if you don't open it daily, it lives somewhere else.

## Four decisions worth arguing with

**1. Storage stays flat. Navigation goes property-first.**

You asked whether Properties should sit at the top with projects, tasks, and meetings hanging off each one. Half yes. The portfolio belongs at the top, and it's `02`. But work doesn't partition cleanly by property: Elise.ai touches all six, one vendor meeting can cover three, payroll covers the whole portfolio. Nest the work under each property and cross-property work has nowhere to go, which means a `_Portfolio-wide/` folder within a month, which is the abstraction leaking again.

So a note lives in exactly one folder by its type and carries a `property` link. The Property note then assembles everything about that asset by query: its open tasks, its meetings, its projects. One source of truth, many views. You get property-first navigation without property-first storage, and nothing has to be filed twice or decided twice.

**2. `Work OS` dissolved rather than renamed.**

Renaming it Portfolio or Operations would have kept the extra level and just changed the sign on the door. Its children came up to the root instead. "Portfolio" won the name for `02` over "Properties" for a boring reason: in Obsidian, "properties" already means frontmatter fields, and the operating guide uses that sense constantly. One word, two meanings, in the sentences you'll be writing to agents all day.

**3. `06 Playbook/` makes the 90-day deliverable visible.**

Field notes and procedures were in two unrelated places, `02 Notes/` and `05 Work OS/SOPs/`, with nothing connecting them. They're the same subject at two stages of ripeness. A field note is what somebody told you on a walkthrough. A procedure is what the company does, once you set it `active`. Now they're adjacent folders, so the pipeline is a thing you can see instead of a thing you have to remember.

`Resources/` folded into `06 Playbook/Reference/`. It had been holding durable reference and yesterday's AI output under one name, which is two folders wearing one label. Reference is reference; provenance lives in `origin`.

**4. A number lives in the properties panel, never in the body.**

The old Property template carried units, market, and address in the frontmatter and then repeated them as a bullet list under a heading. Two copies of the same fact drift, always. The body list is gone. That's also what turns the portfolio table on the dashboard into a real instrument rather than decoration.

`occupancy` and `occupancy_as_of` are a pair. A percent without its report date is a rumor, which is a rule already in the voice file, now pushed down into the schema.

## The dashboard

The old one was a menu of folder links with an apology in an HTML comment about Bases not being set up. It's now six live sections ordered by urgency, and section two is the one that didn't exist before.

1. **Start here.** Today's note, the prompt to write down yesterday, the calendar, today's tasks.
2. **Waiting on you.** Procedure drafts, flagged captures, unreviewed AI results. The operating guide is full of moves only you can make, and nothing was surfacing that queue. A system that hides its own decision backlog stalls quietly. An empty section here is the goal.
3. **Portfolio.** Occupancy by property.
4. **Projects.** Active, with target dates.
5. **This week.** Meetings, upcoming tasks, people needing attention.
6. **What you're learning.** Recent field notes, and what's been ratified.

Every section is a query, so an empty one renders empty instead of lying. That matters on day one, when the honest answer to "which properties are below occupancy" is "nobody has told you yet."

Views live in `07 System/Bases/` as three files, one per surface. Bases is a core plugin, so they render with nothing installed. **Task queries need the Tasks plugin, which isn't in this vault yet.** Until you install it, every `tasks` block shows as a plain code block.

## The look

`.obsidian/snippets/dwell-home.css`, applied by the `dwell-home` cssclass. It's a deliberate sibling of `gos-home.css`, not a recolor.

Same lightness and saturation as gOS's warm gold `#807047`, hue rotated to slate teal `#42756C`. Two vaults that look like one designer made them and are never confused at a glance.

Structurally it goes the other direction on purpose. gOS underlines its H2s and rounds its callouts to 15px, which reads as a place to browse. DWELL puts a left rule on H2s like a document margin, squares corners to 6px, tightens the vertical rhythm, and sets tabular figures in every table so occupancy columns line up. It's a place to check a number and leave.

Amber shows up exactly once, on the `decide` callout. If something is warm-colored in this vault, you're the blocker.

Templates lost their placeholder H1s. The filename is the title, so a second copy of it as the first line was a duplicate. H1 is now reserved for pages that greet you: the dashboard, the review, the two index notes. Everything else starts at H2, which makes the outline pane useful.

## What I deliberately didn't touch

`AGENT-VOICE.md` is now byte-identical to gOS's, per your instruction. The DWELL-specific banned phrases that had crept into `validate-voice.mjs` came out too, because a validator enforcing rules the voice file doesn't state is the same divergence wearing a different hat. Those phrases are worth banning in both vaults; they're logged as a system request instead of applied to one.

The em dash fix in `validate-voice.mjs` stayed. That's a bug fix, not a voice change: the gOS regex lets any digit followed by a spaced em dash through, which is the exact shape of every dated log line.

The six property statuses stayed as they are, even though research turned up that Dwell publishes no lifecycle language at all, which means all six words are a guess. Changing them without asking would replace one guess with another.

## What needs your call

- Does `05 Meetings/` deserve a top-level folder, or should it live under the Playbook? Right now meetings are how you learn, so it's high traffic. In a year it might not be.
- Is `06 Playbook/Reference/` a real folder or a junk drawer with a nicer name? I think reference material genuinely wants a home, but ask again in 60 days.
- The seventh property, and Houston. Both are in `NOW.md` as open questions.
- Whether the three Hollywood Road properties are one operating unit or three. This one changes what "a property" means in every procedure you write.

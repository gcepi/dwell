# Two nightly operators

One vault had one nightly sweep. Two vaults get two, and they must not touch each other.

| Routine name | Repository | Time (America/Chicago) | Contract |
|---|---|---|---|
| Nightly process-inbox | `gcepi/gOS` | 12:30 AM | `06 System/Agent/NIGHTLY-SWEEP.md` in gOS |
| Nightly process-inbox (DWELL) | the DWELL repo | 2:00 AM | `07 System/Agent/NIGHTLY-SWEEP.md` here |

## Why two and not one

A single routine reading both repositories would be simpler to schedule and worse in every other way.

**Blast radius.** One run that fails partway leaves one vault half-processed. Two runs mean a bad night in DWELL never touches a night of personal writing, and a Readwise plugin problem never blocks a property task.

**The confidentiality boundary is easier to keep when it's structural.** An operator that holds credentials for both repositories can write employer data into gOS by mistake. An operator that can only see one repository cannot. The rule in the operating guide's **The two vaults** section is enforced by what each routine has access to, not only by what the contract asks it to remember.

**Usage spreads across two windows.** A 90-minute gap keeps the two runs from competing for the same rate limits and the same connector quotas. If one night's work runs long, the other still starts clean.

**The contracts diverge.** gOS mirrors a public website, ingests Readwise, maintains a 50-conversations campaign, and forbids an agent from touching prose. DWELL does none of that and expects an agent to draft prose all day. Those are different jobs and a single procedure covering both would be full of "unless you are in the other vault."

The cost is real and worth naming: two contracts drift. A fix applied in one does not land in the other, and six months from now the two nightly procedures will have diverged in ways nobody chose. The mitigation is in the weekly system review, which reviews a shared change once and applies it twice, in two commits in two repositories.

## Setting up the DWELL routine

The gOS routine already exists and needs no change to its schedule. For DWELL:

1. Create a new Claude Code Routine named exactly **Nightly process-inbox (DWELL)**. The name is load-bearing: the DWELL operating guide names it as the sole authorized operator, and the collision rule below is checked against it.
2. Point it at the DWELL repository only. Do not grant it the gOS repository.
3. Schedule it for 2:00 AM `America/Chicago`, daily.
4. Give it the connectors DWELL actually uses: Google Drive (the DWELL inbox folder only), Google Calendar, Gmail (send), and GitHub for the DWELL repository. It needs no Readwise access and no website repository.
5. Set the prompt to read `CLAUDE.md`, then the **Every run** section of `07 System/Agent/OPERATING-GUIDE.md`, then `07 System/Agent/AGENT-VOICE.md`, then follow `07 System/Agent/NIGHTLY-SWEEP.md`.

## The collision rule

Each operating guide names one authorized nightly operator for its own repository. Any other automation that starts a session to process an inbox or run a sweep stops before reading connectors, changing files, opening a pull request, or sending a digest, and reports the collision.

Cross-vault collisions are the new case:

- The gOS operator finding itself in the DWELL repository stops and reports.
- The DWELL operator finding itself in the gOS repository stops and reports.
- Either operator finding a file that belongs to the other vault leaves it in place, processes nothing from it, and creates a Needs Review item naming the file. Neither one moves a file across.

There is one pending change on the gOS side. Its operating guide currently names a single authorized nightly operator and knows nothing about DWELL. It needs one added line naming **Nightly process-inbox (DWELL)** as the sole DWELL operator, and one line saying neither operator writes to the other's repository. That change was deliberately not made from this session, for two reasons: this build was scoped to create DWELL without modifying gOS, and gOS's own contract routes governance-file changes through its weekly system review. Graham, file it as a system request in gOS and it lands in the next weekly session.

## Email

Both operators send one morning email. gOS keeps its subject line and its branded HTML template. DWELL sends a plainer message with the subject `DWELL brief · YYYY-MM-DD`, so the two are sortable and never mistaken for one another in the inbox.

Two emails arriving before 3 AM is a lot of morning mail for one person. If it becomes noise, the fix is a filter that labels them and skips the inbox, not a merged operator.

## Checking that both ran

Each run writes a log to `07 System/Logs/` in its own repository and merges one pull request. A morning with one email and not two means one operator failed silently. The fastest check is the pull request list in each repository: two merged `claude/nightly-*` branches, dated today.

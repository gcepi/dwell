# Two nightly operators

Two vaults run two nightly sweeps. Neither touches the other's repository.

| Routine name | Repository | Time (America/Chicago) | Contract |
|---|---|---|---|
| Nightly process-inbox | `gcepi/gOS` | 12:30 AM | `06 System/Agent/NIGHTLY-SWEEP.md` in gOS |
| Nightly process-inbox (DWELL) | the DWELL repo | 2:00 AM | `07 System/Agent/NIGHTLY-SWEEP.md` here |

## Setting up the DWELL routine

The gOS routine already exists and needs no change to its schedule. For DWELL:

1. Create a new Claude Code Routine named exactly **Nightly process-inbox (DWELL)**. The DWELL operating guide names it as the sole authorized operator, and the collision rule below is checked against it.
2. Point it at the DWELL repository only. Do not grant it the gOS repository.
3. Schedule it for 2:00 AM `America/Chicago`, daily.
4. Give it the connectors DWELL actually uses: Google Drive (the DWELL inbox folder only), Google Calendar, Gmail (send), and GitHub for the DWELL repository. It needs no Readwise access and no website repository.
5. Set the prompt to read `CLAUDE.md`, then the **Every run** section of `07 System/Agent/OPERATING-GUIDE.md`, then `07 System/Agent/AGENT-VOICE.md`, then follow `07 System/Agent/NIGHTLY-SWEEP.md`.

## The collision rule

Each operating guide names one authorized nightly operator for its own repository. Any other automation that starts a session to process an inbox or run a sweep stops before reading connectors, changing files, opening a pull request, or sending a digest, and reports the collision.

Cross-vault collisions:

- The gOS operator finding itself in the DWELL repository stops and reports.
- The DWELL operator finding itself in the gOS repository stops and reports.
- Either operator finding a file that belongs to the other vault leaves it in place, processes nothing from it, and creates a Needs Review item naming the file. Neither one moves a file across.

One change is pending on the gOS side. Its operating guide names a single authorized nightly operator and knows nothing about DWELL. It needs one added line naming **Nightly process-inbox (DWELL)** as the sole DWELL operator, and one line saying neither operator writes to the other's repository. File it as a system request in gOS.

## Email

Both operators send one morning email. gOS keeps its subject line and its branded HTML template. DWELL sends a plainer message with the subject `DWELL brief · YYYY-MM-DD`.

If the two emails become noise, add a Gmail filter that labels them and skips the inbox.

## Checking that both ran

Each run writes a log to `07 System/Logs/` in its own repository and merges one pull request. A morning with one email and not two means one operator failed silently. The fastest check is the pull request list in each repository: two merged `claude/nightly-*` branches, dated today.

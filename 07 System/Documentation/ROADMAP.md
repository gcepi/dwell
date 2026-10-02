# Dwell system roadmap

Created 2026-10-02. This is a short execution plan, not a standing invitation to rebuild the system.

## Definition of success

By 2026-10-17, each Dwell workday can end with sources preserved, a useful next-day handoff, and no uncertainty about where company work belongs. Meeting transcripts, handwritten notes, and typed notes remain readable source material. The system may suggest organization, but it does not silently convert every thought into a task or replace Asana as the execution system.

## 2026-10-02 -- restore the plumbing

- [x] Push the existing gOS and Dwell commits after restoring GitHub's Git credential helper.
- [ ] Store and validate the Grain API token, then prove a read-only meeting-list or token-info request.
- [ ] Confirm the Mac/Obsidian copy has caught up with `origin/main`. The repository's Work Dashboard already points at `02 Notes/Tasks.md`; a screen that still shows `05 Work OS/Tasks/Tasks.md` is displaying an older local copy.

**Done when:** both repositories show clean `main` branches, Grain can perform one read-only call, and the live desktop renders current dashboard content.

## 2026-10-03 -- one complete capture loop

- [ ] Process one real Grain meeting and one Supernote export through the current Dwell inbox.
- [ ] Check the resulting source links, Hessel list, and daily note by hand.
- [ ] Record only the concrete routing rules that proved necessary. No autonomous task creation for Dwell execution work.

**Done when:** tomorrow morning has an accurate, source-linked handoff that Graham can use without reopening every capture.

## 2026-10-05 -- settle the daily rhythm

- [ ] Use the end-of-day handoff on two consecutive workdays.
- [ ] Decide whether the system should send a reminder when no end-of-day capture arrives. Keep it opt-in and nonintrusive.
- [ ] Identify the few signals that deserve promotion: explicit asks for Hessel, a named follow-up, an approved procedure, or a source that needs review.

**Done when:** the handoff feels like Graham's own working memory, not an AI daily brief that guessed wrong.

## 2026-10-07 -- Asana boundary

- [ ] Decide the smallest Asana shape for execution work: projects, owners, due dates, and what qualifies for transfer from Dwell.
- [ ] Keep Dwell as the source and thinking layer. Test one manually approved transfer only after Asana exists.

**Done when:** Hessel conversations and working context stay in Dwell while active project execution has one clear home.

## 2026-10-10 -- model-cost decision

- [ ] Keep ChatGPT/Codex OAuth for frontier reasoning and the existing deterministic scripts for mechanical work.
- [ ] Run one bounded MiniMax API evaluation against a non-sensitive, repeatable Dwell triage sample. Set a hard monthly budget before any unattended use.
- [ ] Decide whether a ClawRouter deployment is justified by actual multi-provider API use, rather than by the desire to optimize in advance.

**Done when:** there is one written model policy: which work is deterministic, which uses OAuth, which may use a paid API, and the monthly ceiling.

## 2026-10-17 -- Jev decision gate

- [ ] Evaluate Jev only on one typed, advisory question with an auditable answer set, such as `Hessel list | needs review | archive as source`.
- [ ] Compare its decision and confidence with a manual review of 20 real captures.
- [ ] Adopt it only if it reduces review work without hiding uncertainty. Otherwise, leave it out.

**Done when:** Jev is either a measured, narrow gate or explicitly deferred. It is not a second brain and does not decide Dwell priorities.

## Deferred until the capture loop is trusted

- Screen control: start with a bounded, read-only Mac test after the above loop works. Never make a primary Mac password the integration mechanism.
- Local embeddings or BGE-M3: reconsider only if FTS recall proves inadequate. It is a retrieval component, not a reasoning model.
- New aesthetic system: collect references now; implement after the operating loop is useful.
- New providers, databases, and automation platforms: no action without a demonstrated gap.


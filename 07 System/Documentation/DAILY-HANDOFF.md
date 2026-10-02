# Daily handoff

The point is to leave your next self enough context to begin again without recreating the day from scratch.

## Inputs

- A daily note for what you learned, who you talked to, and what needs Hessel's attention.
- Supernote exports in `Supernote/EXPORT/`.
- Grain recordings once the API token is live.

The original transcript, image, PDF, or typed note remains the source. AI-created notes point back to it.

## End of day

1. Add a few bullets to the daily note. Imperfect is fine.
2. Drop handwritten pages into `Supernote/EXPORT/`.
3. Run `bash "07 System/Scripts/dwell-sync.sh"` after the files finish syncing.
4. Commit and push before switching devices.

## Morning

Open [[01 Home/Dashboard|Dashboard]], today's note, and [[01 Home/Hessel|Hessel]]. Read the original page or transcript when a summary leaves out the texture you need.

## Boundaries

- The Hessel page is a conversation surface. Asana will hold project execution when it is ready.
- A transcript can contain a task, a question, a rough thought, or a mis-transcribed name. Preserve it first. Promote only what has enough evidence.
- The system may ask for a missing end-of-day capture after the intake channels are reliable. It should not manufacture a daily brief from thin evidence.

# Clipzy site: triage-first repositioning + demo video

**Date:** 2026-09-11
**Trigger:** Feedback from @tirthaexe on X after clipzy.xyz was shared.

## The feedback

Three distinct points, all valid:

1. The site reads as a video editor, so a reader assumes Clipzy auto-produces
   finished clips and is disappointed when it does not. The core idea, sorting
   your own clips down to the keepers, never reaches the hero.
2. Static screenshots cannot show a swipe. A live demo would explain the product
   faster than any copy.
3. "How it works" has gaps in progression. Import is never explained: the reader
   has no idea how clips get into the app.

## What we confirmed on device

Captured from a Pixel 9 Pro running build 1.0.1:

- The app's own signed-out screen already says **"Your best Twitch moments,
  sorted."** The app is positioned on triage; only the website drifted to editor.
- Clips load newest first, so a creator starts with last night and works back.
- Twitch sign-in completes in about a second with no extra setup.
- **Kept clips arrive as "cloud clips" and must be downloaded once to unlock
  editing and offline playback.** This step is entirely absent from the site and
  is a second progression gap beyond the one Tirtha named.

## Decisions

**Positioning: triage first, editing as the payoff.** The hero leads with the
swipe. Editing and export stay on the page but move below, framed as what you do
once the keepers are chosen. This preserves the deliberate boundary against
competing with CapCut.

**Hero H1:** "Your Twitch backlog, sorted in one sitting."

**Hero visual:** a silent looping capture of the real swipe, replacing the static
screenshot tab-switcher. Falls back to the existing screenshots when the video
cannot play or the viewer prefers reduced motion.

**How it works: six steps, not four.** The current four start mid-story and end
early. Both ends get closed and the download step gets named.

| # | Step | Why it exists |
|---|------|---------------|
| 01 | Connect | Closes the import gap Tirtha named |
| 02 | Review | The core loop, now the second thing you read |
| 03 | Organize | Unchanged in substance |
| 04 | Download | Closes the gap we found ourselves |
| 05 | Create | Was "Create" |
| 06 | Finish | Captions plus export, closing the back end |

**Walkthrough section:** a click-to-play 73s capture between "How it works" and
the editor section, answering "does it do it for me, or do I do it" by showing
the answer.

## Assets

All captured on device, silent, cropped to exclude the ad banner, with a faked
clean status bar.

- `public/demo/swipe-loop.mp4` / `.webm` — 9.8s hero loop, 470KB / 385KB
- `public/demo/connect-twitch.mp4` / `.webm` — 5.5s, sign-in to loaded deck
- `public/demo/walkthrough.mp4` — 73s, silent, awaiting voiceover

## Out of scope

- Narration. The walkthrough ships silent; Frozair records voice over it later.
- The Google Play purchase failure found during capture. Logged separately.

## Non-negotiables

Pricing copy keeps saying the free plan is ad supported, even though the footage
was cropped to exclude the ad banner. Nothing on the page may imply otherwise.

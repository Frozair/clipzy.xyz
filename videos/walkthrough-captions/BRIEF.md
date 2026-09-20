---
workflow: general-video
flow: automation
storyboard: no
message: "You choose what is worth keeping; Clipzy makes that fast and finishes the ones you chose."
destination: web
language: en
length: 105s
---

## Intent

Burn short beat captions onto the existing silent Clipzy walkthrough so the demo
explains itself on clipzy.xyz without a voiceover. The footage is finished and
must not be recut, recoloured or reframed — captions are the only addition.

The video follows one Twitch clip from the review deck to an exported vertical
video. Captions name what is happening at each beat, in the same plain register
as the site copy. They describe; they do not sell.

## Assets

- `assets/walkthrough-v2.mp4` — the finished 105.1s silent walkthrough, 540x1204, captured on a Pixel 9 Pro running Clipzy 1.0.1. The only video source.
- `assets/manrope.css` + `assets/fonts/` — Manrope, the site's heading font, vendored so renders are deterministic and work offline.

## Notes

- Brand: near-black ground `#08070b`, purple `#a46dff`, aqua `#4ee2cf`, Manrope.
- Do not cover the bottom tab bar during 18–21s: the Feed→Library change is the point of that beat.
- Caption wording must match what is on screen. Never claim a step the footage does not show; the export completes but the saved file is never shown.
- A voiceover script timed to an older cut exists at `docs/walkthrough-voiceover-script.md`. It does not match this cut and is not the source for these captions.

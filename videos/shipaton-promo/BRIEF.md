---
workflow: general-video
flow: automation
storyboard: no
message: "Clipzy turns a Twitch clip backlog into posted vertical video — you decide what's worth keeping, the app makes that fast."
destination: shipaton-submission
aspect: 1920x1080
language: en
length: 73s
angle: product-walkthrough
---

## Intent

A landscape product promo for the RevenueCat Shipaton 2026 submission. It has to
show the real app running on a real device inside two minutes, in English, with
no voiceover. Eight beats: seven feature beats built on a Pixel 9 Pro screen
capture playing inside a phone mockup, then a closing brand card.

Positioning is triage-first throughout: the streamer swipes through their own
Twitch clips and decides what to keep, and Clipzy finishes the ones they chose.
Nothing in the copy may suggest the app finds or generates clips on its own.

Tone: calm, designed, restrained motion. Dark ground with soft purple/aqua
glows, matching clipzy.xyz. Silent — no audio track at all.

## Assets

- assets/walkthrough-v2.mp4 — 540x1204 silent Pixel 9 Pro screen capture (105.1s) of the real app; plays inside the phone mockup on every beat.
- assets/logo.png — Clipzy mark, closing card only.
- assets/apple-app-store-badge.png, assets/google-play-badge.png — store badges on the closing card.
- assets/manrope.css + assets/fonts/*.woff2 — vendored Manrope so renders are deterministic offline.

## Customizations

- Phone mockup left, text column right; the phone holds its position while text beats cross-fade over it.
- Each beat cuts the source footage to a specific moment with `data-media-start`; consecutive video clips overlap 0.3s for a cross-dissolve.
- Closing card: logo, "Your best Twitch moments, sorted." with "sorted" in the site's purple→pink→aqua gradient, both store badges, clipzy.xyz in muted type.

## Notes

- Hard rules from the submission: under 2 minutes, English, real device footage.
- Beat lengths were extended past the raw source ranges (roughly 8-9.5s each) so the headlines are readable; each beat still starts on the prescribed moment.
- No third-party logos or branding may be authored into the graphics.
- Format convention only was borrowed from reference videos — all copy, colour and closing wording is Clipzy's own.

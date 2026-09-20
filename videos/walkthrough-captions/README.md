# Walkthrough captions

Burns beat captions onto the finished Clipzy walkthrough so the demo explains
itself on the site without a voiceover.

```bash
npm run check      # lint, runtime, layout, motion, contrast
npm run render:web # -> out/walkthrough-captioned.mp4 (540x1400, CRF 27)
npm run dev        # preview in the browser
```

The source footage in `assets/` is the finished cut and is never altered: the
canvas is taller than the phone screen so captions sit on a plate underneath
rather than covering app UI. The second half of the video is almost entirely
bottom controls, so an overlay would hide the thing each beat is about.

Caption timings in `index.html` are measured against this exact cut. Re-cutting
the footage invalidates them, and the timestamps listed beside the player on the
site have to move with them.

Manrope is vendored in `assets/fonts/` so renders are deterministic and work
offline.

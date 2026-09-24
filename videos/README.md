# videos/

Two HyperFrames projects. Each is plain HTML rendered to MP4 through headless
Chrome, so a composition is a file you can open and edit, not a binary you have
to rebuild from scratch.

| Project | What it makes |
|---|---|
| `walkthrough-captions/` | The 1:45 app walkthrough with beat captions on a plate below the phone screen |
| `shipaton-promo/` | The 73s landscape promo: phone on the left, copy on the right, end card |

## Editing either one

```bash
cd videos/shipaton-promo
npm run dev       # opens Studio in the browser: timeline, canvas, drag to edit
npm run check     # lint, runtime, layout, motion and contrast in one command
npm run render    # writes out/<name>.mp4
```

`npm run dev` is the answer to "I want to change this next week". Studio gives
you a visual timeline of every clip and caption, and edits save back to the
HTML. You can also just open `index.html` in an editor; the timing lives in
`data-start` and `data-duration` attributes and the copy is plain text.

Run `npm run check` before rendering. It catches broken timing, overflowing
text and contrast failures, which a render will happily produce without
complaint.

## How the promo is put together

`index.html` is the root: background glows, the phone mockup, and eight hosts
that mount `compositions/beat-b1.html` … `beat-b7.html` and `closing.html`. One
file per beat, so changing a headline means editing one small file.

Each beat pulls a specific time range out of `assets/walkthrough-v2.mp4` with
`data-media-start`. **Replacing the footage means re-timing those ranges** —
roughly seven numbers, plus checking each beat lands on the right moment. The
layout, copy and end card are unaffected.

## Reproducibility

- The CLI version is pinned in each `package.json`, so a render next year
  produces the same file. To move up: `npx hyperframes@latest upgrade --project .`
- Manrope is vendored in `assets/fonts/`, so renders work offline and don't
  shift if Google Fonts changes.
- Source footage is committed. Renders are not; `out/` is ignored, since it is
  reproducible from what is here.

# Clipzy walkthrough — voiceover script (v2 cut)

For the 1:45 cut. Replaces `walkthrough-voiceover-script.md`, which was written
for the older 1:23 version and describes library sorting and searching that the
current cut no longer shows.

Audio is generated locally by VoiceStudio on the **VoxCPM2** engine, cloned from
the **Frozair** voice profile (`bbf4cfff`). VoxCPM2 is Apache-2.0 and safe for
commercial use; the default OmniVoice engine is not, as its weights are CC-BY-NC.

| Start | Line | Length |
|---|---|---|
| 0:00.4 | This is Clipzy. You sign in with Twitch, and your own clips load automatically, newest first. | 7.5s |
| 0:12.4 | Watch one. Keep it, or archive it. The next one is already playing. | 5.3s |
| 0:18.3 | Everything you keep lands in your library. | 3.2s |
| 0:21.9 | At this point the clip still lives on Twitch, not on your phone. One tap pulls it down, and that unlocks editing. | 9.0s |
| 0:31.5 | Here is the editor. First, pick the output: vertical, square, or landscape. | 4.5s |
| 0:37.6 | Your clip is horizontal and the feed is vertical, so something has to give. Stacked splits it, face-cam up top, gameplay underneath. | 10.6s |
| 0:48.6 | The default crop leaves you off to the side, so zoom in and drag until you are centred. | 4.8s |
| 0:56.6 | Then check how it lands on TikTok, Shorts and Reels before you post. | 5.0s |
| 1:03.8 | Trim the moment down to just the part worth watching. | 2.7s |
| 1:09.6 | Captions come from the clip's own audio, generated right here on the phone. | 4.5s |
| 1:19.4 | You can restyle them however you like, then burn them in. | 5.1s |
| 1:35.2 | Export, and it is on your phone, ready to post. | 3.4s |

Twelve lines, 65 seconds of speech across a 105 second video. The gaps are
deliberate: the viewer is reading the screen at the same time.

## Regenerating

With VoiceStudio running, `voice` takes a profile id, and a fixed `seed` makes the
output reproducible. Nothing leaves the machine:

```bash
curl -X POST http://localhost:3900/v1/audio/speech \
  -H 'Content-Type: application/json' \
  -d '{"model":"voxcpm2","voice":"bbf4cfff","input":"Your line here","response_format":"wav","seed":7}' \
  -o line.wav
```

## Verification

Every line is transcribed back through VoiceStudio and compared to its source text,
because generated speech can garble a word while still sounding fine. Eleven of
twelve return 99-100%.

One line had to be reworded. "Restyle them however you like" came back as "We're in
our style" at 88%; giving the word a run-up as "You can restyle them..." fixed it at
100%. Reword rather than re-roll when a specific word fails.

Cloning was confirmed by pitch, not by ear: the reference clip sits at 108 Hz median,
the cloned lines at 107 Hz across a tight 103-115 range. The stock voice measured
131 Hz and ranged 113-221.

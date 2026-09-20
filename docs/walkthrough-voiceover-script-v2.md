# Clipzy walkthrough — voiceover script (v2 cut)

For the 1:45 cut. Replaces `walkthrough-voiceover-script.md`, which was written
for the older 1:23 version and describes library sorting and searching that the
current cut no longer shows.

Audio was generated locally with VoiceStudio using the VoxCPM2 engine, which is
Apache-2.0 licensed and therefore safe for commercial use. The default OmniVoice
engine is not: its weights are CC-BY-NC.

| Start | Line | Length |
|---|---|---|
| 0:00.4 | This is Clipzy. You sign in with Twitch, and your own clips load automatically, newest first. | 5.6s |
| 0:12.4 | Watch one. Keep it, or archive it. The next one is already playing. | 4.5s |
| 0:18.3 | Everything you keep lands in your library. | 2.7s |
| 0:21.6 | At this point the clip still lives on Twitch, not on your phone. One tap pulls it down, and that unlocks editing. | 5.8s |
| 0:31.0 | Here is the editor. First, pick the output: vertical, square, or landscape. | 5.4s |
| 0:38.0 | Your clip is horizontal and the feed is vertical, so something has to give. Stacked splits it, face-cam up top, gameplay underneath. | 7.2s |
| 0:45.6 | The default crop leaves you off to the side, so zoom in and drag until you are centred. | 5.6s |
| 0:56.8 | Then check how it lands on TikTok, Shorts and Reels before you post. | 4.6s |
| 1:04.0 | Trim the moment down to just the part worth watching. | 2.9s |
| 1:09.8 | Captions come from the clip's own audio, generated right here on the phone. | 4.2s |
| 1:19.6 | Restyle them however you like, then burn them in. | 3.5s |
| 1:35.4 | Export, and it is on your phone, ready to post. | 3.4s |

Twelve lines, 55 seconds of speech across a 105 second video. The gaps are
deliberate: the viewer is reading the screen at the same time.

## Regenerating

With VoiceStudio running, its local OpenAI-compatible endpoint takes the text and
returns audio. No account, no key, nothing leaves the machine:

```bash
curl -X POST http://localhost:3900/v1/audio/speech \
  -H 'Content-Type: application/json' \
  -d '{"model":"voxcpm2","voice":"onyx","input":"Your line here","response_format":"wav"}' \
  -o line.wav
```

Each line took about five seconds to generate. Every one was transcribed back and
compared to its source text to confirm it was intelligible; the lowest match was 93%.

#!/usr/bin/env bash
# Render the social preview card (public/og-v2.png) from og.html.
#
# The card is composed in HTML so it uses the site's real palette, the real
# Manrope webfont, and real app screenshots. Nothing here is generated art.
#
# To change the phone screenshots, replace assets/phone-front.png and
# assets/phone-back.png. Both are cropped to drop the tab bar and gesture bar
# so the Keep/Archive row sits comfortably inside the frame:
#   ffmpeg -i <source>.png -vf "crop=<w>:<h>:0:0" assets/phone-front.png
#
# If you change the output size, update og:image:width / og:image:height in
# index.html to match. Renaming the output busts stale social-card caches.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/public/og-v2.png"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

[ -x "$CHROME" ] || { echo "Chrome not found at: $CHROME" >&2; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg not found" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Render at 2x, then downscale to the canonical 1200x630 for crisp text.
"$CHROME" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=2 --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$TMP/2x.png" "file://$HERE/og.html" 2>/dev/null

ffmpeg -y -loglevel error -i "$TMP/2x.png" -vf "scale=1200:630:flags=lanczos" "$OUT"
echo "wrote $OUT"

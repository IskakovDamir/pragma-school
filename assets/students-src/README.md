# Student portraits — source files

The PNGs in this folder are the source of truth for the five cutouts on the
"Истории наших учеников" cards. The app loads the WebP versions in
`public/students/`; these PNGs are deliberately **outside** `public/` so they
are not copied into the build. Nothing ever requested them and they added
~838KB to every deployment.

Vite only bundles what `src/` imports and only copies `public/` verbatim, so a
folder here is never touched by the build. Verify with:

    npm run build && ls .vercel/output/static/students/   # five .webp, nothing else

## Regenerating the WebPs

From this folder:

    for f in *.png; do
      cwebp -q 86 -alpha_q 100 -m 6 -sharp_yuv -metadata none \
        "$f" -o "../../public/students/${f%.png}.webp"
    done

`-alpha_q 100` keeps the alpha channel lossless and `-sharp_yuv` is what stops
chroma bleeding on the soft cutout edges — both matter more than `-q` here.
q=86 was chosen by measuring error on the alpha-edge pixels only (mean ~2.7/255,
p99 ~10/255, invisible at 200%); it gives 858,566 -> 121,970 bytes, 85.8% off.

## Do not re-crop these

Every file has already been processed and the steps are **not** idempotent:

- All five were cropped to their alpha bounding box on import, so there is no
  transparent padding left above the head. The card's photo block relies on
  that — a trimmed canvas is what puts every head on the same line when the
  portrait breaks the block's top edge.
- `aisulu.png` additionally carries a horizontal crop of `(87, 0, 387, 401)`
  applied to the trimmed original, taking her from 493x401 (landscape, the odd
  one out) to 300x401. **That crop is already baked into the file here.**
  Re-applying it would cut into her face.

The pre-everything originals are outside this repo, in the archived prototype at
`pragma-school/public/students/` (Cyrillic filenames, untrimmed).

## Filenames are transliterated on purpose

macOS stores "Айсулу.png" decomposed (NFD: и + combining breve) while a
filename typed into a `.ts` file is composed (NFC: й), so the request missed the
file on disk and 404'd — on exactly the two names containing "й", leaving the
other three working. ASCII names cannot be normalised into a different byte
string. Keep them ASCII.

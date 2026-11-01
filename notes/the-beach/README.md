# The Beach — source texts

Raw screenplay and subtitle text for the 2000 film *The Beach* (dir. Danny Boyle,
screenplay by John Hodge, based on the novel by Alex Garland), kept as a writing
reference. Not manuscript, not site content: `srcDir` is `docs/`, so nothing here
builds or publishes.

## Files

| File | What it is |
|---|---|
| `dialogue.txt` | Subtitle stream as one line per cue, `[HH:MM:SS] text`, 1,478 cues, 00:00:33 → 01:53:14. 10,030 words. Start here. |
| `subtitles.srt` | Verbatim copy of the source `.srt` — exact timings, multi-line cues intact. |
| `screenplay.txt` | Text extracted from the `.doc`. **Partial**: 2,861 words, 22 scene headings, ends as Richard leaves Khao San for the island. Act I only. |

`dialogue.txt` is the complete film; `screenplay.txt` is not. For any scene past
the departure, the subtitles are the only source here.

## Provenance

| Source | sha256 |
|---|---|
| `~/Desktop/The.Beach.2000.1080p.BrRip.x264.YIFY.srt` | `9f50da917de9b3ba3636f02140ebfad7b09e295bc7a2795199467960e50d9a11` |
| the screenplay `.doc` in `~/Downloads/` (CJK filename meaning "The Beach — movie screenplay, English") | `cf778784aba11f7dc8eab7c6fdf53883c9712e72a0b50466bb36076329dd6a78` |

Extracted 2026-11-01. `screenplay.txt` = `textutil -convert txt` on the `.doc`,
minus its first two lines (a Chinese download-site title, not screenplay text).
`dialogue.txt` = the `.srt` with sequence numbers and timing ranges folded into a
single start timestamp; three encoder-credit cues dropped (YIFY banner, "Subtitles
by aLLvOv", "ENGLISH").

`screenplay.txt` is kept verbatim, so it still carries the two non-ASCII defects
below. The English-only rule of this repo applies to authored files like this one,
not to raw source data.

## Defects left unfixed

Both sources are low-quality and the errors are preserved rather than corrected,
so grep hits match the real film text. Don't copy these into prose without checking:

- Subtitles render capital `I` as lowercase `l` throughout — `where l'm from`,
  `l'm`, `what we l'd do`.
- `screenplay.txt` has OCR damage: `snapsho9t exerpts`, `Restaurantes`,
  `Versache`, `you an phone home`, `thrileld`, and one line where a stray CJK
  glyph is glued into `you and your…you and your boyfriend`.
- The copyright line lost its `©` and reads `?Figment Films ltd.`
- Spelling of Thai/character names varies between the two sources (`tuk-tud` in
  the screenplay vs the film's actual usage).

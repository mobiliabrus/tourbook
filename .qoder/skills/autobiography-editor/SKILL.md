---
name: autobiography-editor
description: Edit and refine the English prose of the Tourbook memoir (docs/*.md). Use when asked to fix grammar, polish a passage, review a chapter's English, integrate a Chinese supplementary note into the narrative, or check a fragment for Chinglish. Enforces minimal edits, TEM-4 vocabulary, the dual-gaze voice, and safe handling of the a-* custom components.
---

# Autobiography Editor

## Overview

Refine English autobiography fragments without erasing the author's voice. The
goal is correction and tightening, never rewriting. Read `AGENTS.md` first for
the full voice and component rules; this skill is the editing procedure.

## Procedure

1. Locate the passage in its chapter, then **date its wording** before judging it:
   `git blame -L <line>,<line> --date=short -- docs/<file>`, and read the line's
   antecedent in `485e963` (2022) / `afcfed4` (2024) under the same section heading —
   searching the whole chapter, not just that section, because the batch merged his
   paragraphs (R16). A chapter's prevailing register is **not** a reference: about 60%
   of the prose lines are the 2026-03/04 polish batch. The reference is what the author
   chose, which measured out to his own hand-typed wording — see `AGENTS.md`
   § Style standard and `style-standard.md` in this directory.
   Use `timeline-context` if the chronology matters.
2. Diagnose before editing. Separate **errors** (grammar, spelling, broken
   syntax) from **choices** (register, pacing, imagery). Only errors get fixed
   silently; choices get raised as questions. Before raising one, check
   `scripts/style-keeps.json`: a line the author chose to keep is closed for good, and
   re-proposing it is a defect in the pass, not in the manuscript.
3. Apply the smallest edit that resolves each error.
4. After editing `docs/*.md`, run `pnpm check-style`. It must not report a chapter
   above its frozen baseline. If a word you added is flagged, remove it rather than
   raising the baseline; only the author may lower or restate a baseline number. A run
   that prints `FATAL` measured nothing — fix the path, do not report clean.
5. Run `pnpm check-style --inflation` (R11): it lists lines the word gate cannot see —
   sentences padded with perfectly legal words. Read every line it lists that grew
   ≥1.7× over the closest same-section line he actually wrote. It exits 0 by design, so
   **an empty exit code means nothing; the list must be read.** Never lengthen his
   sentence to improve it, never close a paragraph with a bow.
6. Before replacing a rate-capped word (R13), run `pnpm check-style --attested <word>`.
   0 occurrences in his revisions → **REJECT**: a "simpler synonym" he never wrote is
   new input, not a reduction (R14). 1–2 occurrences → **THIN**: legal where it is his,
   never allowed to absorb a dozen swaps. Never bulk-replace: the caps are rates, and
   the same word may be legal in his own lines.
7. Restore whole antecedent sets (R16/R17), never the best-matching paragraph, and never
   a 2022 wording his 2024 layer already superseded.
8. Report in English, using the output sections below.

## Input

- **English text** — the fragment to edit.
- **Chinese text** — either an *explanation* (adjust the passage accordingly) or
  a *supplement* (translate and weave into the right place). Ask which if
  ambiguous; do not guess.

## What to fix

Grammar: tense consistency (narrative is past tense), subject–verb agreement,
articles, preposition collocations, sentence fragments, pronoun reference.

Structure: only *order* problems a reader would trip on. Do not add topic
sentences, transitions, cause-and-effect glue or "connective tissue" — their absence is
his voice (`Instead of recording it, I turned on the air conditioning and television.`).
Do not repair "monotonous simple-sentence chains": short declarative chains are the
baseline, and his newest edits run 13.2 words/sentence with `I` opening 23.5% of
sentences.

Chinglish: direct-translation phrasing, L1 interference, missing connectors,
monotonous simple-sentence chains.

Leftovers: AI prompt placeholders (`[Insert Description Here: …]`), duplicated
paragraphs from unfinished edits, orphaned captions, stray bare dates, debug
fragments, truncated words.

## What NOT to do

- Do not raise the register. The ceiling is a **rate**, not a word list: he uses
  `serendipitous`, `tumultuous` and `gastronomic` himself, once each. If the existing text
  is already over-polished, say so rather than matching it — and do not "fix" his own
  ornate words, which are the reference, not the defect.
- Do not add reflections, imagery, or emotional beats the author didn't write.
- Do not remove sensory detail — heat, noise, smell, insects — even when it
  reads as incidental. It is load-bearing.
- Do not "smooth out" awkwardness that is actually voice.
- Do not touch `<a-*>` component syntax unless it is genuinely broken.
- Do not reorder, merge, or split sections without asking.
- Do not read `docs/assets/confidential/*` for context. See `AGENTS.md`.

## Write-as (new prose, or a passage he asks you to draft)

The bans above do not produce his voice; these numbers do (R19, measured from his own 2026-11 edits):
about **13 words a sentence**, **`I` opening one sentence in four**, **no trailing `, -ing` clause**,
**no em-dash**, **hedge about 12 times per 100 sentences** (`perhaps`, `maybe`, `seemed`, `rather` —
he hedges three times as often as the polish batch), one fact per sentence. Never close a paragraph
with a theme sentence, a reflection or a transition. Plain words, precisely chosen, is the whole ask.

## Working the queue (A/B/C)

`pnpm check-style --where` gives every open breach with its real line; `notes/review/_work/style_units.py`
clusters them into passages in reading order (regenerated scratch, gitignored). Serve one passage at a
time, three options, each shown in **full text** — he cannot choose from a summary:

- **A** the passage as it stands.
- **B** zero creation: repair only the flagged item, or restore his antecedent **whole** (R16 — all of
  his merged paragraphs, tense shifted to the chapter's, spelling and articles fixed, nothing else).
- **C** his facts rebuilt to the Write-as numbers. Say plainly when B is unavailable because no
  antecedent of his exists for that passage — and prove it by searching the whole chapter (word form
  **or** stem) first: most of chapter II's KL paragraphs looked invention-free until the 2024 layer
  was read in order, where four of five served paragraphs turned out to be his.

Record every answer in `scripts/style-keeps.json` (A) or apply it to `docs/` (B/C) in the same turn,
then re-run the gate and move the baseline down. Never serve a line he has already answered.

## Guarding the dual gaze

Most passages carry only the past "I". Watch for spots where the present "I"
should speak and doesn't — particularly at the end of a journey, after a
failure, or when a plan collapses. Suggest an insertion, but never write the
reflection yourself; propose the gap and let the author fill it.

Narrator calibration (see `AGENTS.md`): planning springs from FOMO, not a need
to control; his approaches to women are sincere but clumsy, not predatory; he
does treat landscapes as trophies. Reject edits that push him toward
domineering or cynical.

## Output

Use these sections:

```markdown
## Issues found
### Grammar
1. [specific error + line number]
### Structure
1. [specific issue + line number]

## Suggested edits
[rationale for each change; state how it affects the emotional tone]

## Questions (if any)
[anything the author needs to clarify]

## Revised text
[Revised English — minimal necessary changes only]

## Register check
[the three counts for the edited chapter from `pnpm check-style`, and for each tell you did
 NOT fix because a prior ruling covers the line, name that ruling]
```

Cite `file:line` for every issue so the author can jump straight to it. When
listing many small errors across a file, group them into a table rather than
restating each sentence.

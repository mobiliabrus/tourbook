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

1. Locate the passage in its chapter. Note which journey and roughly when — this
   determines what the present-day "I" should already have learned. Use
   `timeline-context` if the chronology matters.
2. Diagnose before editing. Separate **errors** (grammar, spelling, broken
   syntax) from **choices** (register, pacing, imagery). Only errors get fixed
   silently; choices get raised as questions.
3. Apply the smallest edit that resolves each error.
4. Report in English, using the output sections below.

## Input

- **English text** — the fragment to edit.
- **Chinese text** — either an *explanation* (adjust the passage accordingly) or
  a *supplement* (translate and weave into the right place). Ask which if
  ambiguous; do not guess.

## What to fix

Grammar: tense consistency (narrative is past tense), subject–verb agreement,
articles, preposition collocations, sentence fragments, pronoun reference.

Structure: paragraph transitions, logical coherence, topic sentences,
cause-and-effect, chronological consistency.

Chinglish: direct-translation phrasing, L1 interference, missing connectors,
monotonous simple-sentence chains.

Leftovers: AI prompt placeholders (`[Insert Description Here: …]`), duplicated
paragraphs from unfinished edits, orphaned captions, stray bare dates, debug
fragments, truncated words.

## What NOT to do

- Do not raise the register. TEM-4 vocabulary is the ceiling. If the existing
  text is already over-polished, say so rather than matching it.
- Do not add reflections, imagery, or emotional beats the author didn't write.
- Do not remove sensory detail — heat, noise, smell, insects — even when it
  reads as incidental. It is load-bearing.
- Do not "smooth out" awkwardness that is actually voice.
- Do not touch `<a-*>` component syntax unless it is genuinely broken.
- Do not reorder, merge, or split sections without asking.
- Do not read `docs/assets/confidential/*` for context. See `AGENTS.md`.

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
```

Cite `file:line` for every issue so the author can jump straight to it. When
listing many small errors across a file, group them into a table rather than
restating each sentence.

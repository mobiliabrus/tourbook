---
name: timeline-context
description: Establish chronological and structural context for the Tourbook memoir. Use when asked when something happened, what came before or after an event, which chapter covers a person or place, whether two passages contradict each other on dates, or for an overview of the seven-journey structure. Derives the timeline from the dated flight, hotel, and divelog records embedded in the public chapters.
---

# Timeline Context

## Overview

Answer "when / in what order / where is this" questions about the memoir, and
catch chronological contradictions before they reach the published page.

## The timeline source

`docs/assets/confidential/timeline.md` is AES ciphertext. Do not open it or run
a decode script. The plaintext source `timeline.mdx` is present locally and may
be read under `AGENTS.md` when the task needs it.

Every date that matters is already in the public chapters, in plaintext, inside
`<a-flight>`, `<a-hotel>`, and `<a-divelog>` records. Derive the timeline from
those first. Use `timeline.mdx` as a cross-check when needed; when sources
disagree, show both and ask which is authoritative.

## Deriving chronology

`AGENTS.md` holds a verified chapter-by-chapter date table. Start there. Drill
in with these:

```bash
# All flight legs, dated and ordered
grep -hoE 'departure-time="[0-9-]+ [0-9:]+"' docs/*.md | sort

# All hotel stays with night counts
grep -hoE 'name="[^"]+" date="?[0-9-]+|date: [0-9-]+' docs/*.md

# Dive log numbering — check for gaps and duplicates
grep -hE '^no: |^date: ' docs/*.md

# Which chapter covers a person or place
grep -rn 'Danni\|Marilyn\|Ailin' docs/*.md
```

Prefer `git log --follow` on a chapter when the question is about how the text
changed rather than what happened.

## Known chronological traps

These are live inconsistencies, not hypotheticals. Re-verify before citing —
they may have been fixed.

- **episode-2.md, Western Sichuan**: outbound `3U8630` is dated 2013-07-03 but
  the return `CZ8129` is dated 2013-06-24 — nine days *before* departure.
- **3-tour.md, closing Bangkok section**: `<a-hotel name="48 ville"
  date="2014-11-2">` conflicts with the same chapter's `FD552` flight on
  2014-11-14.
- **4-tour.md divelogs**: numbering jumps 13 → 15; no dive 14.
- **6-tour.md divelogs**: no.29 and no.31 both claim 2017-1-9 at 10:18; no.30–34
  have no `location`.
- **Date formats** are not normalized: `2014-1-4`, `2014-01-04`, `2015-4-5`,
  `2017-1-8` all appear. Compare by value, never by string sort.
- **5-tour.md is a stub** (~15 lines, ends mid-anecdote). Any timeline claim
  about Tour V rests on a single hotel date, 2015-10-27.
- The stale Lingma config placed Tour V in Jan–Apr 2017. That is **Tour VI**.

## Confidential cross-references

Public chapters embed private stories via `<a-secret name="x">`. Check whether a
reference resolves against the directory listing — that is metadata, and allowed:

```bash
grep -rho 'a-secret name="[a-z0-9_-]*"' docs/*.md | sort -u
ls docs/assets/confidential/
```

If a chapter mentions a person who has a confidential file, say the file exists.
Do not read `.md` ciphertext or infer a date from the filename. A task-needed
`.mdx` source may be read under `AGENTS.md`; otherwise leave the content alone.

## Answering

Give the date, the chapter, and the neighbouring events so the author can place
it:

```markdown
**Event**: [name]
**Date**: [date]
**Chapter**: [file.md] — [journey title]
**Before**: [preceding event, date]
**After**: [following event, date]
```

When two sources disagree, show both with `file:line` and ask which is
authoritative. Do not silently pick one. When a date is absent from every
source, say it is unknown rather than estimating from context.

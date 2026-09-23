# Tourbook

An English-language travel memoir published as a VitePress site. Seven overseas
journeys (2013–2017) framed as a record of self-disillusionment, plus two
prologue episodes covering 2010–2013.

**Language policy**: everything in this repository is English — site content
(`lang: 'en-UK'`), config files, rules, skill files, and review feedback to the
author. Do not write Chinese into any committed file, and never translate the
memoir itself. Chinese only ever appears as *input*: a note the author supplies
about a passage, which the editor folds into English prose.

## Commands

```bash
pnpm dev          # VitePress dev server (docs/)
pnpm build        # production build → docs/.vitepress/dist
pnpm type-check   # tsc --noEmit
```

`pnpm start`, `pnpm encode`, `pnpm decode` are **broken**: they point at
`../scripts/lib/*`, which does not exist in this repo. Do not rely on them, and
do not "fix" them by guessing at the missing scripts.

Deployment: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages
under `base: '/tourbook/'`.

## Content architecture

```
docs/
├── index.md          INTRO
├── episode-1.md      PROLOGUE  Episode I. Beginnings
├── episode-2.md      PROLOGUE  Episode II. Fastprimes
├── 1-tour.md … 7-tour.md   MAIN CHRONICLES
├── appendix.md       Unfulfilled Journey (2019)
└── assets/confidential/    encrypted private stories
```

Sidebar order and titles live in `docs/.vitepress/config.ts` and must match each
file's frontmatter `title`. VitePress cannot infer the sidebar from dynamic
content — update `config.ts` manually when adding or renaming a page.

### Verified chronology

Derived from the public `<a-flight>` / `<a-hotel>` / `<a-divelog>` records. Use
this as the working timeline; it needs no decryption.

| Chapter | Dates | Where |
|---|---|---|
| Episode I | 2010-04, 2011-07 | South Korea; Weizhou Island |
| Episode II | 2012 – 2013-07 | Chongqing; Weizhou; Mt Emei; Gulangyu; Western Sichuan |
| I. Long, Solitary Tour | 2013-10-08 → 10-31 | Bangkok, Sukhothai, Chiang Mai, Phuket |
| II. The Backpacker | 2014-01-04 → 01-21 | KL, Kota Kinabalu, Mabul, Penang |
| III. The Three Trees | 2014-11-02 → 11-14 | Chiang Mai treehouses, Koh Tao (OW) |
| IV. Lonely Soul | 2015-03-31 → 04-23 | Koh Tao (AOW), Phangan, Krabi, Similan, HK |
| V. Interlude | 2015-10-27 → | Bangkok — **stub, ~15 lines, unfinished** |
| VI. Redemption's Echo | 2017-01-05 → 01-19 | Surat Thani, Similan, Koh Phangan |
| VII. Final Journey | 2017-04-02 → 04-19 | Kinabalu, Sipadan, Koh Samui, Phangan |
| Appendix | 2019 | A trip planned but never taken |

## Custom components

All prefixed `a-`, registered in `docs/.vitepress/components/component-registry.ts`:
`a-img` `a-modal` `a-map` `a-flight` `a-hotel` `a-times` `a-secret` `a-carousel`
`a-close` `a-placeholder` `a-lazyload` `a-lazycontent` `a-gallery` `a-divelog`.

Two invocation forms exist and both are valid:

```markdown
<a-flight flight="FD2557" departure="CKG" destination="DMK"
          departure-time="2013-10-08 11:10" arrive-time="2013-10-08 13:20"></a-flight>
```

````markdown
```<a-map>
points: 100.60039,13.91730,A1 Bus|100.55457,13.80228,Mo Chit
route: {"legs":[…]}
```
````

Rules when editing:

- Any value containing spaces, `|`, `{`, or long JSON **must** use the fenced
  YAML form. Long complex values in inline Vue attributes break compilation.
- In YAML form, a colon must be followed by a space. Quote values containing
  colons or leading/trailing spaces.
- Never change component syntax while editing prose. Touch it only to fix an
  actual error, and say so.
- `v-html` cannot render these components; dynamic Markdown goes through
  `markdown-render.ts` with the `markdown-it-macau` plugin.

## Confidential content

`docs/assets/confidential/*.md` are **AES ciphertext**, committed to git and
decrypted in the browser by `a-secret.vue` after the reader supplies a key.
The plaintext `.mdx` sources are gitignored and currently absent locally, and
the decode script is missing — so this content is **not readable** here.

- Never attempt to decrypt, decode, brute-force, or reconstruct this content.
- Never read a confidential file's body to "get context". Ciphertext is not
  context; it just burns the window.
- Referencing a confidential file by name (to check whether an `<a-secret>`
  reference resolves) is fine. Reading its contents requires the author's
  explicit go-ahead, and is currently impossible anyway.
- These are real people. Do not quote, summarize, or paraphrase private stories
  into public chapters, and never suggest making them public.

## Writing conventions

### Voice

**Dual gaze.** Two voices run simultaneously: the past "I" who was there
(arrogant, restless, over-planning) and the present "I" who is writing
(ashamed, analytical). The present voice is the point of the book. Protect it.

**Character.** The narrator is a man who plans meticulously and connects
badly. Calibrate carefully:

- His planning comes from **FOMO** — fear of missing out — not from a need to
  control people. Do not write him as domineering.
- His interactions with women are **sincere but clumsy**, not predatory. He is
  not collecting people.
- He **does** treat landscapes as medals to be collected. That one stays.

**Arc per journey.** Ambition → Action → Failure → Emptiness.

**Tone.** Slate blue (cold, introspective, deep-sea) with rust red (the physical
shame of remembering).

### Editing rules

- **Minimal changes.** The smallest edit that fixes the problem. This is
  refinement, not rewriting — a "medical report", not a novel.
- **TEM-4 vocabulary.** Do not upgrade diction. Words like `serendipitous`,
  `gastronomic`, `tumultuous` are already past the line; the existing over-
  polished chapters are a known problem, not a target to match.
- Preserve sensory detail (heat, sound, smell) even when it seems incidental.
- Preserve the author's Chinglish-adjacent rhythm where it carries voice. Fix
  grammar, not personality.
- Check tense consistency (past tense narrative), articles, prepositions,
  pronoun reference, subject–verb agreement.
- Keep it tight. Cut redundancy rather than adding connective tissue.
- Personal/reflective pieces end with `I hope.` as its own paragraph.
- Explain how a proposed change affects emotional tone, not just grammar.
- Ask before making structural changes (reordering, merging, splitting chapters).

### Known state issues

The manuscript is mid-edit and the chapters are **not in one voice**: 1-tour and
2-tour are heavily polished; 6-tour and 7-tour are near-raw drafts. 3-tour still
contains AI prompt placeholders. 5-tour is a stub. When editing, do not
"harmonize" by pulling raw chapters up to the polished register — that makes the
voice problem worse. Flag it instead.

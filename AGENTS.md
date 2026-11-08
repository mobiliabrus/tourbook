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

`pnpm encode`, `pnpm decode`, and `pnpm start` invoke password-based encoding or
watch scripts. Do not run them; the author handles encryption. Use `pnpm dev`
for the site without the watcher.

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
The plaintext `.mdx` sources are gitignored and present locally.

- The author permits reading `docs/assets/confidential/*.mdx` when the current
  task needs them. This is standing access to the plaintext sources; do not ask
  per file or per session. Read only the files the task needs, not siblings for
  context.
- Editing a `.mdx` still requires the author's request for that content change.
  Change content only; leave encoding and publication to the author.
- Never ask for, store, test, or use a password. Never encrypt, decrypt,
  brute-force, or reconstruct confidential content. Do not run `pnpm encode`,
  `pnpm decode`, `pnpm start`, or equivalent encoding/watch scripts.
- Do not read `.md` ciphertext bodies. Filenames and directory listings are
  metadata and may be used to resolve `<a-secret>` references.
- These are real people. Do not quote, summarize, or paraphrase private stories
  into public chapters, and never suggest making them public.
- Keep searches scoped to the files the task needs. If private text is exposed
  unexpectedly, say so, stop using it, and wait for the author's instruction.

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
- **TEM-4 vocabulary.** Do not upgrade diction. This is a **rate** rule, not a
  word rule: he uses ornate words too, but about once each — `serendipitous`
  (2-tour `afcfed4:492`), `tumultuous` (6-tour `:58`), `gastronomic` (2-tour `:502`)
  are all his, one occurrence apiece, so the bullet that once banned them by name
  was banning his voice. The defect is the polish layer spreading such words across
  every page. `pnpm check-style --attested <word>` answers "is this word his at all",
  and answers **THIN** for a word he uses once: legal to keep where it is his, never
  to be used as a swap target many times. The existing over-polished chapters are a
  known problem, not a target to match.
- Preserve sensory detail (heat, sound, smell) even when it seems incidental.
- Preserve the author's Chinglish-adjacent rhythm where it carries voice. Fix
  grammar, not personality.
- Check tense consistency (past tense narrative), articles, prepositions,
  pronoun reference, subject–verb agreement.
- Keep it tight. Cut redundancy rather than adding connective tissue.
- Personal/reflective pieces end with `I hope.` as its own paragraph.
- Explain how a proposed change affects emotional tone, not just grammar.
- Ask before making structural changes (reordering, merging, splitting chapters).

### Style standard

The reference is what the author **chose**, not what a chapter currently sounds like. In 14 paired
trials — his wording against the 2026-03/04 batch's, same passage, full text — the batch's wording
won **0**. His own edits of 2026-11 are the cleanest sample of all, so the profile below is anchored
there, and his 2022/2023-24 text remains the vocabulary reference (`style_voice.py`,
`style_voicespec.py`, per 100 sentences):

| | 2022 notes | 2023-24 hand | 2026-11 his own edits | the 2026 batch |
|---|---|---|---|---|
| words / sentence | 8.4 | 13.8 | **13.2** | 16.7 |
| sentences opening `I` | 15.9 | 12.0 | **23.5** | 5.0 |
| trailing `, -ing` | 1.8 | 6.3 | **0.0** | 13.3 |
| em-dash per 1k words | 0.0 | 1.6 | **0.0** | 4.0 |
| hedge (`perhaps`, `maybe`, `seemed`, `rather`) | — | — | **11.8** | 3.3 |

Four clauses, in priority order:

1. **The machine's wording never replaces his.** Vocabulary is tiered by whether it is his: **T1**
   never his and rejected by him (`melancholy`, `washed over`, `paths diverged`, `destined`,
   `commenced`, `instantly`, `transcend`, `mesmerizing`, `palpable`, `teeming`) — banned. **T2** his
   but multiplied by the batch, capped at his own 2023-24 rate x1.35 (`upon` 0.79/1k, `bustling`,
   `lively`, `captivating`, `arrival`, `amidst`, trailing `, -ing` 6.3/100 sentences, em-dash
   1.6/100) — never add more, and close a gap by **substituting**, never by deleting his prose.
   **T3** his and not inflated — legal, including `Thus`, `To my surprise`, `however`, `it turned
   out`, `I found myself`, `meandered`, `gastronomic`, `serendipitous`, `tumultuous`. Those are his
   voice, not polish; a pass that "fixes" them is destroying the reference it should be matching.
2. **Paragraph granularity is his.** The batch merged his paragraphs into single lines; five lines
   still carry that merge. A restore puts back his **whole antecedent set**, not its
   best-matching paragraph — otherwise "restoring his sentence" silently deletes another
   paragraph of his.
3. **New propositions need his yes, per item.** A sentence the batch added about how a moment felt,
   looked or mattered is a defect. A fact he never wrote down but confirms happened is content **he**
   owns: approve it by name, never fold it into a style pass.
4. **The machine does only what he says he cannot do**: grammar, tense, articles, agreement,
   spelling, and turning a three-word note into a complete sentence. Nothing else.

Closing-reflection lines (`looking back`, `in hindsight`, `reminding me that…`) are **frozen**:
counted by the gate, never edited by a style pass, and not added — the author has not decided them.

Full evidence and rules R1–R19: `.qoder/skills/autobiography-editor/style-standard.md`.
Commands: `pnpm check-style` (ratchet — counts may only fall), `--where` (every breach with its
real `file:line`, as JSON), `--inflation` (lists length-inflated lines, always exits 0 — it is a
reading list, not a gate), `--attested <word>` (is that word his at all?), `--guard <rev>` (re-test
the tier lists against the hand-typed revisions), `--update-baseline` after an approved fix,
`--ratchet-only` in CI. A `FATAL` means the tool read nothing: never treat it as clean.

**Author keeps** (`scripts/style-keeps.json`): a line the author chose to keep after seeing its
flagged item is recorded there by its opening words, is excluded from the gate's counts, and must
never be edited by a later pass. A keep is per line — it does not legalise the word elsewhere.
**Writing new prose** (R19): about 13 words a sentence, `I` opening roughly one sentence in four, no
trailing `, -ing`, no em-dash, hedging (`perhaps`, `maybe`, `seemed`) about 12 times per 100
sentences, one fact per sentence, and no closing reflection or theme sentence to round a paragraph
off. The remediation runs as A/B/C passages in reading order — A as it stands, B zero-creation
(minimal repair, or his antecedent restored whole per R16), C his facts rebuilt to that profile.

### Known state issues

The manuscript is mid-edit and the chapters are **not in one voice**: 1-tour and
2-tour are heavily polished; 6-tour and 7-tour are near-raw drafts. 3-tour still
contains AI prompt placeholders. 5-tour is a stub. When editing, do not
"harmonize" by pulling raw chapters up to the polished register, and do not
harmonize *within* a chapter either: a chapter's prevailing register is mostly the
polish layer (chapter II has no sentence of his own once block quotes are excluded),
so it cannot serve as the reference. The reference is `### Style standard` above.
`pnpm check-style` fails if polish counts rise.

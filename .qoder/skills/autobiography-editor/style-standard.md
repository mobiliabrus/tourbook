# Style standard — evidence and rules R1–R19

Loaded on demand when editing the memoir's English prose. `AGENTS.md` carries the short version;
`scripts/check-style.mjs` is the executable form of the word lists, rate caps and construction
rules, and is the source of truth for anything countable. Numbers below were measured by the
author's working scripts against git revisions, not estimated.

## What the reference corpus is, and why it changed

The first version of this standard treated "hand-typed by the author" as the definition of his
voice. That premise was tested and had to be rebuilt: the author said plainly that what he typed
is not necessarily what he wants ("my writing is poor; the AI parts I actually like"), so
provenance alone cannot be the authority.

The replacement is **choice**. Fourteen paired trials were run — the same passage, his wording
against the 2026-03/04 batch's, shown in full and in context, answered by him. **The batch's
wording won zero.** One trial was a calibration item: `docs/2-tour.md:335`, where he had already
deleted the machine's sentence by hand; his answer matched his own prior behaviour, so the
instrument was tracking his taste rather than flattering it.

Two of the fourteen initially answered for the batch. Both were overturned when the truncated
text was shown in full: at `docs/2-tour.md:486` he chose his own two paragraphs over the batch's
merged one, and at `docs/episode-1.md:29` he chose his own opening once he could see that the
batch's tail was a theme sentence.

His hand-typed layers remain the **vocabulary** reference, because what he chose turned out to be
what he typed: the 2022 import (`485e963`, terse notes, 8.4 words/sentence) and the 2023-12→2024-03
narration (`afcfed4`, 13.8 words/sentence, committed by hand across 12 commits inside a 257-commit
window, before any AI tooling entered this repo — `.lingma` appears 2026-03-14, the
`[Insert Description Here: …]` placeholders 2026-03-04).

## The profile, per 100 sentences

| | 2022 notes | 2023-24 hand | 2026-11 his own edits | 2026 batch |
|---|---|---|---|---|
| words / sentence | 8.4 | 13.8 | **13.2** | 16.7 |
| sentences opening `I` | 15.9 | 12.0 | **23.5** | 5.0 |
| trailing `, -ing` | 1.8 | 6.3 | **0.0** | 13.3 |
| em-dash per 1k words | 0.0 | 1.6 | **0.0** | 4.0 |
| hedge (`perhaps`, `maybe`, `seemed`, `rather`) | — | — | **11.8** | 3.3 |

The single most informative row is `I`-opening: it falls monotonically across the published text
(15.9 → 12.0 → 9.2) while mid-sentence `I` + verb actually rises for him (12.9 → 18.2). So the
batch did not delete the subject — it turned `I did X` into `, doing X`. That one mechanism moves
`, -ing` 6.3 → 10.1 and the em-dash 1.6 → 6.2, and no word list can see it (R11, R13).

The 2026-11 column is his newest, unrehearsed writing — the passages he edited during the trials.
It is the cleanest column in the table, which is why structure is specified from it while
vocabulary is still drawn from 2023-24.

## The three vocabulary tiers

`scripts/check-style.mjs` holds the lists. Tiers are decided by vintage (does the word exist in
his hand-typed layers) and confirmed by his choices:

- **T1 — never his, and rejected by him**: `melancholy`, `a sense of`, `washed over`, `paths
  diverged`, `as fate would have it`, `fate had other plans`, `destined`, `commenced`, `culinary
  expedition`, `subtle`, `palpable`, `profound`, `vibrant`, `sprawling`, `teeming`, `engulfed`,
  `euphoria`, `pandemonium`, `mesmerizing`, `to my astonishment`, `was about to`, `transcend`,
  `solo`, `inquired`, `instantly`, `linger`. Banned outright.
- **T2 — his, multiplied by the batch**, capped at his own 2023-24 rate ×1.35: `upon` 0.79/1k,
  `itinerary`, `traveler`, `fellow`, `amidst`, `arrival`, `lively`, `bustling`, `initially`,
  `captivating`, plus the constructions `, -ing` 6.3/100 sentences and em-dash 1.6/100. Never add
  more; close a gap by substituting a T3 word, never by deleting prose (R13).
- **T3 — his and not inflated**: `to my surprise`, `Thus,`, `However,`, `meandered`, `gastronomic`,
  `encountered`, `smugness`, `nuance`, `serendipitous`, `wouldn't you know it`, `etched`, `glimmer`,
  `thereby`, `anticipated`, `embark`, `breathtaking`, `undercurrent`. Legal — leave alone.

Two cautions that cost real work to learn. `serendipitous`, `tumultuous` and `gastronomic` each
occur exactly once in his own 2024 text, so an earlier draft of these rules that banned them "as
past the line" was banning his voice: the defect is the polish layer spreading such words across
every page, which is why this is a **rate** rule. And a construction list maintained as a second
copy drifted out of sync with the gate twice; every rule text here must match
`scripts/check-style.mjs`, which is the only definition.

## Banned constructions (measured 0 in both hand layers)

`I was + forced/left/greeted/overwhelmed/made/met…`; circumstance as subject (`logic dictated`,
`fate had other plans`, `the weather decided`). The remedy is to put the agent back in subject
position, never to delete the sentence. Legal, do not "clean up": `I found myself`, `it seems`,
`it turned out`, `by chance`, sentence-initial `However,`, `there was/were`, passive voice,
`, which`, semicolons, question marks.

## Rules

**R1** One action per sentence. Chapter ceilings are the frozen `wps` values; a long sentence is
allowed only as a list of concrete things (`6-tour.md:177`, `7-tour.md:405`).
**R2** Feeling is carried by an action, an object, or a number; never named. His text says
`Instead of recording it, I turned on the air conditioning and television.` and `Shit. I'm still
single.`, not `a strange sense of melancholy washed over me`.
**R3** Agentless and fate constructions are licensed only by checkable circumstance — bookings,
sea state, visas, weather — never by a person or by his own choice. His `had to` / `compelled`
all point at weather and sea (`6-tour.md:47-65`).
**R4** Evaluative adjectives for people and places are governed by rate, not presence.
**R5** `However,` / `Thus,` / `upon` are his (4×, 8× in 2023-24). Cap, not ban. New transitions
should be `But` / `So` / `And`, which is what 2022 uses.
**R6** Fix grammar, never structure. `who I found very agreeable`, `applied their medicine`,
`Scheduled boat transfer … at 1230hrs`, `541km, 18 hrs` are voice, not errors.
`She suggest me a cup of Salt Dog.` becomes `She suggested a Salt Dog.`
**R7** Keep his unanswered self-questions; never convert one into a statement.
**R8** Text the author has already ruled on is exempt. A style pass may not re-open a content
ruling.
**R9** When the batch *added* a feeling or claim, delete it. When it *replaced* one of his
sentences, restore his. Never "reword the machine's sentence downwards". The only edit inside a
restoration is a proper-noun spelling fix (`Kula Lumpur` → `Kuala Lumpur`), named in the diff so
he can veto it.
**R10** Never attribute an inner state to a real person. The batch did (`2-tour.md:90`, `:503`,
`:279`). Fix by deleting his gloss on the moment, not by writing her line.
**R11** Inflation is a defect equal to a banned word. `pnpm check-style --inflation` prints the
lines as a **decision list and exits 0**: a length ratio cannot be a pass/fail gate, because he
himself expanded the book 4.4× between 2022 and 2024. The list must be read. Additions require
material the author supplied — never lengthen a sentence to improve it, never close a paragraph
with a bow.
**R12** Nothing of his may be removed without his say-so. The batch also deleted: seven passages
are shorter than what he wrote, worst at `2-tour.md:519`, where his `I deliberately made sure they
stayed closer to the inside of the sidewalk` became `a peculiar, lingering glance … my heart
skipping a beat`. His action was replaced by atmosphere.
**R13** A T2 cap is met by substitution, never by deletion: cutting text lowers the denominator
and can push a compliant word over the line. Measured on the corrected manuscript, `captivate`
holds at 4 occurrences while its rate rises 0.27 → 0.29. Report a T2 figure as
*(count, rate, denominator)*, never as a rate alone.
**R14** A replacement word must be attested in his text — now defined as the **chosen** set, which
empirically equals his hand-typed layers. `--attested <word>` answers: **REJECT** when he never
wrote it (`set out`, `begin`, `interested`, `fascinate` were all rejected), **THIN** when he uses it
once or twice — legal to keep, never allowed to absorb a dozen swaps. THIN exits 0: failing on a
word he uses once would reject his own vocabulary, which is the mistake the tier split exists to
prevent.
**R15** The present voice may not be manufactured. `looking back` / `in hindsight` occur 0 times in
both hand layers and 3 times at HEAD, each one expanding a bare judgement of his into psychology he
never states: his `I said I was too tired and didn't want to go. Now I regret.` (8 words) became 60
words plus `using exhaustion as an excuse to avoid the messiness of real interaction`. Screened both
ways: `I regret` and `taught me that` **are** his, so they stay legal.
**R16** A restore must put back his **whole antecedent set**, not its best-matching paragraph. The
batch merged his paragraphs, and one markdown line can carry two or three of them; five lines in the
manuscript still do (`1-tour.md:25` watch/midnight, `2-tour.md:252` the three Guangdong girls,
`2-tour.md:275` the ring game, `2-tour.md:486` the durian with Danni, `7-tour.md:104` Laban Rata and
Ailin). Restoring only the strongest match silently deletes another paragraph of his — a restore
recommendation is a deletion claim in disguise. Before restoring, search the whole chapter across
sections (word form **or** stem, since the batch also renamed things: `sea gypsies` → `Bajau Laut`),
and keep his paragraph boundaries. Never infer "the machine invented this" from one paragraph
failing to match: three such accusations were made this session and all three were his own text.
**R17** Never restore wording he has already superseded. Where his 2022 note and his 2024 rewrite
cover the same content, the newer layer wins; a de-merge must not reintroduce phrasing he had
already revised away.

**R18 — An author keep is permanent, and it is per line.** When the author answers "leave it" (option
A), the line goes into `scripts/style-keeps.json` keyed by its opening words, because line numbers
move as prose is restored. The gate then excludes it from the counts, prints it as
`author-kept: n/N rulings applied`, and warns if an anchor matches no line — a keep that silently
stops matching is a lost decision. `vibrant` kept at `1-tour.md:162` does not make `vibrant` legal on
any other line, and a keep is never a reason to widen a tier.

**R19 — The profile is used forward, not only as a ban.** Prohibition lists alone do not produce his
voice: measured against his own 2026-11 edits, new prose should run about **13 words a sentence**,
open sentences with `I` about **once every four** (his live edits: 23.5 per 100), use **no trailing
`, -ing` clauses**, **no em-dash**, and hedge (`perhaps`, `maybe`, `seemed`, `rather`) about
**12 times per 100 sentences** — he hedges three times as often as the polish batch does, which is
the difference between "it seemed quiet" and "an oppressive silence descended". One fact per
sentence. Do not add a closing reflection, a theme sentence or a transition: absence of glue is his
voice (R15, and `AGENTS.md` § Structure).

## Frozen, not decided
Closing-reflection lines (`looking back`, `in hindsight`, `reminding me that…`, standalone
aphorisms) are **frozen**: the gate keeps counting them, so the ratchet still forbids adding new
ones, but no style pass may edit or delete them, and nothing may be added — the author answered
"not sure" and the whole class is worth three lines in a 324-line book. When those lines are
actually reached, decide them in context, not in the abstract.

## Enforcement

`pnpm check-style`. T1, the construction rules and per-chapter `wps` are a **ratchet** (counts may
only fall against the frozen BASELINE); T2 is an **absolute cap** at his own 2023-24 rate, which the
manuscript currently exceeds and therefore fails by design until remediation lands — only R13's
method may close it. `--ratchet-only` is the CI mode: it fails on regressions, not on legacy debt.
`--guard <rev>` re-tests the lists against the hand-typed revisions and must report 0 hits; a run
that prints `FATAL` measured nothing — that is a path or checkout problem, never a style verdict.
A ratchet may only move on a reviewed change to the detector or an approved fix, never to turn a
red gate green.

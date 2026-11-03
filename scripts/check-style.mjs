#!/usr/bin/env node
// Style gate for the Tourbook memoir. No dependencies.
//
//   pnpm check-style                 report; exit 1 on any breach
//   pnpm check-style --json          machine-readable
//   pnpm check-style --update-baseline   print a new BASELINE literal (ratchet down)
//   pnpm check-style --ratchet-only  fail only on regressions (CI mode)
//   pnpm check-style --ratchet-only  fail only on regressions (CI mode)
//   pnpm check-style --guard <rev>   verify the lists never fire on hand-typed text
//
// THREE TIERS, two rules. Every threshold below is measured against two
// hand-typed revisions, not chosen by taste:
//   485e963   2022-11-27  2266 prose words   (terse notes)
//   afcfed4   2024-10-11 snapshot, lines committed 2023-05..2024-03 by hand across
//             12 commits / 3 identities, before any AI tooling entered this repo
//             (.lingma appears 2026-03-14)  10126 prose words  (narrating voice)
//
//   TIER 1  absent from BOTH hand revisions -> banned; per-chapter ratchet
//   TIER 2  his, but the 2026-03/04 batch inflated it -> rate cap = his own rate
//   TIER 3  his, not inflated -> legal, leave alone (listed at the bottom so nobody
//           "fixes" them again)
//
// Register is not evidence about facts. A flagged line never means an event was
// invented; the author confirmed chapter II's scenes are real with the batch holding
// the wording. See AGENTS.md "Style standard".

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Repo root = nearest ancestor holding docs/index.md. The script must give the same
// answer from notes/review/_work/ and from scripts/: a fixed '..' made it read nothing
// and print "OK — clean" over 45 live breaches.
let ROOT = dirname(fileURLToPath(import.meta.url));
while (ROOT !== '/' && !existsSync(join(ROOT, 'docs', 'index.md'))) ROOT = dirname(ROOT);
if (!existsSync(join(ROOT, 'docs', 'index.md'))) {
  console.error('FATAL: no repo root found above ' + dirname(fileURLToPath(import.meta.url))
    + ' (looking for docs/index.md). Not measuring anything.');
  process.exit(1);
}
const FILES = ['index.md', 'episode-1.md', 'episode-2.md', '1-tour.md', '2-tour.md', '3-tour.md',
  '4-tour.md', '5-tour.md', '6-tour.md', '7-tour.md', 'appendix.md'];

// ---- TIER 1 words: 0 occurrences in 485e963 AND in afcfed4.
// Adding an entry here without re-running --guard on both revisions is a bug.
const LEXICON = [
  'a sense of', 'washed over', 'flooded me', 'a pang of', 'a wave of', 'a surge of',
  'melancholy', 'nostalgia', 'longing', 'wistful', 'yearn',
  'paths diverged', 'diverged', 'as fate would have it', 'fate had other plans',
  'fate, however', 'destined', 'beckon', 'commenced', 'commence', 'marked the beginning',
  'culinary expedition', 'enchant', 'ethereal', 'serene', 'stunning', 'magnificent',
  'spectacular', 'vibrant', 'picturesque', 'mesmeriz', 'tapestry', 'mosaic', 'palpable',
  'testament', 'indelible', 'profound', 'poignant', 'apprehension', 'linger', 'resonat',
  'permeat', 'unravel', 'unspoken', 'subtle', 'subtly', 'sprawling', 'teeming', 'engulfed',
  'erupted into life', 'buzzed with', 'frenetic', 'pandemonium', 'euphoria', 'revelry',
  'to my astonishment', 'to my delight', 'as if it were', 'was about to',
  'would never know', 'would never see', 'not without', 'in that moment', 'shimmer',
  'relish', 'cultivat', 'foster', 'transcend', 'inquired', 'instantly', 'solo',
  // ops/procedural register — found while reading the H group (content the pass deleted).
  // 0 occurrences in both hand revisions; `the following`, `subsequently`, `prior to`,
  // `encountered a` were tested too and ARE his, so they stay legal.
  'operational', 'parameters', 'as follows', 'designated', 'proceed', 'regarding',
  'additionally',
];

// ---- TIER 1 constructions: 0 per 100 sentences in both hand revisions.
// Measured case-insensitively. ("it was only/not…" clefts were here in an earlier
// draft and are NOT: `afcfed4` 7-tour.md:150 has his own `It was only when I started
// walking back…`, and --guard caught it after the Python measurement had wrongly
// reported 0.0 because its pattern was case-sensitive.)
const CONS_HARD = [
  [/\bI (?:was|were) (?:forced|compelled|left|made|met|greeted|received|drawn|carried|halted|confronted|struck|reminded|diverted|overwhelmed|arrested)\b/gi, 'I was forced/left'],
  [/\b(?:Fate|Chance|Circumstances?|Logic|Events?|The (?:weather|wind|sea|situation|crowd|current|delay|reality)|Anxiety|Curiosity)[\w\s,']{0,30}?(?:dictated|had other plans|compelled|forced|meant|decided|prevented|stopped|threw)\b/gi, 'circumstance as subject'],
  // The reflective closer ("aphorism") class, found by checking what a word-level ban
  // misses. It fired on exactly one line in the manuscript — 7-tour.md:449, which the
  // author deleted by hand on 2026-11-03. Do NOT widen this class: `perhaps` (10 uses),
  // `in the end`, `after all`, `then released`, `I learned/realized that` all occur in
  // his own 2023-24 text and are legal.
  [/\b(?:isn'?t|aren'?t|was meant|were meant)\s+to\s+be\b|\bmeant to be \w+ed\b/gi, 'meant-to-be closer'],
  [/\b(?:maybe|perhaps) (?:that'?s|this'?s)\b/gi, "maybe that's framing"],
  // P — manufactured retrospection. AGENTS.md: the present "I" who writes (ashamed,
  // analytical) is the point of the book, so this is the most severe class: the batch put
  // *markers of hindsight* in a mouth that never used them, and expanded his bare
  // "Now I regret." (afcfed4 1-tour.md:135) into a paragraph of self-diagnosis
  // (HEAD 1-tour.md:145). Screened: `looking back` / `in hindsight` are 0 in both hand
  // revisions. NOT admitted, because he writes them: `I regret` (his, 1-tour:135),
  // `taught me that` (his, 1-tour:125).
  [/\b(?:looking back|in hindsight|with the benefit of hindsight|to this day)\b/gi,
    'manufactured retrospection (P)'],
];

// ---- TIER 2 rates. cap = his own rate per 1000 words (lexicon) or per 100
// sentences (constructions), measured in afcfed4. Tolerance x1.35.
const CAPS = [
  // word, per 1000 prose words
  [/\bupon\b/gi, 0.79, 'upon (per 1k words; 2022: 0, his 2023-24: 0.79, HEAD: 1.90 = 2.4x)'],
  [/\bitinerary\b/gi, 0.30, 'itinerary (0.30 -> 0.88 = 3.0x)'],
  [/\btravelers?\b/gi, 0.20, 'traveler (0.20 -> 0.68 = 3.4x)'],
  [/\bfellow\b/gi, 0.20, 'fellow (0.20 -> 0.61 = 3.1x)'],
  [/\bamidst\b/gi, 0.10, 'amidst (0.10 -> 0.61 = 6.2x)'],
  [/\barrival\b/gi, 0.10, 'arrival (0.10 -> 0.54 = 6.2x)'],
  [/\blively\b/gi, 0.10, 'lively (0.10 -> 0.47 = 4.8x)'],
  [/\bbustling\b/gi, 0.20, 'bustling (0.20 -> 0.41 = 2.1x)'],
  [/\binitially\b/gi, 0.40, 'initially (0.40 -> 0.54 = 1.4x)'],
  [/\bembark\w*/gi, 0.49, 'embark (0.49 -> 0.68 = 1.4x)'],
  [/\bcaptivat\w*/gi, 0.20, 'captivate (0.20 -> 0.27 = 1.4x)'],
  // constructions, per 100 sentences
  [/,\s+\w+ing\b/g, 6.3, 'trailing ", -ing" clause (2022: 1.8, his 2023-24: 6.3, HEAD: 10.5 = 1.7x)'],
  [/[—–]/g, 1.6, 'em-dash (2022: 0.0, his 2023-24: 1.6, HEAD: 6.2 = 3.8x)'],
  [/\b(?:accidentally|unintentionally|inadvertently|unavoidably|reluctantly)\b/gi, 0.1, 'no-fault adverb (0.1 -> 0.2)'],
];

// ---- TIER 3, measured LEGAL: his own, at or below his own rate. Do not flag, do
// not "clean up", do not move into LEXICON or CAPS:
//   words : to my surprise · Thus · however · meandered · gastronomic · encountered
//           smugness · nuance · serendipitous · wouldn't you know it · etched ·
//           glimmer · sparsely · thereby · anticipated · undercurrent · amidst? (capped)
//   syntax: sentence-initial However, (1.8 -> 2.4, 1.3x) · Thus, (0.4 -> 0.2, he uses
//           it LESS) · there was/were (2.3 -> 1.4) · passive (5.6 -> 6.7) ·
//           ", which" (2.0 -> 1.5) · ";" (3.6 -> 4.7) · question marks (3.4 -> 2.9) ·
//           "I found myself" (0.3 -> 0.3, identical) · "it seems" (0.4 -> 0.5) ·
//           "it turned out" (0.1 -> 0.1) · "by chance" (0.1 -> 0.0) ·
//           "I deliberately/chose/decided" (1.2 -> 1.1, held)

// Frozen per-chapter counts, measured 2026-11-03 at HEAD 7a03e3b with the tier-1
// lists above. Ratchet: lower these as remediation lands; never raise them.
// Generated by --update-baseline.
// Re-frozen 2026-11-03 when the P class (manufactured retrospection) entered CONS_HARD: 1-tour
// hard 1→2, 2-tour 5→7, tell counts unchanged. A ratchet may only move on a reviewed change to
// the detector or an approved fix — never to make a red gate green.
const BASELINE = {
  'index.md': { tell: 1, hard: 0, wps: 10.1 },
  'episode-1.md': { tell: 1, hard: 0, wps: 17.1 },
  'episode-2.md': { tell: 1, hard: 0, wps: 17.2 },
  '1-tour.md': { tell: 6, hard: 2, wps: 13.7 },
  '2-tour.md': { tell: 31, hard: 7, wps: 16.6 },
  '3-tour.md': { tell: 0, hard: 0, wps: 13.6 },
  '4-tour.md': { tell: 2, hard: 0, wps: 16.1 },
  '5-tour.md': { tell: 0, hard: 0, wps: 13.8 },
  '6-tour.md': { tell: 0, hard: 0, wps: 14.3 },
  '7-tour.md': { tell: 3, hard: 1, wps: 13.2 },
  'appendix.md': { tell: 0, hard: 0, wps: 8.9 },
};

const SKIP = /^(title|name|dir|points|route|walking|flight|departure|destination|departure-time|arrive-time|date|nights|no|location|depth|time|guide|buddy|notes|weight|type|max_depth)\b/;
const WORD = /[A-Za-z][A-Za-z'’-]*/g;

function proseLines(text) {
  const out = [];
  let fence = false, fm = false;
  text.split('\n').forEach((raw, idx) => {
    const n = idx + 1;
    const s = raw.trim();
    if (n === 1 && s === '---') { fm = true; return; }
    if (fm) { if (s === '---') fm = false; return; }
    if (s.startsWith('```')) { fence = !fence; return; }
    if (fence || !s || s.startsWith('#') || s.startsWith('<a-') || s.startsWith('|') || s.startsWith('![')) return;
    if (SKIP.test(s)) return;
    if ((s.match(WORD) || []).length < 3) return;
    out.push({ n, s });
  });
  return out;
}

const sentences = (s) => s.split(/(?<=[.!?])\s+/).filter((x) => /[A-Za-z]/.test(x));

function measure(lines) {
  const tell = [], hard = [];
  let ns = 0, ws = 0;
  for (const { n, s } of lines) {
    const low = s.toLowerCase();
    const t = LEXICON.filter((k) => low.includes(k));
    if (t.length) tell.push({ n, tags: t });
    const h = CONS_HARD.map(([re, label]) => (s.match(re) || []).length ? label : null).filter(Boolean);
    if (h.length) hard.push({ n, tags: h });
    for (const x of sentences(s)) { ns++; ws += (x.match(WORD) || []).length; }
  }
  return { tell, hard, ns, words: lines.map((l) => l.s).join(' ').match(WORD)?.length || 0, wps: ns ? ws / ns : 0 };
}

// Read a file as it stood at some revision. Returns '' when the path did not exist there
// (a normal outcome: several chapters are absent at 485e963) and records the miss, so a
// caller can tell "nothing at that revision" apart from "git could not run at all".
const misses = [];
const revText = (rev, f) => {
  try {
    return execFileSync('git', ['show', `${rev}:docs/${f}`],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { misses.push(`${rev}:docs/${f}`); return ''; }
};

// --guard <rev>: the tier-1 lists must never fire on hand-typed text. Reads
// .git-guard-tmp/<file>, which you populate with `git show <rev>:docs/<f>`.
if (process.argv.includes('--guard')) {
  const rev = process.argv[process.argv.indexOf('--guard') + 1];
  if (!rev) { console.error('usage: check-style --guard <git-rev>'); process.exit(2); }
  let bad = 0, files = 0;
  const absent = [];
  const missStart = misses.length;
  for (const f of FILES) {
    // An empty read means the path did not exist at that revision — not a clean test.
    // Counting it as "present" would overstate coverage, so it is reported as untested.
    const body = revText(rev, f);
    if (body.trim() === '') {
      absent.push(f);
      continue;
    }
    files++;
    for (const { n, s } of proseLines(body)) {
      const low = s.toLowerCase();
      const t = LEXICON.filter((k) => low.includes(k));
      // .test() on a /g regex is stateful (lastIndex persists) — count matches instead.
      const h = CONS_HARD.map(([re, l]) => ((s.match(re) || []).length ? l : null)).filter(Boolean);
      if (t.length || h.length) {
        bad++;
        console.log(`HIT ${f}:${n}: ${[...t, ...h].join(', ')}\n    ${s.slice(0, 140)}`);
      }
    }
  }
  if (files === 0) {
    console.error('FATAL: read nothing from ' + rev + ' (' + (misses.length - missStart)
      + ' git show failures). Zero tested files is not a pass — check that this is a git'
      + ' checkout and that the revision exists.');
    process.exit(1);
  }
  console.log(`guard ${rev}: ${bad} hits across ${files} files present at that revision`);
  // Spelled out from what was actually read, never hardcoded: a hand-written list of which
  // chapters are absent once asserted (wrongly) that appendix.md did not exist at afcfed4.
  console.log('  untested at ' + rev + ' (no such path): ' + absent.join(' '));
  console.log('  A chapter absent at BOTH 485e963 and afcfed4 has no hand-typed layer, so');
  console.log('  "never his" is unproven there — do not treat a flag in those files as settled.');
  process.exit(bad === 0 ? 0 : 1);
}

// ---- archived revisions: section-aware prose, for --inflation ------------------
const STOP = new Set(('a an the and or but if so as of to in on at by for with without from into over under i me my '
  + 'we us our you your he him his she her it its they them their this that these those there here is are was were '
  + 'be been being am do does did doing have has had having will would shall should can could may might must not no '
  + 'nor all any each other one two three some such only own same then than when where why how what which who whom '
  + 'whose while after before because too very just now also ever never still yet about against between during per '
  + 'via up down out off again once day days time night nights morning evening').split(' '));

// Same filters as proseLines, but each line keeps the heading it sits under: inflation
// may only be judged against a line from the same section (a 2022 note-line is not the
// antecedent of a 2024 narrative sentence).
function proseSections(text) {
  const out = [];
  let fence = false, fm = false, sec = '(top)';
  text.split('\n').forEach((raw, idx) => {
    const n = idx + 1;
    const s = raw.trim();
    if (n === 1 && s === '---') { fm = true; return; }
    if (fm) { if (s === '---') fm = false; return; }
    if (s.startsWith('```')) { fence = !fence; return; }
    // fence checked before headings: a '# comment' inside a code block is not a section
    if (fence) return;
    if (s.startsWith('#')) {
      const t = s.replace(/^#+/, '').trim().toLowerCase();
      if (t && !t.includes('$frontmatter')) sec = t;
      return;
    }
    if (!s || s.startsWith('<a-') || s.startsWith('|') || s.startsWith('![') || s.startsWith('>')) return;
    if (SKIP.test(s)) return;
    if ((s.match(WORD) || []).length < 3) return;
    out.push({ n, s, sec });
  });
  return out;
}

const hkey = (t) => new Set((t.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 1).map((w) => w.slice(0, 4)));
// Sørensen–Dice on character bigrams: heading titles must match *fuzzily*, because the batch
// normalized his own spellings (KULA LUMPUR → Kuala Lumpur, GERGORE TOWN → George Town,
// SALT DOG → Salty Dog). Token-prefix matching alone called all of chapter II unjudgeable.
const dice = (a, b) => {
  const g = (s) => { const out = []; for (let i = 0; i + 1 < s.length; i++) out.push(s.slice(i, i + 2)); return out; };
  const A = g(a.replace(/[^a-z0-9]/g, '')), B = new Set(g(b.replace(/[^a-z0-9]/g, '')));
  if (!A.length || !B.size) return 0;
  let hit = 0;
  for (const x of A) if (B.has(x)) hit++;
  return (2 * hit) / (A.length + B.size);
};
function hmatch(a, b) {
  const ka = hkey(a), kb = hkey(b);
  if (!ka.size || !kb.size) return false;
  if ([...ka].every((x) => kb.has(x)) && [...kb].every((x) => ka.has(x))) return true;
  let inter = 0;
  for (const x of ka) if (kb.has(x)) inter++;
  return inter / Math.min(ka.size, kb.size) >= 0.6 || dice(a, b) >= 0.75;
}
const toks = (s) => new Set((s.match(WORD) || []).map((w) => w.toLowerCase())
  .filter((w) => w.length > 3 && !STOP.has(w)));
const wc = (s) => (s.match(WORD) || []).length;

if (process.argv.includes('--inflation')) {
  // R11: the batch's other defect is length, and it hides from a word ban because the
  // padding words are all legal. REPORT ONLY — a length ratio is never pass/fail (he
  // himself expanded the book 4.4x between 2022 and 2024), so this exits 0 by design.
  const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt; };
  const REV24 = arg('--rev24', 'afcfed4'), REV22 = arg('--rev22', '485e963');
  const RATIO = Number(arg('--ratio', '1.7')), MINADD = Number(arg('--add', '18'));
  const rows = [];
  let comparable = 0, blind = 0;
  for (const f of FILES) {
    const p = join(ROOT, 'docs', f);
    if (!existsSync(p)) continue;
    const head = proseSections(readFileSync(p, 'utf8'));
    const a24 = proseSections(revText(REV24, f)), a22 = proseSections(revText(REV22, f));
    for (const { n, s, sec } of head) {
      if (LEXICON.some((k) => s.toLowerCase().includes(k))) continue;   // already tier-1 scope
      const tn = toks(s);
      let best = null, bs = 0;
      for (const [tag, poolAll] of [['24', a24], ['22', a22]]) {
        const pool = poolAll.filter((l) => hmatch(l.sec, sec));
        if (!pool.length) continue;
        for (const l of pool) {
          const tt = toks(l.s);
          if (!tt.size) continue;
          let inter = 0;
          for (const w of tn) if (tt.has(w)) inter++;
          const ov = inter / Math.max(1, tn.size + tt.size - inter);
          if (ov > bs) { bs = ov; best = { tag, ...l }; }
        }
      }
      if (!best) { blind++; continue; }
      if (bs < 0.15) { blind++; continue; }
      comparable++;
      const was = wc(best.s), now = wc(s);
      if (now / Math.max(1, was) >= RATIO && now - was >= MINADD) {
        rows.push({ key: `${f}:${n}`, sec, ant: `${best.tag}:${best.n}:${bs.toFixed(2)}`,
          ratio: (now / Math.max(1, was)).toFixed(2), add: now - was, was: best.s, now: s });
      }
    }
  }
  rows.sort((x, y) => Number(y.ratio) - Number(x.ratio));
  // An empty antecedent archive makes the whole comparison vacuous — "0 lines" would then
  // look like "no inflation", the same false-green shape the ratchet had. Fail instead.
  if (!comparable) {
    console.error('FATAL: could not read a single antecedent line from ' + REV24 + ' or ' + REV22
      + ' (' + misses.length + ' git show failures). Inflation cannot be judged without them;'
      + ' this is a checkout/git problem, not a clean report.');
    process.exit(1);
  }
  console.log(`inflation (R11): ${rows.length} lines add >=${RATIO}x and >=${MINADD} words to the closest`);
  console.log(`same-section antecedent, while containing ZERO tier-1 word.`);
  console.log(`coverage: ${comparable} lines comparable, ${blind} have no usable antecedent (cannot be judged).`);
  console.log(`git show misses: ${misses.length} (expected: index/episodes/appendix do not exist at 485e963).`);
  console.log(`thresholds are editorial: --ratio/--add change what is listed, never the exit code.\n`);
  for (const r of rows) console.log(`${r.key.padEnd(16)} ${r.ratio}x +${String(r.add).padStart(3)}w  <- ${r.ant}\n    was: ${r.was.slice(0, 150)}\n    now: ${r.now.slice(0, 170)}`);
  console.log('\nNOT a gate: exit 0 even when the list is non-empty. Each line is a decision for the author (R12).');
  process.exit(0);
}

if (process.argv.includes('--attested')) {
  // R14: a replacement word must be one he actually wrote. Ask the archives, not the
  // editor's taste. Usage: check-style --attested upon on after "as soon as"
  const i = process.argv.indexOf('--attested');
  const words = process.argv.slice(i + 1).filter((w) => !w.startsWith('--'));
  if (!words.length) { console.error('usage: check-style --attested <word> [word…]'); process.exit(2); }
  const HAND = [['24', 'afcfed4'], ['22', '485e963']];
  const corpus = {};
  for (const [tag, rev] of HAND) {
    corpus[tag] = FILES.map((f) => revText(rev, f)).join('\n').toLowerCase();
  }
  if (!corpus['24'].trim() && !corpus['22'].trim()) {
    console.error('FATAL: neither hand-typed revision could be read — attestation is'
      + ' unknowable, which is not the same as "not attested".');
    process.exit(1);
  }
  console.log('attestation (R14): counts in his own hand-typed prose');
  let anyReject = false;
  for (const w of words) {
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[- ]');
    const c24 = (corpus['24'].match(new RegExp('\\b' + esc + '\\b', 'gi')) || []).length;
    const c22 = (corpus['22'].match(new RegExp('\\b' + esc + '\\b', 'gi')) || []).length;
    // banned = a tier-1 phrase occurring *inside* the candidate, never mere substring overlap
    // ('longing' contains 'on', which is not evidence that 'on' is banned)
    const banned = LEXICON.filter((k) => new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(w));
    const cap = CAPS.find(([rx2]) => rx2.test(w));
    let verdict;
    if (banned.length) verdict = 'REJECT — tier-1 banned word';
    else if (c24 + c22 === 0) verdict = 'REJECT — 0 occurrences in his revisions (not his word)';
    else if (c24 + c22 <= 2) verdict = 'THIN — he uses it ' + (c24 + c22) + '×; do not make it absorb many swaps';
    else verdict = 'ok';
    if (verdict.startsWith('REJECT')) anyReject = true;   // THIN is legal: he uses it, just rarely.
    // A word he uses once is not a violation — failing on THIN would make the tool reject his own
    // vocabulary, which is the exact mistake the tier split exists to prevent.
    console.log('  ' + w.padEnd(16) + ' 2024 ' + String(c24).padStart(4) + '  2022 '
      + String(c22).padStart(3) + (cap ? '  [rate-capped item: ' + cap[2].split(' (')[0] + ']' : '')
        + '  ' + verdict);
  }
  if (anyReject) {
    console.log('\nThis is R14: a word he never wrote is not a "simpler synonym", it is new input.');
  }
  process.exit(anyReject ? 1 : 0);
}

const all = [];
const missing = [];
for (const f of FILES) {
  const p = join(ROOT, 'docs', f);
  if (existsSync(p)) all.push({ f, m: measure(proseLines(readFileSync(p, 'utf8'))) });
  else missing.push(f);
}
// Reading nothing is never a pass: an empty extract must fail, not print "OK".
if (missing.length || all.reduce((n, a) => n + a.m.words, 0) === 0) {
  console.error('FATAL: measured ' + all.length + '/' + FILES.length + ' chapters'
    + (missing.length ? ' (missing: ' + missing.join(' ') + ')' : '')
    + ' — a gate that reads no prose cannot report clean.');
  process.exit(1);
}

if (process.argv.includes('--update-baseline')) {
  console.log('const BASELINE = {');
  for (const { f, m } of all) {
    console.log(`  '${f}': { tell: ${m.tell.length}, hard: ${m.hard.length}, wps: ${Number(m.wps.toFixed(1))} },`);
  }
  console.log('};');
  process.exit(0);
}

function proseText(f) {
  const p = join(ROOT, 'docs', f);
  return existsSync(p) ? proseLines(readFileSync(p, 'utf8')).map((l) => l.s).join(' ') : '';
}

const bookText = all.map((a) => proseText(a.f)).join(' ');
const bookWords = all.reduce((n, a) => n + a.m.words, 0) || 1;
const bookSentences = all.reduce((n, a) => n + a.m.ns, 0) || 1;

// Word caps are per 1000 prose words; the three construction caps are per 100
// sentences, because that is how their rates were measured in his own text.
const caps = CAPS.map(([re, cap, note]) => {
  const count = (bookText.match(re) || []).length;
  const perSentence = /clause|em-dash|adverb/.test(note);
  const rate = perSentence ? 100 * count / bookSentences : 1000 * count / bookWords;
  return {
    note, cap, count, rate: Number(rate.toFixed(2)),
    unit: perSentence ? '/100s' : '/1k',
    over: count > 0 && rate > cap * 1.35,
  };
});

let fail = 0;
const rows = [];
for (const { f, m } of all) {
  const b = BASELINE[f] || { tell: 0, hard: 0, wps: 20 };
  const cur = { file: f, tell: m.tell.length, hard: m.hard.length, wps: Number(m.wps.toFixed(1)) };
  const over = [];
  const advisory = [];
  if (cur.tell > b.tell) over.push(`tier1-words ${b.tell}→${cur.tell}`);
  if (cur.hard > b.hard) over.push(`tier1-syntax ${b.hard}→${cur.hard}`);
  // wps is ADVISORY and must never fail the gate: restoring the author's own sentence
  // can raise it (observed: episode-2.md 17.2 -> 18.3, because his 2024 line is longer
  // than the batch's replacement). A ratchet here would block the edits R9 requires.
  if (cur.wps > b.wps + 0.5) advisory.push(`wps ${b.wps}→${cur.wps}`);
  if (over.length) fail++;
  rows.push({ ...cur, baseline: b, over, advisory });
}
if (caps.some((c) => c.over) && !process.argv.includes('--ratchet-only')) fail++;

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ fail, bookWords, bookSentences, caps, chapters: rows }, null, 2));
} else {
  console.log('chapter          tier1-words  tier1-syntax   wps   vs baseline');
  for (const r of rows) {
    console.log(r.file.padEnd(15) + String(r.tell).padStart(11) + String(r.hard).padStart(14) +
      ' ' + String(r.wps).padStart(5) + '   ' + (r.over.length ? '⚠ ' + r.over.join(', ') : 'ok'));
  }
  console.log(`\ntier-1 totals: ${rows.reduce((a, r) => a + r.tell, 0)} diction lines, ${rows.reduce((a, r) => a + r.hard, 0)} agency/cleft lines (book: ${bookWords} prose words, ${bookSentences} sentences)`);
  console.log('\ntier-2 rates (cap = his own 2023-24 rate):');
  for (const c of caps) console.log(`  ${c.over ? '⚠' : ' '} ${c.note} — ${c.count} uses, ${c.rate}${c.unit} vs cap ${c.cap}`);
  if (fail) {
    const ratchet = process.argv.includes('--ratchet-only');
    console.log(`\nFAIL — ${fail} breach(es).`);
    console.log(ratchet
      ? '  Something got WORSE than the frozen baseline: tier-1 diction or agentless syntax'
        + ' appeared or increased. This is the mode meant for CI.'
      : '  If the only breach is tier-2 rates, the manuscript is merely still sick —'
        + ' run with --ratchet-only to fail on regressions instead.');
    console.log('  Line-level list: notes/review/2026-11-style-worklist.md §9/§10; remediation §1-§4.');
    process.exit(1);
  }
  console.log('\nOK — clean.');
}

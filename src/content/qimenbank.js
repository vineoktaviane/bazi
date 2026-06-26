/* Plain-English interpretation bank for the Qi Men hour plate.
 * Everyday language only: what to do, where, and what to avoid — no jargon in the main read.
 * Wave-append pattern: push strings into arrays, never fork logic; pick(arr, seed) stays deterministic. */
import { pick } from "./banks";
import { STARS, DOORS, DEITIES, PALACES, STEM_PAIRS, plateOverlays, askerMatterRel } from "../engines/qimen";

/* Plain-English meaning of each named 十干剋應 pattern. These are the vivid, memorable
 * signs — the layer a general reader remembers. Keyed by the engine's "heaven,earth" key. */
export const PATTERN_PLAIN = {
  "4,2": "one of the luckiest signs in the whole system: bold, direct action this way is richly rewarded",
  "2,4": "a windfall sign: things fall into place almost on their own, say yes to the easy version",
  "3,3": "a happy-news sign: letters, replies and small wishes arrive as hoped",
  "3,8": "a sign of real favour and fair outcomes, excellent for officials, approvals and legal matters",
  "1,2": "a smooth, advancing sign, strongest when the door here is a kind one",
  "4,1": "a sign that simply mirrors the door here: a good door makes it good, a harsh door makes it harsh",
  "1,7": "a sign of loss and things slipping away, guard what's yours and don't lend in this direction",
  "7,1": "a sign of accidents and upheaval, avoid confrontation, risky travel and heavy machinery this way",
  "2,6": "a clash of forces bringing loss, keep valuables and money close in this direction",
  "6,2": "a clash of forces that draws trouble in, watch for theft and rivals this way",
  "3,9": "a sign that letters, deals and words go wrong, don't sign or send anything important this way",
  "9,3": "a sign of tangled paperwork and disputes, expect complications with documents",
  "6,6": "a deadlocked, quarrelsome sign, stalemates and clashes favour this direction",
  "9,9": "a closing-net sign: everything feels stuck on all sides, start nothing here",
  "8,8": "an entangling sign: small vexations pile up, keep plans simple this way",
  "5,5": "one of the heaviest signs, postpone anything that matters in this direction",
  "1,1": "a stay-put sign: not the hour to petition, promote or push, hold your position",
  "2,2": "a sign of harassment and waste, protect your documents and belongings this way",
};
export const PATTERN_FRAGILE = "though this luck is fragile here, an afflicted spot (pressed, punished or entombed) can flip it — treat it as ordinary rather than golden";

/* What each door means for ordinary activities, in plain words. */
export const DOOR_PLAIN = {
  open: {
    label: "Meetings, applications & asking upward",
    does: [
      "the direction for interviews, applications, pitches to the boss and official errands, doors open more easily this way",
      "walk this way for anything formal: meetings, paperwork with officials, asking someone senior for a yes",
    ],
    avoid: [],
  },
  rest: {
    label: "Rest, romance & smoothing things over",
    does: [
      "the direction for dates, apologies, gentle favours and genuine rest, soft approaches land well here",
      "head this way to reconcile, to court, to ask kindly, or simply to recover",
    ],
    avoid: [],
  },
  life: {
    label: "Money, deals & health",
    does: [
      "the direction for money errands, purchases, negotiations and health appointments, things started this way tend to grow",
      "use this quarter for shopping, deals, treatments and any fresh start you want to flourish",
    ],
    avoid: [],
  },
  scenery: {
    label: "Being seen: pitches, posts & exams",
    does: [
      "good for presentations, publishing, celebrations and exams, bright but light, so show things here rather than settle things here",
      "a stage direction: perform, present and be noticed, and save the binding decisions for elsewhere",
    ],
    avoid: [],
  },
  harm: {
    label: "",
    does: [
      "only good for workouts, competition and chasing what you're owed",
      "a fighting quarter: fine for sport and collections, bruising for everything gentle",
    ],
    avoid: [
      "first meetings, negotiations and anything needing goodwill, this direction picks fights",
      "smooth conversations, this way runs rough today",
    ],
  },
  block: {
    label: "",
    does: [
      "good for focused solo work and staying out of sight",
      "a sealed quarter: fine for deep work and privacy",
    ],
    avoid: [
      "asking for anything or trying to be noticed, requests stall this way",
      "launches and appeals, the door is shut in this direction",
    ],
  },
  death: {
    label: "",
    does: [
      "only right for endings: closing accounts, final paperwork, goodbyes",
      "a direction for finishing things for good, and for nothing you want to live and grow",
    ],
    avoid: [
      "starting anything, this direction buries beginnings",
      "new ventures, purchases or proposals, save them for another quarter",
    ],
  },
  fright: {
    label: "",
    does: [
      "only useful for formal disputes and hard bargaining",
      "a jumpy quarter that suits complaints and courtroom nerves, and little else",
    ],
    avoid: [
      "calm talks and reassurance, this direction makes everyone anxious",
      "delicate conversations, words rattle and misfire this way",
    ],
  },
};

/* One-clause mood of each star, plain words. */
export const STAR_MOOD = {
  peng: ["a bold, risk-hungry mood, fine for daring moves, wrong for anything respectable", "an appetite for risk hangs here, keep the stakes deliberate"],
  rui: ["a slow, studious mood, better for learning than launching", "a heavy, patient air, study and befriend, don't start or sign"],
  chong: ["a fast, direct mood, act quickly and simply", "an urgent air, good for decisive moves, bad for finesse"],
  fu: ["a kind, cultured mood, the friendliest influence on the plate", "a gentle, learned air, excellent for people and growth"],
  qin: ["a fair, steady mood, good for matters needing balance", "an even-handed air, disputes settle more fairly here"],
  xin: ["a clear-headed, take-charge mood, decisions and remedies land well", "a strategist's air, plan, decide and heal here"],
  zhu: ["a defensive, dig-in mood, hold ground rather than advance", "a guarded air, protect what you have, don't expand"],
  ren: ["a patient, dependable mood, right for slow and steady matters", "a load-bearing air, good for work that must last"],
  ying: ["a showy, impatient mood, shine briefly but don't commit", "a flashy air, visibility yes, staying power no"],
};

/* One-clause note for each deity, plain words. */
export const DEITY_MOOD = {
  zhifu: ["with the strongest backing on the plate behind you", "with real authority quietly on your side"],
  tengshe: ["but double-check everything, this quarter twists details", "though promises here wriggle, get it in writing"],
  taiyin: ["with quiet help working behind the scenes", "and discreet allies favour this direction"],
  liuhe: ["with goodwill and easy cooperation in the air", "and agreements come together naturally here"],
  baihu: ["but tempers and accidents run hot this way, go gently", "though force is close to the surface here, avoid provocation"],
  xuanwu: ["but watch your wallet and your words, leaks and small thefts favour this quarter", "though something here may not be what it claims, verify"],
  jiudi: ["and slow, steady moves are protected here", "with deep roots favouring patience over speed"],
  jiutian: ["and bold, visible moves get extra lift here", "with a tailwind for ambition and publicity"],
};

/* Tier synthesis: door carries the verdict, star and deity tilt it. */
const cap = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const listJoin = (arr) => (arr.length <= 1 ? arr.join("") : arr.length === 2 ? arr.join(" and ") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`);
export const TIERS = ["avoid", "poor", "mixed", "good", "excellent"];
export const TIER_PLAIN = {
  excellent: ["one of the best quarters of this hour", "as strong as this hour gets"],
  good: ["a solid quarter for it", "well supported this hour"],
  mixed: ["usable, with the caveats below", "workable if you mind the details"],
  poor: ["weak this hour, better postponed", "more friction than help this hour"],
  avoid: ["leave this direction alone this hour", "genuinely against you this hour"],
};

/* Plain notes for the overlay conditions (void, horse, door-palace relation, fu/fan-yin). */
export const OVERLAY_PLAIN = {
  void: [
    "this quarter is hollow this hour: plans made here feel promising but don't stick, revisit them next double-hour",
    "an empty-room quarter: whatever is agreed this way tends to evaporate, confirm it again later",
  ],
  horse: [
    "things move fast here, the right quarter for travel, errands and anything you want set in motion",
    "the hour's movement sits here, journeys and quick changes go smoothly this way",
  ],
  horseVoid: [
    "the hour's movement sits here but runs hollow, trips and changes planned now stall or get rebooked",
    "movement wants to happen here yet the ground is empty, expect delays if you set out this hour",
  ],
  pressed: [
    "the door is pressed here, so its promise only half-delivers",
    "this door fights its ground here, so expect more effort for less result",
  ],
  pressedBad: [
    "the door is pressed here, which sharpens the trouble",
    "pressed ground makes this door meaner than usual",
  ],
  restrained: [
    "the door is held down here, so results come smaller and slower",
    "this ground dampens the door, so lower your expectations a notch",
  ],
  supported: [
    "the ground feeds this door, so it runs at full strength",
    "this door stands on friendly ground, so count on it",
  ],
  fuyin: [
    "A holding-pattern hour: the plate sits still, so favour waiting, repeating and consolidating over launching anything new.",
    "The hour holds its breath: better for finishing and maintaining than for starting.",
  ],
  fanyin: [
    "A reversal-prone hour: matters flip and answers change, avoid finalising anything and expect back-and-forth.",
    "The plate stands opposed to itself this hour: decisions wobble, so keep things provisional.",
  ],
  jixing: [
    "the energy here injures itself (擊刑), quarrels and self-inflicted setbacks favour this spot, don't force it",
    "a self-wounding quarter this hour (擊刑), pushing here tends to cut the pusher",
  ],
  rumu: [
    "part of this quarter is boxed in (入墓), matters here feel shelved, expect dimness and delay",
    "something here sits in its tomb this hour (入墓), initiative goes quiet in this direction",
  ],
};

export function palaceScore(o, pal, ov) {
  const door = DOORS[o.doors[pal]], star = STARS[o.heavenStar[pal]], deity = DEITIES[o.deities[pal]];
  const good = door.good;
  let s = good ? 2 : o.doors[pal] === "block" || o.doors[pal] === "scenery" ? 0 : -2;
  s += star.good ? 1 : -1;
  s += deity.good ? 1 : -1;
  if (ov) {
    /* door-palace relation, polarity-aware (門迫/門制/宮生門): a favouring relation
     * strengthens whatever the door already is, so it helps good doors and worsens bad ones. */
    const rel = ov.doorRel[pal];
    if (rel === "pressed") s += good ? -2 : -1;      // 門迫: good loses power, bad turns meaner
    else if (rel === "restrained") s += good ? -1 : 1; // 門制: good weakened, bad suppressed
    else if (rel === "supported") s += good ? 1 : -1;  // 宮生門: amplifies the door either way
    if (ov.jixing.some((j) => j.pal === pal)) s -= 2;
    if (ov.rumu.some((r) => r.pal === pal)) s -= 1;
    for (const p of ov.patterns) if (p.pal === pal) s += p.good ? 2 : -2;
  }
  return s;
}
export function palaceTier(o, pal, ov) {
  const s = palaceScore(o, pal, ov);
  let t = s >= 3 ? "excellent" : s >= 1 ? "good" : s >= -1 ? "mixed" : s >= -3 ? "poor" : "avoid";
  /* a void palace can't be better than mixed: its results don't materialise this hour */
  if (ov && ov.voidPals.includes(pal) && (t === "excellent" || t === "good")) t = "mixed";
  return t;
}

function palaceNotes(o, pal, ov, seed) {
  const notes = [];
  const rel = ov.doorRel[pal];
  if (rel === "pressed") notes.push(pick(DOORS[o.doors[pal]].good ? OVERLAY_PLAIN.pressed : OVERLAY_PLAIN.pressedBad, seed + pal));
  else if (rel === "restrained") notes.push(pick(OVERLAY_PLAIN.restrained, seed + pal));
  else if (rel === "supported") notes.push(pick(OVERLAY_PLAIN.supported, seed + pal));
  if (ov.voidPals.includes(pal)) notes.push(pick(OVERLAY_PLAIN.void, seed + pal));
  if (ov.horsePal === pal) notes.push(pick(ov.voidPals.includes(pal) ? OVERLAY_PLAIN.horseVoid : OVERLAY_PLAIN.horse, seed + pal));
  if (ov.jixing.some((j) => j.pal === pal)) notes.push(pick(OVERLAY_PLAIN.jixing, seed + pal));
  if (ov.rumu.some((r) => r.pal === pal)) notes.push(pick(OVERLAY_PLAIN.rumu, seed + pal));
  const afflicted = rel === "pressed" || ov.jixing.some((j) => j.pal === pal) || ov.rumu.some((r) => r.pal === pal);
  for (const p of ov.patterns) if (p.pal === pal && PATTERN_PLAIN[p.key]) {
    notes.push(`${p.name} (${p.cn}), ${PATTERN_PLAIN[p.key]}${p.fragile && afflicted ? ` — ${PATTERN_FRAGILE}` : ""}`);
  }
  return notes;
}

/* The hour in plain terms: one row per helpful door, plus a keep-away row. */
export function hourSummary(o) {
  const seed = o.ju + o.hour.branch;
  const ov = plateOverlays(o);
  const rows = [];
  for (const key of ["life", "open", "rest", "scenery"]) {
    const pal = o.doors.indexOf(key);
    if (pal < 1) continue;
    const tier = palaceTier(o, pal, ov);
    const notes = palaceNotes(o, pal, ov, seed);
    rows.push({
      key, pal, tier,
      dir: PALACES[pal].dir,
      label: DOOR_PLAIN[key].label,
      text: `${cap(pick(DOOR_PLAIN[key].does, seed + pal))}. Here you'll find ${pick(STAR_MOOD[o.heavenStar[pal]], seed)}, ${pick(DEITY_MOOD[o.deities[pal]], seed + 1)}. Overall, ${pick(TIER_PLAIN[tier], seed + pal + 2)}${notes.length ? `. ${cap(notes.join("; "))}` : ""}.`,
    });
  }
  rows.sort((a, b) => TIERS.indexOf(b.tier) - TIERS.indexOf(a.tier));
  const avoid = [];
  for (const key of ["death", "fright", "harm"]) {
    const pal = o.doors.indexOf(key);
    if (pal < 1) continue;
    const extra = ov.doorRel[pal] === "pressed" ? `, ${pick(OVERLAY_PLAIN.pressedBad, seed + pal)}` : "";
    avoid.push({ key, pal, dir: PALACES[pal].dir, text: `${PALACES[pal].dir}: avoid ${pick(DOOR_PLAIN[key].avoid, seed + pal)}${extra}` });
  }
  const best = rows.find((r) => r.tier === "excellent" || r.tier === "good") || rows[0];
  let lead = best
    ? `Best this hour: the ${best.dir}. ${best.label.replace(/^Being seen: /, "")} go well that way.${avoid.length ? ` Keep anything important away from the ${listJoin(avoid.map((a) => a.dir))}.` : ""}`
    : `A guarded hour: no direction stands out, keep matters routine and stay flexible until the next double-hour.`;
  if (ov.fuyin) lead += ` ${pick(OVERLAY_PLAIN.fuyin, seed)}`;
  if (ov.fanyin) lead += ` ${pick(OVERLAY_PLAIN.fanyin, seed)}`;
  /* named 十干剋應 patterns, de-duplicated by name, most memorable of all the layers */
  const seenP = new Set();
  const patterns = [];
  for (const p of ov.patterns) {
    if (seenP.has(p.key) || !PATTERN_PLAIN[p.key]) continue;
    seenP.add(p.key);
    const afflicted = ov.doorRel[p.pal] === "pressed" || ov.jixing.some((j) => j.pal === p.pal) || ov.rumu.some((r) => r.pal === p.pal);
    patterns.push({ ...p, dir: PALACES[p.pal].dir, text: `${PATTERN_PLAIN[p.key]}${p.fragile && afflicted ? ` — ${PATTERN_FRAGILE}` : ""}` });
  }
  patterns.sort((a, b) => (b.good === a.good ? 0 : b.good ? 1 : -1));
  return { lead, rows, avoid, patterns, ov };
}

/* You and the matter: the asker's palace vs the matter's palace, in plain words. */
export const ASKER_MATTER_PLAIN = {
  together: ["You and the matter share one quarter this hour: it is already in your hands, act directly.", "You stand in the same place as the question, no distance to cross, just do it."],
  supports: ["The matter's quarter feeds yours: it comes toward you, receive it rather than chase it.", "The hour tilts the matter your way, stay available and say yes to the easy version."],
  peer: ["You and the matter stand as equals this hour: cooperation, not force, moves it.", "Level ground between you and the question, progress comes through meeting halfway."],
  command: ["Your quarter governs the matter's: it yields if you press, so set the terms yourself.", "You hold the stronger ground this hour, the matter follows if you lead."],
  drains: ["The matter's quarter draws on yours: it will cost energy or money before returning anything, budget for that.", "This hour, the question feeds on you, engage deliberately and set a limit first."],
  presses: ["The matter's quarter bears down on yours this hour: postpone the push and strengthen your position first.", "The question has the upper hand right now, wait for a friendlier hour rather than force this one."],
};
export function askerMatterRead(o, seed) {
  const ov = plateOverlays(o);
  const rel = askerMatterRel(ov.dayPal, ov.hourPal);
  if (!rel) return null;
  return { rel, dayPal: ov.dayPal, hourPal: ov.hourPal, text: pick(ASKER_MATTER_PLAIN[rel], seed) };
}

/* ---------------- per-topic use-gods 用神, multi-source-verified assignments only ----------------
 * Verified 2026-07: 開門=career, 值符=boss; 生門+戊=money; 六合+乙(her)+庚(him)=love; 時干=children,
 * 生門=home/property; 天芮=the ailment (inverted), 天心/乙=treatment, judged by its door; 日干+馬星=travel;
 * 天輔+丁+景門=study; 驚門=the dispute, 開門=the judge, 六合=witnesses. NOT shipped (failed verification):
 * 值符-as-judge, 官/庚/己 as use-gods, 生門-as-recovery, 乙/天芮 as the child. */
export const TOPIC_USE = {
  career: [
    { kind: "door", key: "open", role: "Your work and career" },
    { kind: "deity", key: "zhifu", role: "Your boss and backing" },
  ],
  money: [
    { kind: "door", key: "life", role: "Profit and income" },
    { kind: "stem", stem: 4, role: "Your capital" },
  ],
  love: [
    { kind: "deity", key: "liuhe", role: "The relationship itself" },
    { kind: "stem", stem: 1, role: "The woman in the question" },
    { kind: "stem", stem: 6, role: "The man in the question" },
  ],
  family: [
    { kind: "door", key: "life", role: "Home and property" },
    { kind: "hourstem", role: "Children and juniors" },
  ],
  health: [
    { kind: "star", key: "rui", role: "The ailment", invert: true },
    { kind: "star", key: "xin", role: "Treatment and doctors", healDoor: true },
  ],
  travel: [
    { kind: "horse", role: "The journey" },
    { kind: "day", role: "You, the traveler" },
  ],
  study: [
    { kind: "star", key: "fu", role: "The examiners" },
    { kind: "stem", stem: 3, role: "Your paper and writing" },
    { kind: "door", key: "scenery", role: "The exam itself" },
  ],
  legal: [
    { kind: "door", key: "fright", role: "The dispute and the lawyers" },
    { kind: "door", key: "open", role: "The judge and officials" },
    { kind: "deity", key: "liuhe", role: "Witnesses and evidence" },
  ],
};
const MARKER_REL = {
  together: ["it shares your own quarter, already in your hands", "it stands with you, no distance to cross"],
  supports: ["its quarter feeds yours, help flows your way", "it leans toward you, receive rather than chase"],
  peer: ["it stands level with you, cooperation moves it", "equal ground, meet it halfway"],
  command: ["your quarter governs it, you set the terms", "it answers to you this hour, lead"],
  drains: ["it draws on your quarter, budget the effort first", "it will cost you before it returns, decide the limit"],
  presses: ["its quarter bears down on yours, keep your guard up", "it has the stronger ground, don't force it this hour"],
};
function markerPalace(o, ov, m) {
  if (m.kind === "door") return o.doors.indexOf(m.key);
  if (m.kind === "star") return o.heavenStar.indexOf(m.key);
  if (m.kind === "deity") return o.deities.indexOf(m.key);
  if (m.kind === "stem") { for (let pal = 1; pal <= 9; pal++) if (pal !== 5 && o.heavenStems[pal] && o.heavenStems[pal].includes(m.stem)) return pal; return -1; }
  if (m.kind === "horse") return ov.horsePal;
  if (m.kind === "hourstem") return ov.hourPal;
  if (m.kind === "day") return ov.dayPal;
  return -1;
}
/* Read the plate for one question topic: each verified use-god, located and judged in plain words. */
export function topicRead(o, catKey, seed) {
  const markers = TOPIC_USE[catKey];
  if (!markers) return null;
  const ov = plateOverlays(o);
  const out = [];
  for (const m of markers) {
    const pal = markerPalace(o, ov, m);
    if (pal < 1) continue;
    const tier = palaceTier(o, pal, ov);
    const notes = palaceNotes(o, pal, ov, seed);
    const relKey = m.kind === "day" ? null : askerMatterRel(ov.dayPal, pal);
    let text;
    if (m.invert) {
      const strong = tier === "excellent" || tier === "good";
      text = strong
        ? `it stands well-fed there this hour, so take symptoms seriously and don't postpone the check-up`
        : `it sits weakly placed there, a good hour to act against it with treatment or rest`;
    } else {
      text = `${pick(TIER_PLAIN[tier], seed + pal)}${relKey && relKey !== "together" ? `, and ${pick(MARKER_REL[relKey], seed + pal + 1)}` : relKey === "together" ? `, and ${pick(MARKER_REL.together, seed + pal + 1)}` : ""}`;
    }
    if (m.healDoor) {
      const dk = o.doors[pal];
      const healable = dk === "open" || dk === "rest" || dk === "life";
      text += healable
        ? `; it stands on the ${DOORS[dk].en}, classically a sign that treatment takes hold`
        : `; it stands on the ${DOORS[dk].en}, so expect treatment to need patience or a second opinion`;
    }
    if (notes.length && !m.invert) text += `. Note: ${notes.join("; ")}`;
    out.push({ role: m.role, pal, dir: PALACES[pal].dir, tier, good: tier === "excellent" || tier === "good", text });
  }
  return out.length ? out : null;
}

/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { BRANCHES, EL_NAME, MONTH_NAMES, STEMS } from "./data";
import { civilToJD, jdToCivil } from "../astro/calendar";
import { surroundingTerms, termJD } from "../astro/solar";
import { CLASH, COMBINE, CONTROLS, PRODUCES, TG, dmStrength, monthPillarOf, tenGod, yearPillarOf } from "./bazi";
import { NOBLEMAN, PEACH, SKYHORSE, TRIO_OF, WENCHANG } from "./stars";

/* ---------------- ORACLE: Plum Blossom I Ching + BaZi timing scan ---------------- */
const TRIGRAMS = [null,
  { name: "Qian", cn: "乾", sym: "☰", el: "metal", image: "Heaven, force, leadership, initiative, the decisive act" },
  { name: "Dui", cn: "兌", sym: "☱", el: "metal", image: "Lake, joy, speech, exchange, persuasion" },
  { name: "Li", cn: "離", sym: "☲", el: "fire", image: "Fire, clarity, visibility, recognition, attachment" },
  { name: "Zhen", cn: "震", sym: "☳", el: "wood", image: "Thunder, shock, sudden movement, beginnings" },
  { name: "Xun", cn: "巽", sym: "☴", el: "wood", image: "Wind, gradual influence, penetration, negotiation" },
  { name: "Kan", cn: "坎", sym: "☵", el: "water", image: "Water, depth, hidden currents, risk, resourcefulness" },
  { name: "Gen", cn: "艮", sym: "☶", el: "earth", image: "Mountain, stillness, boundaries, waiting, integrity" },
  { name: "Kun", cn: "坤", sym: "☷", el: "earth", image: "Earth, receptivity, patience, support, yielding strength" },
];
/* King Wen hexagram names: HEX_NAME[upper-1][lower-1], trigram order Qian,Dui,Li,Zhen,Xun,Kan,Gen,Kun */
const HEX_NAME = [
  ["1 乾 The Creative", "10 履 Treading", "13 同人 Fellowship", "25 無妄 Innocence", "44 姤 Coming to Meet", "6 訟 Conflict", "33 遯 Retreat", "12 否 Standstill"],
  ["43 夬 Breakthrough", "58 兌 The Joyous", "49 革 Revolution", "17 隨 Following", "28 大過 Great Exceeding", "47 困 Oppression", "31 咸 Influence", "45 萃 Gathering"],
  ["14 大有 Great Possession", "38 睽 Opposition", "30 離 The Clinging Fire", "21 噬嗑 Biting Through", "50 鼎 The Cauldron", "64 未濟 Before Completion", "56 旅 The Wanderer", "35 晉 Progress"],
  ["34 大壯 Great Power", "54 歸妹 The Marrying Maiden", "55 豐 Abundance", "51 震 The Arousing", "32 恆 Duration", "40 解 Deliverance", "62 小過 Small Exceeding", "16 豫 Enthusiasm"],
  ["9 小畜 Small Taming", "61 中孚 Inner Truth", "37 家人 The Family", "42 益 Increase", "57 巽 The Gentle", "59 渙 Dispersion", "53 漸 Gradual Progress", "20 觀 Contemplation"],
  ["5 需 Waiting", "60 節 Limitation", "63 既濟 After Completion", "3 屯 Difficulty at the Beginning", "48 井 The Well", "29 坎 The Abysmal", "39 蹇 Obstruction", "8 比 Holding Together"],
  ["26 大畜 Great Taming", "41 損 Decrease", "22 賁 Grace", "27 頤 Nourishment", "18 蠱 Work on the Decayed", "4 蒙 Youthful Folly", "52 艮 Keeping Still", "23 剝 Splitting Apart"],
  ["11 泰 Peace", "19 臨 Approach", "36 明夷 Darkening of the Light", "24 復 Return", "46 升 Pushing Upward", "7 師 The Army", "15 謙 Modesty", "2 坤 The Receptive"],
];
/* Ti/Yong verdicts: relation of the matter (Yong) to you (Ti) */
const ORACLE_VERDICT = {
  supports: { tier: "Very favorable", rank: 5, texts: [
    "The matter feeds you: {D} carries natural momentum, and pursuing it strengthens rather than costs you. Obstacles that appear are small and temporary, proceed, and accept the help that comes, because help is built into this configuration.",
    "The energy of the question flows toward you like a tributary joining a river. {D} wants to happen; your role is to not overcomplicate it. Say yes to the straightforward version and be suspicious only of your own hesitation.",
  ]},
  peer: { tier: "Favorable", rank: 4, texts: [
    "You and the matter are of one element, kinship, not struggle. {D} proceeds smoothly through cooperation and familiarity; the people involved are more ally than obstacle. Move with the current rather than trying to force a dramatic result.",
    "Harmony between you and the question: {D} unfolds among equals, without hidden resistance. The result will be solid rather than spectacular, which, for most questions, is exactly what one should want.",
  ]},
  command: { tier: "Achievable with effort", rank: 3, texts: [
    "You hold the handle: the matter yields to you, but only when gripped. {D} is winnable through deliberate effort, nothing falls into your lap here, and nothing stands truly against you either. Set the terms, do the work, and collect.",
    "You are the stronger element in this configuration, {D} can be commanded, not merely hoped for. The cost is engagement: passive waiting wins nothing, decisive management wins most of it.",
  ]},
  drains: { tier: "Costly, proceed only deliberately", rank: 2, texts: [
    "The matter draws from you: {D} will take energy, money or attention before it returns anything. That is not a refusal, investments look exactly like this, but go in only with eyes open, a defined limit, and the willingness to walk away when the limit is reached.",
    "This configuration spends you. {D} is possible, but you are the fuel it burns; success arrives tired. If it matters enough to pay for, pay knowingly, and secure your reserves (rest, savings, allies) before you begin, not after.",
  ]},
  presses: { tier: "Unfavorable, strengthen first", rank: 1, texts: [
    "The matter has the upper hand: {D} presses against you, and pushing now means pushing uphill against a stronger element. The classical counsel is not surrender but delay, withdraw, strengthen your position, and return when the configuration turns.",
    "This moment does not favor you in this question: {D} currently controls the board. Forcing it invites loss; waiting costs little. Use the pause to build what you lack, information, allies, resources, so the next asking finds you stronger.",
  ]},
};
ORACLE_VERDICT.supports.texts.push("Rarely does a configuration lean this kindly: the matter itself works on your behalf, like a door already opening as you reach for it. Walk through without theatrics, gratitude, not force, is the correct posture here.");
ORACLE_VERDICT.peer.texts.push("Neither servant nor master, the matter meets you as kin. {D} advances through mutuality: share information freely, split gains fairly, and the configuration keeps renewing itself.");
ORACLE_VERDICT.command.texts.push("The matter is clay and you are hands: {D} takes whatever shape your effort insists on. The only failure mode is leaving the clay on the table.");
ORACLE_VERDICT.drains.texts.push("Count the true price before proceeding: {D} charges in the currency you have least of, time, vitality, attention. Paid knowingly, it may still be worth it; paid absentmindedly, it always overcharges.");
ORACLE_VERDICT.presses.texts.push("Iron against your grain: {D} currently outweighs you, and effort spent now mostly proves the point. Retreat here is technique, not defeat, the configuration will rotate, and the prepared return wins what the stubborn stand loses.");
ORACLE_VERDICT.supports.texts.push("Tailwind conditions: {D} moves as if pre-approved. The only sabotage available is overthinking a gift.");
ORACLE_VERDICT.peer.texts.push("Level ground, familiar company: {D} unfolds among likes. No drama is promised, and none is needed.");
ORACLE_VERDICT.command.texts.push("Yours to shape: {D} answers to pressure applied by you specifically. Delegate the doing if you like, never the deciding.");
ORACLE_VERDICT.drains.texts.push("An honest toll road: {D} is passable, priced, and posted. Check the balance before the barrier, not after.");
ORACLE_VERDICT.presses.texts.push("Headwind verdict: {D} pushes back harder than pushing forward pays. Anchor, provision, and wait for the turn, it comes.");
const QUESTION_CATS = [
  { key: "career", label: "Career & work", cn: "官", gods: () => ["DO", "7K"], star: "nobleman", domain: "this career move" },
  { key: "money", label: "Money & business", cn: "財", gods: () => ["IW", "DW"], star: "nobleman", domain: "this financial step" },
  { key: "love", label: "Love & relationships", cn: "桃", gods: (g) => (g === "F" ? ["DO", "7K"] : ["DW", "IW"]), star: "peach", domain: "this relationship matter", dayCombine: true },
  { key: "family", label: "Family & home", cn: "家", gods: () => ["DR", "EG"], star: null, domain: "this family matter", dayCombine: true },
  { key: "health", label: "Health & recovery", cn: "醫", gods: () => ["DR", "EG"], star: null, domain: "this health effort", avoid7K: true },
  { key: "travel", label: "Travel & relocation", cn: "馬", gods: () => ["HO"], star: "skyhorse", domain: "this move", clashOK: true },
  { key: "study", label: "Study & exams", cn: "文", gods: () => ["DR", "IR"], star: "wenchang", domain: "this study goal" },
  { key: "legal", label: "Contracts & disputes", cn: "訟", gods: () => ["DO"], star: "nobleman", domain: "this formal matter", avoidHO: true },
];
function starBranches(chart, starKey) {
  if (!starKey) return [];
  const trio = TRIO_OF(chart.day.branch).join(",");
  if (starKey === "nobleman") return NOBLEMAN[chart.day.stem];
  if (starKey === "wenchang") return [WENCHANG[chart.day.stem]];
  if (starKey === "peach") return [PEACH[trio]];
  if (starKey === "skyhorse") return [SKYHORSE[trio]];
  return [];
}
/* next `count` solar months from a moment */
function upcomingMonths(fromDate, tz, count = 12) {
  const jdNow = civilToJD(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate(), fromDate.getHours(), fromDate.getMinutes(), tz);
  const seq = [];
  for (let y = fromDate.getFullYear() - 1; y <= fromDate.getFullYear() + 2; y++)
    for (let i = 0; i < 12; i++) seq.push({ baziYear: y, i, jd: termJD(y, i) });
  seq.sort((a, b) => a.jd - b.jd);
  let k = 0;
  while (k < seq.length - 1 && seq[k + 1].jd <= jdNow) k++;
  const out = [];
  for (let n = 0; n < count && k + n < seq.length; n++) {
    const t = seq[k + n];
    const mp = monthPillarOf(yearPillarOf(t.baziYear).stem, t.i);
    const c = jdToCivil(t.jd, tz);
    out.push({ ...mp, label: `${MONTH_NAMES[c.month - 1]} ${c.year}` });
  }
  return out;
}
function scanTiming(chart, profile, cat) {
  const months = upcomingMonths(new Date(), profile.tz, 12);
  const gods = cat.gods(profile.gender);
  const stars = starBranches(chart, cat.star);
  const fav = dmStrength(chart).favorable;
  const scored = months.map((mo) => {
    let s = 0; const why = []; const warn = [];
    const gS = tenGod(chart.day.stem, mo.stem);
    const gB = tenGod(chart.day.stem, BRANCHES[mo.branch].hidden[0]);
    if (gods.includes(gS)) { s += 3; why.push(`${TG[gS].name} leads the month, the exact energy this question needs`); }
    if (gods.includes(gB)) { s += 2; why.push(`${TG[gB].name} runs beneath the month`); }
    if (stars.includes(mo.branch)) { s += 2; why.push(`your ${cat.star === "peach" ? "Peach Blossom" : cat.star === "skyhorse" ? "Sky Horse" : cat.star === "wenchang" ? "Academic star" : "Nobleman"} is activated (${BRANCHES[mo.branch].animal} month)`); }
    if (fav.includes(STEMS[mo.stem].el)) { s += 1; why.push(`the month's ${EL_NAME[STEMS[mo.stem].el]} feeds your chart`); }
    if (cat.dayCombine && COMBINE[mo.branch] === chart.day.branch) { s += 2; why.push(`the month combines your spouse/home palace`); }
    const clashesDay = CLASH[mo.branch] === chart.day.branch;
    if (clashesDay) {
      if (cat.clashOK) { s += 1; why.push(`a clash on your day pillar, classically a natural month for relocation and movement`); }
      else { s -= 3; warn.push(`clashes your day pillar, personal turbulence; keep this matter away from this month`); }
    }
    let natClash = 0;
    for (const pos of ["year", "month", "hour"]) if (CLASH[mo.branch] === chart[pos].branch) natClash++;
    if (natClash && !cat.clashOK) { s -= natClash; warn.push(`clashes your ${natClash > 1 ? "chart in multiple palaces" : "natal chart"}, expect disruption around this matter`); }
    if (cat.avoid7K && gS === "7K") { s -= 2; warn.push(`a Seven Killings month, pressure works against recovery`); }
    if (cat.avoidHO && gS === "HO") { s -= 2; warn.push(`a Hurting Officer month, words and technicalities cause trouble in formal matters`); }
    return { ...mo, s, why, warn };
  });
  const best = scored.filter((m) => m.s >= 2).sort((a, b) => b.s - a.s).slice(0, 3);
  const avoid = scored.filter((m) => m.s <= -2).sort((a, b) => a.s - b.s).slice(0, 2);
  return { best, avoid };
}
const QUESTION_TYPES = [
  { key: "should", label: "Should I?" },
  { key: "when", label: "When?" },
  { key: "howgo", label: "How will it go?" },
  { key: "advice", label: "What should I do?" },
];
/* direct answers: question type × verdict rank (1 worst .. 5 best) */
const ANSWER_LEAD = {
  should: { 5: "Yes, and promptly.", 4: "Yes.", 3: "Yes, if you're willing to work for it.", 2: "Only if you can afford what it will cost you.", 1: "Not now." },
  howgo: { 5: "Smoothly, momentum is with you.", 4: "Well, through cooperation rather than force.", 3: "It succeeds if driven, and stalls if left alone.", 2: "Slowly, and at real cost to you.", 1: "Against you, as things currently stand." },
  advice: { 5: "Act, this configuration rewards initiative.", 4: "Proceed steadily and keep your allies close.", 3: "Take charge personally, it only moves if you move it.", 2: "Set a hard limit before you spend more of yourself on it.", 1: "Pause. Strengthen your position. Return later." },
};
const STAGE_TEXT = [
  "at its beginning, young, unformed, and still shapeable by what you do next",
  "in mid-course, momentum exists and the pattern is set; steering beats restarting",
  "in its late stage, near culmination or ending; harvest what is ready and don't replant this field",
];
function castOracle(chart, profile, cat, question, qtype = "should") {
  const now = new Date();
  const tz = -now.getTimezoneOffset() / 60;
  const jdUT = civilToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), tz);
  const { cur } = surroundingTerms(jdUT, now.getFullYear());
  const yb = yearPillarOf(cur.baziYear).branch + 1;
  const mo = cur.i + 1;
  const dd = now.getDate();
  const hr = Math.floor(((now.getHours() + 1) % 24) / 2) + 1;
  const sum1 = yb + mo + dd;
  const upper = sum1 % 8 || 8;
  const sum2 = sum1 + hr;
  const lower = sum2 % 8 || 8;
  const moving = sum2 % 6 || 6;
  const yongIsLower = moving <= 3;
  const ti = TRIGRAMS[yongIsLower ? upper : lower];
  const yong = TRIGRAMS[yongIsLower ? lower : upper];
  let rel;
  if (yong.el === ti.el) rel = "peer";
  else if (PRODUCES[yong.el] === ti.el) rel = "supports";
  else if (PRODUCES[ti.el] === yong.el) rel = "drains";
  else if (CONTROLS[ti.el] === yong.el) rel = "command";
  else rel = "presses";
  const v = ORACLE_VERDICT[rel];
  const timing = scanTiming(chart, profile, cat);
  let answerLead;
  if (qtype === "when") {
    answerLead = timing.best.length
      ? `${timing.best[0].label}${timing.best[1] ? `, then ${timing.best[1].label}` : ""}, ${v.rank >= 3 ? "and the present configuration lets you prepare openly" : "but hold position until then; the present configuration resists forcing it early"}.`
      : "No strongly favorable window appears in the next twelve months, choose by circumstance, not by waiting.";
  } else {
    answerLead = ANSWER_LEAD[qtype === "howgo" || qtype === "advice" ? qtype : "should"][v.rank];
  }
  const stage = STAGE_TEXT[Math.floor((moving - 1) / 2)];
  return {
    ts: now.getTime(), question: question || "", catKey: cat.key, qtype,
    hexName: HEX_NAME[upper - 1][lower - 1], upper, lower, moving, stage,
    ti: ti.name, yong: yong.name, rel, tier: v.tier, rank: v.rank, answerLead,
    verdictText: v.texts[dd % v.texts.length].replaceAll("{D}", cat.domain),
    timing,
  };
}

export { TRIGRAMS, HEX_NAME, ORACLE_VERDICT, QUESTION_CATS, starBranches, upcomingMonths, scanTiming, QUESTION_TYPES, ANSWER_LEAD, STAGE_TEXT, castOracle };

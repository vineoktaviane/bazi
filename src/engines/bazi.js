/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { BRANCHES, EL_NAME, STEMS } from "./data";
import { DAY_OFFSET, civilToJD, jdnOf } from "../astro/calendar";
import { surroundingTerms } from "../astro/solar";

/* ---------------- PILLARS ---------------- */
const FIVE_TIGERS = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 };
const FIVE_RATS = { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 };
const yearPillarOf = (Y) => ({ stem: (((Y - 4) % 10) + 10) % 10, branch: (((Y - 4) % 12) + 12) % 12 });
const monthPillarOf = (yearStem, ti) => ({ stem: (FIVE_TIGERS[yearStem] + ti) % 10, branch: (2 + ti) % 12 });
const sexIndex = (s, b) => { for (let n = 0; n < 60; n++) if (n % 10 === s && n % 12 === b) return n; return 0; };


function computeChart(p) {
  const { y, m, d, hh, min, tz, gender } = p;
  const dci = ((jdnOf(y, m, d) + (hh >= 23 ? 1 : 0) + DAY_OFFSET) % 60 + 60) % 60;
  const day = { stem: dci % 10, branch: dci % 12 };
  const jdUT = civilToJD(y, m, d, hh, min, tz);
  const { cur, next } = surroundingTerms(jdUT, y);
  const yp = yearPillarOf(cur.baziYear);
  const mp = monthPillarOf(yp.stem, cur.i);
  const hp = { stem: (FIVE_RATS[day.stem] + Math.floor(((hh + 1) % 24) / 2)) % 10, branch: Math.floor(((hh + 1) % 24) / 2) };
  const forward = (STEMS[yp.stem].yang && gender === "M") || (!STEMS[yp.stem].yang && gender === "F");
  const diffDays = Math.abs((forward ? next.jd : cur.jd) - jdUT);
  const startAge = Math.max(1, Math.floor(diffDays / 3));
  const luck = [];
  const mi = sexIndex(mp.stem, mp.branch);
  for (let k = 1; k <= 8; k++) {
    const n = ((mi + (forward ? k : -k)) % 60 + 60) % 60;
    luck.push({ age: startAge + (k - 1) * 10, stem: n % 10, branch: n % 12 });
  }
  return { year: yp, month: mp, day, hour: hp, luck, forward, startAge, baziYear: cur.baziYear };
}

/* ---------------- TEN GODS ---------------- */
const PRODUCES = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };
function tenGod(dm, o) {
  const A = STEMS[dm], B = STEMS[o]; const same = A.yang === B.yang;
  if (A.el === B.el) return same ? "F" : "RW";
  if (PRODUCES[A.el] === B.el) return same ? "EG" : "HO";
  if (CONTROLS[A.el] === B.el) return same ? "IW" : "DW";
  if (CONTROLS[B.el] === A.el) return same ? "7K" : "DO";
  return same ? "IR" : "DR";
}
const TG = {
  F: { name: "Friend", cn: "比肩" },
  RW: { name: "Rob Wealth", cn: "劫財" },
  EG: { name: "Eating God", cn: "食神" },
  HO: { name: "Hurting Officer", cn: "傷官" },
  IW: { name: "Indirect Wealth", cn: "偏財" },
  DW: { name: "Direct Wealth", cn: "正財" },
  DO: { name: "Direct Officer", cn: "正官" },
  "7K": { name: "Seven Killings", cn: "七殺" },
  DR: { name: "Direct Resource", cn: "正印" },
  IR: { name: "Indirect Resource", cn: "偏印" },
};

const PRODUCED_BY = { fire: "wood", earth: "fire", metal: "earth", water: "metal", wood: "water" };
const CONTROLLED_BY = { earth: "wood", water: "earth", fire: "water", metal: "fire", wood: "metal" };

/* Five Factors: how each element relates to the Day Master, and which Ten Gods live there */
const FACTOR_DEFS = [
  { key: "companion", label: "Companions", cn: "比劫", gods: ["F", "RW"], rel: (el) => el,
    meaning: "Your own element. Self-reliance, peers, siblings and allies, the people who stand beside you, and your strength to act alone." },
  { key: "output", label: "Output", cn: "食傷", gods: ["EG", "HO"], rel: (el) => PRODUCES[el],
    meaning: "The element you produce. Creativity, expression, skills and performance, energy flowing out of you into the world. It earns, but it also drains." },
  { key: "wealth", label: "Wealth", cn: "財星", gods: ["IW", "DW"], rel: (el) => CONTROLS[el],
    meaning: "The element you control. Money, results and assets, what you can command through steady effort (direct) or seized opportunity (indirect)." },
  { key: "influence", label: "Influence", cn: "官殺", gods: ["DO", "7K"], rel: (el) => CONTROLLED_BY[el],
    meaning: "The element that controls you. Authority, career status, discipline and pressure, the forces that shape you, test you, and give you rank." },
  { key: "resource", label: "Resource", cn: "印星", gods: ["DR", "IR"], rel: (el) => PRODUCED_BY[el],
    meaning: "The element that produces you. Knowledge, mentors, protection, documents and health, everything that replenishes and shields you." },
];
const TG_LINE = {
  F: "Self-reliance, equal partners, shared effort.",
  RW: "Competitive drive, charisma among peers, impulsive spending.",
  EG: "Relaxed creativity, taste, wellbeing, gentle expression.",
  HO: "Bold expression, performance, rule-breaking brilliance.",
  IW: "Opportunity-spotting, business instinct, money in motion.",
  DW: "Steady income, diligence, control over resources.",
  DO: "Status, responsibility, integrity, playing by the rules.",
  "7K": "Ambition, courage under pressure, decisive force.",
  DR: "Formal learning, mentors, protection, kindness.",
  IR: "Unconventional mind, intuition, strategy, solitude.",
};
const TG_DOMINANT = {
  F: "With Friend as your strongest influence, you are built for partnership among equals: independent, loyal, and most effective working shoulder-to-shoulder rather than above or below someone. The lesson of a Friend-heavy chart is boundaries around money and credit, what is shared must be defined, or friendship pays the bill.",
  RW: "With Rob Wealth dominant, you carry bold, magnetic, competitive energy: you rally people, take risks others won't, and hate losing. The classical warning is that this god competes for your wealth, impulsive spending, generous promises and rivalries are the leaks to guard.",
  EG: "With Eating God dominant, you are a natural creator and enjoyer of life: ideas, food, art and comfort flow through you at your own unhurried pace. Your gift is producing without strain; your trap is coasting, comfort can quietly replace ambition if nothing pushes you.",
  HO: "With Hurting Officer dominant, you are expressive, sharp and impossible to script: a performer, critic and innovator who chafes against rules. Channelled into craft or stage, this is brilliance; unchannelled, it becomes career-damaging words aimed at exactly the wrong authority figure.",
  IW: "With Indirect Wealth dominant, you see opportunities before others do and are comfortable with money in motion, deals, ventures, side income. Your risk is the same as your gift: overextension, and valuing the next opportunity over the one already in hand.",
  DW: "With Direct Wealth dominant, you build steadily: diligent, practical, reliable with resources, and rewarded by routine rather than gambles. The caution is rigidity, over-controlling money, time or people, and mistaking busyness for progress.",
  DO: "With Direct Officer dominant, you are wired for responsibility: principled, structured, respected, and comfortable inside hierarchy and law. Status matters to you, and you earn it honestly, just watch that duty doesn't smother spontaneity or make you fear every mistake.",
  "7K": "With Seven Killings dominant, pressure is your fuel: you take charge in crises, push through what breaks others, and command respect through decisiveness. Unmanaged, the same force turns inward as stress or outward as aggression, this god must be given hard problems, or it makes them.",
  DR: "With Direct Resource dominant, you are a lifelong learner, protected and supported: mentors appear, knowledge accumulates, and people trust your judgment. The shadow is passivity, waiting to be fully prepared, fully backed, fully certain, while bolder people act.",
  IR: "With Indirect Resource dominant, you lead with the mind: intuitive, strategic, drawn to unconventional knowledge, and able to see the angle everyone else missed. The cost of that inward focus is isolation and overthinking, insight must eventually leave your head, or it curdles into doubt.",
};
const TG_DOMINANT2 = {
  F: "A Friend-led chart walks through life flanked: siblings, comrades, co-founders. Your instinct in trouble is to call someone, and someone answers. The lifelong ledger to watch is the shared one: split ventures, joint accounts and borrowed credit are where this gift collects its fee.",
  RW: "Rob Wealth in command makes you the one who dares first: the opener of negotiations, the taker of dares, the friend who makes dull evenings historic. Money is your weather, it comes and goes in fronts. Build the boring reservoir (automatic savings, untouchable accounts) precisely because your nature won't.",
  EG: "An Eating God chart is a fortunate temperament: you generate pleasure and product from the same motion. Your work rarely feels like war, which is a blessing with one clause, nothing in you volunteers for hardship, so growth must be invited in deliberately.",
  HO: "Hurting Officer dominant is the performer's constitution: allergic to scripts, gifted at spotlight, dangerous in captivity. Your career either includes an audience or manufactures conflict to feel alive. Choose the audience.",
  IW: "Indirect Wealth in command is the trader's eye as a personality: everything is inventory, timing and margin. Fortunes visit you more than once in life, the skill to practice is keeping a floor under the swings, because your ceiling takes care of itself.",
  DW: "Direct Wealth dominant builds like sediment: layer on layer, decade on decade. You will likely out-own your flashier peers by sheer consistency. The examined risk: mistaking accumulation for purpose, and discovering at sixty a full vault and an unwritten life.",
  DO: "A Direct Officer chart is trusted on sight and promoted on schedule: you embody the institution's better self. Two disciplines keep it healthy, saying no before overload rather than after, and keeping one corner of life gloriously unofficial.",
  "7K": "Seven Killings dominant is command psychology: you organize under fire, decide while others deliberate, and secretly relax in emergencies. Peace is your hard mode. Keep a worthy war on the calendar, a mountain, a startup, a mastery, or your nervous system will draft one from your household.",
  DR: "Direct Resource in command is the protected scholar's life: knowledge accretes, references vouch, safety nets appear. Its single tax is initiative, everything in your chart waits for sanction. Practice starting unsanctioned things at small scale, forever.",
  IR: "Indirect Resource dominant is the strategist's solitude: you know things sideways, early and deeply, and explain them only when asked twice. Institutions underprice you; niches crown you. Find the room where your strange map is the official one.",
};
/* share of each Ten God in the chart: visible stems (excl. DM) ×1, hidden main qi ×1 (month branch ×1.5 for seasonal weight), minor hidden ×0.4 */
function tenGodProfile(chart) {
  const dm = chart.day.stem;
  const w = { F: 0, RW: 0, EG: 0, HO: 0, IW: 0, DW: 0, DO: 0, "7K": 0, DR: 0, IR: 0 };
  for (const pos of ["year", "month", "hour"]) w[tenGod(dm, chart[pos].stem)] += 1;
  for (const pos of ["year", "month", "day", "hour"]) {
    BRANCHES[chart[pos].branch].hidden.forEach((h, i) => {
      w[tenGod(dm, h)] += i === 0 ? (pos === "month" ? 1.5 : 1) : 0.4;
    });
  }
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  Object.keys(w).forEach((k) => (pct[k] = Math.round((w[k] / total) * 100)));
  const top = Object.keys(w).sort((a, b) => w[b] - w[a])[0];
  return { w, pct, top };
}

/* ---------------- KNOWLEDGE BANKS ---------------- */
const EL_QUALITY = {
  wood: "growing, structured, nurturing", fire: "warm, visible, persuasive", earth: "grounded, practical, trust-building",
  metal: "precise, refined, decisive", water: "fluid, communicative, insightful",
};
const EL_CAREERS = {
  wood: "education, writing & publishing, fashion & textiles, wellness, botany & agriculture, design",
  fire: "entertainment, media & marketing, food & beverage, energy, technology, public speaking",
  earth: "real estate, construction, insurance, HR & consultancy, food production, land & property",
  metal: "finance & banking, engineering, law & enforcement, machinery & automotive, jewellery, precision crafts",
  water: "logistics & shipping, trade, tourism & travel, communication, beverages, research & philosophy",
};
const EL_COLORS = { wood: "greens", fire: "reds, oranges and purples", earth: "yellows, browns and beiges", metal: "white, gold, silver and grey", water: "black, navy and deep blues" };
const EL_DIR = { wood: "East", fire: "South", earth: "Southwest & Northeast", metal: "West", water: "North" };
const EL_HEALTH = {
  wood: "liver, gallbladder, eyes and tendons", fire: "heart, blood circulation and small intestine",
  earth: "stomach, spleen, digestion and muscles", metal: "lungs, skin and respiratory system", water: "kidneys, bladder, ears and bones",
};
/* Concrete real-life translation of each factor, the anti-"do I need to be a carpenter" bank */
const FACTOR_REAL = {
  companion: (el) => `Companions are your equals: friends, siblings, colleagues at your level, and your own capacity to stand alone. Yours is ${EL_NAME[el]} itself, so the allies who truly fit you tend to carry ${EL_QUALITY[el]} energy, and joint ventures suit ${EL_NAME[el]}-type settings such as ${EL_CAREERS[el]}.`,
  output: (el) => `"Output" is anything that comes OUT of you, words, ideas, designs, dishes, code, lessons, jokes, plans, products. It is not a material and not a job title: ${EL_NAME[el]} Output means that when you express yourself, it naturally carries ${EL_QUALITY[el]} qualities, and it is most valued in ${EL_NAME[el]}-type fields such as ${EL_CAREERS[el]}.`,
  wealth: (el) => `Wealth is what you can command and convert into results: income, assets, deals, tangible outcomes. ${EL_NAME[el]} being your Wealth element means money flows to you most naturally through ${EL_NAME[el]}-type industries (${EL_CAREERS[el]}) and through ${EL_QUALITY[el]} ways of working.`,
  influence: (el) => `Influence is the pressure that gives you rank: bosses, rules, deadlines, titles, reputation. Your Influence element is ${EL_NAME[el]}, so authority in your life tends to arrive with a ${EL_QUALITY[el]} character, and structures in ${EL_NAME[el]}-type fields (${EL_CAREERS[el]}) are the ones most likely to promote and test you.`,
  resource: (el) => `Resource is everything that feeds and protects you: education, mentors, certificates, contracts, rest, mother figures. Yours is ${EL_NAME[el]}, so support and learning come to you most easily through ${EL_NAME[el]}-type channels (${EL_CAREERS[el]}) and ${EL_QUALITY[el]} environments.`,
};

/* Simplified Day Master strength -> favorable elements. Transparent method, disclosed in UI. */
function dmStrength(chart) {
  const dmEl = STEMS[chart.day.stem].el;
  const prof = elementProfile(chart);
  const total = Object.values(prof).reduce((a, b) => a + b, 0);
  const monthEl = BRANCHES[chart.month.branch].el;
  const seasonal = monthEl === dmEl || monthEl === PRODUCED_BY[dmEl];
  const support = prof[dmEl] + prof[PRODUCED_BY[dmEl]] + (seasonal ? 1.2 : 0);
  const ratio = support / (total + (seasonal ? 1.2 : 0));
  const strong = ratio >= 0.5;
  const favorable = strong ? [PRODUCES[dmEl], CONTROLS[dmEl], CONTROLLED_BY[dmEl]] : [PRODUCED_BY[dmEl], dmEl];
  return { strong, ratio, favorable, seasonal, dmEl };
}

/* ---------------- BRANCH RELATIONS ---------------- */
const CLASH = { 0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5 };
const COMBINE = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
const HARM = { 0: 7, 7: 0, 1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3, 8: 11, 11: 8, 9: 10, 10: 9 };
const PUNISH_GROUPS = [[2, 5, 8], [1, 7, 10], [0, 3]];
const SELF_PUNISH = [4, 6, 9, 11];
const HARMONY_TRIOS = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
function relate(a, b) {
  if (CLASH[a] === b) return "clash";
  if (COMBINE[a] === b) return "combine";
  if (HARM[a] === b) return "harm";
  if (a === b && SELF_PUNISH.includes(a)) return "selfpunish";
  for (const g of PUNISH_GROUPS) if (a !== b && g.includes(a) && g.includes(b)) return "punish";
  for (const t of HARMONY_TRIOS) if (a !== b && t.includes(a) && t.includes(b)) return "harmony";
  if (a === b) return "same";
  return null;
}

/* ---------------- ELEMENT PROFILE ---------------- */
function elementProfile(chart) {
  const w = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pos of ["year", "month", "day", "hour"]) {
    const pl = chart[pos];
    w[STEMS[pl.stem].el] += 1;
    BRANCHES[pl.branch].hidden.forEach((h, i) => { w[STEMS[h].el] += i === 0 ? 1 : 0.4; });
  }
  return w;
}



function monthReading(chart, mStem, mBranch) {
  const dm = chart.day.stem;
  const gStem = tenGod(dm, mStem);
  const gBranch = tenGod(dm, BRANCHES[mBranch].hidden[0]);
  const inter = [];
  for (const pos of ["year", "month", "day", "hour"]) {
    const r = relate(mBranch, chart[pos].branch);
    if (r) inter.push({ pos, r });
  }
  return { gStem, gBranch, inter };
}

export { FIVE_TIGERS, FIVE_RATS, yearPillarOf, monthPillarOf, sexIndex, computeChart, PRODUCES, CONTROLS, tenGod, TG, PRODUCED_BY, CONTROLLED_BY, FACTOR_DEFS, TG_LINE, TG_DOMINANT, TG_DOMINANT2, tenGodProfile, EL_QUALITY, EL_CAREERS, EL_COLORS, EL_DIR, EL_HEALTH, FACTOR_REAL, dmStrength, CLASH, COMBINE, HARM, PUNISH_GROUPS, SELF_PUNISH, HARMONY_TRIOS, relate, elementProfile, monthReading };

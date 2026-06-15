/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { BRANCHES, EL_NAME, STEMS } from "./data";
import { CLASH, COMBINE, CONTROLS, EL_QUALITY, TG, dmStrength, elementProfile, relate, tenGod } from "./bazi";
import { NOBLEMAN } from "./stars";
import { upcomingMonths } from "./oracle";
import { dayPillarOf, monthBranchOf, officerOf } from "./officers";
import { pick } from "../content/banks";
import { CROSS_REL, REL_GOOD, REL_LABEL, TG_PERSON, TG_PERSON2 } from "../content/banks2";

/* ---------------- COMPATIBILITY ---------------- */
const PALACE_SHORT = { year: "family & roots", month: "career world", day: "inner/home life", hour: "plans & children" };
function compat(cA, cB, nameA, nameB) {
  let score = 50;
  const strengths = [], frictions = [], dynamics = [];
  const dsA = cA.day.stem, dsB = cB.day.stem;

  /* Who you are to each other, Ten God dynamic, both directions */
  const gAB = tenGod(dsA, dsB); // what B is to A
  const gBA = tenGod(dsB, dsA);
  dynamics.push({ title: `To ${nameA}, ${nameB} is ${TG[gAB].name} ${TG[gAB].cn}`, text: `In ${nameA}'s chart, ${nameB} appears as ${pick([TG_PERSON[gAB], TG_PERSON2[gAB]], dsA + dsB)}` });
  dynamics.push({ title: `To ${nameB}, ${nameA} is ${TG[gBA].name} ${TG[gBA].cn}`, text: `In ${nameB}'s chart, ${nameA} appears as ${pick([TG_PERSON[gBA], TG_PERSON2[gBA]], dsA * 2 + dsB)}` });

  /* Day stem chemistry */
  const combos = { 0: 5, 5: 0, 1: 6, 6: 1, 2: 7, 7: 2, 3: 8, 8: 3, 4: 9, 9: 4 };
  if (combos[dsA] === dsB) {
    score += 18;
    strengths.push({ pts: 18, title: "Day Masters combine 天干合", text: `${STEMS[dsA].p} and ${STEMS[dsB].p} form one of the five classical stem combinations, a near-magnetic pull between your core selves. This is chemistry at the identity level: you don't have to work at being drawn to each other. Its shadow is complacency, attraction this automatic can excuse never learning to communicate.` });
  } else if (CONTROLS[STEMS[dsA].el] === STEMS[dsB].el || CONTROLS[STEMS[dsB].el] === STEMS[dsA].el) {
    score -= 4;
    frictions.push({ pts: -4, title: "Controlling core dynamic", text: `One Day Master's element naturally disciplines the other's. In practice: one of you keeps instinctively correcting, managing or setting standards for the other. Between mature people this is productive structure; between tired ones it's a power struggle. The fix is making the control explicit and consensual, roles agreed, not assumed.` });
  }

  /* Full cross-chart branch grid: every palace of A against every palace of B */
  const POS = ["year", "month", "day", "hour"];
  const weight = (pa, pb) => (pa === "day" && pb === "day" ? 1 : pa === "day" || pb === "day" ? 0.5 : pa === "year" && pb === "year" ? 0.5 : 0.25);
  const BASE = { combine: 20, harmony: 12, clash: -22, harm: -12, punish: -10, selfpunish: -8, same: 4 };
  POS.forEach((pa, i) =>
    POS.forEach((pb, j) => {
      const r = relate(cA[pa].branch, cB[pb].branch);
      if (!r) return;
      const pts = Math.round(BASE[r] * weight(pa, pb));
      score += pts;
      const labA = `${nameA}'s ${PALACE_SHORT[pa]}`;
      const labB = `${nameB}'s ${PALACE_SHORT[pb]}`;
      const isDayDay = pa === "day" && pb === "day";
      let text = CROSS_REL[r](labA, labB, i * 4 + j);
      if (isDayDay) {
        text = (REL_GOOD[r] || r === "same"
          ? `This is the headline connection: both Day Branches, the spouse palace of each chart. ${text} A bond between the two relationship seats themselves is the strongest classical indicator of daily-life ease as a pair.`
          : `This is the headline friction: both Day Branches, the spouse palace of each chart. ${text} Because it sits between the two relationship seats themselves, this pattern shows up at home, in routines, in the texture of ordinary days, not in rare dramatic moments.`);
      }
      const finding = { pts, title: `${REL_LABEL[r]} · ${BRANCHES[cA[pa].branch].animal} (${nameA} ${pa}) ↔ ${BRANCHES[cB[pb].branch].animal} (${nameB} ${pb})`, text };
      (pts >= 0 ? strengths : frictions).push(finding);
    })
  );

  /* Element complementarity */
  const pA = elementProfile(cA), pB = elementProfile(cB);
  const strongest = (p) => Object.entries(p).sort((a, b) => b[1] - a[1])[0][0];
  const weakest = (p) => Object.entries(p).sort((a, b) => a[1] - b[1])[0][0];
  if (strongest(pA) === weakest(pB)) {
    score += 6;
    strengths.push({ pts: 6, title: `${nameA} supplies what ${nameB} lacks`, text: `${nameA}'s chart overflows with ${EL_NAME[strongest(pA)]}, precisely the element thinnest in ${nameB}'s chart. In daily life this reads as one person naturally being strong exactly where the other runs empty: ${EL_QUALITY[strongest(pA)]} energy that ${nameB} doesn't have to manufacture alone.` });
  }
  if (strongest(pB) === weakest(pA)) {
    score += 6;
    strengths.push({ pts: 6, title: `${nameB} supplies what ${nameA} lacks`, text: `${nameB}'s chart overflows with ${EL_NAME[strongest(pB)]}, precisely the element thinnest in ${nameA}'s chart. Complementary charts like this often feel "completing": each borrows a quality (${EL_QUALITY[strongest(pB)]}) the other was born without.` });
  }

  /* sort findings by magnitude so headline items lead */
  strengths.sort((a, b) => b.pts - a.pts);
  frictions.sort((a, b) => a.pts - b.pts);

  score = Math.max(5, Math.min(95, Math.round(score)));
  let verdict, seal, summary;
  if (score >= 78) { verdict = "Strong natural fit"; seal = "上吉"; summary = "The classical connections between these charts run strongly positive: bonds outnumber and outweigh frictions. This doesn't guarantee anything, it means the default current flows together, and effort invested here compounds easily."; }
  else if (score >= 62) { verdict = "Good fit"; seal = "吉"; summary = "More flows well than grinds between these charts. The frictions listed below are real but specific, they name the seams to manage, while the strengths carry the day-to-day."; }
  else if (score >= 45) { verdict = "Mixed, workable"; seal = "中"; summary = "These charts pull in both directions at once: genuine bonds alongside genuine friction. Pairings like this live or die on whether the friction zones are managed deliberately, read both lists below as a map, not a grade."; }
  else if (score >= 30) { verdict = "Challenging"; seal = "慎"; summary = "The frictions between these charts outweigh the bonds. Classically this pairing demands structure: explicit agreements, separated domains, and realistic expectations exactly where the clashes sit. Difficult is not doomed, but it is work."; }
  else { verdict = "High friction"; seal = "凶"; summary = "The classical indicators point to sustained, structural friction between these charts. Whatever these two build together will be built against the current, possible, but only with unusual honesty about where the pressure lives."; }
  return { score, verdict, seal, summary, strengths, frictions, dynamics };
}

/* joint month weather for two charts */
function pairTiming(cA, cB, tz) {
  const months = upcomingMonths(new Date(), tz, 12);
  const favA = dmStrength(cA).favorable, favB = dmStrength(cB).favorable;
  return months.map((mo) => {
    const clashA = CLASH[mo.branch] === cA.day.branch, clashB = CLASH[mo.branch] === cB.day.branch;
    const goodA = favA.includes(STEMS[mo.stem].el) || COMBINE[mo.branch] === cA.day.branch;
    const goodB = favB.includes(STEMS[mo.stem].el) || COMBINE[mo.branch] === cB.day.branch;
    let tag = "neutral";
    if (clashA && clashB) tag = "storm";
    else if (clashA || clashB) tag = clashA ? "roughA" : "roughB";
    else if (goodA && goodB) tag = "gold";
    return { ...mo, tag };
  });
}
/* best days for an important conversation/decision between two charts, next 30 days */
function bestDaysFor(cA, cB, tz, span = 30) {
  const out = [];
  const now = new Date();
  for (let k = 1; k <= span; k++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k);
    const dp = dayPillarOf(d);
    let sc = 0; const why = [];
    if (CLASH[dp.branch] === cA.day.branch || CLASH[dp.branch] === cB.day.branch) continue;
    if (COMBINE[dp.branch] === cA.day.branch) { sc += 2; why.push("combines your day pillar"); }
    if (COMBINE[dp.branch] === cB.day.branch) { sc += 2; why.push("combines their day pillar"); }
    if (NOBLEMAN[cA.day.stem].includes(dp.branch)) { sc += 1; why.push("your Nobleman day"); }
    if (NOBLEMAN[cB.day.stem].includes(dp.branch)) { sc += 1; why.push("their Nobleman day"); }
    const off = officerOf(dp.branch, monthBranchOf(d, tz));
    if (["Success", "Open", "Stable"].includes(off.en)) { sc += 1; why.push(`${off.en} officer day`); }
    if (["Destruction", "Danger", "Close"].includes(off.en)) sc -= 2;
    if (sc >= 2) out.push({ date: d, sc, why, off, dp });
  }
  return out.sort((a, b) => b.sc - a.sc).slice(0, 3);
}
const REL_LENS = {
  partner: { cn: "情", label: "Partner", intro: "Read as a couple: the spouse palaces carry the most weight here, day-branch findings below describe the texture of your shared daily life, and Peach Blossom months are your high season." },
  family: { cn: "家", label: "Family", intro: "Read as family: year-branch findings matter most, they govern roots, gatherings and obligations. Frictions here surface at holidays and households, not in daily logistics." },
  work: { cn: "職", label: "Work", intro: "Read as colleagues: watch the authority current, whether one of you naturally reads as the other's Officer or Killings god decides who feels graded by whom. Keep money findings formal." },
  friend: { cn: "友", label: "Friend / Business", intro: "Read as friends or partners in ventures: Companion and Wealth dynamics dominate, the classic risks are shared money and blurred credit, the classic gift is genuine alliance." },
};

export { PALACE_SHORT, compat, pairTiming, bestDaysFor, REL_LENS };

/* Often-asked life questions 常問: definitions and the activation scanner.
 * Every answer leads with what a chart cannot do, then shows computed windows
 * (decades + upcoming years) for the stars and ten gods tradition ties to the question.
 * Reads engine exports only, deterministic, never predicts. */
import { STEMS, BRANCHES } from "../engines/data";
import { tenGod, TG, relate, yearPillarOf, dmStrength } from "../engines/bazi";
import { NOBLEMAN, WENCHANG, PEACH, SKYHORSE, TRIO_OF, TRIO_STAR, LU_STAR, YANG_BLADE, GOLDEN_CARRIAGE, growthStage } from "../engines/stars";

export const STAR_LABEL = {
  nobleman: { name: "Nobleman", cn: "貴人" },
  wenchang: { name: "Academic Star", cn: "文昌" },
  peach: { name: "Peach Blossom", cn: "桃花" },
  skyhorse: { name: "Sky Horse", cn: "驛馬" },
  hongluan: { name: "Red Phoenix", cn: "紅鸞" },
  tianxi: { name: "Sky Happiness", cn: "天喜" },
  lu: { name: "Thriving Star", cn: "祿神" },
  carriage: { name: "Golden Carriage", cn: "金輿" },
  general: { name: "General Star", cn: "將星" },
  calamity: { name: "Calamity Sha", cn: "災煞" },
  robbery: { name: "Robbery Sha", cn: "劫煞" },
  blade: { name: "Yang Blade", cn: "羊刃" },
};

/* Which branch(es) activate a given star for this chart. Same public formulas the engines use. */
function starBranchesOf(chart, key) {
  const ds = chart.day.stem, yb = chart.year.branch;
  const trio = TRIO_OF(chart.day.branch).join(",");
  switch (key) {
    case "nobleman": return NOBLEMAN[ds];
    case "wenchang": return [WENCHANG[ds]];
    case "peach": return [PEACH[trio]];
    case "skyhorse": return [SKYHORSE[trio]];
    case "hongluan": return [(3 - yb + 24) % 12];
    case "tianxi": return [(9 - yb + 24) % 12];
    case "lu": return [LU_STAR[ds]];
    case "carriage": return [GOLDEN_CARRIAGE[ds]];
    case "general": return [TRIO_STAR.general[trio]];
    case "calamity": return [TRIO_STAR.calamity[trio]];
    case "robbery": return [TRIO_STAR.robbery[trio]];
    case "blade": return YANG_BLADE[ds] === undefined ? [] : [YANG_BLADE[ds]];
    default: return [];
  }
}

export const LIFE_QUESTIONS = [
  {
    key: "marry", cn: "婚", label: "When will I marry?", q: "When will I get married?",
    cant: "No chart can name the year you will marry, and none should try, marriage needs a second person the chart cannot see.",
    markers: "the Red Phoenix, Sky Happiness and your spouse star",
    stars: ["hongluan", "tianxi"], gods: (g) => (g === "F" ? ["DO", "7K"] : ["DW", "IW"]),
    godWord: "spouse star", combineGood: true,
  },
  {
    key: "meet", cn: "緣", label: "When will I meet someone?", q: "When will I meet someone?",
    cant: "No chart can say who you will meet or where, encounters belong to life, not to calculation.",
    markers: "the Peach Blossom, the Red Phoenix and your spouse star",
    stars: ["peach", "hongluan"], gods: (g) => (g === "F" ? ["DO", "7K"] : ["DW", "IW"]),
    godWord: "spouse star", combineGood: true,
  },
  {
    key: "children", cn: "子", label: "When will I have children?", q: "When will I have children?",
    cant: "No chart can promise a child or a birth year, biology and circumstance outrank any pillar.",
    markers: "the Sky Happiness star, your children star and the hour pillar (the children palace)",
    stars: ["tianxi"], gods: (g) => (g === "F" ? ["EG", "HO"] : ["DO", "7K"]),
    godWord: "children star", palaceHour: true,
  },
  {
    key: "rich", cn: "富", label: "When will money improve?", q: "When will I become wealthy?",
    cant: "No chart can state a sum or a date of wealth, effort, markets and luck sit outside the pillars.",
    markers: "the Thriving Star and your wealth stars",
    stars: ["lu"], gods: () => ["IW", "DW"], godWord: "wealth star", favEl: true,
  },
  {
    key: "career", cn: "官", label: "When does my career rise?", q: "When will my career advance?",
    cant: "No chart can hand you a title or a promotion date, organisations decide those, not stars.",
    markers: "the General Star, your Nobleman and your authority stars",
    stars: ["general", "nobleman"], gods: () => ["DO", "7K"], godWord: "authority star",
  },
  {
    key: "business", cn: "創", label: "When to start a business?", q: "When should I start a business?",
    cant: "No chart can guarantee a venture succeeds, execution and market decide that.",
    markers: "the Thriving Star and your enterprise stars",
    stars: ["lu"], gods: () => ["IW", "EG"], godWord: "enterprise star", favEl: true,
  },
  {
    key: "move", cn: "遷", label: "When to move or go abroad?", q: "When is the right time to move or go abroad?",
    cant: "No chart can pick your city or country, it only marks when movement itself flows more easily.",
    markers: "the Sky Horse and your expression star",
    stars: ["skyhorse"], gods: () => ["HO"], godWord: "movement star", clashGood: true,
  },
  {
    key: "study", cn: "文", label: "When to study or sit exams?", q: "When should I study, certify or take the exam?",
    cant: "No chart can pass an exam for you, preparation does that.",
    markers: "the Academic Star and your learning stars",
    stars: ["wenchang"], gods: () => ["DR", "IR"], godWord: "learning star",
  },
  {
    key: "home", cn: "宅", label: "When will I buy a home?", q: "When will I buy a home?",
    cant: "No chart can see prices, mortgages or listings, it only marks when settling and material footing are supported.",
    markers: "the Golden Carriage, your steady-wealth star and your resource star",
    stars: ["carriage"], gods: () => ["DW", "DR"], godWord: "stability star",
  },
  {
    key: "health", cn: "醫", label: "When to guard my health?", q: "When should I take extra care of my health?",
    cant: "No chart can diagnose anything, doctors do that, and a flagged window in a healthy life passes quietly.",
    markers: "the Calamity and Robbery Sha, clashes with your day branch, and the low arcs of the growth cycle",
    stars: ["calamity", "robbery", "blade"], gods: () => [], godWord: "", caution: true,
  },
];

/* Score one pillar (a decade or a year) against a question's markers. Pure and deterministic. */
function scorePillar(chart, qd, gods, starBr, stem, branch) {
  const ds = chart.day.stem;
  const reasons = [];
  let score = 0;
  const gS = tenGod(ds, stem), gB = tenGod(ds, BRANCHES[branch].hidden[0]);
  if (gods.includes(gS)) { score += 2; reasons.push(`its stem carries your ${qd.godWord} (${TG[gS].name} ${TG[gS].cn})`); }
  if (gods.includes(gB) && gB !== gS) { score += 1.5; reasons.push(`its branch hides your ${qd.godWord} (${TG[gB].name} ${TG[gB].cn})`); }
  for (const sk of qd.stars) {
    if ((starBr[sk] || []).includes(branch)) {
      score += 2;
      reasons.push(`it lands on your ${STAR_LABEL[sk].name} ${STAR_LABEL[sk].cn} branch, ${BRANCHES[branch].animal}`);
    }
  }
  if (qd.combineGood && relate(branch, chart.day.branch) === "combine") { score += 1.5; reasons.push("it combines with your day branch, the spouse palace"); }
  if (qd.palaceHour) {
    const r = relate(branch, chart.hour.branch);
    if (branch === chart.hour.branch) { score += 1.5; reasons.push("it matches your hour branch, the children palace"); }
    else if (r === "combine") { score += 1.5; reasons.push("it combines with your hour branch, the children palace"); }
  }
  if (qd.clashGood && relate(branch, chart.day.branch) === "clash") { score += 1; reasons.push("it clashes your day branch, which classically stirs movement and change of place"); }
  if (qd.favEl) {
    const st = dmStrength(chart);
    if (st.favorable.includes(STEMS[stem].el)) { score += 0.5; reasons.push(`its element (${STEMS[stem].el}) is one your chart welcomes`); }
  }
  if (qd.caution) {
    if (relate(branch, chart.day.branch) === "clash") { score += 2; reasons.push("it clashes your day branch, the pillar of the self and the body"); }
    const stage = growthStage(ds, branch);
    if (stage.idx === 6) { score += 1.5; reasons.push("your Day Master sits at the Sickness 病 stage here"); }
    if (stage.idx === 7 || stage.idx === 9) { score += 1; reasons.push(`your Day Master sits at the ${stage.en} ${stage.cn} stage here, a low arc of the cycle`); }
  }
  return { score, reasons };
}

export function scanQuestion(chart, profile, qd) {
  const gods = qd.gods(profile.gender);
  const starBr = {};
  for (const sk of qd.stars) starBr[sk] = starBranchesOf(chart, sk);
  const now = new Date();
  const curAge = Math.floor((now - new Date(profile.y, profile.m - 1, profile.d)) / (365.25 * 24 * 3600 * 1000));
  const decades = chart.luck
    .map((l) => {
      const { score, reasons } = scorePillar(chart, qd, gods, starBr, l.stem, l.branch);
      const y0 = profile.y + l.age;
      return { ...l, score, reasons, y0, current: curAge >= l.age && curAge < l.age + 10, past: l.age + 9 < curAge };
    })
    .filter((d) => d.score >= 2 && !d.past)
    .sort((a, b) => b.score - a.score || a.age - b.age)
    .slice(0, 3);
  const years = [];
  const Y0 = now.getFullYear();
  for (let Y = Y0; Y < Y0 + 12; Y++) {
    const yp = yearPillarOf(Y);
    const { score, reasons } = scorePillar(chart, qd, gods, starBr, yp.stem, yp.branch);
    let sc = score; const rs = reasons.slice();
    if (qd.caution && (yp.branch + 11) % 12 === chart.year.branch) { sc += 1; rs.push("it carries the Sickness Charm 病符, last year's fatigue asking to be paid"); }
    if (sc >= 2) years.push({ Y, ...yp, score: sc, reasons: rs });
  }
  years.sort((a, b) => b.score - a.score || a.Y - b.Y);
  return { decades, years: years.slice(0, 4), gods, starBr };
}

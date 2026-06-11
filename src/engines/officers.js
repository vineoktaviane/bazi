/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { DAY_OFFSET, civilToJD, jdnOf } from "../astro/calendar";
import { surroundingTerms } from "../astro/solar";
import { CLASH, COMBINE, relate, sexIndex, tenGod } from "./bazi";
import { NOBLEMAN, cycleStars, voidBranches } from "./stars";
import { fill } from "../content/banks";

/* ---------------- DAY OFFICERS + DAILY/PAIR ENGINES ---------------- */
const DAY_OFFICERS = [
  { cn: "建", en: "Establish", good: true, text: "The founding day: what starts today carries the month's own authority. Start things meant to last; don't dig up what already stands." },
  { cn: "除", en: "Remove", good: true, text: "The sweeping day: made for removal, clutter, ailments, obligations, bad arrangements. Subtract today; add tomorrow." },
  { cn: "滿", en: "Full", good: true, text: "The abundance day: containers fill. Harvest, celebrate and store, but a full vessel accepts nothing new, so don't force fresh starts." },
  { cn: "平", en: "Balance", good: true, text: "The leveling day: extremes flatten. Excellent for settling disputes and evening accounts; dull for glory." },
  { cn: "定", en: "Stable", good: true, text: "The anchoring day: what is fixed today stays fixed. Sign, commit, engage, and don't choose it for anything that needs to move." },
  { cn: "執", en: "Initiate", good: true, text: "The grasping day: authority in the hand. Take hold of tasks, people and debts, a day for grip, not release." },
  { cn: "破", en: "Destruction", good: false, text: "The breaking day: the month's own clash. Nothing built today holds. Use it only for what should break, then stand back." },
  { cn: "危", en: "Danger", good: false, text: "The precipice day: margins are thin. Move carefully, defer the daring, let the adrenaline find you another day." },
  { cn: "成", en: "Success", good: true, text: "The completion day: efforts mature. The classic all-purpose auspicious day, finish, launch, celebrate, marry." },
  { cn: "收", en: "Receive", good: true, text: "The gathering day: what is owed comes home. Collect, store, bank and file, intake, not outflow." },
  { cn: "開", en: "Open", good: true, text: "The open-gate day: doors swing easily. Begin what needs welcome, enterprises, courses, introductions." },
  { cn: "閉", en: "Close", good: false, text: "The sealed day: energy turns inward and shuts. Close books, lock doors, rest deeply, begin nothing." },
];
const officerOf = (dayBranch, monthBranch) => DAY_OFFICERS[(dayBranch - monthBranch + 12) % 12];
const hourRange = (b) => `${String((23 + 2 * b) % 24).padStart(2, "0")}:00–${String((1 + 2 * b) % 24).padStart(2, "0")}:00`;
function dayPillarOf(date) {
  const dci = ((jdnOf(date.getFullYear(), date.getMonth() + 1, date.getDate()) + DAY_OFFSET) % 60 + 60) % 60;
  return { stem: dci % 10, branch: dci % 12, dci };
}
function monthBranchOf(date, tz) {
  const jdUT = civilToJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12, 0, tz);
  return (2 + surroundingTerms(jdUT, date.getFullYear()).cur.i) % 12;
}
function todayInfo(chart, profile) {
  const now = new Date();
  const dp = dayPillarOf(now);
  const mb = monthBranchOf(now, profile.tz);
  const gS = tenGod(chart.day.stem, dp.stem);
  const officer = officerOf(dp.branch, mb);
  const stars = cycleStars(chart, dp.branch);
  const rel = relate(dp.branch, chart.day.branch);
  const voids = voidBranches(sexIndex(chart.day.stem, chart.day.branch));
  const isVoid = voids.includes(dp.branch);
  return { dp, gS, officer, stars, rel, isVoid,
    golden: COMBINE[chart.day.branch], broken: CLASH[chart.day.branch], noble: NOBLEMAN[chart.day.stem] };
}

export { DAY_OFFICERS, officerOf, hourRange, dayPillarOf, monthBranchOf, todayInfo };

/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { BRANCHES } from "./data";
import { CLASH, HARMONY_TRIOS } from "./bazi";
import { pick } from "../content/banks";
import { SHENSHA_ALT } from "../content/banks2";

/* Symbolic stars, classical public formulas, verified against reference chart:
   Gui DM -> Nobleman Si & Mao, Academic Mao; day branch Mao -> Peach Blossom Zi, Sky Horse Si */
const NOBLEMAN = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 7: [2, 6], 8: [5, 3], 9: [5, 3] };
const WENCHANG = { 0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3 };
const TRIO_OF = (b) => HARMONY_TRIOS.find((t) => t.includes(b));
const PEACH = { "8,0,4": 9, "11,3,7": 0, "2,6,10": 3, "5,9,1": 6 };
const SKYHORSE = { "8,0,4": 2, "11,3,7": 5, "2,6,10": 8, "5,9,1": 11 };
function symbolicStars(chart) {
  const ds = chart.day.stem, db = chart.day.branch;
  const trio = TRIO_OF(db).join(",");
  const an = (b) => `${BRANCHES[b].animal} (${BRANCHES[b].cn} ${BRANCHES[b].p})`;
  return [
    { name: "Nobleman", cn: "貴人", who: NOBLEMAN[ds].map(an).join(" and "),
      text: "Your helpful-people star. In years and months of these signs, and around people born in these animal years, doors open, favours arrive, and trouble gets smoothed over. When you need a mentor, backer or rescuer, look here first." },
    { name: "Academic star", cn: "文昌", who: an(WENCHANG[ds]),
      text: "Your intelligence and scholarship star. Years, months and people of this sign sharpen your study, writing and exam luck. Time certifications, publications and applications to its months when you can." },
    { name: "Peach Blossom", cn: "桃花", who: an(PEACH[trio]),
      text: "Your charm and attraction star. Activated in years and months of this sign, your social magnetism rises, good for romance, networking, sales and anything that depends on being liked. The classical caution: heightened attention includes the unwanted kind." },
    { name: "Sky Horse", cn: "驛馬", who: an(SKYHORSE[trio]),
      text: "Your movement star. Years and months of this sign stir travel, relocation, job changes and restlessness. Fighting it breeds frustration; scheduled movement, trips, transfers, launches, uses it well." },
  ];
}

/* ---------------- SHEN SHA 神煞: auspicious & inauspicious stars ---------------- */
const TRIO_STAR = {
  general: { "8,0,4": 0, "2,6,10": 6, "5,9,1": 9, "11,3,7": 3 },   // 將星 trio peak
  huagai: { "8,0,4": 4, "2,6,10": 10, "5,9,1": 1, "11,3,7": 7 },    // 華蓋 trio grave
  calamity: { "8,0,4": 6, "2,6,10": 0, "5,9,1": 3, "11,3,7": 9 },   // 災煞 clash of peak
  robbery: { "8,0,4": 5, "2,6,10": 11, "5,9,1": 2, "11,3,7": 8 },   // 劫煞
};
const SHENSHA_TEXT = {
  general: { name: "General Star", cn: "將星", good: true, text: "Command energy: authority sits well on you now. Take the chair, lead the meeting, make the call, deference is wasted this cycle." },
  huagai: { name: "Elegant Seal", cn: "華蓋", good: true, text: "Solitary brilliance: art, study, research and spiritual work deepen, but so does the pull to withdraw. Create alone, then remember to come back." },
  calamity: { name: "Calamity Sha", cn: "災煞", good: false, text: "Accident-prone energy: sharpen attention around traffic, tools, water and deadlines. Back up your files, double-check the details, skip the daredevil plans." },
  robbery: { name: "Robbery Sha", cn: "劫煞", good: false, text: "Loss through others: guard valuables and passwords, vet new partners twice, and lend nothing you need back this cycle." },
  hongluan: { name: "Red Phoenix", cn: "紅鸞", good: true, text: "The marriage star: romance, proposals, engagements and unions are classically favoured when this activates." },
  tianxi: { name: "Sky Happiness", cn: "天喜", good: true, text: "The celebration star: good news, festivities, births and reunions gather under its activation." },
  taisui: { name: "Tai Sui", cn: "太歲", good: false, text: "You meet the Grand Duke this year, a year of significant personal change. The tradition: act deliberately rather than drift, keep a steady profile, and mark the year with a celebration rather than letting it mark you." },
  suipo: { name: "Year Breaker", cn: "歲破", good: false, text: "The year clashes your foundations: expect movement in living situation, family arrangements or long-held plans. Choose your changes early, before the year chooses them for you." },
  sickness: { name: "Sickness Charm", cn: "病符", good: false, text: "Lingering-ailment energy: last year's fatigue wants to be paid for. Rest earlier than feels necessary and take small symptoms seriously." },
};
/* stars a given target branch (month or year) activates for this person */
function cycleStars(chart, targetBranch) {
  const out = [];
  const seen = new Set();
  const add = (key, via) => { if (!seen.has(key)) { seen.add(key); out.push({ ...SHENSHA_TEXT[key], text: pick([SHENSHA_TEXT[key].text, SHENSHA_ALT[key]], targetBranch + key.length), via }); } };
  for (const [pos, br] of [["day", chart.day.branch], ["year", chart.year.branch]]) {
    const trio = TRIO_OF(br).join(",");
    for (const k of ["general", "huagai", "calamity", "robbery"]) {
      if (TRIO_STAR[k][trio] === targetBranch) add(k, pos);
    }
  }
  if (LU_STAR[chart.day.stem] === targetBranch) { out.push({ ...EXTRA_STAR_TEXT.lu, text: pick([EXTRA_STAR_TEXT.lu.text, SHENSHA_ALT.lu], targetBranch), via: "day" }); }
  if (YANG_BLADE[chart.day.stem] === targetBranch) { out.push({ ...EXTRA_STAR_TEXT.blade, text: pick([EXTRA_STAR_TEXT.blade.text, SHENSHA_ALT.blade], targetBranch), via: "day" }); }
  if (GOLDEN_CARRIAGE[chart.day.stem] === targetBranch) { out.push({ ...EXTRA_STAR_TEXT.carriage, text: pick([EXTRA_STAR_TEXT.carriage.text, SHENSHA_ALT.carriage], targetBranch), via: "day" }); }
  if ((3 - chart.year.branch + 24) % 12 === targetBranch) add("hongluan", "year");
  if ((9 - chart.year.branch + 24) % 12 === targetBranch) add("tianxi", "year");
  return out;
}
/* extra annual-only checks */
function annualStars(chart, annualBranch) {
  const out = cycleStars(chart, annualBranch);
  if (annualBranch === chart.year.branch || annualBranch === chart.day.branch) out.unshift({ ...SHENSHA_TEXT.taisui, text: pick([SHENSHA_TEXT.taisui.text, SHENSHA_ALT.taisui], annualBranch), via: annualBranch === chart.year.branch ? "year" : "day" });
  if (CLASH[annualBranch] === chart.year.branch) out.push({ ...SHENSHA_TEXT.suipo, text: pick([SHENSHA_TEXT.suipo.text, SHENSHA_ALT.suipo], annualBranch), via: "year" });
  if ((annualBranch + 11) % 12 === chart.year.branch) out.push({ ...SHENSHA_TEXT.sickness, text: pick([SHENSHA_TEXT.sickness.text, SHENSHA_ALT.sickness], annualBranch), via: "year" });
  return out;
}

/* ---------------- GROWTH STAGES, NA YIN, VOID, EXTRA STARS ---------------- */
const GROWTH_START = { 0: 11, 2: 2, 4: 2, 6: 5, 8: 8, 1: 6, 3: 9, 5: 9, 7: 0, 9: 3 };
const GROWTH_STAGES = [
  { cn: "\u9577\u751f", en: "Growth" }, { cn: "\u6c90\u6d74", en: "Bath" }, { cn: "\u51a0\u5e36", en: "Cap & Sash" },
  { cn: "\u81e8\u5b98", en: "Thriving" }, { cn: "\u5e1d\u65fa", en: "Peak" }, { cn: "\u8870", en: "Weakening" },
  { cn: "\u75c5", en: "Sickness" }, { cn: "\u6b7b", en: "Death" }, { cn: "\u5893", en: "Grave" },
  { cn: "\u7d55", en: "Extinction" }, { cn: "\u80ce", en: "Conception" }, { cn: "\u990a", en: "Nourishing" },
];
const GROWTH_TEXT = [
  "fresh capability and support, favors beginnings", "charming but changeable, delightful, shouldn't sign contracts",
  "coming of age, step into roles slightly too big", "full working strength, capacity meets opportunity",
  "maximum power, spend it, the next step is down", "strength ebbing into wisdom, consolidate, mentor, defend",
  "energy turned inward to repair, patience, not demands", "the cycle's pause, let endings complete, start nothing here",
  "the storehouse, save, archive, close; a vault and occasionally a rut", "the void between cycles, fragile, and the exact point reinvention becomes possible",
  "the new spark in darkness, real but not yet robust; protect it", "invisible gestation, trust the process and keep feeding it",
];
function growthStage(dmStem, branch) {
  const start = GROWTH_START[dmStem];
  const idx = dmStem % 2 === 0 ? (branch - start + 12) % 12 : (start - branch + 12) % 12;
  return { idx, ...GROWTH_STAGES[idx], text: GROWTH_TEXT[idx] };
}
const NAYIN = ["Gold in the Sea \u6d77\u4e2d\u91d1","Fire in the Furnace \u7210\u4e2d\u706b","Wood of the Great Forest \u5927\u6797\u6728","Earth by the Roadside \u8def\u65c1\u571f","Sword-Edge Gold \u528d\u92d2\u91d1","Fire on the Mountain Top \u5c71\u982d\u706b","Water of the Ravine \u6f97\u4e0b\u6c34","Earth of the City Wall \u57ce\u982d\u571f","White-Wax Gold \u767d\u881f\u91d1","Willow Wood \u694a\u67f3\u6728","Spring Water \u6cc9\u4e2d\u6c34","Earth on the Roof \u5c4b\u4e0a\u571f","Thunderbolt Fire \u9739\u9742\u706b","Pine & Cypress Wood \u677e\u67cf\u6728","Long-Flowing Water \u9577\u6d41\u6c34","Gold in the Sand \u6c99\u4e2d\u91d1","Fire below the Mountain \u5c71\u4e0b\u706b","Wood of the Plain \u5e73\u5730\u6728","Earth on the Wall \u58c1\u4e0a\u571f","Gold-Foil Gold \u91d1\u7b94\u91d1","Lamp Fire \u8986\u71c8\u706b","Water of the Heavenly River \u5929\u6cb3\u6c34","Earth of the Great Post-Road \u5927\u9a5b\u571f","Hairpin Gold \u91f5\u91e7\u91d1","Mulberry Wood \u6851\u67d8\u6728","Water of the Great Stream \u5927\u6eaa\u6c34","Earth in the Sand \u6c99\u4e2d\u571f","Fire in the Sky \u5929\u4e0a\u706b","Pomegranate Wood \u77f3\u69b4\u6728","Water of the Great Sea \u5927\u6d77\u6c34"];
const nayinOf = (sexIdx) => NAYIN[Math.floor((((sexIdx % 60) + 60) % 60) / 2)];
function voidBranches(daySexIndex) {
  const xs = (daySexIndex - (daySexIndex % 10) + 120) % 12;
  return [(xs + 10) % 12, (xs + 11) % 12];
}
const VOID_PALACE = {
  year: "Your year pillar is void: roots, ancestry and early foundations sit lightly on you, freedom from the past, and a certain unmoored feeling that self-made traditions can fix.",
  month: "Your month pillar is void: career structures and the parental script hold you loosely, conventional ladders satisfy less; build your own definition of arrival.",
  day: "Your spouse palace is void: partnership themes arrive on their own late schedule and resist standard templates. Presence, not paperwork, fills this seat.",
  hour: "Your hour pillar is void: legacy and later-life plans stay abstract until deliberately made concrete, write them down early and revisit often.",
};
const LU_STAR = { 0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0 };
const YANG_BLADE = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };
const GOLDEN_CARRIAGE = { 0: 4, 1: 5, 2: 7, 3: 8, 4: 7, 5: 8, 6: 10, 7: 11, 8: 1, 9: 2 };
const EXTRA_STAR_TEXT = {
  lu: { name: "Thriving Star", cn: "\u797f\u795e", good: true, text: "Your salary star activates: income, employment and material footing are favoured; collect, negotiate and invoice in this window." },
  blade: { name: "Yang Blade", cn: "\u7f8a\u5203", good: false, text: "Power\u2019s overshoot: fierce capability with equal risk. Superb for decisive, physical or surgical matters; handle everything sharp, words included, with respect." },
  carriage: { name: "Golden Carriage", cn: "\u91d1\u8f3f", good: true, text: "The comfort star: logistics ease, material worries soften, a good window to upgrade what carries you, from vehicles to living arrangements." },
};

export { NOBLEMAN, WENCHANG, TRIO_OF, PEACH, SKYHORSE, symbolicStars, TRIO_STAR, SHENSHA_TEXT, cycleStars, annualStars, GROWTH_START, GROWTH_STAGES, GROWTH_TEXT, growthStage, NAYIN, nayinOf, voidBranches, VOID_PALACE, LU_STAR, YANG_BLADE, GOLDEN_CARRIAGE, EXTRA_STAR_TEXT };

/* Qi Men Dun Jia 奇門遁甲: hour-plate (時家) casting engine, rotating-plate (轉盤) school.
 * NEW ENGINE, not part of the verbatim-ported set. PRD rule: never approximate — this is a
 * complete classical casting, guarded by tests/qimen.test.js (hand-verified plates).
 *
 * School choices (PRD §6 requires disclosure):
 *  - 24 solar terms computed astronomically (same solar-longitude routine as the BaZi engine).
 *  - Yuan by chai-bu 拆補法: the most recent Jia/Ji day is the fu tou 符頭; its branch sets the
 *    yuan (Zi-Wu-Mao-You upper, Yin-Shen-Si-Hai middle, Chen-Xu-Chou-Wei lower).
 *  - Day rolls over at 23:00, the same Zi-hour school as computeChart.
 *  - Tian Qin 天禽 lodges in palace 2 (寄坤); any landing in palace 5 lodges likewise.
 *  - Eight-deity set 值符螣蛇太陰六合白虎玄武九地九天; yang dun clockwise, yin dun counter.
 *  - Cast at device-local time, like the Plum Blossom oracle.
 *  - Not yet modelled (shown raw, never invented): 十干剋應 stem-pair verdicts, 門迫 door
 *    pressing, 空亡 void and 馬星 horse overlays, annual/monthly/day plates. */
import { civilToJD, jdnOf, DAY_OFFSET } from "../astro/calendar";
import { findTerm } from "../astro/solar";
import { FIVE_RATS, sexIndex, PRODUCES, CONTROLS } from "./bazi";
import { TRIO_OF, SKYHORSE, voidBranches } from "./stars";

/* ---------------- 24 solar terms, k=0 is 冬至 (sun at 270°), 15° steps ---------------- */
const QM_TERMS = [
  { cn: "冬至", p: "Dong Zhi", en: "Winter Solstice" }, { cn: "小寒", p: "Xiao Han", en: "Minor Cold" },
  { cn: "大寒", p: "Da Han", en: "Major Cold" }, { cn: "立春", p: "Li Chun", en: "Start of Spring" },
  { cn: "雨水", p: "Yu Shui", en: "Rain Water" }, { cn: "驚蟄", p: "Jing Zhe", en: "Awakening of Insects" },
  { cn: "春分", p: "Chun Fen", en: "Spring Equinox" }, { cn: "清明", p: "Qing Ming", en: "Clear and Bright" },
  { cn: "穀雨", p: "Gu Yu", en: "Grain Rain" }, { cn: "立夏", p: "Li Xia", en: "Start of Summer" },
  { cn: "小滿", p: "Xiao Man", en: "Grain Buds" }, { cn: "芒種", p: "Mang Zhong", en: "Grain in Ear" },
  { cn: "夏至", p: "Xia Zhi", en: "Summer Solstice" }, { cn: "小暑", p: "Xiao Shu", en: "Minor Heat" },
  { cn: "大暑", p: "Da Shu", en: "Major Heat" }, { cn: "立秋", p: "Li Qiu", en: "Start of Autumn" },
  { cn: "處暑", p: "Chu Shu", en: "End of Heat" }, { cn: "白露", p: "Bai Lu", en: "White Dew" },
  { cn: "秋分", p: "Qiu Fen", en: "Autumn Equinox" }, { cn: "寒露", p: "Han Lu", en: "Cold Dew" },
  { cn: "霜降", p: "Shuang Jiang", en: "Frost Descent" }, { cn: "立冬", p: "Li Dong", en: "Start of Winter" },
  { cn: "小雪", p: "Xiao Xue", en: "Minor Snow" }, { cn: "大雪", p: "Da Xue", en: "Major Snow" },
];
/* approximate calendar (month, day) of each term, used only to seed the bisection */
const QM_APPROX = [
  [12, 22], [1, 6], [1, 20], [2, 4], [2, 19], [3, 6], [3, 21], [4, 5], [4, 20], [5, 6], [5, 21], [6, 6],
  [6, 21], [7, 7], [7, 23], [8, 8], [8, 23], [9, 8], [9, 23], [10, 8], [10, 23], [11, 7], [11, 22], [12, 7],
];
/* classical ju table: JU_TABLE[k] = [upper, middle, lower yuan]; k 0-11 yang dun, 12-23 yin dun.
 * Mnemonic source: 冬至驚蟄一七四, 小寒二八五, 大寒春分三九六, 雨水九六三, 清明立夏四一七,
 * 立春八五二, 穀雨小滿五二八, 芒種六三九; 夏至白露九三六, 小暑八二五, 大暑秋分七一四,
 * 立秋二五八, 寒露立冬六九三, 處暑一四七, 霜降小雪五八二, 大雪四七一. */
const JU_TABLE = [
  [1, 7, 4], [2, 8, 5], [3, 9, 6], [8, 5, 2], [9, 6, 3], [1, 7, 4], [3, 9, 6], [4, 1, 7], [5, 2, 8], [4, 1, 7], [5, 2, 8], [6, 3, 9],
  [9, 3, 6], [8, 2, 5], [7, 1, 4], [2, 5, 8], [1, 4, 7], [9, 3, 6], [7, 1, 4], [6, 9, 3], [5, 8, 2], [6, 9, 3], [5, 8, 2], [4, 7, 1],
];
const qmTermCache = new Map();
function qmTermJD(calY, k) {
  const key = calY + ":" + k;
  if (qmTermCache.has(key)) return qmTermCache.get(key);
  const [m, d] = QM_APPROX[k];
  const guess = jdnOf(calY, m, d) - 0.5;
  const v = findTerm((270 + 15 * k) % 360, guess - 20, guess + 20);
  qmTermCache.set(key, v);
  return v;
}
/* the term in force at jdUT */
function qmTermAt(jdUT, calYear) {
  const seq = [];
  for (let y = calYear - 1; y <= calYear + 1; y++) for (let k = 0; k < 24; k++) seq.push({ k, jd: qmTermJD(y, k) });
  seq.sort((a, b) => a.jd - b.jd);
  let cur = seq[0];
  for (const t of seq) { if (t.jd <= jdUT) cur = t; else break; }
  return cur;
}

/* ---------------- palaces, rings, home positions ---------------- */
/* Luo Shu palaces: 1坎N 2坤SW 3震E 4巽SE 5中 6乾NW 7兌W 8艮NE 9離S */
const PALACES = [null,
  { dir: "N", cn: "坎", el: "water" }, { dir: "SW", cn: "坤", el: "earth" }, { dir: "E", cn: "震", el: "wood" },
  { dir: "SE", cn: "巽", el: "wood" }, { dir: "Center", cn: "中", el: "earth" }, { dir: "NW", cn: "乾", el: "metal" },
  { dir: "W", cn: "兌", el: "metal" }, { dir: "NE", cn: "艮", el: "earth" }, { dir: "S", cn: "離", el: "fire" },
];
const RING = [1, 8, 3, 4, 9, 2, 7, 6]; // outer palaces, geographic clockwise N→NE→E→SE→S→SW→W→NW
const EARTH_SEQ = [4, 5, 6, 7, 8, 9, 3, 2, 1]; // 戊己庚辛壬癸丁丙乙 as stem indices

const STARS = {
  peng: { cn: "天蓬", p: "Tian Peng", el: "water", good: false, home: 1, text: "The adventurer: bold, hungry, rule-bending. Superb for stealth, risk and unconventional moves; poor for weddings, contracts and anything that must look respectable." },
  rui: { cn: "天芮", p: "Tian Rui", el: "earth", good: false, home: 2, text: "The scholar-patient: a star of study, teachers and friendship, and equally of illness and slow faults. Learn and befriend under it; do not launch, treat or trade under it." },
  chong: { cn: "天冲", p: "Tian Chong", el: "wood", good: true, home: 3, text: "The vanguard: direct, fast, a touch reckless. Right for urgent action, sport and rescue; wrong for delicate negotiation." },
  fu: { cn: "天輔", p: "Tian Fu", el: "wood", good: true, home: 4, text: "The tutor: the most civilised of the nine, favouring study, exams, culture, travel and anything that grows a person." },
  qin: { cn: "天禽", p: "Tian Qin", el: "earth", good: true, home: 5, text: "The arbiter: central, balanced, dignified. Good for matters needing fairness, authority and steadiness; it travels lodged with Tian Rui." },
  xin: { cn: "天心", p: "Tian Xin", el: "metal", good: true, home: 6, text: "The physician: leadership, strategy, medicine and money sit well under it, the classical star of healers and decision-makers." },
  zhu: { cn: "天柱", p: "Tian Zhu", el: "metal", good: false, home: 7, text: "The pillar: a star of holding, defending and sharp words. Guard and consolidate under it; expansion and speeches turn against you." },
  ren: { cn: "天任", p: "Tian Ren", el: "earth", good: true, home: 8, text: "The steward: patient, load-bearing, trustworthy. Favours gradual matters, farming-pace work, property and anything built to last." },
  ying: { cn: "天英", p: "Tian Ying", el: "fire", good: false, home: 9, text: "The beacon: bright, visible, impulsive. Useful for publicity and performances; hasty for money, contracts and long plans." },
};
const DOORS = {
  open: { cn: "開門", p: "Kai Men", en: "Open Door", el: "metal", good: true, home: 6, texts: [
    "The door of openings: careers, offices, audiences with the powerful, launches. Walk toward it when you need doors, literal or otherwise, to open.",
    "Everything official favours this direction now: applications, interviews, first meetings with authority.",
  ] },
  rest: { cn: "休門", p: "Xiu Men", en: "Rest Door", el: "water", good: true, home: 1, texts: [
    "The door of ease: rest, reconciliation, gentle networking and asking for favours. Nothing forced prospers more than the unforced here.",
    "Soft matters flow this way now: recovery, courtship, quiet talks, renewing an old tie.",
  ] },
  life: { cn: "生門", p: "Sheng Men", en: "Life Door", el: "earth", good: true, home: 8, texts: [
    "The door of increase: money, health, building and beginnings. The classical first choice for anything you want to grow.",
    "Seek profit, healing and new ground in this direction, the hour's most nourishing quarter.",
  ] },
  harm: { cn: "傷門", p: "Shang Men", en: "Harm Door", el: "wood", good: false, home: 3, texts: [
    "The door of injury: competition, collections and hunts thrive here, everything else risks a cut. Not the direction for smooth dealings.",
    "Good only for contests and reclaiming what is owed; for ordinary matters this quarter bruises.",
  ] },
  block: { cn: "杜門", p: "Du Men", en: "Block Door", el: "wood", good: false, home: 4, texts: [
    "The door of sealing: hiding, technical work, security and secrets do well, anything needing openness stalls.",
    "A closed quarter: right for going unseen and finishing quiet work, wrong for launches and requests.",
  ] },
  scenery: { cn: "景門", p: "Jing Men", en: "Scenery Door", el: "fire", good: false, home: 9, texts: [
    "The door of display: documents, exams, presentations and celebrations shine here; substance-heavy matters find it all light and no heat.",
    "Bright but thin: use it to be seen, not to settle anything binding.",
  ] },
  death: { cn: "死門", p: "Si Men", en: "Death Door", el: "earth", good: false, home: 2, texts: [
    "The door of endings: classically reserved for funerals, closures and final paperwork. Start nothing toward it this hour.",
    "A direction for burying what is finished, and for nothing that hopes to live.",
  ] },
  fright: { cn: "驚門", p: "Jing Men", en: "Fright Door", el: "metal", good: false, home: 7, texts: [
    "The door of alarms: disputes, lawsuits and persuasion sharpen here, and so does anxiety. Debaters use it; everyone else avoids it.",
    "Words cut both ways in this quarter, argue here only if arguing is the goal.",
  ] },
};
const DEITIES = {
  zhifu: { cn: "值符", p: "Zhi Fu", en: "Chief Protector", good: true, text: "the commander's own protection, the strongest backing on the plate" },
  tengshe: { cn: "螣蛇", p: "Teng She", en: "Coiling Snake", good: false, text: "twists, illusions and entanglement, verify twice here" },
  taiyin: { cn: "太陰", p: "Tai Yin", en: "Great Yin", good: true, text: "quiet help, concealment and planning, good for preparation" },
  liuhe: { cn: "六合", p: "Liu He", en: "Six Harmonies", good: true, text: "harmony, partnership and marriage, good for joining" },
  baihu: { cn: "白虎", p: "Bai Hu", en: "White Tiger", good: false, text: "force, accidents and clashes with authority, tread carefully" },
  xuanwu: { cn: "玄武", p: "Xuan Wu", en: "Black Tortoise", good: false, text: "theft, leaks and deception, guard valuables and words" },
  jiudi: { cn: "九地", p: "Jiu Di", en: "Nine Earth", good: true, text: "stability, defence and the long term, good for consolidating" },
  jiutian: { cn: "九天", p: "Jiu Tian", en: "Nine Heaven", good: true, text: "ambition, expansion and publicity, good for going high and loud" },
};
const HOME_STAR = [null, "peng", "rui", "chong", "fu", "qin", "xin", "zhu", "ren", "ying"];
const HOME_DOOR = [null, "rest", "death", "harm", "block", null, "open", "fright", "life", "scenery"];
const STAR_RING = ["peng", "ren", "chong", "fu", "ying", "rui", "zhu", "xin"]; // homes 1,8,3,4,9,2,7,6
const DOOR_RING = ["rest", "life", "harm", "block", "scenery", "death", "fright", "open"]; // 休生傷杜景死驚開
const DEITY_SEQ = ["zhifu", "tengshe", "taiyin", "liuhe", "baihu", "xuanwu", "jiudi", "jiutian"];
const XUN_CN = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];

/* ---------------- plate arrangement (pure; hsi = hour sexagenary index 0-59) ---------------- */
function arrangePlates(ju, yang, hsi) {
  const earth = Array(10).fill(null);   // palace -> earth-plate stem index
  const stemPal = {};                    // stem index -> palace
  for (let n = 0; n < 9; n++) {
    const pal = yang ? ((ju - 1 + n) % 9) + 1 : ((((ju - 1 - n) % 9) + 9) % 9) + 1;
    earth[pal] = EARTH_SEQ[n];
    stemPal[EARTH_SEQ[n]] = pal;
  }
  const xun = Math.floor(hsi / 10);      // 0..5 → 甲子..甲寅
  const hidden = 4 + xun;                // 遁干: 甲子戊 甲戌己 甲申庚 甲午辛 甲辰壬 甲寅癸
  const dutyPal = stemPal[hidden];
  const zhifuStar = HOME_STAR[dutyPal];
  const zhishiDoor = HOME_DOOR[dutyPal === 5 ? 2 : dutyPal];
  const hourStem = hsi % 10;
  const hourStemPal = hourStem === 0 ? dutyPal : stemPal[hourStem]; // 甲 hides behind its xun stem
  const starTarget = hourStemPal === 5 ? 2 : hourStemPal;           // 中宮 lodges in 坤
  /* heaven plate: rotate the star ring so the duty star reaches the hour-stem palace */
  const heavenStar = Array(10).fill(null);
  const zfRingIdx = STAR_RING.indexOf(zhifuStar === "qin" ? "rui" : zhifuStar);
  const tRingIdx = RING.indexOf(starTarget);
  for (let i = 0; i < 8; i++) heavenStar[RING[(tRingIdx + i) % 8]] = STAR_RING[(zfRingIdx + i) % 8];
  /* each star carries the earth stem of its home palace; Tian Rui also carries Tian Qin's */
  const heavenStems = Array(10).fill(null).map(() => []);
  for (const pal of RING) {
    const st = heavenStar[pal];
    heavenStems[pal].push(earth[STARS[st].home]);
    if (st === "rui") heavenStems[pal].push(earth[5]);
  }
  /* doors: the duty door flies from the duty palace by the hours elapsed since the xun head,
   * through all nine palace numbers (a landing on 5 lodges in 2); the rest follow the ring */
  const elapsed = hsi % 10;
  let doorPal = yang ? ((dutyPal - 1 + elapsed) % 9) + 1 : ((((dutyPal - 1 - elapsed) % 9) + 9) % 9) + 1;
  if (doorPal === 5) doorPal = 2;
  const doors = Array(10).fill(null);
  const zsRingIdx = DOOR_RING.indexOf(zhishiDoor);
  const dRingIdx = RING.indexOf(doorPal);
  for (let i = 0; i < 8; i++) doors[RING[(dRingIdx + i) % 8]] = DOOR_RING[(zsRingIdx + i) % 8];
  /* deities: Chief Protector sits with the duty star; yang clockwise, yin counterclockwise */
  const deities = Array(10).fill(null);
  const zfIdx = RING.indexOf(starTarget);
  for (let i = 0; i < 8; i++) deities[yang ? RING[(zfIdx + i) % 8] : RING[(zfIdx - i + 8) % 8]] = DEITY_SEQ[i];
  return { earth, heavenStar, heavenStems, doors, deities, dutyPal, zhifuStar, zhishiDoor, starTarget, doorPal, xun, hidden };
}

/* ---------------- full cast at a moment ---------------- */
function castQimen(date = new Date(), question = "") {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate(), hh = date.getHours(), min = date.getMinutes();
  const tz = -date.getTimezoneOffset() / 60;
  const jdUT = civilToJD(y, m, d, hh, min, tz);
  const dci = ((jdnOf(y, m, d) + (hh >= 23 ? 1 : 0) + DAY_OFFSET) % 60 + 60) % 60;
  const hourIdx = Math.floor(((hh + 1) % 24) / 2);
  const hourStem = (FIVE_RATS[dci % 10] + hourIdx) % 10;
  const hsi = sexIndex(hourStem, hourIdx);
  const term = qmTermAt(jdUT, y);
  const yang = term.k < 12;
  const futouBranch = (dci - (dci % 5)) % 12;
  const yuan = [0, 6, 3, 9].includes(futouBranch) ? 0 : [2, 8, 5, 11].includes(futouBranch) ? 1 : 2;
  const ju = JU_TABLE[term.k][yuan];
  const plates = arrangePlates(ju, yang, hsi);
  return {
    ts: date.getTime(), question: question || "",
    day: { stem: dci % 10, branch: dci % 12 }, hour: { stem: hourStem, branch: hourIdx },
    termK: term.k, yang, yuan, ju,
    untilHour: (2 * hourIdx + 1) % 24,
    ...plates,
  };
}

/* ---------------- overlays: void, horse, fu/fan-yin, door-palace relation, asker/matter ----------------
 * Computed at render time from a stored cast (PRD: recompute derived data, never persist it). */
const BRANCH_PAL = [1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6]; // 子1 丑寅8 卯3 辰巳4 午9 未申2 酉7 戌亥6
const OPP_PAL = { 1: 9, 9: 1, 2: 8, 8: 2, 3: 7, 7: 3, 4: 6, 6: 4 };
/* 六儀擊刑: the palace each yi stem strikes when the heaven-plate stem lands there.
 * Verified 4 sources (qimenpai/sohu/nwet/vocus), anchor 煙波釣叟歌 "甲子值符愁向東". */
const JIXING_PAL = { 4: 3, 5: 2, 6: 8, 7: 9, 8: 4, 9: 4 }; // 戊→震3 己→坤2 庚→艮8 辛→離9 壬→巽4 癸→巽4
/* 奇儀入墓: the palace entombing each heaven-plate stem. Yin-retrograde school,
 * verified 3+ sources per row (qimenpai/svnthv/163). School choice: 乙 ships its unanimous
 * tomb 乾6 (戌); the additional 坤2 tomb some schools give 乙 is deliberately not flagged. */
const RUMU_PAL = { 1: 6, 2: 6, 3: 8, 4: 6, 5: 8, 6: 8, 7: 4, 8: 4, 9: 2 };
/* 十干剋應: named heaven-over-earth stem patterns. Verified 2026-07 across 5+ sources
 * (daoisms.com.cn, qimenpai ×2, sohu ×2, kpfans, yixiansheng); 烟波釣叟歌 anchors the
 * 返首/跌穴 and 入熒/入白 orderings. Key = "heavenStem,earthStem" (stem indices 0-9).
 * Excluded (unresolved cross-source name conflict): 丙+丁. 甲 never appears raw (rides its 遁 stem). */
const STEM_PAIRS = {
  "4,2": { name: "Dragon Returns to its Head", cn: "青龍返首", good: true, fragile: true },
  "2,4": { name: "Bird Falls into the Cave", cn: "飛鳥跌穴", good: true },
  "3,3": { name: "Star-Charm in Great Yin", cn: "星奇入太陰", good: true },
  "3,8": { name: "Five Spirits Unite", cn: "五神互合", good: true },
  "1,2": { name: "Fortune Flows", cn: "奇儀順遂", good: true, conditional: true },
  "4,1": { name: "Dragon Meets its Spirit", cn: "青龍合靈", good: true, followsDoor: true },
  "1,7": { name: "Dragon Flees", cn: "青龍逃走", good: false },
  "7,1": { name: "White Tiger Runs Wild", cn: "白虎猖狂", good: false },
  "2,6": { name: "Fire Enters Metal", cn: "熒入太白", good: false },
  "6,2": { name: "Metal Enters Fire", cn: "太白入熒", good: false },
  "3,9": { name: "Scarlet Bird Drowns", cn: "朱雀投江", good: false },
  "9,3": { name: "Snake Writhes", cn: "螣蛇夭矯", good: false },
  "6,6": { name: "Twin Metal Clash", cn: "太白同宮", good: false },
  "9,9": { name: "Heaven's Net Closes", cn: "天網四張", good: false },
  "8,8": { name: "Snake in the Net", cn: "蛇入地羅", good: false },
  "5,5": { name: "Demon at the Earth Gate", cn: "地戶逢鬼", good: false },
  "1,1": { name: "Sun-Charm Locked", cn: "日奇伏吟", good: false },
  "2,2": { name: "Moon-Charm Defied", cn: "月奇悖師", good: false },
};
/* door element vs palace element; effect consensus: pressed worst, restrained weak, supported best */
function doorRelation(doorKey, pal) {
  const dEl = DOORS[doorKey].el, pEl = PALACES[pal].el;
  if (dEl === pEl) return "matched";
  if (CONTROLS[dEl] === pEl) return "pressed";     // 門迫: good doors lose power, bad doors worsen
  if (CONTROLS[pEl] === dEl) return "restrained";  // 門制: the door is held down
  if (PRODUCES[pEl] === dEl) return "supported";   // 宮生門: the door is fed
  return "draining";                                // 門生宮: the door spends itself
}
function plateOverlays(o) {
  const hsi = sexIndex(o.hour.stem, o.hour.branch);
  const voidBr = voidBranches(hsi);                          // 時空: the hour-xun void
  const voidPals = [...new Set(voidBr.map((b) => BRANCH_PAL[b]))];
  const horseBranch = SKYHORSE[TRIO_OF(o.hour.branch).join(",")];
  const horsePal = BRANCH_PAL[horseBranch];
  const fuyin = o.starTarget === o.dutyPal;                  // stars at home: hold
  const fanyin = OPP_PAL[o.starTarget] === o.dutyPal;        // stars opposite: reversal
  const doorRel = {};
  for (const pal of RING) doorRel[pal] = doorRelation(o.doors[pal], pal);
  /* 擊刑 / 入墓: heaven-plate stems striking or entombed in their landing palace */
  const jixing = [], rumu = [], patterns = [];
  for (const pal of RING) {
    for (const st of o.heavenStems[pal]) {
      if (JIXING_PAL[st] === pal) jixing.push({ pal, stem: st });
      if (RUMU_PAL[st] === pal) rumu.push({ pal, stem: st });
      const pk = `${st},${o.earth[pal]}`;
      if (STEM_PAIRS[pk]) patterns.push({ pal, key: pk, ...STEM_PAIRS[pk] });
    }
  }
  /* the asker (day stem) and the matter (hour stem) on the heaven plate; 甲 rides its xun stem */
  const seek = (stem) => {
    const st = stem === 0 ? 4 + o.xun : stem;
    return RING.find((pal) => o.heavenStems[pal].includes(st)) || null;
  };
  return { voidBr, voidPals, horseBranch, horsePal, fuyin, fanyin, doorRel, jixing, rumu, patterns, dayPal: seek(o.day.stem), hourPal: seek(o.hour.stem) };
}
/* relation of the matter's palace to the asker's palace, Ti/Yong style */
function askerMatterRel(dayPal, hourPal) {
  if (!dayPal || !hourPal) return null;
  if (dayPal === hourPal) return "together";
  const a = PALACES[dayPal].el, m = PALACES[hourPal].el;
  if (a === m) return "peer";
  if (PRODUCES[m] === a) return "supports";
  if (PRODUCES[a] === m) return "drains";
  if (CONTROLS[a] === m) return "command";
  return "presses";
}

export { QM_TERMS, JU_TABLE, PALACES, RING, EARTH_SEQ, STARS, DOORS, DEITIES, HOME_STAR, HOME_DOOR, STAR_RING, DOOR_RING, DEITY_SEQ, XUN_CN, BRANCH_PAL, OPP_PAL, JIXING_PAL, RUMU_PAL, STEM_PAIRS, qmTermJD, qmTermAt, arrangePlates, castQimen, doorRelation, plateOverlays, askerMatterRel };

/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
/* ---------------- LIFE GUA (8 Mansions 風水命卦) ---------------- */
const GUA_DATA = {
  1: { name: "Kan", cn: "坎", el: "water", group: "East", dirs: { sq: "SE", ty: "E", yn: "S", fw: "N", hh: "W", wg: "NE", ls: "NW", jm: "SW" } },
  2: { name: "Kun", cn: "坤", el: "earth", group: "West", dirs: { sq: "NE", ty: "W", yn: "NW", fw: "SW", hh: "E", wg: "SE", ls: "S", jm: "N" } },
  3: { name: "Zhen", cn: "震", el: "wood", group: "East", dirs: { sq: "S", ty: "N", yn: "SE", fw: "E", hh: "SW", wg: "NW", ls: "NE", jm: "W" } },
  4: { name: "Xun", cn: "巽", el: "wood", group: "East", dirs: { sq: "N", ty: "S", yn: "E", fw: "SE", hh: "NW", wg: "SW", ls: "W", jm: "NE" } },
  6: { name: "Qian", cn: "乾", el: "metal", group: "West", dirs: { sq: "W", ty: "NE", yn: "SW", fw: "NW", hh: "SE", wg: "E", ls: "N", jm: "S" } },
  7: { name: "Dui", cn: "兌", el: "metal", group: "West", dirs: { sq: "NW", ty: "SW", yn: "NE", fw: "W", hh: "N", wg: "S", ls: "SE", jm: "E" } },
  8: { name: "Gen", cn: "艮", el: "earth", group: "West", dirs: { sq: "SW", ty: "NW", yn: "W", fw: "NE", hh: "S", wg: "N", ls: "E", jm: "SE" } },
  9: { name: "Li", cn: "離", el: "fire", group: "East", dirs: { sq: "E", ty: "SE", yn: "N", fw: "S", hh: "NE", wg: "W", ls: "SW", jm: "NW" } },
};
const DIR_TYPES = [
  { k: "sq", name: "Sheng Qi 生氣", en: "Life-Generating", good: true, text: "Your power direction: vitality, growth, opportunity. Face it at your desk, use it for important meetings and main doors." },
  { k: "ty", name: "Tian Yi 天醫", en: "Heavenly Doctor", good: true, text: "The healing direction: health, recovery, reliable helpers. Face it when unwell; good for the bedroom or kitchen." },
  { k: "yn", name: "Yan Nian 延年", en: "Longevity", good: true, text: "The relationship direction: harmony, partnerships, durability. Supports marriages, negotiations and long collaborations." },
  { k: "fw", name: "Fu Wei 伏位", en: "Stability", good: true, text: "Your steady direction: clarity, calm, incremental progress. Good for sleeping (head pointing here) and daily focus." },
  { k: "hh", name: "Huo Hai 禍害", en: "Mishaps", good: false, text: "Small persistent troubles: arguments, fatigue, minor losses. Avoid facing it for long stretches of the day." },
  { k: "wg", name: "Wu Gui 五鬼", en: "Five Ghosts", good: false, text: "Betrayals, disputes, theft and fire in the classical texts. Keep doors, beds and stoves away from this direction." },
  { k: "ls", name: "Liu Sha 六煞", en: "Six Killings", good: false, text: "Scandal and relationship damage: the direction of self-inflicted entanglements. Avoid for important dealings." },
  { k: "jm", name: "Jue Ming 絕命", en: "Life-Threatening", good: false, text: "The worst direction: total-loss energy. Never face it for surgery dates, contract signings or the bed if avoidable." },
];
function lifeGua(baziYear, gender) {
  let s = baziYear; let n = 0;
  String(s).split("").forEach((d) => (n += +d));
  while (n > 9) n = String(n).split("").reduce((a, b) => a + +b, 0);
  let g = gender === "M" ? 11 - n : 4 + n;
  while (g > 9) g = String(g).split("").reduce((a, b) => a + +b, 0);
  if (g === 5) g = gender === "M" ? 2 : 8;
  if (g === 0) g = 9;
  return g;
}

export { GUA_DATA, DIR_TYPES, lifeGua };

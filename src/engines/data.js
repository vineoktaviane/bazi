/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
/* ---------------- CORE DATA ---------------- */
const STEMS = [
  { p: "Jia", cn: "甲", el: "wood", yang: true },
  { p: "Yi", cn: "乙", el: "wood", yang: false },
  { p: "Bing", cn: "丙", el: "fire", yang: true },
  { p: "Ding", cn: "丁", el: "fire", yang: false },
  { p: "Wu", cn: "戊", el: "earth", yang: true },
  { p: "Ji", cn: "己", el: "earth", yang: false },
  { p: "Geng", cn: "庚", el: "metal", yang: true },
  { p: "Xin", cn: "辛", el: "metal", yang: false },
  { p: "Ren", cn: "壬", el: "water", yang: true },
  { p: "Gui", cn: "癸", el: "water", yang: false },
];
const BRANCHES = [
  { p: "Zi", cn: "子", animal: "Rat", el: "water", hidden: [9] },
  { p: "Chou", cn: "丑", animal: "Ox", el: "earth", hidden: [5, 7, 9] },
  { p: "Yin", cn: "寅", animal: "Tiger", el: "wood", hidden: [0, 2, 4] },
  { p: "Mao", cn: "卯", animal: "Rabbit", el: "wood", hidden: [1] },
  { p: "Chen", cn: "辰", animal: "Dragon", el: "earth", hidden: [4, 1, 9] },
  { p: "Si", cn: "巳", animal: "Snake", el: "fire", hidden: [2, 6, 4] },
  { p: "Wu", cn: "午", animal: "Horse", el: "fire", hidden: [3, 5] },
  { p: "Wei", cn: "未", animal: "Goat", el: "earth", hidden: [5, 3, 1] },
  { p: "Shen", cn: "申", animal: "Monkey", el: "metal", hidden: [6, 8, 4] },
  { p: "You", cn: "酉", animal: "Rooster", el: "metal", hidden: [7] },
  { p: "Xu", cn: "戌", animal: "Dog", el: "earth", hidden: [4, 7, 3] },
  { p: "Hai", cn: "亥", animal: "Pig", el: "water", hidden: [8, 0] },
];
const EL_COLOR = { wood: "#6E9B6B", fire: "#C75B45", earth: "#C09A52", metal: "#C2BBAA", water: "#6B94B8" };
const EL_CN = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const EL_NAME = { wood: "Wood", fire: "Fire", earth: "Earth", metal: "Metal", water: "Water" };

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export { STEMS, BRANCHES, EL_COLOR, EL_CN, EL_NAME, MONTH_NAMES };

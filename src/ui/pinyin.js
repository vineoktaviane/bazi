/* UI-only pinyin layer.
 *
 * Maps every Han character rendered anywhere in the app to tone-marked Hanyu
 * Pinyin, so each Chinese glyph can be shown with a romanized reading.
 *
 * This lives in src/ui on purpose: the engines and content banks are ported
 * verbatim and must never be hand-edited. This module reads their `.cn` output
 * at the render site and derives the reading here, leaving the data untouched.
 *
 * Readings are chosen for the BaZi / Zi Wei / Yijing context, e.g. the King
 * Wen hexagram 否 is "pǐ" (not "fǒu"), the mansion 參 is "shēn" (not "cān"),
 * 相 in 天相 is "xiàng", 曲 in 武曲 is "qū", 畜 in 小畜 is "xù".
 */

export const PY = {
  // five elements, na-yin, growth-stage & officer vocabulary
  月: "yuè", 令: "lìng", 沖: "chōng", 害: "hài", 刑: "xíng", 合: "hé",
  伏: "fú", 納: "nà", 音: "yīn", 海: "hǎi", 中: "zhōng", 金: "jīn",
  爐: "lú", 火: "huǒ", 大: "dà", 林: "lín", 木: "mù", 路: "lù",
  旁: "páng", 土: "tǔ", 劍: "jiàn", 鋒: "fēng", 山: "shān", 頭: "tóu",
  澗: "jiàn", 下: "xià", 水: "shuǐ", 城: "chéng", 白: "bái", 蠟: "là",
  楊: "yáng", 柳: "liǔ", 泉: "quán", 屋: "wū", 上: "shàng", 霹: "pī",
  靂: "lì", 松: "sōng", 柏: "bǎi", 長: "cháng", 流: "liú", 沙: "shā",
  平: "píng", 地: "dì", 壁: "bì", 箔: "bó", 覆: "fù", 燈: "dēng",
  天: "tiān", 河: "hé", 驛: "yì", 釵: "chāi", 釧: "chuàn", 桑: "sāng",
  柘: "zhè", 溪: "xī", 石: "shí", 榴: "liú", 生: "shēng",

  // twelve growth stages + counters
  十: "shí", 二: "èr", 宮: "gōng", 沐: "mù", 浴: "yù", 冠: "guān",
  帶: "dài", 臨: "lín", 官: "guān", 帝: "dì", 旺: "wàng", 衰: "shuāi",
  病: "bìng", 死: "sǐ", 墓: "mù", 絕: "jué", 胎: "tāi", 養: "yǎng",
  空: "kōng", 亡: "wáng",

  // twelve day officers
  建: "jiàn", 除: "chú", 神: "shén", 滿: "mǎn", 定: "dìng", 執: "zhí",
  破: "pò", 危: "wēi", 成: "chéng", 收: "shōu", 開: "kāi", 閉: "bì",

  // symbolic stars & shen sha
  煞: "shà", 祿: "lù", 羊: "yáng", 刃: "rèn", 輿: "yú", 德: "dé",
  八: "bā", 宿: "xiù",

  // 28 lunar mansions
  角: "jiǎo", 亢: "kàng", 氐: "dī", 房: "fáng", 心: "xīn", 尾: "wěi",
  箕: "jī", 斗: "dǒu", 牛: "niú", 女: "nǚ", 虛: "xū", 室: "shì",
  奎: "kuí", 婁: "lóu", 胃: "wèi", 昴: "mǎo", 畢: "bì", 觜: "zī",
  參: "shēn", 井: "jǐng", 鬼: "guǐ", 星: "xīng", 張: "zhāng",
  翼: "yì", 軫: "zhěn",

  // ten gods
  比: "bǐ", 肩: "jiān", 劫: "jié", 財: "cái", 食: "shí", 傷: "shāng",
  偏: "piān", 正: "zhèng", 七: "qī", 殺: "shā", 印: "yìn", 干: "gān",

  // question-category & misc glyphs
  吉: "jí", 慎: "shèn", 凶: "xiōng", 情: "qíng", 家: "jiā", 職: "zhí",
  友: "yǒu",

  // ten heavenly stems
  甲: "jiǎ", 乙: "yǐ", 丙: "bǐng", 丁: "dīng", 戊: "wù", 己: "jǐ",
  庚: "gēng", 辛: "xīn", 壬: "rén", 癸: "guǐ",

  // twelve earthly branches
  子: "zǐ", 丑: "chǒu", 寅: "yín", 卯: "mǎo", 辰: "chén", 巳: "sì",
  午: "wǔ", 未: "wèi", 申: "shēn", 酉: "yǒu", 戌: "xū", 亥: "hài",

  // eight trigrams, 8-mansions directions
  風: "fēng", 命: "mìng", 卦: "guà", 坎: "kǎn", 坤: "kūn", 震: "zhèn",
  巽: "xùn", 乾: "qián", 兌: "duì", 艮: "gèn", 離: "lí", 氣: "qì",
  醫: "yī", 延: "yán", 年: "nián", 位: "wèi", 禍: "huò", 五: "wǔ",
  六: "liù",

  // King Wen 64 hexagram names
  履: "lǚ", 同: "tóng", 人: "rén", 無: "wú", 妄: "wàng", 姤: "gòu",
  訟: "sòng", 遯: "dùn", 否: "pǐ", 夬: "guài", 革: "gé", 隨: "suí",
  過: "guò", 困: "kùn", 咸: "xián", 萃: "cuì", 有: "yǒu", 睽: "kuí",
  噬: "shì", 嗑: "kè", 鼎: "dǐng", 濟: "jì", 旅: "lǚ", 晉: "jìn",
  壯: "zhuàng", 歸: "guī", 妹: "mèi", 豐: "fēng", 恆: "héng", 解: "jiě",
  小: "xiǎo", 豫: "yù", 畜: "xù", 孚: "fú", 益: "yì", 渙: "huàn",
  漸: "jiàn", 觀: "guān", 需: "xū", 節: "jié", 既: "jì", 屯: "zhūn",
  蹇: "jiǎn", 損: "sǔn", 賁: "bì", 頤: "yí", 蠱: "gǔ", 蒙: "méng",
  剝: "bō", 泰: "tài", 明: "míng", 夷: "yí", 復: "fù", 升: "shēng",
  師: "shī", 謙: "qiān",

  // symbolic-star & annual vocabulary
  桃: "táo", 馬: "mǎ", 文: "wén", 貴: "guì", 昌: "chāng", 花: "huā",
  將: "jiàng", 華: "huá", 蓋: "gài", 災: "zāi", 紅: "hóng", 鸞: "luán",
  喜: "xǐ", 太: "tài", 歲: "suì", 符: "fú",

  // Zi Wei Dou Shu palaces
  兄: "xiōng", 弟: "dì", 夫: "fū", 妻: "qī", 帛: "bó", 疾: "jí",
  厄: "è", 遷: "qiān", 移: "yí", 交: "jiāo", 田: "tián", 宅: "zhái",
  福: "fú", 父: "fù", 母: "mǔ",

  // Zi Wei Dou Shu stars & four transformations
  紫: "zǐ", 微: "wēi", 機: "jī", 陽: "yáng", 武: "wǔ", 曲: "qū",
  廉: "lián", 貞: "zhēn", 府: "fǔ", 陰: "yīn", 貪: "tān", 狼: "láng",
  巨: "jù", 門: "mén", 相: "xiàng", 梁: "liáng", 軍: "jūn", 左: "zuǒ",
  輔: "fǔ", 右: "yòu", 弼: "bì", 權: "quán", 科: "kē", 忌: "jì",

  // tab seals & section markers
  卜: "bǔ", 體: "tǐ", 用: "yòng", 錄: "lù", 日: "rì", 時: "shí",
  柱: "zhù", 行: "xíng", 強: "qiáng", 衡: "héng", 方: "fāng",
  運: "yùn", 讀: "dú", 局: "jú", 身: "shēn", 學: "xué", 支: "zhī",
  藏: "cáng", 問: "wèn", 典: "diǎn", 今: "jīn", 檔: "dàng", 新: "xīn",
};

const isHan = (ch) => ch >= "一" && ch <= "鿿";

/* Space-joined pinyin for every Han character in `s`; non-Han is dropped.
 * py("海中金") -> "hǎi zhōng jīn"; py("Wood 木") -> "mù"; py("NE") -> "". */
export function py(s) {
  if (s == null) return "";
  const out = [];
  for (const ch of String(s)) if (isHan(ch)) out.push(PY[ch] || ch);
  return out.join(" ");
}

/* Inline form for glyphs sitting inside a sentence: "月令 (yuè lìng)".
 * Returns the original string unchanged when it contains no Han. */
export function cnpy(s) {
  const p = py(s);
  return p ? `${s} (${p})` : String(s == null ? "" : s);
}

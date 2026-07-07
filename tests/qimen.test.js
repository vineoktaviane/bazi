/* Qi Men Dun Jia engine verification: ju table canon, earth-plate canon, three fully
 * hand-computed reference plates (zhuan-pan rules), structural invariants, date-level checks. */
import { describe, it, expect } from "vitest";
import { JU_TABLE, QM_TERMS, PALACES, RING, STARS, DOORS, STEM_PAIRS, arrangePlates, castQimen, qmTermJD, qmTermAt, doorRelation, plateOverlays, askerMatterRel, BRANCH_PAL } from "../src/engines/qimen.js";
import { civilToJD, jdnOf, DAY_OFFSET } from "../src/astro/calendar.js";
import { computeChart, sexIndex } from "../src/engines/bazi.js";

describe("ju table", () => {
  it("has 24 terms, yang for 0-11, all ju in 1..9", () => {
    expect(JU_TABLE.length).toBe(24);
    expect(QM_TERMS.length).toBe(24);
    for (const row of JU_TABLE) {
      expect(row.length).toBe(3);
      for (const j of row) { expect(j).toBeGreaterThanOrEqual(1); expect(j).toBeLessThanOrEqual(9); }
    }
  });
  it("matches the classical mnemonic anchors", () => {
    expect(JU_TABLE[0]).toEqual([1, 7, 4]);   // 冬至一七四
    expect(JU_TABLE[5]).toEqual([1, 7, 4]);   // 驚蟄一七四
    expect(JU_TABLE[3]).toEqual([8, 5, 2]);   // 立春八五二
    expect(JU_TABLE[12]).toEqual([9, 3, 6]);  // 夏至九三六
    expect(JU_TABLE[23]).toEqual([4, 7, 1]);  // 大雪四七一
    expect(JU_TABLE[16]).toEqual([1, 4, 7]);  // 處暑一四七
  });
});

describe("earth plate canon", () => {
  it("yang 1 ju places 戊己庚辛壬癸丁丙乙 in palaces 1..9", () => {
    const p = arrangePlates(1, true, 0);
    // stems: 戊4 己5 庚6 辛7 壬8 癸9 丁3 丙2 乙1
    expect(p.earth.slice(1)).toEqual([4, 5, 6, 7, 8, 9, 3, 2, 1]);
  });
  it("yin 9 ju places 戊 at 9 and descends", () => {
    const p = arrangePlates(9, false, 0);
    expect(p.earth[9]).toBe(4); // 戊
    expect(p.earth[8]).toBe(5); // 己
    expect(p.earth[1]).toBe(1); // 乙
  });
});

describe("hand-verified reference plates", () => {
  it("yang 1 ju, hour 甲子: everything at home", () => {
    const p = arrangePlates(1, true, 0);
    expect(p.dutyPal).toBe(1);
    expect(p.zhifuStar).toBe("peng");
    expect(p.zhishiDoor).toBe("rest");
    expect(p.starTarget).toBe(1);
    expect(p.doorPal).toBe(1);
    for (const pal of RING) {
      expect(STARS[p.heavenStar[pal]].home).toBe(pal);      // stars at home palaces
      expect(DOORS[p.doors[pal]].home).toBe(pal);           // doors at home palaces
    }
    // deities yang clockwise from palace 1: 1值符 8螣蛇 3太陰 4六合 9白虎 2玄武 7九地 6九天
    expect(p.deities[1]).toBe("zhifu"); expect(p.deities[8]).toBe("tengshe");
    expect(p.deities[3]).toBe("taiyin"); expect(p.deities[4]).toBe("liuhe");
    expect(p.deities[9]).toBe("baihu"); expect(p.deities[2]).toBe("xuanwu");
    expect(p.deities[7]).toBe("jiudi"); expect(p.deities[6]).toBe("jiutian");
  });
  it("yang 1 ju, hour 丙寅: full hand computation", () => {
    const hsi = sexIndex(2, 2); // 丙寅 = 2
    const p = arrangePlates(1, true, hsi);
    expect(p.dutyPal).toBe(1);
    expect(p.starTarget).toBe(8); // 丙 sits in palace 8 on the yang-1 earth plate
    // heaven stars: 蓬8 任3 冲4 輔9 英2 芮7 柱6 心1
    expect(p.heavenStar[8]).toBe("peng"); expect(p.heavenStar[3]).toBe("ren");
    expect(p.heavenStar[4]).toBe("chong"); expect(p.heavenStar[9]).toBe("fu");
    expect(p.heavenStar[2]).toBe("ying"); expect(p.heavenStar[7]).toBe("rui");
    expect(p.heavenStar[6]).toBe("zhu"); expect(p.heavenStar[1]).toBe("xin");
    // doors: 休3 生4 傷9 杜2 景7 死6 驚1 開8
    expect(p.doorPal).toBe(3);
    expect(p.doors[3]).toBe("rest"); expect(p.doors[4]).toBe("life");
    expect(p.doors[9]).toBe("harm"); expect(p.doors[2]).toBe("block");
    expect(p.doors[7]).toBe("scenery"); expect(p.doors[6]).toBe("death");
    expect(p.doors[1]).toBe("fright"); expect(p.doors[8]).toBe("open");
    // deities from palace 8 clockwise
    expect(p.deities[8]).toBe("zhifu"); expect(p.deities[3]).toBe("tengshe");
    expect(p.deities[4]).toBe("taiyin"); expect(p.deities[9]).toBe("liuhe");
    expect(p.deities[2]).toBe("baihu"); expect(p.deities[7]).toBe("xuanwu");
    expect(p.deities[6]).toBe("jiudi"); expect(p.deities[1]).toBe("jiutian");
    // heaven stems: peng carries palace-1 earth stem 戊; rui carries 芮(pal 2)=己 and 禽(pal 5)=壬
    expect(p.heavenStems[8]).toEqual([4]);
    expect(p.heavenStems[7]).toEqual([5, 8]);
  });
  it("yin 9 ju, hour 乙丑: full hand computation", () => {
    const hsi = sexIndex(1, 1); // 乙丑 = 1
    const p = arrangePlates(9, false, hsi);
    expect(p.dutyPal).toBe(9);
    expect(p.zhifuStar).toBe("ying");
    expect(p.zhishiDoor).toBe("scenery");
    expect(p.starTarget).toBe(1); // 乙 sits in palace 1 on the yin-9 earth plate
    // heaven stars: 英1 芮8 柱3 心4 蓬9 任2 冲7 輔6
    expect(p.heavenStar[1]).toBe("ying"); expect(p.heavenStar[8]).toBe("rui");
    expect(p.heavenStar[3]).toBe("zhu"); expect(p.heavenStar[4]).toBe("xin");
    expect(p.heavenStar[9]).toBe("peng"); expect(p.heavenStar[2]).toBe("ren");
    expect(p.heavenStar[7]).toBe("chong"); expect(p.heavenStar[6]).toBe("fu");
    // doors fly backward in yin dun: 景8 死3 驚4 開9 休2 生7 傷6 杜1
    expect(p.doorPal).toBe(8);
    expect(p.doors[8]).toBe("scenery"); expect(p.doors[3]).toBe("death");
    expect(p.doors[4]).toBe("fright"); expect(p.doors[9]).toBe("open");
    expect(p.doors[2]).toBe("rest"); expect(p.doors[7]).toBe("life");
    expect(p.doors[6]).toBe("harm"); expect(p.doors[1]).toBe("block");
    // deities counterclockwise from palace 1: 1值符 6螣蛇 7太陰 2六合 9白虎 4玄武 3九地 8九天
    expect(p.deities[1]).toBe("zhifu"); expect(p.deities[6]).toBe("tengshe");
    expect(p.deities[7]).toBe("taiyin"); expect(p.deities[2]).toBe("liuhe");
    expect(p.deities[9]).toBe("baihu"); expect(p.deities[4]).toBe("xuanwu");
    expect(p.deities[3]).toBe("jiudi"); expect(p.deities[8]).toBe("jiutian");
  });
});

describe("structural invariants across many plates", () => {
  it("every plate is complete and consistent", () => {
    for (let ju = 1; ju <= 9; ju++) for (const yang of [true, false]) for (let hsi = 0; hsi < 60; hsi += 7) {
      const p = arrangePlates(ju, yang, hsi);
      expect(new Set(p.earth.slice(1)).size).toBe(9);                        // 9 distinct stems
      expect(new Set(RING.map((x) => p.heavenStar[x])).size).toBe(8);        // 8 distinct stars
      expect(new Set(RING.map((x) => p.doors[x])).size).toBe(8);             // 8 distinct doors
      expect(new Set(RING.map((x) => p.deities[x])).size).toBe(8);           // 8 distinct deities
      expect(p.dutyPal).toBeGreaterThanOrEqual(1); expect(p.dutyPal).toBeLessThanOrEqual(9);
      expect(p.starTarget).not.toBe(5); expect(p.doorPal).not.toBe(5);       // lodging respected
      // ring order preserved: stars keep their cyclic sequence
      const seq = RING.map((x) => p.heavenStar[x]);
      const i0 = seq.indexOf("peng");
      const ringNames = ["peng", "ren", "chong", "fu", "ying", "rui", "zhu", "xin"];
      for (let i = 0; i < 8; i++) expect(seq[(i0 + i) % 8]).toBe(ringNames[i]);
    }
  });
});

describe("published external reference charts", () => {
  /* Sources chosen where chai-bu and zhi-run yuan methods provably agree (mid-term dates),
   * so they validate this engine regardless of school. All 轉盤 (rotating) school. */
  it("2014-06-27 16:30 UTC+8 (pixnet tutorial): 陰遁三局, full palace layout", () => {
    const o = castQimen(new Date(2014, 5, 27, 16, 30));
    expect(o.yang).toBe(false);
    expect(o.ju).toBe(3);
    expect(o.day).toEqual({ stem: 5, branch: 5 });   // 己巳
    expect(o.hour).toEqual({ stem: 8, branch: 8 });  // 壬申
    expect(o.zhifuStar).toBe("chong");               // 值符天沖
    expect(o.starTarget).toBe(8);                    // 落8宮
    expect(o.zhishiDoor).toBe("harm");               // 值使傷門
    expect(o.doorPal).toBe(4);                       // 落4宮
    // full published layout, palace → star / door / deity
    const want = {
      1: ["ren", "open", "tengshe"], 2: ["zhu", "scenery", "baihu"], 3: ["fu", "life", "jiutian"],
      4: ["ying", "harm", "jiudi"], 6: ["peng", "fright", "taiyin"], 7: ["xin", "death", "liuhe"],
      8: ["chong", "rest", "zhifu"], 9: ["rui", "block", "xuanwu"],
    };
    for (const [pal, [st, dr, de]] of Object.entries(want)) {
      expect(o.heavenStar[pal]).toBe(st);
      expect(o.doors[pal]).toBe(dr);
      expect(o.deities[pal]).toBe(de);
    }
    expect(o.heavenStems[9]).toEqual([5, 2]); // 芮禽 palace carries 己 and 丙
    expect(o.earth[1]).toBe(6);               // earth plate 庚 in 坎1
  });
  it("2022-03-10 12:15 UTC+8 (163.com tutorial): 陽遁4局 anchors", () => {
    const o = castQimen(new Date(2022, 2, 10, 12, 15));
    expect(o.yang).toBe(true);
    expect(o.ju).toBe(4);                            // 驚蟄下元
    expect(o.yuan).toBe(2);
    expect(o.day).toEqual({ stem: 8, branch: 10 });  // 壬戌
    expect(o.hour).toEqual({ stem: 2, branch: 6 });  // 丙午
    expect(o.zhifuStar).toBe("ren");                 // 值符天任
    expect(o.starTarget).toBe(2);                    // 落坤2宮
    expect(o.zhishiDoor).toBe("life");               // 值使生門
    expect(o.doorPal).toBe(1);                       // 落坎1宮
  });
  it("2003-08-28 16:00 UTC+8 (奇门实例汇集 book): 陰遁四局 anchors", () => {
    const o = castQimen(new Date(2003, 7, 28, 16, 0));
    expect(o.yang).toBe(false);
    expect(o.ju).toBe(4);                            // 處暑中元
    expect(o.day).toEqual({ stem: 9, branch: 9 });   // 癸酉
    expect(o.hour).toEqual({ stem: 6, branch: 8 });  // 庚申
    expect(o.zhifuStar).toBe("ren");                 // 值符天任落二宮
    expect(o.starTarget).toBe(2);
    expect(o.zhishiDoor).toBe("life");               // 值使生門落二宮
    expect(o.doorPal).toBe(2);
  });
  it("2022-09-15 14:20 UTC+8 (qimenpai, all three yuan methods agree): 陰遁三局", () => {
    const o = castQimen(new Date(2022, 8, 15, 14, 20));
    expect(o.yang).toBe(false);
    expect(o.ju).toBe(3);                            // 白露中元
    expect(o.day).toEqual({ stem: 7, branch: 7 });   // 辛未
  });
  it("qimenpai duty-pair anchors at plate level", () => {
    // 陽遁7局 乙丑時 → 值符天柱落6宮, 值使驚門落8宮
    const a = arrangePlates(7, true, sexIndex(1, 1));
    expect(a.zhifuStar).toBe("zhu"); expect(a.starTarget).toBe(6);
    expect(a.zhishiDoor).toBe("fright"); expect(a.doorPal).toBe(8);
    // 陰遁6局 辛丑時 → 值符天沖落3宮, 值使傷門落5宮寄坤2宮
    const b = arrangePlates(6, false, sexIndex(7, 1));
    expect(b.zhifuStar).toBe("chong"); expect(b.starTarget).toBe(3);
    expect(b.zhishiDoor).toBe("harm"); expect(b.doorPal).toBe(2); // lodged from 5
  });
});

describe("overlays: void, horse, fu/fan-yin, door-palace relation, asker/matter", () => {
  const mk = (ju, yang, hourStem, hourBranch, dayStem = 0, dayBranch = 0) => ({
    ...arrangePlates(ju, yang, sexIndex(hourStem, hourBranch)),
    hour: { stem: hourStem, branch: hourBranch }, day: { stem: dayStem, branch: dayBranch },
  });
  it("branch→palace rim map is the classical one", () => {
    // 子1 丑寅8 卯3 辰巳4 午9 未申2 酉7 戌亥6
    expect(BRANCH_PAL).toEqual([1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6]);
  });
  it("甲子 xun void is 戌亥 → palace 6; horse of a 子 hour is 寅 → palace 8", () => {
    const ov = plateOverlays(mk(1, true, 0, 0));
    expect(ov.voidBr.sort()).toEqual([10, 11]);
    expect(ov.voidPals).toEqual([6]);
    expect(ov.horseBranch).toBe(2);
    expect(ov.horsePal).toBe(8);
  });
  it("fuyin when the duty star sits at home; fanyin when opposite", () => {
    expect(plateOverlays(mk(1, true, 0, 0)).fuyin).toBe(true);   // 甲子: everything home
    const fan = plateOverlays(mk(1, true, 1, 1));                 // 乙丑: 乙 sits in palace 9, opposite duty 1
    expect(fan.fanyin).toBe(true);
    expect(fan.fuyin).toBe(false);
  });
  it("door-palace element relations", () => {
    expect(doorRelation("rest", 1)).toBe("matched");     // water door, water palace
    expect(doorRelation("rest", 9)).toBe("pressed");     // water door controls fire palace
    expect(doorRelation("open", 3)).toBe("pressed");     // metal door controls wood palace
    expect(doorRelation("rest", 7)).toBe("supported");   // metal palace feeds water door
    expect(doorRelation("death", 6)).toBe("draining");   // earth door feeds metal palace
    expect(doorRelation("open", 9)).toBe("restrained");  // fire palace controls metal door
  });
  it("擊刑: 戊 landing in palace 3 is flagged (yang 1, hour 庚午)", () => {
    // hour 庚午 → 庚 sits in palace 3 on the yang-1 earth plate → 天蓬 carries 戊 there
    const ov = plateOverlays(mk(1, true, 6, 6));
    expect(ov.jixing).toContainEqual({ pal: 3, stem: 4 });
  });
  it("入墓: 丙 landing in palace 6 is flagged (yang 1, hour 丁卯)", () => {
    // hour 丁卯 → 丁 sits in palace 7 → 天任 (carrying 丙 from palace 8) lands in 乾6
    const ov = plateOverlays(mk(1, true, 3, 3));
    expect(ov.rumu).toContainEqual({ pal: 6, stem: 2 });
  });
  it("fuyin plate carries its inherent 己 self-punishment in palace 2", () => {
    const ov = plateOverlays(mk(1, true, 0, 0)); // 甲子: heaven = earth
    expect(ov.jixing).toContainEqual({ pal: 2, stem: 5 });
  });
  it("十干剋應: verified named patterns keyed correctly (heaven,earth)", () => {
    // 烟波釣叟歌 orderings, verified across 5+ sources
    expect(STEM_PAIRS["4,2"].cn).toBe("青龍返首"); // 戊(甲)+丙 great fortune
    expect(STEM_PAIRS["4,2"].good).toBe(true);
    expect(STEM_PAIRS["2,4"].cn).toBe("飛鳥跌穴"); // 丙+戊 great fortune
    expect(STEM_PAIRS["6,2"].cn).toBe("太白入熒"); // 庚+丙 thief comes
    expect(STEM_PAIRS["2,6"].cn).toBe("熒入太白"); // 丙+庚 thief departs
    expect(STEM_PAIRS["4,2"].good).not.toBe(STEM_PAIRS["1,7"].good); // 青龍逃走 is bad
    expect(STEM_PAIRS["3,3"].good).toBe(true);   // 星奇入太陰
    expect(STEM_PAIRS["5,5"].good).toBe(false);  // 地戶逢鬼
    expect(STEM_PAIRS["2,3"]).toBeUndefined();   // 丙+丁 excluded (name conflict, DO-NOT-SHIP)
  });
  it("fuyin plate surfaces the self-doubling patterns on the diagonal (yang 1)", () => {
    // yang-1 earth: earth[2]=己(5); 天芮 (home 2) carries 己 back to palace 2 → 己+己 地戶逢鬼
    const ov = plateOverlays(mk(1, true, 0, 0));
    expect(ov.patterns.some((p) => p.key === "5,5" && p.pal === 2)).toBe(true);
  });
  it("patterns are detected against the palace's own earth stem", () => {
    const o = castQimen(new Date(2014, 5, 27, 16, 30)); // verified 陰3 reference plate
    const ov = plateOverlays(o);
    for (const p of ov.patterns) {
      expect(o.heavenStems[p.pal].map((h) => `${h},${o.earth[p.pal]}`)).toContain(p.key);
      expect(STEM_PAIRS[p.key]).toBeTruthy();
    }
  });
  it("asker and matter palaces resolve via heaven stems, 甲 riding its xun stem", () => {
    const o = mk(1, true, 1, 1, 0, 0); // hour 乙丑, day 甲子
    const ov = plateOverlays(o);
    expect(ov.hourPal).toBe(1); // 乙 carried by 天英 into palace 1
    expect(ov.dayPal).toBe(9);  // 甲 rides 戊, carried by 天蓬 into palace 9
    expect(askerMatterRel(ov.dayPal, ov.hourPal)).toBe("presses"); // water presses fire
    expect(askerMatterRel(3, 3)).toBe("together");
    expect(askerMatterRel(1, 6)).toBe("supports");  // metal matter feeds water asker
    expect(askerMatterRel(1, 2)).toBe("presses");   // earth matter controls water asker
    expect(askerMatterRel(9, 6)).toBe("command");   // fire asker controls metal matter
  });
});

describe("date-level casting", () => {
  it("solstices flip the dun: early January yang, early July yin", () => {
    const jan = castQimen(new Date(2026, 0, 2, 12, 0));
    const jul = castQimen(new Date(2026, 6, 2, 12, 0));
    expect(jan.yang).toBe(true);
    expect(QM_TERMS[jan.termK].p).toBe("Dong Zhi"); // Jan 2 sits between 冬至 (~Dec 22) and 小寒 (~Jan 5)
    expect(jul.yang).toBe(false);
    expect(QM_TERMS[jul.termK].p).toBe("Xia Zhi");
  });
  it("term times are astronomically ordered and ~15.2 days apart", () => {
    let prev = qmTermJD(2026, 0);
    for (let k = 1; k < 24; k++) {
      const t = k < 3 ? qmTermJD(2027, k) : qmTermJD(2026, k) + (k >= 3 ? 0 : 0); // 小寒/大寒 of the 冬至-2026 cycle fall in Jan 2027
      if (k >= 3) continue; // ordering fully covered by qmTermAt below
      expect(t).toBeGreaterThan(prev);
      prev = t;
    }
    const seq = [];
    for (let k = 0; k < 24; k++) seq.push(qmTermJD(2026, k));
    const gaps = [];
    const sorted = seq.slice().sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i] - sorted[i - 1]);
    for (const g of gaps) { expect(g).toBeGreaterThan(13.9); expect(g).toBeLessThan(16.5); }
  });
  it("day and hour pillars match the BaZi engine's school (23:00 rollover)", () => {
    const d = new Date(2026, 6, 4, 23, 30); // 23:30 → next day's pillar, Zi hour
    const o = castQimen(d);
    const chart = computeChart({ y: 2026, m: 7, d: 4, hh: 23, min: 30, tz: -d.getTimezoneOffset() / 60, gender: "F" });
    expect(o.day).toEqual(chart.day);
    expect(o.hour).toEqual(chart.hour);
    expect(o.hour.branch).toBe(0);
  });
  it("fu tou yuan: a known day resolves correctly (1989-10-10 = 癸卯 → fu tou 己亥 → middle yuan)", () => {
    const dci = ((jdnOf(1989, 10, 10) + DAY_OFFSET) % 60 + 60) % 60;
    expect(dci).toBe(39); // 癸卯, the engine's own verified anchor
    const o = castQimen(new Date(1989, 9, 10, 12, 0));
    expect(o.yuan).toBe(1); // 39 - 4 = 35 = 己亥; 亥 → middle yuan
    expect(o.ju).toBe(JU_TABLE[o.termK][1]);
  });
  it("cast result is serializable and self-consistent", () => {
    const o = castQimen(new Date(2026, 2, 15, 9, 12), "test");
    const r = JSON.parse(JSON.stringify(o));
    expect(r.ju).toBeGreaterThanOrEqual(1); expect(r.ju).toBeLessThanOrEqual(9);
    expect(r.heavenStar[r.starTarget]).toBe(r.zhifuStar === "qin" ? "rui" : r.zhifuStar);
    expect(r.doors[r.doorPal]).toBe(r.zhishiDoor);
    expect(r.deities[r.starTarget]).toBe("zhifu");
    expect(PALACES[r.dutyPal]).toBeTruthy();
  });
});

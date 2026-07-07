/*
 * PRD §3 MUST-PASS verification suite.
 * Every engine change must keep these green. Values verified against a real
 * Joey Yap commercial chart (10 Oct 1989, 01:25, UTC+8, female) and public
 * astronomical/calendar facts. DO NOT weaken an assertion to make it pass.
 */
import { describe, it, expect } from "vitest";
import { STEMS, BRANCHES } from "../src/engines/data.js";
import { computeChart, sexIndex, tenGod } from "../src/engines/bazi.js";
import { termJD } from "../src/astro/solar.js";
import { jdToCivil } from "../src/astro/calendar.js";
import { lunarDate } from "../src/astro/lunar.js";
import { zwdsChart } from "../src/engines/zwds.js";
import {
  symbolicStars, growthStage, voidBranches,
  NOBLEMAN, WENCHANG, PEACH, SKYHORSE, LU_STAR,
} from "../src/engines/stars.js";
import { lifeGua, GUA_DATA } from "../src/engines/mansions.js";
import { officerOf, dayPillarOf } from "../src/engines/officers.js";

/** Reference person: 10 Oct 1989, 01:25, UTC+8, female */
const REF = { y: 1989, m: 10, d: 10, hh: 1, min: 25, tz: 8, gender: "F" };

const S = (p) => STEMS[p.stem].p;
const B = (p) => BRANCHES[p.branch].p;
const pillar = (p) => `${S(p)}-${B(p)}`;

describe("BaZi pillars (reference person)", () => {
  const c = computeChart(REF);
  it("four pillars: Ji-Si / Jia-Xu / Gui-Mao / Gui-Chou", () => {
    expect(pillar(c.year)).toBe("Ji-Si");
    expect(pillar(c.month)).toBe("Jia-Xu");
    expect(pillar(c.day)).toBe("Gui-Mao");
    expect(pillar(c.hour)).toBe("Gui-Chou");
  });
  it("luck pillars forward from age 9", () => {
    expect(c.forward).toBe(true);
    expect(c.startAge).toBe(9);
    const expected = ["Yi-Hai", "Bing-Zi", "Ding-Chou", "Wu-Yin", "Ji-Mao", "Geng-Chen", "Xin-Si", "Ren-Wu"];
    expect(c.luck.map(pillar)).toEqual(expected);
    expect(c.luck.map((l) => l.age)).toEqual([9, 19, 29, 39, 49, 59, 69, 79]);
  });
});

describe("Day-pillar anchors", () => {
  it("1989-10-10 = Gui-Mao (sexagenary 39)", () => {
    const dp = dayPillarOf(new Date(1989, 9, 10));
    expect(dp.dci).toBe(39);
    expect(pillar(dp)).toBe("Gui-Mao");
  });
  it("1949-10-01 = Jia-Zi (sexagenary 0)", () => {
    const dp = dayPillarOf(new Date(1949, 9, 1));
    expect(dp.dci).toBe(0);
    expect(pillar(dp)).toBe("Jia-Zi");
  });
  it("23:00+ births roll the day pillar forward (Zi-hour school choice)", () => {
    const late = computeChart({ ...REF, hh: 23, min: 30 });
    const sameDayEarlier = computeChart({ ...REF, hh: 22, min: 30 });
    const next = (sexIndex(sameDayEarlier.day.stem, sameDayEarlier.day.branch) + 1) % 60;
    expect(sexIndex(late.day.stem, late.day.branch)).toBe(next);
  });
});

describe("2026 solar terms (UTC+8 civil dates)", () => {
  // §3: Li Chun Feb 4, Jing Zhe Mar 5, Qing Ming Apr 5, Li Xia May 5, Mang Zhong Jun 5,
  // Xiao Shu Jul 7, Li Qiu Aug 7, Bai Lu Sep 7, Han Lu Oct 8, Li Dong Nov 7, Da Xue Dec 7,
  // Xiao Han Jan 5 2027.
  const expected = [
    [2026, 2, 4], [2026, 3, 5], [2026, 4, 5], [2026, 5, 5], [2026, 6, 5], [2026, 7, 7],
    [2026, 8, 7], [2026, 9, 7], [2026, 10, 8], [2026, 11, 7], [2026, 12, 7], [2027, 1, 5],
  ];
  expected.forEach(([yy, mm, dd], i) => {
    it(`term ${i} falls on ${yy}-${mm}-${dd}`, () => {
      const c = jdToCivil(termJD(2026, i), 8);
      expect([c.year, c.month, c.day]).toEqual([yy, mm, dd]);
    });
  });
});

describe("Lunar calendar (astronomical, UTC+8 day boundary)", () => {
  const cny = [
    [2026, 2, 17], [2025, 1, 29], [2024, 2, 10], [2023, 1, 22],
    [2020, 1, 25], [2000, 2, 5], [1989, 2, 6], [1990, 1, 27],
  ];
  cny.forEach(([y, m, d]) => {
    it(`CNY ${y}: lunar 1/1 on ${y}-${m}-${d}`, () => {
      const l = lunarDate(y, m, d);
      expect({ month: l.month, day: l.day, isLeap: l.isLeap }).toEqual({ month: 1, day: 1, isLeap: false });
    });
  });
  it("Mid-Autumn (8/15): 1989-09-14 and 2025-10-06", () => {
    for (const [y, m, d] of [[1989, 9, 14], [2025, 10, 6]]) {
      const l = lunarDate(y, m, d);
      expect({ month: l.month, day: l.day, isLeap: l.isLeap }).toEqual({ month: 8, day: 15, isLeap: false });
    }
  });
  it("leap months: 2023-03-22 = leap-2/1, 2025-07-25 = leap-6/1, 1990-06-23 = leap-5/1", () => {
    for (const [y, m, d, lm] of [[2023, 3, 22, 2], [2025, 7, 25, 6], [1990, 6, 23, 5]]) {
      const l = lunarDate(y, m, d);
      expect({ month: l.month, day: l.day, isLeap: l.isLeap }).toEqual({ month: lm, day: 1, isLeap: true });
    }
  });
  it("reference person = lunar month 9, day 11", () => {
    const l = lunarDate(REF.y, REF.m, REF.d);
    expect({ month: l.month, day: l.day, isLeap: l.isLeap }).toEqual({ month: 9, day: 11, isLeap: false });
  });
});

describe("ZWDS (reference person)", () => {
  const z = zwdsChart(REF);
  const branchOf = (name) => +Object.keys(z.stars).find((b) => z.stars[b].includes(name));
  it("Ming palace at You, Shen palace at Hai", () => {
    expect(z.ming).toBe(9); // You
    expect(z.shen).toBe(11); // Hai
  });
  it("Shen coincides with Fortune palace (palace index 10)", () => {
    expect((z.ming - z.shen + 12) % 12).toBe(10);
  });
  it("Metal-4 bureau", () => {
    expect(z.ju).toBe(4);
    expect(z.mingEl).toBe("metal");
  });
  it("Zi Wei at Mao together with Tan Lang; Tian Fu at Chou", () => {
    expect(branchOf("ziwei")).toBe(3); // Mao
    expect(z.stars[3]).toContain("tanlang");
    expect(branchOf("tianfu")).toBe(1); // Chou
  });
  it("all 14 major stars placed exactly once", () => {
    const MAJORS = ["ziwei", "tianji", "taiyang", "wuqu", "tiantong", "lianzhen", "tianfu", "taiyin", "tanlang", "jumen", "tianxiang", "tianliang", "qisha", "pojun"];
    const all = Object.values(z.stars).flat();
    for (const s of MAJORS) expect(all.filter((x) => x === s)).toHaveLength(1);
  });
  it("Ji-year Si Hua = Wu Qu 祿 / Tan Lang 權 / Tian Liang 科 / Wen Qu 忌", () => {
    expect(z.sihua).toEqual(["wuqu", "tanlang", "tianliang", "wenqu"]);
  });
});

describe("Growth stages (Gui Day Master), all 12 match Joey Yap PDF", () => {
  const GUI = 9;
  const expected = {
    Mao: "Growth", Zi: "Thriving", Hai: "Peak", Wei: "Grave", Wu: "Extinction", Si: "Conception",
    Chen: "Nourishing", Xu: "Weakening", You: "Sickness", Shen: "Death", Yin: "Bath", Chou: "Cap & Sash",
  };
  for (const [branchName, stage] of Object.entries(expected)) {
    it(`Gui at ${branchName} = ${stage}`, () => {
      const b = BRANCHES.findIndex((x) => x.p === branchName);
      expect(growthStage(GUI, b).en).toBe(stage);
    });
  }
});

describe("Voids", () => {
  it("day sexagenary 39 → voids Chen & Si; reference person's year branch (Si) is void", () => {
    const v = voidBranches(39);
    expect(v.sort((a, b) => a - b)).toEqual([4, 5]); // Chen, Si
    const c = computeChart(REF);
    expect(v).toContain(c.year.branch); // Si, PDF-confirmed
  });
});

describe("Symbolic stars (reference person, PDF-confirmed)", () => {
  const c = computeChart(REF);
  it("Nobleman Si & Mao; Academic Mao; Peach Blossom Zi; Sky Horse Si; Thriving (Lu) Zi", () => {
    expect(NOBLEMAN[c.day.stem].sort((a, b) => a - b)).toEqual([3, 5]); // Mao, Si
    expect(WENCHANG[c.day.stem]).toBe(3); // Mao
    const trio = "11,3,7"; // day branch Mao's harmony trio
    expect(PEACH[trio]).toBe(0); // Zi
    expect(SKYHORSE[trio]).toBe(5); // Si
    expect(LU_STAR[c.day.stem]).toBe(0); // Zi
    // and via the composed engine function
    const names = symbolicStars(c).map((s) => `${s.name}:${s.who}`).join(" | ");
    expect(names).toContain("Nobleman");
  });
});

describe("Life Gua (8 Mansions)", () => {
  it("1989 female = 4 Xun (East/SE group), directions PDF-exact", () => {
    const g = lifeGua(1989, "F");
    expect(g).toBe(4);
    expect(GUA_DATA[4].name).toBe("Xun");
    expect(GUA_DATA[4].dirs).toEqual({ sq: "N", ty: "S", yn: "E", fw: "SE", hh: "NW", wg: "SW", ls: "W", jm: "NE" });
  });
  it("1989 male = 2 Kun", () => {
    expect(lifeGua(1989, "M")).toBe(2);
  });
});

describe("Day officers", () => {
  it("dayBranch == monthBranch → Establish 建; +6 → Destruction 破", () => {
    for (let b = 0; b < 12; b++) {
      expect(officerOf(b, b).en).toBe("Establish");
      expect(officerOf((b + 6) % 12, b).en).toBe("Destruction");
    }
  });
});

describe("Ten God sanity (engine self-consistency)", () => {
  it("reference person: Day Master Gui; year stem Ji is Seven Killings", () => {
    const c = computeChart(REF);
    expect(STEMS[c.day.stem].p).toBe("Gui");
    expect(tenGod(c.day.stem, c.year.stem)).toBe("7K"); // Ji earth controls Gui water, both yin → 7K
    expect(tenGod(c.day.stem, c.month.stem)).toBe("HO"); // Jia wood produced by Gui, opposite polarity → Hurting Officer
  });
});

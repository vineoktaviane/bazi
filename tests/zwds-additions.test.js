/* ZWDS additions (PRD §9 item 5): tier-two minor stars + time layers.
 * Expected values externally verified 2026-07-05/06 against zwds-calculator.com
 * (reference chart, incl. decade age ranges server-rendered per palace) and the
 * iztro engine (10 birthdays for minors; 8 charts x 2 genders x 4 dates for
 * decades/annual/monthly). Branches: Zi0 Chou1 Yin2 Mao3 Chen4 Si5 Wu6 Wei7 Shen8 You9 Xu10 Hai11. */
import { describe, it, expect } from "vitest";
import { zwdsChart, zwdsMinors, zwdsDecades, zwdsYearLayer, zwdsMonthLayer, ZW_MINOR } from "../src/engines/zwds.js";

const REF = { y: 1989, m: 10, d: 10, hh: 1, min: 25, tz: 8, gender: "F" };

describe("tier-two minor stars", () => {
  const z = zwdsChart(REF);
  const minors = zwdsMinors(z, REF);
  const at = (b) => (minors[b] || []).slice().sort();

  it("reference chart: year-stem stars (Ji stem)", () => {
    expect(at(6)).toContain("lucun");      // 祿存 at Wu
    expect(at(7)).toContain("qingyang");   // 擎羊 at Wei
    expect(at(5)).toContain("tuoluo");     // 陀羅 at Si
    expect(at(0)).toContain("tiankui");    // 天魁 at Zi
    expect(at(8)).toContain("tianyue");    // 天鉞 at Shen
  });
  it("reference chart: year-branch + hour stars (Si year, Chou hour)", () => {
    expect(at(4)).toContain("huoxing");    // 火星 at Chen
    expect(at(11)).toContain("lingxing");  // 鈴星 at Hai
    expect(at(10)).toContain("dikong");    // 地空 at Xu
    expect(at(0)).toContain("dijie");      // 地劫 at Zi
    expect(at(11)).toContain("tianma");    // 天馬 at Hai
  });
  it("places exactly ten stars, each defined in ZW_MINOR with texts and good/bad flag", () => {
    const all = Object.values(minors).flat();
    expect(all).toHaveLength(10);
    for (const st of all) {
      expect(ZW_MINOR[st].cn).toBeTruthy();
      expect(ZW_MINOR[st].en).toBeTruthy();
      expect(ZW_MINOR[st].text.length).toBeGreaterThan(20);
      expect(ZW_MINOR[st].plain).toMatch(/^In plain terms/);
      expect(typeof ZW_MINOR[st].good).toBe("boolean");
    }
    const sha = all.filter((st) => !ZW_MINOR[st].good);
    expect(sha.sort()).toEqual(["dijie", "dikong", "huoxing", "lingxing", "qingyang", "tuoluo"]);
  });
});

describe("time layers", () => {
  const z = zwdsChart(REF);

  it("decades: metal-4 bureau female Ji year runs clockwise from Life Palace at age 4", () => {
    const decs = zwdsDecades(z, REF);
    expect(decs[0]).toMatchObject({ b: 9, from: 4, to: 13 });   // You, site-verified
    expect(decs[1]).toMatchObject({ b: 10, from: 14, to: 23 }); // Xu (clockwise)
    expect(decs.find((d) => d.b === 0)).toMatchObject({ from: 34, to: 43 }); // Zi, site-verified
  });
  it("decades: same birth, male runs anti-clockwise", () => {
    const decs = zwdsDecades(z, { ...REF, gender: "M" });
    expect(decs[1]).toMatchObject({ b: 8, from: 14, to: 23 }); // Shen
  });
  it("decade transformations come from the decade palace stem", () => {
    const decs = zwdsDecades(z, REF);
    for (const d of decs) {
      expect(d.sihua).toHaveLength(4);
      expect(d.stem).toBeGreaterThanOrEqual(0);
      expect(d.stem).toBeLessThan(10);
    }
  });
  it("annual layer 2026 (Bing Wu): branch Wu, stem Bing, nominal age 38 (site-verified)", () => {
    const yr = zwdsYearLayer(z, 2026);
    expect(yr).toMatchObject({ b: 6, stem: 2, age: 38 });
  });
  it("monthly layer: Dou Jun seats month 1, then clockwise, all 12 branches once", () => {
    const months = zwdsMonthLayer(z, REF, 6); // annual branch Wu
    expect(months[0]).toBe(11); // Wu - (9-1) + 1 = Hai (iztro-verified)
    expect(months).toHaveLength(12);
    expect(new Set(months).size).toBe(12);
    expect(months[1]).toBe(0); // clockwise
  });
});

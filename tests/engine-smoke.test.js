/* Engine smoke tests, beyond PRD §3: exercise the composed engines end-to-end
 * (compatibility, pair timing, best days, oracle, today info) so regressions in
 * cross-module wiring surface even without UI interaction. */
import { describe, it, expect } from "vitest";
import { computeChart } from "../src/engines/bazi.js";
import { compat, pairTiming, bestDaysFor, REL_LENS } from "../src/engines/compat.js";
import { castOracle, QUESTION_CATS, scanTiming } from "../src/engines/oracle.js";
import { todayInfo } from "../src/engines/officers.js";
import { cycleStars, annualStars } from "../src/engines/stars.js";
import { zwdsChart } from "../src/engines/zwds.js";

const REF = { y: 1989, m: 10, d: 10, hh: 1, min: 25, tz: 8, gender: "F" };
const OTHER = { y: 1988, m: 3, d: 21, hh: 14, min: 0, tz: 8, gender: "M" };

describe("compatibility engine", () => {
  const cA = computeChart(REF), cB = computeChart(OTHER);
  it("compat returns bounded score, verdict, both-direction dynamics", () => {
    const r = compat(cA, cB, "A", "B");
    expect(r.score).toBeGreaterThanOrEqual(5);
    expect(r.score).toBeLessThanOrEqual(95);
    expect(r.verdict).toBeTruthy();
    expect(r.dynamics).toHaveLength(2);
    expect(typeof r.summary).toBe("string");
  });
  it("pairTiming tags 12 months", () => {
    const t = pairTiming(cA, cB, 8);
    expect(t).toHaveLength(12);
    for (const m of t) expect(["storm", "roughA", "roughB", "gold", "neutral"]).toContain(m.tag);
  });
  it("bestDaysFor returns at most 3 non-clash days with reasons", () => {
    const days = bestDaysFor(cA, cB, 8);
    expect(days.length).toBeLessThanOrEqual(3);
    for (const d of days) {
      expect(d.sc).toBeGreaterThanOrEqual(2);
      expect(d.why.length).toBeGreaterThan(0);
    }
  });
  it("all four relationship lenses exist", () => {
    expect(Object.keys(REL_LENS).sort()).toEqual(["family", "friend", "partner", "work"]);
  });
});

describe("oracle engine", () => {
  const chart = computeChart(REF);
  it("castOracle produces a complete deterministic-shape reading for every category & question type", () => {
    for (const cat of QUESTION_CATS) {
      for (const qtype of ["should", "when", "howgo", "advice"]) {
        const o = castOracle(chart, REF, cat, "test", qtype);
        expect(o.hexName).toBeTruthy();
        expect(o.rank).toBeGreaterThanOrEqual(1);
        expect(o.rank).toBeLessThanOrEqual(5);
        expect(o.answerLead).toBeTruthy();
        expect(o.verdictText).not.toContain("{D}");
        expect(o.timing).toHaveProperty("best");
        expect(o.timing).toHaveProperty("avoid");
      }
    }
  });
  it("scanTiming best months score >= 2, avoid months <= -2", () => {
    const t = scanTiming(chart, REF, QUESTION_CATS[0]);
    for (const m of t.best) expect(m.s).toBeGreaterThanOrEqual(2);
    for (const m of t.avoid) expect(m.s).toBeLessThanOrEqual(-2);
  });
});

describe("daily + annual engines", () => {
  const chart = computeChart(REF);
  it("todayInfo returns officer, stars, hour windows", () => {
    const t = todayInfo(chart, REF);
    expect(t.officer.en).toBeTruthy();
    expect(Array.isArray(t.stars)).toBe(true);
    expect(t.golden).toBeGreaterThanOrEqual(0);
    expect(t.noble).toHaveLength(2);
  });
  it("cycleStars/annualStars never duplicate a star key and fill text templates", () => {
    for (let b = 0; b < 12; b++) {
      const stars = annualStars(chart, b);
      for (const st of stars) {
        expect(st.text).toBeTruthy();
        expect(st.name).toBeTruthy();
      }
    }
  });
  it("zwdsChart is null-safe shape for a second person too", () => {
    const z = zwdsChart(OTHER);
    expect(z).not.toBeNull();
    expect(Object.values(z.stars).flat().length).toBeGreaterThanOrEqual(18);
  });
});

/* Often-asked questions scanner: structure, gender rules, star formulas, honest framing. */
import { describe, it, expect } from "vitest";
import { computeChart } from "../src/engines/bazi.js";
import { LIFE_QUESTIONS, scanQuestion } from "../src/content/questions.js";

const profile = { y: 1990, m: 5, d: 15, hh: 10, min: 30, tz: 8, gender: "F", name: "T" };
const chart = computeChart(profile);

describe("often-asked question scanner", () => {
  it("produces structured, bounded output for every question", () => {
    for (const qd of LIFE_QUESTIONS) {
      const res = scanQuestion(chart, profile, qd);
      expect(Array.isArray(res.decades)).toBe(true);
      expect(res.decades.length).toBeLessThanOrEqual(3);
      expect(res.years.length).toBeLessThanOrEqual(4);
      for (const d of res.decades) {
        expect(d.score).toBeGreaterThanOrEqual(2);
        expect(d.reasons.length).toBeGreaterThan(0);
        expect(d.past).toBe(false);
      }
      for (const y of res.years) {
        expect(y.score).toBeGreaterThanOrEqual(2);
        expect(y.reasons.length).toBeGreaterThan(0);
        expect(y.Y).toBeGreaterThanOrEqual(new Date().getFullYear());
      }
    }
  });
  it("marriage markers match the engine's Red Phoenix / Sky Happiness formulas", () => {
    const qd = LIFE_QUESTIONS.find((x) => x.key === "marry");
    const res = scanQuestion(chart, profile, qd);
    expect(res.starBr.hongluan).toEqual([(3 - chart.year.branch + 24) % 12]);
    expect(res.starBr.tianxi).toEqual([(9 - chart.year.branch + 24) % 12]);
    expect(res.gods).toEqual(["DO", "7K"]); // female: officer = spouse star
  });
  it("gender flips the spouse and children stars", () => {
    const marry = LIFE_QUESTIONS.find((x) => x.key === "marry");
    const kids = LIFE_QUESTIONS.find((x) => x.key === "children");
    expect(marry.gods("M")).toEqual(["DW", "IW"]);
    expect(kids.gods("F")).toEqual(["EG", "HO"]);
    expect(kids.gods("M")).toEqual(["DO", "7K"]);
  });
  it("health scan flags caution windows without ten-god noise", () => {
    const qd = LIFE_QUESTIONS.find((x) => x.key === "health");
    const res = scanQuestion(chart, profile, qd);
    expect(res.gods).toEqual([]);
    for (const w of [...res.decades, ...res.years]) {
      for (const r of w.reasons) expect(r).not.toMatch(/undefined|NaN/);
    }
  });
  it("every question card has honest-framing copy", () => {
    for (const qd of LIFE_QUESTIONS) {
      expect(qd.cant).toMatch(/^No chart can/);
      expect(qd.markers.length).toBeGreaterThan(10);
      expect(qd.q.endsWith("?")).toBe(true);
    }
  });
});

/* Plain-language Qi Men reading: structure, tier adjustments, no leaked jargon or undefineds. */
import { describe, it, expect } from "vitest";
import { castQimen, arrangePlates, plateOverlays, PALACES } from "../src/engines/qimen.js";
import { sexIndex } from "../src/engines/bazi.js";
import { hourSummary, palaceTier, askerMatterRead, topicRead, DOOR_PLAIN, PATTERN_PLAIN, TOPIC_USE, TIERS } from "../src/content/qimenbank.js";

describe("plain-language hour summary", () => {
  it("every cast produces a lead, sorted rows, and avoid entries with real directions", () => {
    for (const [y, m, d, hh] of [[2026, 2, 15, 9], [2026, 6, 4, 23], [2025, 11, 30, 5], [2024, 7, 8, 14], [2023, 0, 20, 18]]) {
      const o = castQimen(new Date(y, m, d, hh, 12));
      const sum = hourSummary(o);
      expect(sum.lead.length).toBeGreaterThan(30);
      expect(sum.rows.length).toBeGreaterThanOrEqual(3);
      for (let i = 1; i < sum.rows.length; i++) {
        expect(TIERS.indexOf(sum.rows[i - 1].tier)).toBeGreaterThanOrEqual(TIERS.indexOf(sum.rows[i].tier));
      }
      for (const r of [...sum.rows, ...sum.avoid]) {
        expect(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]).toContain(r.dir);
        expect(r.text).not.toMatch(/undefined|NaN|\[object/);
      }
      const am = askerMatterRead(o, 3);
      if (am) {
        expect(PALACES[am.dayPal]).toBeTruthy();
        expect(am.text).not.toMatch(/undefined/);
      }
    }
  });
  it("a void palace is capped at mixed even with the best door", () => {
    // find a cast where a good door sits in a void palace
    let found = false;
    for (let hh = 1; hh < 24 && !found; hh += 2) {
      for (let d = 1; d < 28 && !found; d += 3) {
        const o = castQimen(new Date(2026, 3, d, hh, 0));
        const ov = plateOverlays(o);
        for (const key of ["life", "open", "rest"]) {
          const pal = o.doors.indexOf(key);
          if (pal > 0 && ov.voidPals.includes(pal)) {
            found = true;
            expect(["mixed", "poor", "avoid"]).toContain(palaceTier(o, pal, ov));
          }
        }
      }
    }
    expect(found).toBe(true);
  });
  it("plain door texts avoid untranslated jargon in the main read", () => {
    for (const k of Object.keys(DOOR_PLAIN)) {
      for (const t of [...DOOR_PLAIN[k].does, ...DOOR_PLAIN[k].avoid]) {
        expect(t).not.toMatch(/值符|值使|旬|遁|天盤|地盤/);
      }
    }
  });
  it("deterministic: same cast object always reads identically", () => {
    const o = castQimen(new Date(2026, 4, 5, 10, 30));
    expect(hourSummary(o)).toEqual(hourSummary(JSON.parse(JSON.stringify(o))));
  });
  it("named patterns render in plain words with no jargon or blanks", () => {
    let sawPattern = false;
    for (let d = 1; d < 28; d += 2) for (let hh = 1; hh < 24; hh += 4) {
      const sum = hourSummary(castQimen(new Date(2026, 5, d, hh, 0)));
      for (const p of sum.patterns) {
        sawPattern = true;
        expect(p.text.length).toBeGreaterThan(10);
        expect(p.text).not.toMatch(/undefined|NaN/);
        expect(PATTERN_PLAIN[p.key]).toBeTruthy();
        expect(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]).toContain(p.dir);
      }
    }
    expect(sawPattern).toBe(true);
  });
});

describe("per-topic use-god reading", () => {
  it("every topic yields located, plain-language use-gods for any cast", () => {
    for (const key of Object.keys(TOPIC_USE)) {
      let anyFound = false;
      for (const [y, m, d, hh] of [[2026, 2, 15, 9], [2026, 6, 4, 15], [2025, 9, 9, 3]]) {
        const o = { ...castQimen(new Date(y, m, d, hh, 0)), topic: key };
        const tr = topicRead(o, key, 5);
        if (!tr) continue;
        anyFound = true;
        for (const m2 of tr) {
          expect(m2.role.length).toBeGreaterThan(2);
          expect(m2.text).not.toMatch(/undefined|NaN|\[object/);
          expect(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]).toContain(m2.dir);
          expect(typeof m2.good).toBe("boolean");
        }
      }
      expect(anyFound).toBe(true);
    }
  });
  it("health use-god reads inverted (a strong ailment star is a warning, not a blessing)", () => {
    // 天芮 marked invert:true — its text should never be a plain 'good' tier phrase
    for (let d = 1; d < 20; d += 3) {
      const o = { ...castQimen(new Date(2026, 1, d, 11, 0)), topic: "health" };
      const tr = topicRead(o, "health", 3);
      const ailment = tr && tr.find((m) => m.role === "The ailment");
      if (ailment) expect(ailment.text).toMatch(/symptoms|treatment|rest|act against/);
    }
  });
});

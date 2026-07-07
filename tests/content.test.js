/*
 * Content-bank integrity checks. The text banks grow by appending variant
 * "waves"; these tests guard the shapes the UI relies on, so enrichment
 * can never silently break rendering. They assert structure, not wording.
 */
import { describe, it, expect } from "vitest";
import { DM_BLURB, TG_MONTH, REL_TEXT, NATAL_CLOSER, fill } from "../src/content/banks.js";
import { CROSS_REL, SEASON_REL } from "../src/content/banks2.js";
import { DM_BLURB3, SEASON_REL3 } from "../src/content/banks3.js";

const GODS = ["F", "RW", "EG", "HO", "IW", "DW", "DO", "7K", "DR", "IR"];
const REL_KINDS = ["clash", "harm", "punish", "selfpunish", "combine", "harmony", "same"];

describe("TG_MONTH banks", () => {
  it("every god keeps a tag and at least 7 focus / 7 watch variants", () => {
    for (const g of GODS) {
      expect(TG_MONTH[g].tag).toBeTruthy();
      expect(TG_MONTH[g].focus.length).toBeGreaterThanOrEqual(7);
      expect(TG_MONTH[g].watch.length).toBeGreaterThanOrEqual(7);
    }
  });
  it("no {P} placeholder survives fill()", () => {
    for (const g of GODS) {
      for (const t of [...TG_MONTH[g].focus, ...TG_MONTH[g].watch]) {
        expect(fill(t, "month")).not.toContain("{P}");
        expect(t.trim().length).toBeGreaterThan(40);
      }
    }
  });
});

describe("relation texts", () => {
  it("REL_TEXT rotates through several distinct variants per kind", () => {
    for (const k of REL_KINDS) {
      const outs = new Set();
      for (let seed = 0; seed < 12; seed++) outs.add(REL_TEXT[k]("your career", seed));
      expect(outs.size).toBeGreaterThanOrEqual(4);
      for (const o of outs) {
        expect(o).toContain("your career");
        expect(fill(o, "month")).not.toContain("{P}");
      }
    }
  });
  it("CROSS_REL returns pair texts for every kind and seed", () => {
    for (const k of REL_KINDS) {
      for (let seed = 0; seed < 8; seed++) {
        const t = CROSS_REL[k]("your home", "their career", seed);
        expect(typeof t).toBe("string");
        expect(t.length).toBeGreaterThan(40);
      }
    }
  });
});

describe("third-bank variants line up with banks 1 & 2", () => {
  it("DM_BLURB3 covers the same ten Day Masters and keeps the 'lead. body' shape the UI splits on", () => {
    expect(Object.keys(DM_BLURB3).sort()).toEqual(Object.keys(DM_BLURB).sort());
    for (const k of Object.keys(DM_BLURB3)) {
      const dot = DM_BLURB3[k].indexOf(". ");
      expect(dot).toBeGreaterThan(0);
      expect(DM_BLURB3[k].slice(dot + 2).length).toBeGreaterThan(40);
    }
  });
  it("SEASON_REL3 covers the same five month-command relations", () => {
    expect(Object.keys(SEASON_REL3).sort()).toEqual(Object.keys(SEASON_REL).sort());
  });
  it("NATAL_CLOSER offers at least 8 rotating closers naming the pair", () => {
    const closers = NATAL_CLOSER("your home and your career");
    expect(closers.length).toBeGreaterThanOrEqual(8);
    for (const c of closers) expect(c).toContain("your home and your career");
  });
});

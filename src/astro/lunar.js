/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { jdToCivil, jdnOf } from "./calendar";
import { findTerm, rad } from "./solar";

/* ---------------- LUNAR CALENDAR (astronomical, verified vs CNY/leap months) ---------------- */
function newMoonJDE(k) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = (2.5534 + 29.1053567 * k - 0.0000014 * T2) * rad;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3) * rad;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3) * rad;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T2) * rad;
  JDE += -0.4072 * Math.sin(Mp) + 0.17241 * E * Math.sin(M) + 0.01608 * Math.sin(2 * Mp) + 0.01039 * Math.sin(2 * F)
    + 0.00739 * E * Math.sin(Mp - M) - 0.00514 * E * Math.sin(Mp + M) + 0.00208 * E * E * Math.sin(2 * M)
    - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M)
    - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F) + 0.00038 * E * Math.sin(M - 2 * F)
    - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om) - 0.00007 * Math.sin(Mp + 2 * M);
  return JDE;
}
const civilJDN8 = (jd) => { const c = jdToCivil(jd, 8); return jdnOf(c.year, c.month, c.day); };
function lunarDate(y, m, d) {
  const targetJDN = jdnOf(y, m, d);
  const k0 = Math.floor((y - 2000) * 12.3685);
  const moons = [];
  for (let k = k0 - 26; k <= k0 + 20; k++) moons.push(civilJDN8(newMoonJDE(k)));
  moons.sort((a, b) => a - b);
  const solstice = (yy) => { const g = jdnOf(yy, 12, 21) - 0.5; return civilJDN8(findTerm(270, g - 10, g + 10)); };
  const solY = [y - 2, y - 1, y, y + 1];
  const solstices = solY.map(solstice);
  const monthStartOf = (jdn) => { let st = moons[0]; for (const mn of moons) { if (mn <= jdn) st = mn; else break; } return st; };
  const zq = [];
  for (let yy = y - 2; yy <= y + 1; yy++) for (let i = 0; i < 12; i++) {
    const guess = jdnOf(yy, 12, 21) + i * 30.44 - 0.5;
    zq.push(civilJDN8(findTerm((270 + 30 * i) % 360, guess - 16, guess + 16)));
  }
  const hasZQ = (a, b) => zq.some((z) => z >= a && z < b);
  for (let si = 0; si < solstices.length - 1; si++) {
    const w1 = monthStartOf(solstices[si]), w2 = monthStartOf(solstices[si + 1]);
    if (!(targetJDN >= w1 && targetJDN < w2)) continue;
    const seq = moons.filter((mn) => mn >= w1 && mn < w2);
    const isLeapY = seq.length === 13;
    let num = 11, leapUsed = false;
    for (let i = 0; i < seq.length; i++) {
      const start = seq[i], end = i + 1 < seq.length ? seq[i + 1] : w2;
      let thisLeap = false;
      if (i > 0) {
        if (isLeapY && !leapUsed && !hasZQ(start, end)) { thisLeap = true; leapUsed = true; }
        else num = (num % 12) + 1;
      }
      if (targetJDN >= start && targetJDN < end)
        return { month: num, day: targetJDN - start + 1, isLeap: thisLeap, lunarYear: num >= 11 ? solY[si] : solY[si] + 1 };
    }
  }
  return null;
}

export { newMoonJDE, civilJDN8, lunarDate };

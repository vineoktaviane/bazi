/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { jdnOf } from "./calendar";

const rad = Math.PI / 180;
function sunLong(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * rad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * rad) +
    0.000289 * Math.sin(3 * M * rad);
  const omega = 125.04 - 1934.136 * T;
  let app = (L0 + C - 0.00569 - 0.00478 * Math.sin(omega * rad)) % 360;
  return app < 0 ? app + 360 : app;
}
function findTerm(deg, lo, hi) {
  const f = (jd) => { let d = sunLong(jd) - deg; while (d > 180) d -= 360; while (d < -180) d += 360; return d; };
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}
const TERM_NAMES = ["Li Chun", "Jing Zhe", "Qing Ming", "Li Xia", "Mang Zhong", "Xiao Shu", "Li Qiu", "Bai Lu", "Han Lu", "Li Dong", "Da Xue", "Xiao Han"];
const TERM_APPROX = [[2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6]];
const termCache = new Map();
/* term i (0=Li Chun) of BaZi year Y; i=11 (Xiao Han) falls in calendar Jan of Y+1 */
function termJD(baziYear, i) {
  const key = baziYear + ":" + i;
  if (termCache.has(key)) return termCache.get(key);
  const calY = i === 11 ? baziYear + 1 : baziYear;
  const [m, d] = TERM_APPROX[i];
  const guess = jdnOf(calY, m, d) - 0.5;
  const v = findTerm((315 + 30 * i) % 360, guess - 20, guess + 20);
  termCache.set(key, v);
  return v;
}

function surroundingTerms(jdUT, calYear) {
  const seq = [];
  for (let y = calYear - 2; y <= calYear + 1; y++) for (let i = 0; i < 12; i++) seq.push({ baziYear: y, i, jd: termJD(y, i) });
  seq.sort((a, b) => a.jd - b.jd);
  let cur = seq[0], next = seq[seq.length - 1];
  for (let k = 0; k < seq.length; k++) { if (seq[k].jd <= jdUT) cur = seq[k]; else { next = seq[k]; break; } }
  return { cur, next };
}

export { rad, sunLong, findTerm, TERM_NAMES, TERM_APPROX, termCache, termJD, surroundingTerms };

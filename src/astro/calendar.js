/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
function jdnOf(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
// day pillar offset derived from anchor 1989-10-10 = Gui Mao (sexagenary 39); cross-checked: 1949-10-01 = Jia Zi
const DAY_OFFSET = (() => { const j = jdnOf(1989, 10, 10); return (((39 - j) % 60) + 60) % 60; })();

function jdToCivil(jd, tz) {
  const j = jd + 0.5 + tz / 24;
  const Z = Math.floor(j); const F = j - Z;
  let A = Z;
  if (Z >= 2299161) { const al = Math.floor((Z - 1867216.25) / 36524.25); A = Z + 1 + al - Math.floor(al / 4); }
  const B = A + 1524; const Cc = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * Cc); const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? Cc - 4716 : Cc - 4715;
  const hrs = F * 24; const hh = Math.floor(hrs); const min = Math.round((hrs - hh) * 60);
  return { year, month, day, hh, min };
}
function civilToJD(y, m, d, hh, min, tz) { return jdnOf(y, m, d) - 0.5 + (hh + min / 60) / 24 - tz / 24; }

export { jdnOf, DAY_OFFSET, jdToCivil, civilToJD };

/* ZwdsSection, RN port of the reference ZWDS section. All placement/derivation
 * logic is identical; only rendering is translated. */
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import { tenGodProfile, TG } from "../../engines/bazi";
import {
  zwdsChart, ZW_PALACES, ZW_STARS, ZW_HUA, ZW_STARS2, ZW_SHEN, ZW_OPEN, ZW_PLAIN, ZW_PALQ,
  zwStar, zwPal, zwHua,
  ZW_BRIGHT_LV, zwBright, zwBrightMod, ZW_MINOR, zwdsMinors,
  zwdsDecades, zwdsYearLayer, zwdsMonthLayer, ZW_DEC_HUA, ZW_YR_HUA,
} from "../../engines/zwds";
import { lunarDate } from "../../astro/lunar";
import { pick } from "../../content/banks";
import { C, cjk } from "../theme";
import { py } from "../pinyin";
import { Dominant, Factor, Inter, P, Under, Fine, SubSec, B, SealChip } from "../components";

const MINOR = ["wenchang", "wenqu", "zuofu", "youbi"];
const HUA_KEYS = ["lu", "quan", "ke", "ji"];

export function ZwdsSection({ chart, profile }) {
  const z = useMemo(() => zwdsChart(profile), [profile]);
  const minors = useMemo(() => (z ? zwdsMinors(z, profile) : {}), [z, profile]);
  const [selB, setSelB] = useState(null);
  if (!z) return null;
  const palaceOf = (b) => ZW_PALACES[((z.ming - b) % 12 + 12) % 12];
  const palIdxOf = (b) => ((z.ming - b) % 12 + 12) % 12;
  const huaOf = (star) => { const i = z.sihua.indexOf(star); return i < 0 ? null : HUA_KEYS[i]; };
  const GRID = [[5, 6, 7, 8], [4, -1, -1, 9], [3, -1, -1, 10], [2, 1, 0, 11]];
  const dgp = tenGodProfile(chart);
  const mingStars = (z.stars[z.ming] || []).filter((st) => !MINOR.includes(st));
  const borrowed = mingStars.length === 0 ? (z.stars[(z.ming + 6) % 12] || []) : null;
  const sel = selB != null ? { b: selB, pal: palaceOf(selB), stars: z.stars[selB] || [] } : null;

  const StarReading = ({ st, b, seed, extraLabel, huaSuffix }) => {
    const hua = huaOf(st);
    const g = b != null ? zwBright(st, b) : 0;
    return (
      <Inter kind={hua === "ji" ? "bad" : hua ? "good" : "dyn"}
        label={`${ZW_STARS[st].cn} ${py(ZW_STARS[st].cn)} ${ZW_STARS[st].en}${extraLabel || ""}${g ? ` · ${ZW_BRIGHT_LV[g].cn} ${ZW_BRIGHT_LV[g].en}` : ""}${hua ? ` · ${ZW_HUA[hua].cn} ${py(ZW_HUA[hua].cn)} ${ZW_HUA[hua].en}` : ""}`}>
        <P>{g ? zwBrightMod(st, b, seed) : ""}{zwStar(st, seed)}{hua ? (huaSuffix ? huaSuffix(hua) : ` In your chart it ${zwHua(hua, seed)}, read this palace's affairs through that lens.`) : ""}</P>
        <Text style={s.plain}>{ZW_PLAIN[st]}</Text>
      </Inter>
    );
  };

  const MinorReading = ({ st }) => (
    <Inter kind={ZW_MINOR[st].good ? "good" : "bad"}
      label={`${ZW_MINOR[st].cn} ${py(ZW_MINOR[st].cn)} ${ZW_MINOR[st].en}${ZW_MINOR[st].good ? "" : " · sha 煞"}`}>
      <P>{ZW_MINOR[st].text}</P>
      <Text style={s.plain}>{ZW_MINOR[st].plain}</Text>
    </Inter>
  );

  return (
    <View>
      <Dominant label="What the lunar lens adds">
        <P><B color={C.gold}>BaZi (solar calendar) says:</B> you are a {STEMS[chart.day.stem].p} {EL_NAME[STEMS[chart.day.stem].el]} Day Master with {TG[dgp.top].name} as your strongest current, the energy-and-timing view of your life.</P>
        <P><B color={C.red}>Zi Wei Dou Shu (lunar calendar) says:</B> born lunar {z.lunar.isLeap ? "leap " : ""}month {z.lunar.month}, day {z.lunar.day}, a {z.mingEl.charAt(0).toUpperCase() + z.mingEl.slice(1)}-{z.ju} bureau chart with your Life Palace in {BRANCHES[z.ming].p}{mingStars.length ? `, held by ${mingStars.map((st) => ZW_STARS[st].en).join(" and ")}` : `, an open palace borrowing ${(borrowed || []).filter((st) => !MINOR.includes(st)).map((st) => ZW_STARS[st].en).join(" and ") || "its opposite palace"}`}, the life-area map view.</P>
        <Fine>The two systems are independent by design: BaZi reads energy and timing; ZWDS reads the twelve rooms of a life. Where they agree, trust the theme; where they differ, they are answering different questions.</Fine>
      </Dominant>

      <Factor chip="讀" title="How to read this chart">
        <P>Think of your life as a house with <B>twelve rooms</B> (the palaces), one for love, one for money, one for career, and so on. The <B>stars are characters living in those rooms</B>: a room's affairs take on its residents' personalities. Four stars carry lifelong modifiers, the <B>Transformations</B>: one flows easily (祿 lù), one commands (權 quán), one earns respect (科 kē), one teaches hard lessons (忌 jì). Your <B>Life Palace</B> is your main room; your <B>Body Palace</B> is where the story concentrates after midlife. <B>Empty rooms</B> aren't bad, they borrow their character from the room directly across the house.</P>
      </Factor>

      <View style={s.grid}>
        {GRID.map((row, ri) => (
          <View key={ri} style={{ flexDirection: "row" }}>
            {row.map((b, ci) =>
              b === -1 ? (
                ri === 1 && ci === 1 ? (
                  <View key={ci} style={[s.cell, s.center, { width: CELL_W * 2 + 4, height: CELL_H * 2 + 4 }]}>
                    <Text style={{ color: C.gold, fontWeight: "700", fontSize: 14 }}>{z.mingEl.toUpperCase()}-{z.ju} 局 jú</Text>
                    <Text style={s.centerSub}>Lunar {z.lunar.isLeap ? "leap " : ""}{z.lunar.month}/{z.lunar.day}</Text>
                    <Text style={s.centerSub}>Ming {BRANCHES[z.ming].cn} {BRANCHES[z.ming].p} · Shen {BRANCHES[z.shen].cn} {BRANCHES[z.shen].p}</Text>
                  </View>
                ) : null
              ) : (
                <Pressable key={ci} onPress={() => setSelB(b)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selB === b }}
                  accessibilityLabel={`${palaceOf(b).en} Palace${b === z.ming ? ", your Life Palace" : ""}${b === z.shen ? ", your Body Palace" : ""}`}
                  style={[s.cell, b === z.ming && s.ming, b === z.shen && s.shen, selB === b && s.sel]}>
                  <Text style={s.pal}>{palaceOf(b).cn} {palaceOf(b).en}</Text>
                  <Text style={s.br}>{BRANCHES[b].cn}</Text>
                  <View style={s.starsWrap}>
                    {(z.stars[b] || []).map((st) => (
                      <Text key={st} style={s.star}>
                        {ZW_STARS[st].cn}
                        {huaOf(st) ? <Text style={[s.hua, huaOf(st) === "ji" ? { color: C.red } : { color: C.gold }]}>{ZW_HUA[huaOf(st)].cn}</Text> : null}
                      </Text>
                    ))}
                  </View>
                  {(minors[b] || []).length ? (
                    <View style={s.minorsWrap}>
                      {(minors[b] || []).map((st) => (
                        <Text key={st} style={[s.minorStar, !ZW_MINOR[st].good && s.minorSha]}>{ZW_MINOR[st].cn}</Text>
                      ))}
                    </View>
                  ) : null}
                </Pressable>
              )
            )}
          </View>
        ))}
      </View>

      {sel ? (
        <View style={s.selBody}>
          <Text style={{ color: C.gold, fontSize: 12, marginBottom: 4 }}>
            {sel.pal.cn} {py(sel.pal.cn)} {sel.pal.en} Palace · {BRANCHES[sel.b].p}{sel.b === z.ming ? " · your Life Palace" : ""}{sel.b === z.shen ? " · your Body Palace" : ""}
          </Text>
          <Text style={s.palq}>“{ZW_PALQ[palIdxOf(sel.b)]}”</Text>
          <P>{zwPal(palIdxOf(sel.b), z.lunar.day + sel.b)}</P>
          {sel.stars.length === 0 ? (
            <Under>An open palace: no major star resides here, so it borrows the character of its opposite palace ({ZW_PALACES[palIdxOf((sel.b + 6) % 12)].en}, {BRANCHES[(sel.b + 6) % 12].p}), the themes arrive second-hand, shaped elsewhere, and reward flexibility over fixed plans in this area.</Under>
          ) : null}
          {sel.stars.map((st) => <StarReading key={st} st={st} b={sel.b} seed={z.lunar.day + sel.b} />)}
          {(minors[sel.b] || []).map((st) => <MinorReading key={st} st={st} />)}
        </View>
      ) : null}

      <SubSec>Your Life Palace, the self, in detail</SubSec>
      <Factor chip="命" title={`${BRANCHES[z.ming].p} ${BRANCHES[z.ming].cn}`} right={`${z.mingEl}-${z.ju} bureau`}>
        <Text style={s.palq}>“{ZW_PALQ[0]}”</Text>
        <P>{zwPal(0, z.lunar.day)}</P>
        {mingStars.length === 0 ? (
          <Under>{pick(ZW_OPEN, z.lunar.day)} For you, that opposite room holds {(borrowed || []).filter((st) => ZW_STARS2[st] && !MINOR.includes(st)).map((st) => ZW_STARS[st].en).join(" and ") || "supporting stars only"}, read their natures below as your borrowed temperament.</Under>
        ) : null}
        {(mingStars.length ? mingStars : (borrowed || []).filter((st) => !MINOR.includes(st))).map((st, i) => (
          <StarReading key={st} st={st} b={mingStars.length ? z.ming : (z.ming + 6) % 12} seed={z.lunar.day + i}
            extraLabel={mingStars.length === 0 ? " (borrowed)" : ""}
            huaSuffix={(hua) => ` In your chart it ${zwHua(hua, z.lunar.day)}.`} />
        ))}
        {(minors[z.ming] || []).map((st) => <MinorReading key={st} st={st} />)}
      </Factor>

      <SubSec>Your Body Palace, where life is heading</SubSec>
      <Factor chip="身" title={`${BRANCHES[z.shen].p} ${BRANCHES[z.shen].cn} · ${ZW_PALACES[palIdxOf(z.shen)].en} Palace`}>
        <P>The Life Palace is who you were issued; the Body Palace is who the decades make of you, its weight grows after thirty-five.</P>
        <Under>{ZW_SHEN[palIdxOf(z.shen)]}</Under>
      </Factor>

      <SubSec>Your Four Transformations, the chart's lifelong currents</SubSec>
      {HUA_KEYS.map((k, i) => {
        const st = z.sihua[i];
        const b = +Object.keys(z.stars).find((br) => z.stars[br].includes(st));
        const palIdx = palIdxOf(b);
        return (
          <Inter key={k} kind={k === "ji" ? "bad" : "good"}
            label={`${ZW_HUA[k].cn} ${py(ZW_HUA[k].cn)} ${ZW_HUA[k].en} · ${ZW_STARS[st].en} in your ${ZW_PALACES[palIdx].en} Palace`}>
            <P>{ZW_STARS[st].en} {zwHua(k, z.lunar.day + i)}. Its home is your {ZW_PALACES[palIdx].en} Palace, {(() => { const t = zwPal(palIdx, z.lunar.day + i + 3); return t.charAt(0).toLowerCase() + t.slice(1); })()} {k === "ji" ? "Expect this life-area to be your recurring classroom: slower, knottier, and ultimately the place your hardest-won wisdom comes from." : k === "lu" ? "This is the life-area where things simply go your way more often than they should, build on it deliberately." : k === "quan" ? "You carry natural command in this life-area, and will meet others who contest it there." : "This life-area builds your name quietly, invest in it for reputation, not just results."}</P>
          </Inter>
        );
      })}

      <SubSec>The four rooms that matter most</SubSec>
      {[2, 4, 8].map((idx) => {
        const b = ((z.ming - idx) % 12 + 12) % 12;
        const roomStars = (z.stars[b] || []).filter((st) => !MINOR.includes(st));
        const minor = (z.stars[b] || []).filter((st) => MINOR.includes(st));
        return (
          <Factor key={idx} chip={ZW_PALACES[idx].cn.charAt(0)} title={`${ZW_PALACES[idx].en} Palace · ${BRANCHES[b].p} ${BRANCHES[b].cn}`}>
            <Text style={s.palq}>“{ZW_PALQ[idx]}”</Text>
            <P>{zwPal(idx, z.lunar.day + idx)}</P>
            {roomStars.length === 0 ? (
              <Under>{pick(ZW_OPEN, z.lunar.day + idx)} Its opposite room ({ZW_PALACES[(idx + 6) % 12].en}) lends this area its character: {(z.stars[(b + 6) % 12] || []).filter((st) => !MINOR.includes(st)).map((st) => ZW_STARS[st].en).join(" and ") || "supporting stars"}.</Under>
            ) : null}
            {roomStars.map((st, i) => (
              <StarReading key={st} st={st} b={b} seed={z.lunar.day + b + i}
                huaSuffix={(hua) => ` Here it ${zwHua(hua, z.lunar.day + b)}.`} />
            ))}
            {(minors[b] || []).map((st) => <MinorReading key={st} st={st} />)}
            {minor.length > 0 ? <Fine>Also present: {minor.map((st) => `${ZW_STARS[st].en} (${zwStar(st, b).split(":")[1].trim()})`).join("; ")}</Fine> : null}
          </Factor>
        );
      })}
      <SubSec>The moving chart, decade, year and month</SubSec>
      {(() => {
        const nowD = new Date();
        const nowLunar = lunarDate(nowD.getFullYear(), nowD.getMonth() + 1, nowD.getDate());
        if (!nowLunar) return null;
        const decades = zwdsDecades(z, profile);
        const yearL = zwdsYearLayer(z, nowLunar.lunarYear);
        const curDec = decades.find((dc) => yearL.age >= dc.from && yearL.age <= dc.to);
        const monthsL = zwdsMonthLayer(z, profile, yearL.b);
        const starB = (st) => +Object.keys(z.stars).find((br) => z.stars[br].includes(st));
        return (
          <View>
            <P>The natal wheel is the terrain; three clocks move across it. Each decade your court convenes in a different palace, each lunar year in the palace of that year's branch, each lunar month one room onward, the same rooms, visited on schedule.</P>
            <Factor chip="限" title={`This decade · ages ${curDec ? `${curDec.from}–${curDec.to}` : `up to ${z.ju - 1}`} · ${curDec ? `${ZW_PALACES[palIdxOf(curDec.b)].en} Palace (${BRANCHES[curDec.b].p})` : "childhood, Life Palace"}`}>
              {curDec ? (
                <View>
                  <P>You are nominal age {yearL.age}. Your decade court sits in your {ZW_PALACES[palIdxOf(curDec.b)].en} Palace: “{ZW_PALQ[palIdxOf(curDec.b)]}” is this chapter's standing question, and the room's residents{(z.stars[curDec.b] || []).length ? ` (${(z.stars[curDec.b] || []).map((st) => ZW_STARS[st].en).join(", ")})` : " (an open room, borrowing its opposite)"} set its tone.</P>
                  {HUA_KEYS.map((k, i) => {
                    const st = curDec.sihua[i];
                    return (
                      <Inter key={k} kind={k === "ji" ? "bad" : "good"}
                        label={`${ZW_HUA[k].cn} ${py(ZW_HUA[k].cn)} · ${ZW_STARS[st].en} · decade ${ZW_HUA[k].en}`}>
                        <P>{ZW_STARS[st].en} {ZW_DEC_HUA[k].replace("{PAL}", ZW_PALACES[palIdxOf(starB(st))].en)}</P>
                      </Inter>
                    );
                  })}
                </View>
              ) : (
                <P>Your first decade begins at nominal age {z.ju} (the bureau number). Until then the childhood years answer to the Life Palace itself, read the natal chart without overlay.</P>
              )}
            </Factor>
            <Factor chip="年" title={`This lunar year · ${STEMS[yearL.stem].cn}${BRANCHES[yearL.b].cn} ${nowLunar.lunarYear} · ${ZW_PALACES[palIdxOf(yearL.b)].en} Palace`}>
              <P>The year convenes in your {ZW_PALACES[palIdxOf(yearL.b)].en} Palace ({BRANCHES[yearL.b].p}), until the next lunar new year, its standing question, “{ZW_PALQ[palIdxOf(yearL.b)]}”, is the year's question. The four transformations below are the year's currents, laid over your natal chart.</P>
              {HUA_KEYS.map((k, i) => {
                const st = yearL.sihua[i];
                return (
                  <Inter key={k} kind={k === "ji" ? "bad" : "good"}
                    label={`${ZW_HUA[k].cn} ${py(ZW_HUA[k].cn)} · ${ZW_STARS[st].en} · annual ${ZW_HUA[k].en}`}>
                    <P>{ZW_STARS[st].en} {ZW_YR_HUA[k].replace("{PAL}", ZW_PALACES[palIdxOf(starB(st))].en)}</P>
                  </Inter>
                );
              })}
            </Factor>
            <Factor chip="月" title="The year's twelve rooms, month by month">
              <P>Lunar months, counted by the classical Dou Jun rule. The highlighted room is the current month's, its palace themes run the month's errands.</P>
              <View style={s.monthsWrap}>
                {monthsL.map((b, k) => (
                  <View key={k} style={[s.monthChip, k === nowLunar.month - 1 && s.monthNow]}>
                    <Text style={[s.monthTxt, k === nowLunar.month - 1 && { color: C.text }]}>M{k + 1} · {ZW_PALACES[palIdxOf(b)].en}</Text>
                  </View>
                ))}
              </View>
            </Factor>
          </View>
        );
      })()}
      <Fine>Tap any other palace in the grid above for its reading, Children, Health, Travel, Friends, Property, Fortune, Parents and Siblings each have their own room.</Fine>
      <Fine>Chart cast by the astronomical lunar calendar (new moons and leap-month rule computed, verified against four decades of Chinese New Year dates). Four Transformations follow the mainstream San He table, some lineages differ on two year-stems; if your practitioner uses another school, the star placements remain identical and only those tags shift. Star brightness (廟 temple · 旺 prosperous · 平 neutral · 弱 weak · 陷 fallen) follows the five-grade San He table published by ZWDS-Calculator.com; schools grade a handful of cells differently, placements are unaffected. Tier-two stars (the Noblemen, Keeper of Wealth, Blade, Grindstone, Fire, Bell, Void, Plunder and Sky Horse) use the standard year-stem, year-branch and hour formulas. Time layers follow San He convention: decades start at the bureau number in nominal age (虛歲), running clockwise for yang-year men and yin-year women and anti-clockwise otherwise, each taking its palace-stem transformations; the year sits in its branch palace with the year-stem transformations and turns at lunar new year; months are seated by the Dou Jun rule.</Fine>
    </View>
  );
}

const CELL_W = 88, CELL_H = 98;
const s = StyleSheet.create({
  grid: { alignSelf: "center", marginVertical: 8 },
  cell: {
    width: CELL_W, height: CELL_H, margin: 1, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.line, borderRadius: 0, padding: 4,
  },
  ming: { borderColor: C.gold, borderWidth: 1.5 },
  shen: { borderStyle: "dashed", borderColor: C.red, borderWidth: 1.5 },
  sel: { backgroundColor: C.card2 },
  center: { alignItems: "center", justifyContent: "center", borderColor: C.gold + "44" },
  centerSub: { color: C.muted, fontSize: 12, marginTop: 2 },
  pal: { color: C.gold, fontSize: 12 },
  br: { color: C.dim, fontFamily: cjk, fontSize: 10, position: "absolute", right: 4, top: 4 },
  starsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 3 },
  star: { color: C.text, fontFamily: cjk, fontSize: 10.5, marginRight: 4, lineHeight: 15 },
  hua: { fontSize: 12 },
  minorsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 1 },
  minorStar: { color: C.green, fontFamily: cjk, fontSize: 8.5, marginRight: 3, lineHeight: 12 },
  minorSha: { color: "#C25743" },
  monthsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  monthChip: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 0, paddingVertical: 4, paddingHorizontal: 7, margin: 2 },
  monthNow: { borderColor: C.gold },
  monthTxt: { color: C.muted, fontSize: 12 },
  selBody: { backgroundColor: C.card2,    padding: 12, marginTop: 6, marginBottom: 4 },
  palq: { color: C.gold, fontStyle: "italic", fontSize: 12, marginBottom: 5 },
  plain: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 2, fontStyle: "italic" },
});

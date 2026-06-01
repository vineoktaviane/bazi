/* PillarByPillar, DirectionsSection, LuckPillars, RN port, logic identical to reference. */
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import { tenGod, relate, TG, TG_LINE } from "../../engines/bazi";
import { growthStage } from "../../engines/stars";
import { lifeGua, GUA_DATA, DIR_TYPES } from "../../engines/mansions";
import { pick, fill, TG_MONTH, PILLAR_DOMAIN, NATAL_CLOSER, REL_TEXT } from "../../content/banks";
import { GOD_IN_PALACE, GOD_IN_PALACE2, PALACE_PAIR, REL_LABEL, REL_GOOD } from "../../content/banks2";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { Dominant, Factor, Inter, P, Under, Watch, Fine, Empty, SubSec, B, SealChip } from "../components";

/* Pillar-by-pillar deep reading + the chart's own internal branch relations */
export function PillarByPillar({ chart }) {
  const dm = chart.day.stem;
  const rows = [
    { pos: "year", cnLabel: "年", title: "Year pillar, roots & public face", god: tenGod(dm, chart.year.stem), bank: "year", pillar: chart.year },
    { pos: "month", cnLabel: "月", title: "Month pillar, career & prime years", god: tenGod(dm, chart.month.stem), bank: "month", pillar: chart.month },
    { pos: "day", cnLabel: "日", title: "Day pillar, you & the spouse palace", god: tenGod(dm, BRANCHES[chart.day.branch].hidden[0]), bank: "spouse", pillar: chart.day },
    { pos: "hour", cnLabel: "時", title: "Hour pillar, legacy, children & plans", god: tenGod(dm, chart.hour.stem), bank: "hour", pillar: chart.hour },
  ];
  const pairs = [];
  const POS = ["year", "month", "day", "hour"];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const r = relate(chart[POS[i]].branch, chart[POS[j]].branch);
    if (r) pairs.push({ a: POS[i], b: POS[j], r });
  }
  return (
    <View>
      {rows.map((row) => {
        const bg = tenGod(dm, BRANCHES[row.pillar.branch].hidden[0]);
        return (
          <Factor key={row.pos} chip={row.cnLabel} title={row.title} right={`${row.bank === "spouse" ? "occupant" : "stem"}: ${TG[row.god].name}`}>
            <P>{pick([GOD_IN_PALACE[row.bank][row.god], GOD_IN_PALACE2[row.bank][row.god]], chart.day.branch + chart.hour.branch)}</P>
            {row.bank !== "spouse" && bg !== row.god ? (
              <Fine>Beneath it, the branch carries {TG[bg].name}, {TG_LINE[bg].toLowerCase()} That undertone colours this palace even when the surface theme is quiet.</Fine>
            ) : null}
          </Factor>
        );
      })}
      <SubSec>Relations inside your own chart</SubSec>
      {pairs.length === 0 && <Empty>Your four branches form no clash, combination, harm or punishment with each other, an unusually self-contained chart where the palaces run independently.</Empty>}
      {pairs.map((p, i) => (
        <Inter key={i} kind={REL_GOOD[p.r] ? "good" : "bad"} label={`${REL_LABEL[p.r]} · ${p.a} ↔ ${p.b}`}>
          <P>{fill(REL_TEXT[p.r](PALACE_PAIR[`${p.a}-${p.b}`], i + chart.day.branch), "life")} {pick(NATAL_CLOSER(PALACE_PAIR[`${p.a}-${p.b}`]), i + chart.month.branch)}</P>
        </Inter>
      ))}
    </View>
  );
}

/* 8 Mansions directions */
export function DirectionsSection({ chart, profile }) {
  const g = lifeGua(chart.baziYear, profile.gender);
  const gd = GUA_DATA[g];
  const byDir = {};
  DIR_TYPES.forEach((d) => (byDir[gd.dirs[d.k]] = d));
  const GRID = [["NW", "N", "NE"], ["W", null, "E"], ["SW", "S", "SE"]];
  return (
    <View>
      <Dominant label={`Your Life Gua: ${g} ${gd.name} ${gd.cn} ${py(gd.cn)} (${EL_NAME[gd.el]}) · ${gd.group} group`}>
        <P>Derived from your birth year and gender, the Life Gua assigns each compass direction a personal quality, four that support you, four that work against you. Use them where direction is free to choose: desk facing, bed orientation, seat in a negotiation, departure bearing on an important day.</P>
      </Dominant>
      <View style={s.compass}>
        {GRID.map((row, ri) => (
          <View key={ri} style={{ flexDirection: "row" }}>
            {row.map((d, ci) =>
              d === null ? (
                <View key={ci} style={[s.compassCell, s.compassCenter]}>
                  <Text style={{ fontFamily: cjk, fontSize: 22, color: C.gold }}>{gd.cn}</Text>
                  <Text style={{ color: C.dim, fontSize: 12, marginTop: 1 }}>{py(gd.cn)}</Text>
                </View>
              ) : (
                <View key={ci} style={[s.compassCell, { borderColor: byDir[d].good ? C.green + "88" : C.red + "88" }]}>
                  <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{d}</Text>
                  <Text style={{ color: byDir[d].good ? C.green : C.red, fontSize: 12 }}>{byDir[d].name.split(" ")[0]}</Text>
                </View>
              )
            )}
          </View>
        ))}
      </View>
      {DIR_TYPES.map((d) => (
        <Inter key={d.k} kind={d.good ? "good" : "bad"} label={`${gd.dirs[d.k]} · ${d.name}, ${d.en}`}>
          <P>{d.text}</P>
        </Inter>
      ))}
    </View>
  );
}

export function LuckPillars({ chart, profile }) {
  const now = new Date();
  const curAge = Math.floor((now - new Date(profile.y, profile.m - 1, profile.d)) / (365.25 * 24 * 3600 * 1000));
  const curIdx = chart.luck.findIndex((l) => curAge >= l.age && curAge < l.age + 10);
  const [sel, setSel] = useState(curIdx >= 0 ? curIdx : 0);
  const l = chart.luck[sel];
  const gS = tenGod(chart.day.stem, l.stem);
  const gB = tenGod(chart.day.stem, BRANCHES[l.branch].hidden[0]);
  const inter = [];
  for (const pos of ["year", "month", "day", "hour"]) {
    const r = relate(l.branch, chart[pos].branch);
    if (r) inter.push({ pos, r });
  }
  const y0 = profile.y + l.age;
  const stage = growthStage(chart.day.stem, l.branch);
  return (
    <View>
      <Under>
        Luck pillars are your life divided into <B color={C.muted}>ten-year chapters</B>. Your natal chart is the vehicle, fixed at birth; each luck pillar is the <B color={C.muted}>road that decade drives on</B>. Your pillars run {chart.forward ? "forward" : "backward"} through the calendar from age {chart.startAge}. The pillar's stem shapes the visible events of the decade; its branch shapes the environment underneath. Tap a pillar to read its decade.
      </Under>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
        {chart.luck.map((lp, i) => (
          <Pressable
            key={i}
            onPress={() => setSel(i)}
            accessibilityRole="button"
            accessibilityState={{ selected: i === sel }}
            accessibilityLabel={`Ages ${lp.age} to ${lp.age + 9}${i === curIdx ? ", current decade" : ""}`}
            style={[s.luckCell, i === sel && s.luckSel, i === curIdx && s.luckCur]}
          >
            <Text style={s.luckAge}>{lp.age}–{lp.age + 9}</Text>
            <Text style={{ fontFamily: cjk, fontSize: 20, color: EL_COLOR[STEMS[lp.stem].el] }}>{STEMS[lp.stem].cn}</Text>
            <Text style={s.luckPy}>{STEMS[lp.stem].p}</Text>
            <Text style={{ fontFamily: cjk, fontSize: 20, color: EL_COLOR[BRANCHES[lp.branch].el] }}>{BRANCHES[lp.branch].cn}</Text>
            <Text style={s.luckPy}>{BRANCHES[lp.branch].p}</Text>
            <Text style={s.luckTg}>{i === curIdx ? "now" : TG[tenGod(chart.day.stem, lp.stem)].name.split(" ")[0]}</Text>
            <Text style={s.luckStage}>{growthStage(chart.day.stem, lp.branch).en}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.luckBody}>
        <Text style={{ color: C.gold, fontSize: 12, marginBottom: 6 }}>
          Ages {l.age}–{l.age + 9} (≈{y0}–{y0 + 9}) · {STEMS[l.stem].p} {BRANCHES[l.branch].p} · {TG[gS].name} over {TG[gB].name}
          {sel === curIdx ? "  ● current decade" : ""}
        </Text>
        <Under>Your Day Master stands at the <B color={C.muted}>{stage.en} {stage.cn} ({py(stage.cn)})</B> stage through this decade: {stage.text}.</Under>
        <P><B>Above the surface ({TG[gS].name}):</B> {fill(pick(TG_MONTH[gS].focus, sel + l.stem), "decade")}</P>
        <Watch><Text style={{ fontWeight: "700" }}>Decade-long caution:</Text> {fill(pick(TG_MONTH[gS].watch, sel + l.branch), "decade")}</Watch>
        {gB !== gS ? (
          <Under><B color={C.muted}>Underneath ({TG[gB].name}):</B> the day-to-day environment of this decade leans toward {TG_MONTH[gB].tag.toLowerCase()}, {(() => { const t = fill(pick(TG_MONTH[gB].focus, sel), "decade"); return t.charAt(0).toLowerCase() + t.slice(1); })()}</Under>
        ) : null}
        {inter.length > 0 ? inter.map((it, i) => (
          <Inter key={i} kind={REL_GOOD[it.r] ? "good" : "bad"} label={`${REL_LABEL[it.r]} → ${it.pos} pillar (all decade)`}>
            <P>{fill(REL_TEXT[it.r](PILLAR_DOMAIN[it.pos], sel + i), "decade")}</P>
          </Inter>
        )) : <Under>This pillar makes no direct clash or combination with your natal branches, its own theme plays out on relatively neutral ground.</Under>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  compass: { alignSelf: "center", marginVertical: 10 },
  compassCell: {
    width: 92, height: 60, margin: 2, borderWidth: 1, borderRadius: 0,
    alignItems: "center", justifyContent: "center", backgroundColor: C.card,
  },
  compassCenter: { borderColor: C.gold + "66" },
  luckCell: {
    width: 76, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 0,
    alignItems: "center", paddingVertical: 7, marginRight: 6,
  },
  luckSel: { borderColor: C.gold },
  luckCur: { backgroundColor: C.card2 },
  luckAge: { color: C.muted, fontSize: 12, marginBottom: 2 },
  luckPy: { color: C.dim, fontSize: 12, marginTop: -1 },
  luckTg: { color: C.gold, fontSize: 12, marginTop: 2 },
  luckStage: { color: C.dim, fontSize: 12 },
  luckBody: { backgroundColor: C.card2,    padding: 12, marginTop: 8 },
});

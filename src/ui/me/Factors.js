/* FiveFactors, TenGodBars, StrengthSection, RN port, logic identical to reference. */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STEMS, EL_CN, EL_NAME } from "../../engines/data";
import {
  elementProfile, tenGodProfile, dmStrength, tenGod,
  TG, TG_LINE, TG_DOMINANT, TG_DOMINANT2, FACTOR_DEFS, FACTOR_REAL,
  PRODUCES, CONTROLS, PRODUCED_BY, CONTROLLED_BY,
  EL_COLORS, EL_DIR, EL_CAREERS,
} from "../../engines/bazi";
import { pick } from "../../content/banks";
import { C, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { Dominant, P, Under, Fine, B } from "../components";
import { ElementCycle } from "./ChartBasics";

const STRENGTH_TEXT = {
  strong: "Strong in your chart, this theme dominates your life whether you choose it or not.",
  balanced: "Present in fair measure, available when you call on it.",
  scarce: "Scarce in your chart, this theme doesn't come naturally and needs conscious cultivation.",
};

export function FiveFactors({ chart }) {
  const dmEl = STEMS[chart.day.stem].el;
  const prof = elementProfile(chart);
  const avg = Object.values(prof).reduce((a, b) => a + b, 0) / 5;
  const strength = (v) => (v > avg * 1.3 ? "strong" : v < avg * 0.6 ? "scarce" : "balanced");
  return (
    <View>
      <Under>
        Every element in your chart plays a role <B color={C.muted}>relative to your Day Master</B>. Because you are {STEMS[chart.day.stem].p} ({EL_NAME[dmEl]}):{" "}
        <B color={EL_COLOR[PRODUCED_BY[dmEl]]}>{EL_NAME[PRODUCED_BY[dmEl]]}</B> feeds you,{" "}
        <B color={EL_COLOR[PRODUCES[dmEl]]}>{EL_NAME[PRODUCES[dmEl]]}</B> is what you create,{" "}
        <B color={EL_COLOR[CONTROLS[dmEl]]}>{EL_NAME[CONTROLS[dmEl]]}</B> is what you command,{" "}
        <B color={EL_COLOR[CONTROLLED_BY[dmEl]]}>{EL_NAME[CONTROLLED_BY[dmEl]]}</B> pressures you, and other{" "}
        <B color={EL_COLOR[dmEl]}>{EL_NAME[dmEl]}</B> stands beside you.
      </Under>
      <Under>
        <B color={C.muted}>Important, none of this is literal.</B> Elements are symbolic categories, not materials or job titles. "Wood is your Output" does not mean carpentry: it describes the character of what flows out of you and the type of field where it's valued. Read every element below that way.
      </Under>
      <ElementCycle dmEl={dmEl} />
      {FACTOR_DEFS.map((f) => {
        const el = f.rel(dmEl);
        const stg = strength(prof[el]);
        return (
          <View key={f.key} style={s.factor}>
            <View style={s.factorHead}>
              <View style={[s.elBadge, { backgroundColor: EL_COLOR[el] }]}>
                <Text style={s.elBadgeText}>{EL_CN[el]}</Text>
              </View>
              <Text style={s.factorTitle}>{EL_NAME[el]} = your {f.label}</Text>
              <Text style={s.factorCn}>{f.cn} {py(f.cn)}</Text>
              <Text style={[s.factorStrength, stg === "strong" ? { color: C.gold } : stg === "scarce" ? { color: C.red } : { color: C.muted }]}>{stg}</Text>
            </View>
            <P>{f.meaning}</P>
            <Under>{FACTOR_REAL[f.key](el)}</Under>
            <Fine>{STRENGTH_TEXT[stg]} Its Ten Gods: {f.gods.map((g) => TG[g].name).join(" and ")}.</Fine>
          </View>
        );
      })}
    </View>
  );
}

export function TenGodBars({ chart }) {
  const { pct, top } = tenGodProfile(chart);
  const dmEl = STEMS[chart.day.stem].el;
  const max = Math.max(...Object.values(pct), 1);
  const godEl = (g) => FACTOR_DEFS.find((f) => f.gods.includes(g)).rel(dmEl);
  return (
    <View>
      <Dominant label={`Your dominant god, ${TG[top].name} ${TG[top].cn} (${py(TG[top].cn)})`}>
        <P>{pick([TG_DOMINANT[top], TG_DOMINANT2[top]], chart.day.stem + chart.month.branch)}</P>
      </Dominant>
      {Object.keys(TG).map((g) => (
        <View key={g} style={s.tgRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={s.tgName}>{TG[g].name} <Text style={{ color: C.dim }}>{TG[g].cn} {py(TG[g].cn)}</Text></Text>
            <View style={s.tgTrack}>
              <View style={[s.tgFill, { width: `${(pct[g] / max) * 100}%`, backgroundColor: EL_COLOR[godEl(g)] }]} />
            </View>
            <Text style={s.tgPct}>{pct[g]}%</Text>
          </View>
          <Text style={s.tgLine}>{TG_LINE[g]}</Text>
        </View>
      ))}
      <Fine>Percentages show each god's share of presence in your natal chart (visible stems and hidden stems, month branch weighted for season). Different schools weight differently, treat the ranking, not the exact numbers, as the signal.</Fine>
    </View>
  );
}

export function StrengthSection({ chart }) {
  const st = dmStrength(chart);
  return (
    <Dominant label={`Your Day Master is ${st.strong ? "strong" : "weak"}  (${Math.round(st.ratio * 100)}% self-support${st.seasonal ? ", in season" : ", out of season"})`}>
      <P>
        {st.strong
          ? "A strong Day Master means the chart already feeds you plenty of your own energy, more fuel isn't what you need. You thrive when that strength is SPENT: on producing (Output), earning (Wealth) and shouldering responsibility (Influence). Idleness and over-support make a strong chart restless and domineering."
          : "A weak Day Master means the chart drains or pressures you more than it feeds you. This is not a flaw, many accomplished charts are weak, but it means your priority is replenishment: the elements that feed you (Resource) and stand beside you (Companions) are your friends, and you perform best with backup, knowledge and allies rather than lone-wolf grinding."}
      </P>
      <Text style={{ color: C.gold, fontSize: 12, fontWeight: "700", marginTop: 4, marginBottom: 6 }}>Favorable elements & how to use them</Text>
      {st.favorable.map((el) => (
        <View key={el} style={{ flexDirection: "row", marginBottom: 7, alignItems: "flex-start" }}>
          <View style={[s.elBadge, { backgroundColor: EL_COLOR[el], marginTop: 2 }]}>
            <Text style={s.elBadgeText}>{EL_CN[el]}</Text>
          </View>
          <Text style={{ color: C.text, fontSize: 12, flex: 1, lineHeight: 18 }}>
            <B>{EL_NAME[el]}</B>, colors: {EL_COLORS[el]} · direction: {EL_DIR[el]} · fields: {EL_CAREERS[el]}
          </Text>
        </View>
      ))}
      <Fine>Strong/weak is judged here by a transparent simplified rule (share of self + resource elements, with a seasonal bonus). Full practitioners also weigh rooting, combinations and special structures, borderline charts deserve a human reading.</Fine>
    </Dominant>
  );
}

const s = StyleSheet.create({
  factor: { backgroundColor: C.card,    padding: 12, marginBottom: 9 },
  factorHead: { flexDirection: "row", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 },
  factorTitle: { color: C.text, fontWeight: "700", fontSize: 18 },
  factorCn: { color: C.dim, fontSize: 12 },
  factorStrength: { fontSize: 12, marginLeft: "auto", fontStyle: "italic" },
  elBadge: { width: 22, height: 22, borderRadius: 0, alignItems: "center", justifyContent: "center", marginRight: 7 },
  elBadgeText: { color: C.ink, fontSize: 14, fontWeight: "700" },
  tgRow: { marginBottom: 8 },
  tgName: { width: 172, color: C.text, fontSize: 12 },
  tgTrack: { flex: 1, height: 9, backgroundColor: C.card,  overflow: "hidden",   },
  tgFill: { height: "100%", borderRadius: 0 },
  tgPct: { width: 38, textAlign: "right", color: C.muted, fontSize: 12 },
  tgLine: { color: C.dim, fontSize: 12, marginLeft: 172, marginTop: 1 },
});

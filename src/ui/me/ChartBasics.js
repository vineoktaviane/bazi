/* PillarTablet, ElementBars, ElementCycle, StarsSection, SeasonSection,
 * faithful RN port of the reference components (logic identical, rendering translated). */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line, Circle, Text as SvgText, Path, Defs, Marker } from "react-native-svg";
import { STEMS, BRANCHES, EL_CN, EL_NAME } from "../../engines/data";
import { tenGod, TG, PRODUCES, CONTROLS, PRODUCED_BY } from "../../engines/bazi";
import { symbolicStars, growthStage } from "../../engines/stars";
import { pick } from "../../content/banks";
import { SEASON_REL, BRANCH_SEASON, SEASON_REL2 } from "../../content/banks2";
import { SEASON_REL3 } from "../../content/banks3";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { Dominant, P, Fine, SealChip } from "../components";

export function PillarTablet({ label, cnLabel, pillar, dm, compact = false }) {
  const st = STEMS[pillar.stem], b = BRANCHES[pillar.branch];
  const gs = dm != null && !(label === "Day") ? tenGod(dm, pillar.stem) : null;
  const stage = dm != null ? growthStage(dm, pillar.branch) : null;
  return (
    <View style={s.tablet}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
        {!compact && <SealChip>{cnLabel}</SealChip>}
        <Text style={s.tabletLabel}>{label}</Text>
      </View>
      {!compact && <Text style={s.tabletTg}>{label === "Day" ? "Day Master" : gs ? TG[gs].name : " "}</Text>}
      <Text style={[s.tabletChar, { color: EL_COLOR[st.el] }]}>{st.cn}</Text>
      <Text style={s.tabletPinyin}>{compact ? EL_NAME[st.el] : `${st.p} · ${EL_NAME[st.el]}`}</Text>
      <Text style={[s.tabletChar, { color: EL_COLOR[b.el] }]}>{b.cn}</Text>
      <Text style={s.tabletPinyin}>{compact ? b.animal : `${b.p} · ${b.animal}`}</Text>
      {!compact && stage ? <Text style={s.tabletStage}>{stage.en}{"\n"}{stage.cn} {py(stage.cn)}</Text> : null}
      {!compact && <View style={s.tabletHidden}>
        {b.hidden.map((h, i) => (
          <View key={i} style={s.hid}>
            <Text style={{ color: EL_COLOR[STEMS[h].el], fontFamily: cjk, fontSize: 13 }}>{STEMS[h].cn}</Text>
            {dm != null ? <Text style={s.hidTg}>{tenGod(dm, h)}</Text> : null}
          </View>
        ))}
      </View>}
    </View>
  );
}

export function ElementBars({ profile }) {
  const max = Math.max(...Object.values(profile), 1);
  return (
    <View style={{ marginBottom: 6 }}>
      {["wood", "fire", "earth", "metal", "water"].map((el) => (
        <View key={el} style={s.elbarRow}>
          <Text style={[s.elbarName, { color: EL_COLOR[el] }]}>{EL_NAME[el]}</Text>
          <View style={s.elbarTrack}>
            <View style={[s.elbarFill, { width: `${(profile[el] / max) * 100}%`, backgroundColor: EL_COLOR[el] }]} />
          </View>
          <Text style={s.elbarVal}>{profile[el].toFixed(1)}</Text>
        </View>
      ))}
    </View>
  );
}

/* Five-element cycle diagram: gold arrows = produces, red dashed = controls; DM element ringed */
export function ElementCycle({ dmEl }) {
  const order = ["wood", "fire", "earth", "metal", "water"];
  const cx = 140, cy = 132, R = 96;
  const pt = (i, r = R) => {
    const a = ((-90 + 72 * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const shrink = (p1, p2, by) => {
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    const L = Math.hypot(dx, dy);
    return [[p1[0] + (dx / L) * by, p1[1] + (dy / L) * by], [p2[0] - (dx / L) * by, p2[1] - (dy / L) * by]];
  };
  const mkLine = (i, j, kind) => {
    const [a, b] = shrink(pt(i), pt(j), 30);
    return (
      <Line
        key={kind + i}
        x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
        stroke={kind === "prod" ? C.gold : C.red}
        strokeWidth={kind === "prod" ? 1.6 : 1.2}
        strokeDasharray={kind === "prod" ? undefined : "4 4"}
        markerEnd={`url(#${kind === "prod" ? "ap" : "ac"})`}
      />
    );
  };
  return (
    <View style={{ alignItems: "center", marginVertical: 8 }}>
      <Svg viewBox="0 0 280 268" width={280} height={268}>
        <Defs>
          <Marker id="ap" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <Path d="M0,0 L8,4 L0,8 z" fill={C.gold} />
          </Marker>
          <Marker id="ac" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <Path d="M0,0 L8,4 L0,8 z" fill={C.red} />
          </Marker>
        </Defs>
        {order.map((_, i) => mkLine(i, (i + 1) % 5, "prod"))}
        {order.map((_, i) => mkLine(i, (i + 2) % 5, "ctrl"))}
        {order.map((el, i) => {
          const [x, y] = pt(i);
          return (
            <React.Fragment key={el}>
              {el === dmEl && <Circle cx={x} cy={y} r={27} fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3 3" />}
              <Circle cx={x} cy={y} r={22} fill={C.card} stroke={EL_COLOR[el]} strokeWidth="2" />
              <SvgText x={x} y={y + 6} textAnchor="middle" fill={EL_COLOR[el]} fontSize="19" fontWeight="600">{EL_CN[el]}</SvgText>
              <SvgText x={x} y={y + 34} textAnchor="middle" fill={C.muted} fontSize="9.5">{py(EL_CN[el])} · {EL_NAME[el]}{el === dmEl ? " · you" : ""}</SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={{ color: C.dim, fontSize: 12 }}>
        <Text style={{ color: C.gold }}>- produces</Text>   <Text style={{ color: C.red }}>--- controls</Text>
      </Text>
    </View>
  );
}

export function StarsSection({ chart }) {
  return (
    <View>
      {symbolicStars(chart).map((st) => (
        <View key={st.name} style={s.starCard}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
            <SealChip>{st.cn}</SealChip>
            <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{st.name}</Text>
            <Text style={{ color: C.gold, fontSize: 12, marginLeft: 8, flexShrink: 1 }}>{st.who}</Text>
          </View>
          <P>{st.text}</P>
        </View>
      ))}
    </View>
  );
}

/* Month Command: DM vs birth season, the deepest single classical factor */
export function SeasonSection({ chart }) {
  const dmEl = STEMS[chart.day.stem].el;
  const mEl = BRANCHES[chart.month.branch].el;
  let relKey;
  if (mEl === dmEl) relKey = "companion";
  else if (PRODUCED_BY[dmEl] === mEl) relKey = "resource";
  else if (PRODUCES[dmEl] === mEl) relKey = "output";
  else if (CONTROLS[dmEl] === mEl) relKey = "wealth";
  else relKey = "influence";
  return (
    <Dominant label={`The Month Command 月令 (yuè lìng), ${BRANCHES[chart.month.branch].p} ${BRANCHES[chart.month.branch].cn}`}>
      <P style={{ color: C.gold, fontStyle: "italic" }}>{BRANCH_SEASON[chart.month.branch]}</P>
      <P>{pick([SEASON_REL[relKey], SEASON_REL2[relKey], SEASON_REL3[relKey]], chart.day.branch + chart.year.branch)}</P>
      <Fine>In classical analysis the birth month outweighs every other single factor: it sets the season your Day Master must live in, and everything else in the chart is read against it.</Fine>
    </Dominant>
  );
}

const s = StyleSheet.create({
  tablet: {
    flex: 1, backgroundColor: C.card2,
    padding: 8, marginHorizontal: 2, alignItems: "center",
  },
  tabletLabel: { color: C.muted, fontSize: 12 },
  tabletTg: { color: C.gold, fontSize: 12, marginBottom: 2, textAlign: "center" },
  tabletChar: { fontFamily: cjk, fontSize: 34, lineHeight: 40 },
  tabletPinyin: { color: C.muted, fontSize: 12, marginBottom: 3, textAlign: "center" },
  tabletStage: { color: C.dim, fontSize: 12, marginTop: 2, textAlign: "center" },
  tabletHidden: { flexDirection: "row", marginTop: 5, gap: 5, flexWrap: "wrap", justifyContent: "center" },
  hid: { alignItems: "center" },
  hidTg: { color: C.dim, fontSize: 12 },
  elbarRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  elbarName: { width: 104, fontSize: 12 },
  elbarTrack: { flex: 1, height: 10, backgroundColor: C.card,  overflow: "hidden",   },
  elbarFill: { height: "100%", borderRadius: 0 },
  elbarVal: { width: 34, textAlign: "right", color: C.muted, fontSize: 12 },
  starCard: { backgroundColor: "transparent",    padding: 11, marginBottom: 8 },
});

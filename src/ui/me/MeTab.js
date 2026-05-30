/* Me tab 命, natal analysis. Composition mirrors the reference "chart" tab. */
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import { sexIndex, elementProfile, dmStrength } from "../../engines/bazi";
import { voidBranches, nayinOf, VOID_PALACE } from "../../engines/stars";
import { pick, DM_BLURB } from "../../content/banks";
import { DM_BLURB2 } from "../../content/banks2";
import { DM_BLURB3 } from "../../content/banks3";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { cnpy } from "../pinyin";
import { Sec, Factor, P, Under, Fine, B, Disclosure, TabNavigation } from "../components";
import { PillarTablet, ElementBars, StarsSection, SeasonSection } from "./ChartBasics";
import { FiveFactors, TenGodBars, StrengthSection } from "./Factors";
import { PillarByPillar, DirectionsSection, LuckPillars } from "./Deep";
import { ZwdsSection } from "./Zwds";
import { Synthesis } from "./Synthesis";

export function MeTab({ chart, profile }) {
  const [section, setSection] = useState("overview");
  const strength = dmStrength(chart);
  const dmName = STEMS[chart.day.stem].p;
  const blurb = pick([DM_BLURB[dmName], DM_BLURB2[dmName], DM_BLURB3[dmName]], chart.month.branch + chart.hour.branch);
  /* every blurb reads "Element, image. Body…", first sentence becomes the title, the rest the body */
  const blurbDot = blurb.indexOf(". ");
  const blurbLead = blurb.slice(0, blurbDot);
  const blurbBody = blurb.slice(blurbDot + 2);
  const dsi = sexIndex(chart.day.stem, chart.day.branch);
  const voids = voidBranches(dsi);
  const voidPalaces = ["year", "month", "hour"].filter((pos) => voids.includes(chart[pos].branch));
  return (
    <View>
      <Text style={s.eyebrow}>MY CHART</Text>
      <Text accessibilityRole="header" style={s.pageTitle}>{profile.name}</Text>
      <Text style={s.pageDescription}>{profile.d}.{profile.m}.{profile.y}</Text>
      <View style={s.dmCard}>
        <Text style={[s.dmGlyph, { color: EL_COLOR[STEMS[chart.day.stem].el] }]}>{STEMS[chart.day.stem].cn}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.dmLabel}>YOUR DAY MASTER</Text>
          <Text style={s.dmTitle}>{dmName} · {EL_NAME[STEMS[chart.day.stem].el]}</Text>
          <Text style={s.dmText}>{blurbLead}</Text>
        </View>
      </View>

      <TabNavigation label="Chart sections" value={section} onChange={setSection}
        items={[{ key: "overview", label: "Overview" }, { key: "elements", label: "Elements" },
          { key: "cycles", label: "Life cycles" }, { key: "deeper", label: "More" }]} />

      {section === "overview" && <>
      <Sec cn="柱">Four Pillars</Sec>
      <View style={{ flexDirection: "row" }}>
        <PillarTablet compact label="Hour" cnLabel="時" pillar={chart.hour} dm={chart.day.stem} />
        <PillarTablet compact label="Day" cnLabel="日" pillar={chart.day} dm={chart.day.stem} />
        <PillarTablet compact label="Month" cnLabel="月" pillar={chart.month} dm={chart.day.stem} />
        <PillarTablet compact label="Year" cnLabel="年" pillar={chart.year} dm={chart.day.stem} />
      </View>
      <View style={s.quickFacts}>
        <View style={s.quickFact}><Text style={s.factLabel}>Polarity</Text><Text style={s.factValue}>{STEMS[chart.day.stem].yang ? "Yang" : "Yin"}</Text></View>
        <View style={s.quickFact}><Text style={s.factLabel}>Supporting elements</Text><Text style={s.factValue}>{strength.favorable.map(el => EL_NAME[el]).join(" · ")}</Text></View>
      </View>
      <Sec cn="衡">Your elements</Sec>
      <ElementBars profile={elementProfile(chart)} />
      <Disclosure label="Read your full profile"><P>{blurbBody}</P><Synthesis chart={chart} profile={profile} /></Disclosure>

      </>}

      {section === "deeper" && <>
      <Sec cn="音">Birth natures & voids</Sec>
      <Factor chip="音" title="The texture of your chart">
        <P>Year Na Yin: <B>{cnpy(nayinOf(sexIndex(chart.year.stem, chart.year.branch)))}</B>, the poetic nature of your birth year. Day Na Yin: <B>{cnpy(nayinOf(dsi))}</B>, the texture of your inner self.</P>
        <Under>Your void branches (空亡 kōng wáng): <B color={C.muted}>{voids.map((v) => `${BRANCHES[v].animal} ${BRANCHES[v].cn} ${BRANCHES[v].p}`).join(" & ")}</B>. A void palace holds its themes loosely: what it governs tends to arrive late, feel distant, or refuse the usual script. The cure is to fill it on purpose, with real plans and habits. {voidPalaces.length ? voidPalaces.map((pos) => VOID_PALACE[pos]).join(" ") : "None of your natal palaces falls void, every seat in your chart is fully occupied."} In months and years of these branches, plans in the affected areas can feel slow or unreal, schedule patience there.</Under>
      </Factor>

      </>}

      {section === "elements" && <>
      <Sec cn="令">Your birth season</Sec>
      <SeasonSection chart={chart} />

      <Sec cn="行">How your elements interact</Sec>
      <FiveFactors chart={chart} />

      <Sec cn="神" note="ten flavors of energy">The Ten Gods in your chart</Sec>
      <TenGodBars chart={chart} />

      <Sec cn="強" note="what feeds you">Strength & favorable elements</Sec>
      <StrengthSection chart={chart} />

      <Sec cn="衡">Element balance</Sec>
      <ElementBars profile={elementProfile(chart)} />

      </>}

      {section === "cycles" && <>
      <Sec cn="方">Your directions, 8 Mansions</Sec>
      <DirectionsSection chart={chart} profile={profile} />

      <Sec cn="運">Luck pillars, your ten-year chapters</Sec>
      <LuckPillars chart={chart} profile={profile} />

      </>}

      {section === "deeper" && <>
      <Sec cn="宮">Pillar by pillar</Sec>
      <PillarByPillar chart={chart} />
      <Sec cn="星" note="special markers in your chart">Your symbolic stars</Sec>
      <StarsSection chart={chart} />
      <Sec cn="紫">Zi Wei Dou Shu, the second lens</Sec>
      <ZwdsSection chart={chart} profile={profile} />
      </>}

      <Fine>For reflection, not prediction.</Fine>
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: { color: C.accent, fontSize: 12, fontWeight: "700", letterSpacing: 2, marginBottom: 10 },
  pageTitle: { color: C.text, fontFamily: serif, fontSize: 28, lineHeight: 40 },
  pageDescription: { color: C.muted, fontSize: 14, lineHeight: 23, marginTop: 8, marginBottom: 24 },
  dmCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.card2,

     padding: 16, gap: 16 },
  dmGlyph: { fontFamily: cjk, fontSize: 56, lineHeight: 68 },
  dmLabel: { color: C.accent, fontSize: 12, letterSpacing: 1.5, fontWeight: "700", marginBottom: 8 },
  dmTitle: { fontFamily: serif, color: C.text, fontSize: 18, lineHeight: 28, marginBottom: 8 },
  dmText: { color: C.muted, fontSize: 14, lineHeight: 23 },
  quickFacts: { flexDirection: "row", gap: 24, marginTop: 8, flexWrap: "wrap", backgroundColor: C.card2, paddingHorizontal: 16 },
  quickFact: { flex: 1, minWidth: 125,   paddingVertical: 16 },
  factLabel: { color: C.muted, fontSize: 12, marginBottom: 8 },
  factValue: { color: C.text, fontSize: 14, fontWeight: "600" },
});

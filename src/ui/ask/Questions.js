/* Often-asked life questions 常問, card UI. Definitions and scanner live in content/questions.js. */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STEMS, BRANCHES } from "../../engines/data";
import { TG } from "../../engines/bazi";
import { STAR_LABEL, scanQuestion } from "../../content/questions";
import { C, serif } from "../theme";
import { SubSec, Inter, P, Under, Fine, Empty, B } from "../components";

export function LifeQuestionCard({ chart, profile, qd }) {
  const res = scanQuestion(chart, profile, qd);
  const gods = res.gods;
  return (
    <View style={s.card}>
      <Text style={s.q}>{qd.q}</Text>
      <View style={s.honest}>
        <Text style={s.honestTitle}>What a chart can, and cannot, do</Text>
        <Text style={s.honestText}>
          {qd.cant} What it <Text style={{ color: C.text }}>can</Text> show is when the influences tradition ties to this question, {qd.markers}, run strongest in your own cycle. Read the windows below as times when the theme is loudest, never as appointments.
        </Text>
      </View>
      <SubSec>Your markers for this question</SubSec>
      <Under>
        {qd.stars.filter((sk) => (res.starBr[sk] || []).length > 0).map((sk, i) => (
          <Text key={sk}>
            {i > 0 ? "\n" : ""}Your {STAR_LABEL[sk].name} <B color={C.gold}>{STAR_LABEL[sk].cn}</B> sits in {res.starBr[sk].map((b) => `${BRANCHES[b].animal} (${BRANCHES[b].cn} ${BRANCHES[b].p})`).join(" and ")}, any year or month of that sign touches it.
          </Text>
        ))}
        {gods.length > 0 ? (
          <Text>{"\n"}Your {qd.godWord}: <B color={C.muted}>{gods.map((g) => `${TG[g].name} ${TG[g].cn}`).join(" and ")}</B>, watched for on the stems and hidden stems of each period.</Text>
        ) : null}
      </Under>
      <SubSec>{qd.caution ? "Decades that ask for extra care" : "Decades where this theme runs strongest"}</SubSec>
      {res.decades.length === 0 && <Empty>None of your coming decades flags this strongly. That is not a refusal, it means the theme arrives through ordinary effort rather than a marked window.</Empty>}
      {res.decades.map((d) => (
        <Inter key={d.age} kind={qd.caution ? "bad" : "good"} label={`Ages ${d.age}–${d.age + 9} (≈${d.y0}–${d.y0 + 9}) · ${STEMS[d.stem].cn}${BRANCHES[d.branch].cn} ${STEMS[d.stem].p} ${BRANCHES[d.branch].p}${d.current ? " · current decade" : ""}`}>
          <P>{d.reasons.join("; ")}.</P>
        </Inter>
      ))}
      <SubSec>{qd.caution ? "Coming years to treat gently" : "Coming years that activate it"}</SubSec>
      {res.years.length === 0 && <Empty>No year in the next twelve flags this strongly, so let circumstance, not the calendar, set your pace here.</Empty>}
      {res.years.map((y) => (
        <Inter key={y.Y} kind={qd.caution ? "bad" : "good"} label={`${y.Y} · ${STEMS[y.stem].cn}${BRANCHES[y.branch].cn} ${STEMS[y.stem].p} ${BRANCHES[y.branch].p}`}>
          <P>{y.reasons.join("; ")}.</P>
        </Inter>
      ))}
      <Fine>
        Computed from your chart's stars and ten gods, not generated. A strong window says the theme is <B color={C.dim}>loudly flagged</B>, never that the event occurs, and a quiet chart never forbids anything. For a yes/no on a specific decision, cast the oracle below.
      </Fine>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card2,    padding: 12, marginTop: 10 },
  q: { color: C.gold, fontFamily: serif, fontSize: 18, lineHeight: 23, marginBottom: 8 },
  honest: { backgroundColor: C.card,      padding: 10, marginBottom: 4 },
  honestTitle: { color: C.muted, fontSize: 18, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 },
  honestText: { color: C.dim, fontSize: 14, lineHeight: 18.5 },
});

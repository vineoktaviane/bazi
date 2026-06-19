/* Ask tab 卜, no-AI oracle. Casting, verdict and timing logic identical to reference. */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { STEMS, BRANCHES } from "../../engines/data";
import { TRIGRAMS, QUESTION_CATS, QUESTION_TYPES, castOracle } from "../../engines/oracle";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { Sec, SubSec, Inter, P, Under, Fine, Empty, Btn, ChipBtn, Field, Input, B, Disclosure, ExpandAction } from "../components";
import { LIFE_QUESTIONS } from "../../content/questions";
import { LifeQuestionCard } from "./Questions";

function TrigramGlyph({ n, big }) {
  const t = TRIGRAMS[n];
  return <Text style={{ color: EL_COLOR[t.el], fontSize: big ? 30 : 22, lineHeight: big ? 34 : 26 }}>{t.sym}</Text>;
}

export function OracleCard({ o, cat }) {
  const upperT = TRIGRAMS[o.upper], lowerT = TRIGRAMS[o.lower];
  const whenFirst = o.qtype === "when";
  const tiT = TRIGRAMS[o.ti === upperT.name ? o.upper : o.lower];
  const yongT = TRIGRAMS[o.yong === upperT.name ? o.upper : o.lower];
  const timingBlock = (
    <View>
      <SubSec>{whenFirst ? "The answer from your chart" : "Your chart's timing for this"}</SubSec>
      {o.timing.best.length === 0 && <Empty>No strongly activated months in the coming year for this question, the chart offers no special window, so choose by circumstance rather than waiting for one.</Empty>}
      {o.timing.best.map((m, i) => (
        <Inter key={i} kind="good" label={`${m.label} · ${STEMS[m.stem].cn}${BRANCHES[m.branch].cn} ${STEMS[m.stem].p} ${BRANCHES[m.branch].p}`}>
          <P>{m.why.join("; ")}.</P>
        </Inter>
      ))}
      {o.timing.avoid.map((m, i) => (
        <Inter key={"a" + i} kind="bad" label={`Avoid · ${m.label} · ${STEMS[m.stem].cn}${BRANCHES[m.branch].cn} ${STEMS[m.stem].p} ${BRANCHES[m.branch].p}`}>
          <P>{m.warn.join("; ")}.</P>
        </Inter>
      ))}
    </View>
  );
  const hexBlock = (
    <View>
      <View style={s.hexRow}>
        <View style={{ alignItems: "center", marginRight: 12 }}>
          <TrigramGlyph n={o.upper} big />
          <TrigramGlyph n={o.lower} big />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.hexName}>{o.hexName} <Text style={s.hexPy}>{py(o.hexName)}</Text></Text>
          <Text style={s.hexSub}>{upperT.name} over {lowerT.name} · moving line {o.moving}</Text>
          <Text style={[s.hexTier, o.rank >= 4 ? { color: C.green } : o.rank <= 2 ? { color: C.red } : { color: C.gold }]}>{o.tier}</Text>
        </View>
      </View>
      <Under>
        You in this question (Tǐ 體): <B color={EL_COLOR[tiT.el]}>{o.ti}</B>, {tiT.image}.{"\n"}
        The matter (Yòng 用): <B color={EL_COLOR[yongT.el]}>{o.yong}</B>, {yongT.image}.
        {o.stage ? <Text>{"\n"}The matter is <B color={C.muted}>{o.stage}</B>.</Text> : null}
      </Under>
      <Text style={s.verdict}>{o.verdictText}</Text>
    </View>
  );
  return (
    <View style={s.oracle}>
      <Under>
        {o.question ? <Text>You asked: <B color={C.muted}>“{o.question}”</B></Text> : <Text>Question: <B color={C.muted}>{cat?.label}</B></Text>}
        {"  ·  "}{QUESTION_TYPES.find((t) => t.key === (o.qtype || "should"))?.label}
      </Under>
      {o.answerLead ? <Text style={s.answer}>{o.answerLead}</Text> : null}
      {whenFirst ? (
        <View>{timingBlock}<SubSec>The moment's condition</SubSec>{hexBlock}</View>
      ) : (
        <View>{hexBlock}{timingBlock}</View>
      )}
      <Fine>Two independent methods, deliberately unmerged: the hexagram (Plum Blossom time-casting, solar-calendar adaptation) answers <B color={C.dim}>whether and how</B> this matter stands right now; the month scan answers <B color={C.dim}>when</B> your own chart supports it. When they disagree, tradition lets the hexagram govern the decision and the chart govern the schedule.</Fine>
    </View>
  );
}

export function AskTab({ chart, profile, data, persist }) {
  const [catKey, setCatKey] = useState(null);
  const [qtype, setQtype] = useState("should");
  const [q, setQ] = useState("");
  const [result, setResult] = useState(null);
  const [histOpen, setHistOpen] = useState(null);
  const [lifeQ, setLifeQ] = useState(null);
  const cast = async () => {
    const cat = QUESTION_CATS.find((c) => c.key === catKey);
    if (!cat) return;
    const o = castOracle(chart, profile, cat, q.trim(), qtype);
    setResult(o);
    const nd = { ...data, oracle: [o, ...(data.oracle || [])].slice(0, 20) };
    await persist(nd);
  };
  return (
    <View>
      <Disclosure label="Popular questions">
      <View style={s.catGrid}>
        {LIFE_QUESTIONS.map((lq) => (
          <ChipBtn key={lq.key} cn={lq.cn} label={lq.label} on={lifeQ === lq.key} onPress={() => setLifeQ(lifeQ === lq.key ? null : lq.key)} style={{ width: "48%" }} />
        ))}
      </View>
      {lifeQ ? <LifeQuestionCard chart={chart} profile={profile} qd={LIFE_QUESTIONS.find((lq) => lq.key === lifeQ)} /> : null}
      </Disclosure>
      <Sec cn="卜">Ask a question</Sec>
      <Field label="Topic" required>
        <View style={s.catGrid}>
          {QUESTION_CATS.map((c) => (
            <ChipBtn key={c.key} cn={c.cn} label={c.label} on={catKey === c.key} onPress={() => setCatKey(c.key)} style={{ width: "31%" }} />
          ))}
        </View>
      </Field>
      <Field label="Focus" required>
        <View style={s.catGrid}>
          {QUESTION_TYPES.map((t) => (
            <ChipBtn key={t.key} label={t.label} on={qtype === t.key} onPress={() => setQtype(t.key)} />
          ))}
        </View>
      </Field>
      <Field label="Your question (optional)">
        <Input
          value={q}
          onChangeText={setQ}
          placeholder="e.g. Should I accept the new offer?"
          maxLength={120}
        />
      </Field>
      <Btn label="Get a reading" onPress={cast} disabled={!catKey} />
      {!catKey ? <Text style={s.missingHint}>Choose a topic to continue.</Text> : null}
      {result ? <OracleCard o={result} cat={QUESTION_CATS.find((c) => c.key === result.catKey)} /> : null}
      {(data.oracle || []).length > 0 ? (
        <View>
          <Sec cn="錄">Past readings</Sec>
          {(data.oracle || []).map((o, i) => (
            <View key={o.ts} style={s.hist}>
              <Pressable
                onPress={() => setHistOpen(histOpen === i ? null : i)}
                accessibilityRole="button"
                accessibilityState={{ expanded: histOpen === i }}
                style={s.histHead}
              >
                <Text style={{ color: C.text, fontSize: 12, flex: 1 }}>
                  {new Date(o.ts).toLocaleDateString()} · {QUESTION_CATS.find((c) => c.key === o.catKey)?.label}{o.question ? `, "${o.question}"` : ""}
                </Text>
                <ExpandAction expanded={histOpen === i} />
              </Pressable>
              {histOpen === i ? <OracleCard o={o} cat={QUESTION_CATS.find((c) => c.key === o.catKey)} /> : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  catGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
  missingHint: { color: C.dim, fontSize: 12, marginTop: 6, textAlign: "center" },
  oracle: { backgroundColor: C.card2,    padding: 12, marginTop: 14 },
  hexRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  hexName: { fontFamily: serif, color: C.text, fontSize: 14 },
  hexPy: { color: C.dim, fontSize: 12, fontFamily: undefined },
  hexSub: { color: C.dim, fontSize: 12, marginTop: 2 },
  hexTier: { fontWeight: "700", fontSize: 14, marginTop: 3 },
  verdict: { color: C.text, fontSize: 14, lineHeight: 20, marginTop: 4, fontFamily: serif },
  answer: { color: C.gold, fontFamily: serif, fontSize: 14, lineHeight: 23, marginVertical: 8 },
  hist: { backgroundColor: C.card2,    marginBottom: 6, padding: 8 },
  histHead: { minHeight: 48, flexDirection: "row", alignItems: "center" },
});

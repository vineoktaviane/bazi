/* Qi Men Dun Jia 局: cast the moment's hour plate.
 * Plain-language reading first (content/qimenbank.js); the full technical plate folds away.
 * Engine (all school choices documented): src/engines/qimen.js */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_COLOR } from "../../engines/data";
import { QM_TERMS, PALACES, STARS, DOORS, DEITIES, XUN_CN, castQimen, plateOverlays } from "../../engines/qimen";
import { hourSummary, askerMatterRead, topicRead } from "../../content/qimenbank";
import { pick } from "../../content/banks";
import { C, serif, cjk } from "../theme";
import { Sec, SubSec, Inter, P, Under, Fine, Empty, Btn, ChipBtn, B } from "../components";

const TOPICS = [
  { key: "career", cn: "官", label: "Career & work" },
  { key: "money", cn: "財", label: "Money & business" },
  { key: "love", cn: "桃", label: "Love & marriage" },
  { key: "family", cn: "家", label: "Home & children" },
  { key: "health", cn: "醫", label: "Health & recovery" },
  { key: "travel", cn: "馬", label: "Travel & moving" },
  { key: "study", cn: "文", label: "Study & exams" },
  { key: "legal", cn: "訟", label: "Disputes & contracts" },
];

const GRID_ROWS = [[4, 9, 2], [3, 5, 7], [8, 1, 6]]; // Luo Shu, south at the top
const JU_CN = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const YUAN_NAME = ["upper yuan 上元", "middle yuan 中元", "lower yuan 下元"];
const NOBLES = { 1: "乙 the Day Noble", 2: "丙 the Moon Noble", 3: "丁 the Star Noble" };
const doorTone = (k) => (DOORS[k].good ? C.green : k === "block" || k === "scenery" ? C.gold : C.red);
const tierTone = { excellent: C.green, good: C.green, mixed: C.gold, poor: C.red, avoid: C.red };

function PalaceCell({ o, pal, ov }) {
  const info = PALACES[pal];
  const isDuty = pal === o.starTarget;
  if (pal === 5) {
    return (
      <View style={[s.cell, s.cellCenter]}>
        <Text style={s.cellDir}>{info.cn} Center</Text>
        <Text style={[s.cellStem, { color: EL_COLOR[STEMS[o.earth[5]].el] }]}>{STEMS[o.earth[5]].cn}</Text>
        <Text style={s.cellNote}>寄坤 lodges SW</Text>
      </View>
    );
  }
  const star = STARS[o.heavenStar[pal]];
  const door = DOORS[o.doors[pal]];
  const deity = DEITIES[o.deities[pal]];
  const marks = [
    ov.voidPals.includes(pal) ? "空" : null,
    ov.horsePal === pal ? "馬" : null,
    ov.jixing.some((j) => j.pal === pal) ? "刑" : null,
    ov.rumu.some((r) => r.pal === pal) ? "墓" : null,
  ].filter(Boolean);
  return (
    <View style={[s.cell, isDuty && s.cellDuty]}>
      <Text style={s.cellDir}>{info.cn} {info.dir}{marks.length ? <Text style={s.cellMark}>  {marks.join(" ")}</Text> : null}</Text>
      <Text style={s.cellDeity}>{deity.cn}</Text>
      <Text style={[s.cellStar, { color: EL_COLOR[star.el] }]}>
        {star.cn}{o.heavenStar[pal] === "rui" ? "禽" : ""} <Text style={s.cellStems}>{o.heavenStems[pal].map((st) => STEMS[st].cn).join("")}</Text>
      </Text>
      <Text style={[s.cellDoor, { color: doorTone(o.doors[pal]) }]}>{door.cn}</Text>
      <Text style={s.cellStem}>{STEMS[o.earth[pal]].cn}</Text>
    </View>
  );
}

/* The full technical plate, folded away behind a toggle for those who read charts. */
function PlateDetail({ o }) {
  const seed = o.ju + o.hour.branch;
  const ov = plateOverlays(o);
  const nobles = [1, 2, 3].map((st) => ({ st, pal: o.heavenStems.findIndex((arr) => arr && arr.includes(st)) })).filter((n) => n.pal > 0);
  return (
    <View>
      <View style={s.grid}>
        {GRID_ROWS.map((row, ri) => (
          <View key={ri} style={s.gridRow}>
            {row.map((pal) => <PalaceCell key={pal} o={o} pal={pal} ov={ov} />)}
          </View>
        ))}
      </View>
      <Under>
        Marks: <B color={C.red}>空</B> void this hour (results don't stick), <B color={C.gold}>馬</B> the hour's horse (movement lives here), <B color={C.red}>刑</B> self-punishment 擊刑 (don't force this quarter), <B color={C.red}>墓</B> a stem in its tomb 入墓 (initiative goes quiet). Doors on hostile ground (門迫) read weaker or meaner; the plain summary above already accounts for all of these.
      </Under>
      <Under>
        The Chief Protector 值符 rides <B color={EL_COLOR[STARS[o.zhifuStar].el]}>{STARS[o.zhifuStar].cn} {STARS[o.zhifuStar].p}</B> in the <B color={C.gold}>{PALACES[o.starTarget].dir}</B> this hour, the plate's strongest backing; the Duty Door 值使 is <B color={doorTone(o.zhishiDoor)}>{DOORS[o.zhishiDoor].cn} {DOORS[o.zhishiDoor].en}</B>. Hour of the {XUN_CN[o.xun]} decade.
      </Under>
      {nobles.length > 0 ? (
        <Under>
          {nobles.map((n, i) => (
            <Text key={n.st}>{i > 0 ? "\n" : ""}{NOBLES[n.st]} shines in the <B color={C.gold}>{PALACES[n.pal].dir}</B>{o.doors[n.pal] && DOORS[o.doors[n.pal]].good ? <Text>, joined with the {DOORS[o.doors[n.pal]].en}, a classically excellent pairing</Text> : null}.</Text>
          ))}
        </Under>
      ) : null}
      <SubSec>Each door, classically</SubSec>
      {[6, 1, 8, 9, 3, 4, 2, 7].map((home) => {
        const key = Object.keys(DOORS).find((k) => DOORS[k].home === home);
        const pal = o.doors.indexOf(key);
        if (pal < 1) return null;
        return (
          <Inter key={key} kind={DOORS[key].good ? "good" : key === "block" || key === "scenery" ? "dyn" : "bad"} label={`${DOORS[key].cn} ${DOORS[key].en} · ${PALACES[pal].dir}`}>
            <P>{pick(DOORS[key].texts, seed + pal)} With {STARS[o.heavenStar[pal]].cn} above and {DEITIES[o.deities[pal]].cn} ({DEITIES[o.deities[pal]].text}).</P>
          </Inter>
        );
      })}
    </View>
  );
}

export function QimenCard({ o }) {
  const [plateOpen, setPlateOpen] = useState(false);
  const sum = hourSummary(o);
  const am = askerMatterRead(o, o.ju + o.day.branch);
  const topic = o.topic ? TOPICS.find((t) => t.key === o.topic) : null;
  const tr = o.topic ? topicRead(o, o.topic, o.ju + o.day.branch) : null;
  const when = new Date(o.ts);
  return (
    <View style={s.card}>
      <Under>
        {o.question ? <Text>Cast over: <B color={C.muted}>“{o.question}”</B>{"\n"}</Text> : null}
        <Text>
          {when.toLocaleDateString()} {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · day {STEMS[o.day.stem].cn}{BRANCHES[o.day.branch].cn}, hour {STEMS[o.hour.stem].cn}{BRANCHES[o.hour.branch].cn} · {o.yang ? "陽遁" : "陰遁"} {JU_CN[o.ju - 1]}局 ({o.yang ? "Yang" : "Yin"} Dun, Ju {o.ju}) · {QM_TERMS[o.termK].cn} {QM_TERMS[o.termK].en}, {YUAN_NAME[o.yuan]}
        </Text>
      </Under>
      <Text style={s.answer}>{sum.lead}</Text>
      {am ? (
        <Under>
          You this hour stand in the <B color={C.gold}>{PALACES[am.dayPal].dir}</B>; the matter at hand sits in the <B color={C.gold}>{PALACES[am.hourPal].dir}</B>. {am.text}
        </Under>
      ) : null}
      {tr ? (
        <View>
          <SubSec>{topic.label}, this hour</SubSec>
          {tr.map((m, i) => (
            <Inter key={i} kind={m.good ? "good" : "bad"} label={`${m.role} · ${m.dir}`}>
              <P>{m.role} {m.text}.</P>
            </Inter>
          ))}
        </View>
      ) : null}
      {sum.patterns.length > 0 ? (
        <View>
          <SubSec>Named signs on the plate</SubSec>
          {sum.patterns.map((p) => (
            <Inter key={p.key} kind={p.good ? "good" : "bad"} label={`${p.name} ${p.cn} · ${p.dir}`}>
              <P>{p.text.charAt(0).toUpperCase() + p.text.slice(1)}.</P>
            </Inter>
          ))}
        </View>
      ) : null}
      <SubSec>This hour, in plain terms</SubSec>
      {sum.rows.map((r) => (
        <Inter key={r.key} kind={r.tier === "excellent" || r.tier === "good" ? "good" : r.tier === "mixed" ? "dyn" : "bad"} label={`${r.label} · ${r.dir}`}>
          <P>{r.text}</P>
        </Inter>
      ))}
      {sum.avoid.length > 0 ? (
        <Inter kind="bad" label={`Keep away · ${sum.avoid.map((a) => a.dir).join(", ")}`}>
          <P>{sum.avoid.map((a) => a.text).join(". ")}.</P>
        </Inter>
      ) : null}
      <Pressable onPress={() => setPlateOpen(!plateOpen)} accessibilityRole="button" accessibilityState={{ expanded: plateOpen }} style={s.plateToggle}>
        <Text style={s.plateToggleText}>{plateOpen ? "− Hide the full plate" : "+ Show the full plate (for chart readers)"}</Text>
      </Pressable>
      {plateOpen ? <PlateDetail o={o} /> : null}
      <Fine>
        Valid for this double-hour, until {String(o.untilHour).padStart(2, "0")}:00. A Qi Men plate is a tactical compass for the moment, where each mode of action sits, never a verdict on outcomes. School choices: hour plates, rotating method 轉盤, chai-bu 拆補 yuan, Tian Qin lodges in Kun 天禽寄坤, day rolls at 23:00, cast at device-local time.
      </Fine>
    </View>
  );
}

export function QimenSection({ data, persist }) {
  const [result, setResult] = useState(null);
  const [histOpen, setHistOpen] = useState(null);
  const [topic, setTopic] = useState(null);
  const cast = async () => {
    const o = { ...castQimen(new Date()), topic };
    setResult(o);
    const nd = { ...data, qimen: [o, ...(data.qimen || [])].slice(0, 10) };
    await persist(nd);
  };
  const hist = (data.qimen || []).filter((o) => !result || o.ts !== result.ts);
  return (
    <View>
      <Sec cn="遁">The moment's map, Qi Men Dun Jia</Sec>
      <Under>
        Where the oracle answers a question, Qi Men maps the hour itself: which compass directions help you right now, for what, and which to keep away from. Fully computed from the solar terms and this exact double-hour, nothing is generated.
      </Under>
      <Text style={s.stepLabel}>Reading a specific matter? (optional)</Text>
      <View style={s.topicGrid}>
        {TOPICS.map((t) => (
          <ChipBtn key={t.key} cn={t.cn} label={t.label} on={topic === t.key} onPress={() => setTopic(topic === t.key ? null : t.key)} style={{ width: "48%" }} />
        ))}
      </View>
      <Btn label={topic ? `Cast for ${TOPICS.find((t) => t.key === topic).label}` : "Cast the hour's plate"} onPress={cast} />
      {result ? <QimenCard o={result} /> : null}
      {hist.length > 0 ? (
        <View>
          <SubSec>Past plates</SubSec>
          {hist.map((o, i) => (
            <View key={o.ts} style={s.hist}>
              <Pressable
                onPress={() => setHistOpen(histOpen === i ? null : i)}
                accessibilityRole="button"
                accessibilityState={{ expanded: histOpen === i }}
                style={s.histHead}
              >
                <Text style={{ color: C.text, fontSize: 12.5, flex: 1 }}>
                  {new Date(o.ts).toLocaleDateString()} {new Date(o.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {o.yang ? "陽" : "陰"}{JU_CN[o.ju - 1]}局 · {DOORS[o.zhishiDoor].en}
                </Text>
                <Text style={{ color: C.dim, fontSize: 15 }}>{histOpen === i ? "−" : "+"}</Text>
              </Pressable>
              {histOpen === i ? <QimenCard o={o} /> : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card2, borderWidth: 1, borderColor: C.gold + "44", borderRadius: 10, padding: 12, marginTop: 14 },
  stepLabel: { color: C.muted, fontSize: 12, marginTop: 10, marginBottom: 5 },
  topicGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 8 },
  answer: { color: C.gold, fontFamily: serif, fontSize: 16.5, lineHeight: 23, marginVertical: 8 },
  grid: { marginTop: 10, marginBottom: 4 },
  gridRow: { flexDirection: "row" },
  cell: { flex: 1, borderWidth: 0.5, borderColor: C.line, alignItems: "center", paddingVertical: 7, paddingHorizontal: 2, backgroundColor: C.card, minHeight: 92, justifyContent: "center" },
  cellDuty: { borderColor: C.gold, borderWidth: 1.5 },
  cellCenter: { backgroundColor: C.card2 },
  cellDir: { color: C.dim, fontSize: 9, marginBottom: 2 },
  cellMark: { color: C.red, fontSize: 9, fontFamily: cjk },
  cellDeity: { color: C.muted, fontFamily: cjk, fontSize: 11 },
  cellStar: { fontFamily: cjk, fontSize: 15, marginVertical: 1 },
  cellStems: { fontSize: 12, color: C.text },
  cellDoor: { fontFamily: cjk, fontSize: 14, fontWeight: "700" },
  cellStem: { color: C.dim, fontFamily: cjk, fontSize: 11, marginTop: 2 },
  cellNote: { color: C.dim, fontSize: 8.5, marginTop: 2 },
  plateToggle: { marginTop: 10, paddingVertical: 6 },
  plateToggleText: { color: C.dim, fontSize: 12, textAlign: "center" },
  hist: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 8, marginBottom: 6, padding: 8 },
  histHead: { flexDirection: "row", alignItems: "center" },
});

/* People tab 人, the People Book. Pair analysis, joint timing, best days. Logic identical to reference. */
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import { computeChart, dmStrength } from "../../engines/bazi";
import { compat, pairTiming, bestDaysFor, REL_LENS } from "../../engines/compat";
import { C, serif, cjk } from "../theme";
import { py } from "../pinyin";
import { Sec, SubSec, Inter, P, Under, Empty, Btn, ChipBtn, B, birthDMY } from "../components";
import { MeTab } from "../me/MeTab";

function PairView({ me, other, meChart, oChart, rel }) {
  const res = useMemo(() => compat(meChart, oChart, "You", other.name), [meChart, oChart, other.name]);
  const lens = REL_LENS[rel || "friend"];
  const favMe = dmStrength(meChart).favorable, favO = dmStrength(oChart).favorable;
  const oElInMyFav = favMe.includes(STEMS[oChart.day.stem].el);
  const myElInTheirFav = favO.includes(STEMS[meChart.day.stem].el);
  const timing = useMemo(() => pairTiming(meChart, oChart, me.tz), [meChart, oChart, me.tz]);
  const gold = timing.filter((m) => m.tag === "gold");
  const rough = timing.filter((m) => m.tag !== "gold" && m.tag !== "neutral");
  const days = useMemo(() => bestDaysFor(meChart, oChart, me.tz), [meChart, oChart, me.tz]);
  return (
    <View style={s.pair}>
      <View style={s.matchHead}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={s.scoreN}>{res.score}</Text>
          <Text style={s.scoreOf}>/100</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.pairTitle}>You × {other.name}</Text>
          <Text style={s.verdict}>{res.verdict} · read as {lens.label}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={s.stamp}><Text style={s.stampText}>{res.seal}</Text></View>
          <Text style={s.stampPy}>{py(res.seal)}</Text>
        </View>
      </View>
      <P>{lens.intro} {res.summary}</P>
      <Inter kind="dyn" label="Structural asymmetry">
        <P>{oElInMyFav && myElInTheirFav ? `Mutual supply: each of you carries an element the other's chart needs, a rare two-way structural fit.`
          : oElInMyFav ? `${other.name}'s core element (${EL_NAME[STEMS[oChart.day.stem].el]}) is one of YOUR favorable elements: their presence structurally strengthens you. The reverse is not true, stay alert to the balance of giving.`
          : myElInTheirFav ? `Your core element (${EL_NAME[STEMS[meChart.day.stem].el]}) is one of THEIR favorable elements: you structurally strengthen them. Generosity is fine, unnoticed generosity is not; keep the exchange visible.`
          : `Neither Day Master feeds the other's structural needs: this bond runs on affinity and history, not elemental supply, which also means neither of you drains the other.`}</P>
      </Inter>
      <SubSec>Who you are to each other</SubSec>
      {res.dynamics.map((f, i) => (
        <Inter key={i} kind="dyn" label={f.title}><P>{f.text}</P></Inter>
      ))}
      <SubSec>Your joint year, storm & gold months</SubSec>
      {gold.length > 0 ? (
        <Inter kind="good" label="Gold months (both charts supported)">
          <P>{gold.map((m) => m.label).join(", ")}, the windows for joint decisions, trips, launches and difficult conversations that need goodwill on both sides.</P>
        </Inter>
      ) : null}
      {rough.map((m, i) => (
        <Inter key={i} kind="bad" label={`${m.label} · ${m.tag === "storm" ? "storm for both" : m.tag === "roughA" ? "rough for you" : `rough for ${other.name}`}`}>
          <P>{m.tag === "storm" ? "Both day pillars are clashed this month: joint turbulence, postpone shared commitments, expect friction to be circumstantial rather than personal, and say so out loud." : m.tag === "roughA" ? "Your day pillar is clashed: your own turbulence will leak into the relationship, name it early so it isn't misread as distance." : `${other.name}'s day pillar is clashed: their rough patch, not your fault, supply patience and don't take the weather personally.`}</P>
        </Inter>
      ))}
      {gold.length === 0 && rough.length === 0 ? <Empty>No storm or gold months in the coming year, a flat, workable stretch where timing matters less than intent.</Empty> : null}
      <SubSec>Best days to talk to them (next 30 days)</SubSec>
      {days.length === 0 ? <Empty>No standout days in the next month, pick by convenience; just avoid days that feel rushed.</Empty> : null}
      {days.map((d, i) => (
        <Inter key={i} kind="good" label={`${d.date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · ${STEMS[d.dp.stem].cn}${BRANCHES[d.dp.branch].cn} ${STEMS[d.dp.stem].p} ${BRANCHES[d.dp.branch].p}`}>
          <P>{d.why.join("; ")}, a day when the branches favour agreement between your two charts.</P>
        </Inter>
      ))}
      <SubSec>What flows well</SubSec>
      {res.strengths.map((f, i) => (
        <Inter key={i} kind="good" label={`+${f.pts} · ${f.title}`}><P>{f.text}</P></Inter>
      ))}
      <SubSec>Where friction lives</SubSec>
      {res.frictions.length === 0 ? <Empty>No structural clashes between these charts.</Empty> : null}
      {res.frictions.map((f, i) => (
        <Inter key={i} kind="bad" label={`${f.pts} · ${f.title}`}><P>{f.text}</P></Inter>
      ))}
    </View>
  );
}

export function PeopleTab({ data, active, chart, persist, onNew }) {
  const [sel, setSel] = useState(null);
  const [view, setView] = useState("pair"); // "pair" reading vs the person's own full chart
  const [confirmDel, setConfirmDel] = useState(null);
  const others = data.profiles.filter((p) => p.id !== data.activeId);
  const selected = others.find((p) => p.id === sel);
  const pickPerson = (id) => { setSel(sel === id ? null : id); setView("pair"); };
  const setRel = async (id, rel) => {
    const nd = { ...data, profiles: data.profiles.map((p) => (p.id === id ? { ...p, rel } : p)) };
    await persist(nd);
  };
  const setActive = async (id) => { const nd = { ...data, activeId: id }; await persist(nd); setSel(null); setView("pair"); };
  const remove = async (id) => {
    const nd = { ...data, profiles: data.profiles.filter((p) => p.id !== id) };
    if (nd.activeId === id) nd.activeId = nd.profiles[0] ? nd.profiles[0].id : null;
    await persist(nd);
    if (sel === id) setSel(null);
    setConfirmDel(null);
  };
  return (
    <View>
      <Sec cn="人">People book</Sec>
      <Under>Everyone here is read against <B color={C.muted}>{active.name}</B> (the main chart). Tap a person for the pair analysis, joint timing and best days to talk, or open their own full chart, without switching whose app this is. Tag each relationship, partner, family, work, friend, and the reading changes lens.</Under>
      {others.length === 0 ? <Empty>No one here yet. Tap “+ New chart” below to add someone, a partner, boss, parent or friend, and read your two charts together.</Empty> : null}
      {others.map((p) => {
        const c = computeChart(p);
        return (
          <View key={p.id} style={[s.prof, sel === p.id && s.profOn]}>
            {confirmDel === p.id ? (
              <View style={s.confirmRow}>
                <Text style={s.confirmText}>Remove {p.name}'s chart? This cannot be undone.</Text>
                <Btn small kind="ghost" label="Keep" onPress={() => setConfirmDel(null)} />
                <Btn small label="Remove" onPress={() => remove(p.id)} style={{ backgroundColor: C.red, marginLeft: 6 }} textStyle={{ color: C.text }} />
              </View>
            ) : (
              <>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => pickPerson(p.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: sel === p.id }}
                  accessibilityLabel={`${p.name}, tap for pair reading`}
                >
                  <Text style={s.profName}>{p.name}  <Text style={s.relChip}>{REL_LENS[p.rel || "friend"].label}</Text></Text>
                  <Text style={s.profSub}>{birthDMY(p)} · {STEMS[c.day.stem].p} {EL_NAME[STEMS[c.day.stem].el]} DM · {BRANCHES[c.year.branch].animal}</Text>
                </Pressable>
                <Pressable
                  onPress={() => setConfirmDel(p.id)}
                  style={s.del}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.name}`}
                >
                  <Text style={{ color: C.dim, fontSize: 14 }}>✕</Text>
                </Pressable>
              </>
            )}
          </View>
        );
      })}
      {selected ? (
        <View>
          <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <ChipBtn label={`You × ${selected.name}`} on={view === "pair"} onPress={() => setView("pair")} style={{ flex: 1 }} />
            <ChipBtn label={`${selected.name}'s full chart`} on={view === "chart"} onPress={() => setView("chart")} style={{ flex: 1 }} />
          </View>
          {view === "pair" ? (
            <View>
              <View style={s.lensRow}>
                {Object.keys(REL_LENS).map((k) => (
                  <Pressable key={k} onPress={() => setRel(selected.id, k)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: (selected.rel || "friend") === k }}
                    accessibilityLabel={`Read as ${REL_LENS[k].label}`}
                    style={[s.lensBtn, (selected.rel || "friend") === k && s.lensOn]}>
                    <Text style={{ fontFamily: cjk, color: C.gold, fontSize: 13 }}>{REL_LENS[k].cn}</Text>
                    <Text style={{ color: C.dim, fontSize: 12 }}>{py(REL_LENS[k].cn)}</Text>
                    <Text style={{ color: (selected.rel || "friend") === k ? C.text : C.muted, fontSize: 12 }}>{REL_LENS[k].label}</Text>
                  </Pressable>
                ))}
              </View>
              <PairView me={active} other={selected} meChart={chart} oChart={computeChart(selected)} rel={selected.rel} />
            </View>
          ) : (
            <View>
              <Under>You are reading <B color={C.muted}>{selected.name}</B>'s own natal chart. Your Me tab still shows {active.name}, nothing has switched.</Under>
              <MeTab chart={computeChart(selected)} profile={selected} />
            </View>
          )}
        </View>
      ) : null}
      <Sec cn="檔">Main chart</Sec>
      <Under>The main chart is who the whole app speaks to: the Me, Now and Ask tabs all read for this person. To simply <B color={C.muted}>look at</B> someone's chart, tap them in the People book above instead, that never switches anything.</Under>
      {data.profiles.map((p) => (
        <View key={p.id} style={[s.prof, p.id === data.activeId && s.profOn]}>
          <View style={{ flex: 1 }}>
            <Text style={s.profName}>{p.name}{p.id === data.activeId ? <Text style={s.activeTag}>  ● main</Text> : null}</Text>
            <Text style={s.profSub}>{birthDMY(p)}</Text>
          </View>
          {p.id !== data.activeId ? (
            <Btn small kind="ghost" label="Set as main" onPress={() => setActive(p.id)} />
          ) : null}
        </View>
      ))}
      <Btn label="+ New chart" onPress={onNew} />
    </View>
  );
}

const s = StyleSheet.create({
  prof: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.card,
       padding: 11, marginBottom: 7,
  },
  profOn: { backgroundColor: C.card2 },
  profName: { color: C.text, fontWeight: "700", fontSize: 14 },
  profSub: { color: C.dim, fontSize: 12, marginTop: 2 },
  relChip: { color: C.gold, fontSize: 12, fontWeight: "400" },
  activeTag: { color: C.gold, fontWeight: "400", fontSize: 12 },
  del: { padding: 6, marginLeft: 6 },
  confirmRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  confirmText: { color: C.warn, fontSize: 14, flex: 1, lineHeight: 17 },
  lensRow: { flexDirection: "row", gap: 6, marginBottom: 8, marginTop: 2 },
  lensBtn: {
    flex: 1, alignItems: "center", paddingVertical: 6, borderWidth: 1,
    borderColor: C.line, borderRadius: 0, backgroundColor: C.card,
  },
  lensOn: { borderColor: C.gold, backgroundColor: C.card2 },
  pair: { backgroundColor: C.card2,    padding: 12, marginTop: 4, marginBottom: 8 },
  matchHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  scoreN: { fontFamily: serif, color: C.gold, fontSize: 34 },
  scoreOf: { color: C.dim, fontSize: 14 },
  pairTitle: { fontFamily: serif, color: C.text, fontSize: 18 },
  verdict: { color: C.muted, fontSize: 14, marginTop: 2 },
  stamp: { borderWidth: 1.5, borderColor: C.red, borderRadius: 0, padding: 5 },
  stampText: { color: C.red, fontFamily: cjk, fontSize: 15 },
  stampPy: { color: C.dim, fontSize: 12, marginTop: 2, textAlign: "center" },
});

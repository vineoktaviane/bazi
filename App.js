/* BaZi Companion, app shell. Tabs: Me 命, Now 今, Ask 卜, People 人, More 學.
 * All readings computed on device from raw birth data. No AI, no network. */
import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, Pressable, ScrollView, StyleSheet, StatusBar, useWindowDimensions, Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { computeChart } from "./src/engines/bazi";
import { loadData, saveData } from "./src/storage";
import { C, serif, cjk } from "./src/ui/theme";
import { Btn, Fine, ChipBtn, Field, Input, SegmentedInput, utcLabel, BrandMark, Disclosure, RadioOption, TabNavigation } from "./src/ui/components";
import { birthErrors } from "./src/ui/birthForm";
import { searchCities } from "./src/content/cities";
import { MeTab } from "./src/ui/me/MeTab";
import { NowTab } from "./src/ui/now/NowTab";
import { AskTab } from "./src/ui/ask/AskTab";
import { PeopleTab } from "./src/ui/people/PeopleTab";
import { MoreTab } from "./src/ui/more/MoreTab";

const TZ_LIST = [];
for (let t = -12; t <= 14; t++) TZ_LIST.push(t);

const num = (s) => (s === "" ? NaN : Number(s));

const TABS = [
  ["chart", "命", "My chart"],
  ["months", "今", "Today"],
  ["ask", "卜", "Ask"],
  ["people", "人", "People"],
  ["more", "學", "Explore"],
];

function NewChartForm({ data, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(["", "", ""]);   // [DD, MM, YYYY]
  const [time, setTime] = useState(["12", "00"]);   // [HH, MM]
  const [tz, setTz] = useState(null);
  const [cityQuery, setCityQuery] = useState("");
  const [cityLabel, setCityLabel] = useState("");    // remembers the picked city
  const [manualTz, setManualTz] = useState(false);
  const [gender, setGender] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const firstRun = data.profiles.length === 0;

  const d = num(date[0]), m = num(date[1]), y = num(date[2]);
  const hh = num(time[0]), min = num(time[1]);
  const errors = birthErrors({ name, date, time, tz, gender });
  const dateComplete = date.every(Boolean) && date[2].length === 4;
  const timeComplete = time.every(Boolean);
  const cityMatches = manualTz ? [] : searchCities(cityQuery);

  const pickCity = (c) => {
    setTz(c.tz);
    setCityLabel(`${c.name}, ${c.cc}`);
    setCityQuery(`${c.name}, ${c.cc}`);
  };

  const save = () => {
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    onSave({ id: Date.now().toString(36), name: name.trim(), y, m, d, hh, min, tz: Number(tz), gender });
  };

  return (
    <View style={s.setupLayout}>
      <Text style={s.breadcrumb}>Profiles / {firstRun ? "Your chart" : "New chart"}</Text>
      <Text accessibilityRole="header" style={s.setupTitle}>Create a birth chart</Text>
      <Text style={s.requiredNote}>* Required fields</Text>
      <View style={s.formCard}>
      <Field label="Name" required error={submitted ? errors.name : null}>
        <Input accessibilityLabel="Name" value={name} onChangeText={setName} placeholder="Your name" />
      </Field>
      <Field
        label="Birth date" required
        error={submitted || dateComplete ? errors.date : null}
      >
        <SegmentedInput
          segments={[
            { len: 2, placeholder: "DD", label: "Day" },
            { len: 2, placeholder: "MM", label: "Month" },
            { len: 4, placeholder: "YYYY", label: "Year" },
          ]}
          separator="-"
          values={date}
          onChange={setDate}
          bad={(submitted || dateComplete) && !!errors.date}
        />
      </Field>
      <Field
        label="Birth time" required
        hint="24-hour time. Unknown? 12:00 is an estimate."
        error={submitted || timeComplete ? errors.time : null}
      >
        <SegmentedInput
          segments={[
            { len: 2, placeholder: "HH", label: "Hour" },
            { len: 2, placeholder: "MM", label: "Minute" },
          ]}
          separator=":"
          values={time}
          onChange={setTime}
          bad={(submitted || timeComplete) && !!errors.time}
        />
      </Field>
      <Field
        label={manualTz ? "Time zone" : "Birthplace or time zone"} required
        error={submitted ? errors.tz : null}
      >
        {manualTz ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              {TZ_LIST.map((t) => (
                <ChipBtn key={t} label={utcLabel(t)} on={tz !== null && tz === t} onPress={() => setTz(t)} style={{ minWidth: 62 }} />
              ))}
            </ScrollView>
            <Text style={s.tzNote}>{tz === null ? "Select a UTC offset" : utcLabel(tz)}</Text>
            <Btn kind="ghost" small label="Search city" onPress={() => { setManualTz(false); }} />
          </>
        ) : (
          <>
            <Input
              accessibilityLabel="Birthplace"
              value={cityQuery}
              onChangeText={(t) => { setCityQuery(t); setCityLabel(""); setTz(null); }}
              placeholder="Search city"
              autoCorrect={false}
            />
            {cityMatches.length > 0 && !cityLabel ? (
              <View style={s.cityList}>
                {cityMatches.map((c) => (
                  <Pressable
                    key={c.name + c.cc}
                    onPress={() => pickCity(c)}
                    accessibilityRole="button"
                    accessibilityLabel={`${c.name}, ${c.cc}, ${utcLabel(c.tz)}`}
                    style={({ pressed }) => [s.cityRow, pressed && { backgroundColor: C.card2 }]}
                  >
                    <Text style={s.cityName}>{c.name}<Text style={s.cityCc}>  {c.cc}</Text></Text>
                    <Text style={s.cityTz}>{utcLabel(c.tz)}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <Text style={s.tzNote}>
              {tz === null ? "" : cityLabel ? `${cityLabel} · ${utcLabel(tz)}` : `Time zone: ${utcLabel(tz)}`}
            </Text>
            <Btn kind="ghost" small label="Set time zone" onPress={() => setManualTz(true)} />
          </>
        )}
      </Field>
      <Field label="Sex at birth" required error={submitted ? errors.gender : null}>
        <View accessibilityRole="radiogroup" accessibilityLabel="Sex at birth, required" aria-required={true} aria-invalid={submitted && !!errors.gender} style={{ flexDirection: "row" }}>
          <RadioOption label="Female" selected={gender === "F"} onPress={() => setGender("F")} />
          <RadioOption label="Male" selected={gender === "M"} onPress={() => setGender("M")} />
        </View>
      </Field>
      {submitted && Object.keys(errors).length > 0 && <Text accessibilityRole="alert" style={s.submitError}>Complete the required fields above.</Text>}
      <Btn label="Create chart" onPress={save} />
      {data.profiles.length > 0 ? <Btn kind="ghost" label="Cancel" onPress={onCancel} /> : null}
      <Fine>Saved on this device.</Fine>
      <Disclosure label="Time & calculation notes">
        <Fine>Birth times from 23:00 use the next day. City offsets use standard time; adjust manually for daylight saving. An estimated birth time may change the hour pillar. Sex at birth determines luck-cycle direction.</Fine>
      </Disclosure>
      </View>
    </View>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("chart");
  const [editing, setEditing] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      if (!d.profiles.length) setEditing(true);
    });
  }, []);

  const active = data && data.profiles.find((p) => p.id === data.activeId);
  const chart = useMemo(() => (active ? computeChart(active) : null), [active]);
  const persist = async (nd) => { setData(nd); await saveData(nd); };

  if (!data) {
    return (
      <SafeAreaProvider>
        <View style={[s.app, s.loading]}>
          <Text style={{ color: C.text, fontFamily: serif, letterSpacing: 2 }}>Opening your chart…</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  const saveProfile = async (prof) => {
    const nd = { ...data, profiles: [...data.profiles, prof], activeId: data.profiles.length === 0 ? prof.id : data.activeId };
    await persist(nd);
    setEditing(false);
    setTab(data.profiles.length === 0 ? "chart" : "people");
  };

  const showForm = editing || !active;

  return (
    <SafeAreaProvider>
      <WebTypography />
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SafeAreaView style={s.app} edges={["top", "left", "right"]}>
        <View style={s.hd}>
          <View style={s.hdInner}>
          <View style={{ alignItems: "center" }}>
            <BrandMark size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.h1}>BaZi <Text style={{ fontWeight: "600" }}>Companion</Text></Text>
          </View>
          {active && <Text numberOfLines={1} style={[s.headerNote, { maxWidth: "35%" }]}>{active.name}</Text>}
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} contentContainerStyle={[s.panel, showForm && s.setupPanel]} key={showForm ? "form" : tab + (active ? active.id : "")}>
          {showForm ? (
            <NewChartForm data={data} onSave={saveProfile} onCancel={() => setEditing(false)} />
          ) : (
            <>
              {tab === "chart" && chart && <MeTab chart={chart} profile={active} />}
              {tab === "months" && chart && <NowTab chart={chart} profile={active} />}
              {tab === "ask" && chart && <AskTab chart={chart} profile={active} data={data} persist={persist} />}
              {tab === "people" && chart && (
                <PeopleTab data={data} active={active} chart={chart} persist={persist} onNew={() => setEditing(true)} />
              )}
              {tab === "more" && chart && <MoreTab chart={chart} profile={active} />}
            </>
          )}
          <View style={{ height: 24 }} />
        </ScrollView>

        {active && !showForm ? (
          <SafeAreaView style={s.navSafe} edges={["bottom"]}>
            <TabNavigation primary label="Main navigation"
              items={TABS.map(([key, , label]) => ({ key, label }))} value={tab} onChange={setTab} />
          </SafeAreaView>
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function WebTypography() {
  if (Platform.OS !== "web") return null;
  return React.createElement("style", null, `
    @font-face {font-family:'IBM Plex Sans';src:url('/fonts/IBMPlexSans-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
    @font-face {font-family:'IBM Plex Sans';src:url('/fonts/IBMPlexSans-SemiBold.ttf') format('truetype');font-weight:600 700;font-display:swap}
    [dir="auto"],input,textarea,button {font-family:'IBM Plex Sans',Arial,sans-serif !important}
    [role="button"]:focus-visible,[role="tab"]:focus-visible,[role="radio"]:focus-visible {outline:2px solid #0F62FE;outline-offset:-2px}
    :root {color-scheme:light}
  `);
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  loading: { alignItems: "center", justifyContent: "center" },
  hd: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.line },
  hdInner: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 24,
    height: 56, width: "100%", alignSelf: "center" },
  h1: { color: C.text, fontFamily: serif, fontSize: 14, fontWeight: "400", lineHeight: 24 },
  headerNote: { color: C.muted, fontSize: 14, fontFamily: serif },
  panel: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32, maxWidth: 1056, width: "100%", alignSelf: "center" },
  setupPanel: { maxWidth: 1056 },
  setupLayout: { width: "100%" },
  breadcrumb: { color: C.muted, fontFamily: serif, fontSize: 12, marginBottom: 24 },
  setupTitle: { fontFamily: serif, color: C.text, fontSize: 28, lineHeight: 40, fontWeight: "400", marginBottom: 8 },
  requiredNote: { fontFamily: serif, color: C.muted, fontSize: 12, lineHeight: 16, marginBottom: 8 },
  formCard: { width: "100%", maxWidth: 480 },
  submitError: { color: C.warn, fontFamily: serif, fontSize: 14, marginTop: 24 },
  cityList: { backgroundColor: C.card2, borderBottomWidth: 1, borderBottomColor: C.inputLine },
  cityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12,
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.line, minHeight: 48 },
  cityName: { color: C.text, fontSize: 14, flex: 1 },
  cityCc: { color: C.dim, fontSize: 12 },
  cityTz: { color: C.muted, fontSize: 12, marginLeft: 16 },
  tzNote: { color: C.muted, fontSize: 12, lineHeight: 16, marginTop: 4 },
  navSafe: { backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line },
});

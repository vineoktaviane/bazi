/* Now tab 今, Today card, annual overview, 12 solar-month cards. Logic identical to reference. */
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { STEMS, BRANCHES, MONTH_NAMES } from "../../engines/data";
import { yearPillarOf, monthPillarOf, monthReading, TG } from "../../engines/bazi";
import { termJD, TERM_NAMES } from "../../astro/solar";
import { civilToJD, jdToCivil } from "../../astro/calendar";
import { cycleStars, annualStars } from "../../engines/stars";
import { todayInfo, hourRange } from "../../engines/officers";
import { pick, fill, TG_MONTH, PILLAR_DOMAIN, REL_TEXT } from "../../content/banks";
import { REL_LABEL, REL_GOOD } from "../../content/banks2";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { Sec, Dominant, Inter, P, Under, Watch, Btn, B, Disclosure, ExpandAction } from "../components";

function HourRow({ color, label, value, hint }) {
  return (
    <View style={s.hourRow}>
      <View style={[s.hourDot, { backgroundColor: color }]} />
      <Text style={[s.hourLabel, { color }]}>{label}</Text>
      <Text style={s.hourValue}>{value}</Text>

    </View>
  );
}

export function TodayCard({ chart, profile }) {
  const t = useMemo(() => todayInfo(chart, profile), [chart, profile]);
  const dg = TG_MONTH[t.gS];
  const st = STEMS[t.dp.stem], b = BRANCHES[t.dp.branch];
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  return (
    <Dominant>
      <View style={s.todayHead}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: cjk, fontSize: 30, lineHeight: 36 }}>
            <Text style={{ color: EL_COLOR[st.el] }}>{st.cn}</Text>
            <Text style={{ color: EL_COLOR[b.el] }}>{b.cn}</Text>
          </Text>
          <Text style={s.todayPy}>{st.p} {b.p}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.todayDate}>Today · {dateStr}</Text>
          <Text style={s.todayTheme}>A {TG[t.gS].name} day for you · {dg.tag.toLowerCase()}</Text>
          <Text style={s.todayOfficer}>Day officer: {t.officer.en} {t.officer.cn} ({py(t.officer.cn)})</Text>
        </View>
      </View>
      <P>{fill(pick(dg.focus, t.dp.dci), "day")}</P>
      <Disclosure label="Today’s reading">
      <Under>{t.officer.text}</Under>
      {t.rel ? <Under>{fill(REL_TEXT[t.rel](PILLAR_DOMAIN.day, t.dp.dci), "day")}</Under> : null}
      {t.isVoid ? <Under>A void day for you: plans made today can feel unreal or slow. Good for inner work, rest and reflection; poor for launches and signings.</Under> : null}
      {t.stars.map((st2, i) => (
        <Inter key={i} kind={st2.good ? "good" : "bad"} label={`${st2.name} ${st2.cn} (${py(st2.cn)}) active today`}>
          <P>{st2.text}</P>
        </Inter>
      ))}
      </Disclosure>
      <View style={s.hoursBox}>
        <HourRow color={C.gold} label="Golden hour" value={hourRange(t.golden)} hint="best window" />
        <HourRow color={C.gold} label="Nobleman hours" value={t.noble.map(hourRange).join(", ")} hint="helpful people" />
        <HourRow color={C.red} label="Broken hour" value={hourRange(t.broken)} hint="keep it routine" />
      </View>
    </Dominant>
  );
}

function MonthCard({ chart, entry, open, onToggle }) {
  const { gStem, gBranch, inter } = monthReading(chart, entry.stem, entry.branch);
  const st = STEMS[entry.stem], b = BRANCHES[entry.branch];
  const primary = TG_MONTH[gStem];
  const secondary = gBranch !== gStem ? TG_MONTH[gBranch] : null;
  const mStars = cycleStars(chart, entry.branch);
  return (
    <View style={[s.mcard, entry.isNow && s.mcardNow]}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: !!open }}
        accessibilityLabel={`${entry.label}${entry.isNow ? ", current month" : ""}`}
        style={s.mcardHead}
      >
        <View style={{ flex: 1 }}>
          <Text style={s.mcardMonth}>{entry.label}</Text>
          <Text style={s.mcardTheme}>{primary.tag}</Text>
          <Text style={s.mcardDates}>from {entry.fromStr}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: cjk, fontSize: 18 }}>
            <Text style={{ color: EL_COLOR[st.el] }}>{st.cn}</Text>
            <Text style={{ color: EL_COLOR[b.el] }}>{b.cn}</Text>
          </Text>
          <Text style={s.mcardPy}>{st.p} {b.p}</Text>
        </View>
        <Text style={s.mcardTg}>{TG[gStem].name}{entry.isNow ? "  ●" : ""}</Text>
        <ExpandAction expanded={open} />
      </Pressable>
      {open ? (
        <View style={s.mcardBody}>
          <Text style={s.tagline}>{primary.tag}{secondary ? ` · undercurrent of ${TG[gBranch].name.toLowerCase()}` : ""}</Text>
          <P>{fill(pick(primary.focus, entry.stem + entry.branch), "month")}</P>
          <Watch><Text style={{ fontWeight: "700" }}>Be careful:</Text> {fill(pick(primary.watch, entry.stem * 2 + entry.branch), "month")}</Watch>
          {secondary ? (
            <Under>Beneath the surface, {TG[gBranch].name} ({secondary.tag.toLowerCase()}) colours the month too: {(() => { const t = fill(pick(secondary.focus, entry.branch), "month"); return t.charAt(0).toLowerCase() + t.slice(1); })()}</Under>
          ) : null}
          {mStars.map((star, i) => (
            <Inter key={i} kind={star.good ? "good" : "bad"} label={`${star.good ? "Auspicious" : "Caution"} star · ${star.name} ${star.cn} (${py(star.cn)})`}>
              <P>{star.text}</P>
            </Inter>
          ))}
          {inter.length > 0 ? inter.map((it, i) => (
            <Inter key={"r" + i} kind={REL_GOOD[it.r] ? "good" : "bad"} label={`${REL_LABEL[it.r]} → ${it.pos} pillar`}>
              <P>{fill(REL_TEXT[it.r](PILLAR_DOMAIN[it.pos], entry.branch + i), "month")}</P>
            </Inter>
          )) : (
            <Under>No direct clash, harm or combination with your natal branches this month, a comparatively neutral backdrop where the month's own theme dominates.</Under>
          )}
        </View>
      ) : null}
    </View>
  );
}

export function NowTab({ chart, profile }) {
  const [yearView, setYearView] = useState(new Date().getFullYear());
  const [openMonth, setOpenMonth] = useState(null);

  const months = useMemo(() => {
    const yp = yearPillarOf(yearView);
    const nowJD = civilToJD(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), 12, 0, 0);
    return Array.from({ length: 12 }, (_, i) => {
      const mp = monthPillarOf(yp.stem, i);
      const fromJD = termJD(yearView, i);
      const toJD = i < 11 ? termJD(yearView, i + 1) : termJD(yearView + 1, 0);
      const c = jdToCivil(fromJD, profile.tz);
      return {
        ...mp,
        label: `${MONTH_NAMES[c.month - 1]} ${c.year}`,
        fromStr: `${c.day} ${MONTH_NAMES[c.month - 1]} (${TERM_NAMES[i]})`,
        isNow: nowJD >= fromJD && nowJD < toJD,
      };
    });
  }, [chart, yearView, profile]);

  const annual = useMemo(() => {
    const yp = yearPillarOf(yearView);
    return { yp, ...monthReading(chart, yp.stem, yp.branch) };
  }, [chart, yearView]);

  return (
    <View>
      <Sec cn="日">Today</Sec>
      <TodayCard chart={chart} profile={profile} />

      <View style={s.yearRow}>
        <Pressable onPress={() => setYearView(yearView - 1)} style={s.yearBtn} hitSlop={8}
          accessibilityRole="button" accessibilityLabel={`Previous year, ${yearView - 1}`}>
          <Text style={s.yearBtnText}>‹</Text>
        </Pressable>
        <Text style={s.yearTitle}>
          {yearView} · {STEMS[annual.yp.stem].cn}{BRANCHES[annual.yp.branch].cn} {STEMS[annual.yp.stem].p} {BRANCHES[annual.yp.branch].p} ({BRANCHES[annual.yp.branch].animal})
        </Text>
        <Pressable onPress={() => setYearView(yearView + 1)} style={s.yearBtn} hitSlop={8}
          accessibilityRole="button" accessibilityLabel={`Next year, ${yearView + 1}`}>
          <Text style={s.yearBtnText}>›</Text>
        </Pressable>
      </View>
      {yearView !== new Date().getFullYear() ? (
        <Btn small kind="ghost" label={`↩ Back to ${new Date().getFullYear()}`}
          onPress={() => { setYearView(new Date().getFullYear()); setOpenMonth(null); }}
          style={{ alignSelf: "center", marginBottom: 8 }} />
      ) : null}

      <Disclosure label="Year overview">
      <View style={s.annual}>
        <P><B>The year overall:</B> a {TG[annual.gStem].name} year for you, {TG_MONTH[annual.gStem].tag.toLowerCase()}. {fill(pick(TG_MONTH[annual.gStem].focus, yearView), "year")}</P>
        <Watch><Text style={{ fontWeight: "700" }}>Year-long caution:</Text> {fill(pick(TG_MONTH[annual.gStem].watch, yearView + 1), "year")}</Watch>
        {annual.inter.map((it, i) => (
          <Inter key={i} kind={REL_GOOD[it.r] ? "good" : "bad"} label={`${REL_LABEL[it.r]} → ${it.pos} pillar (all year)`}>
            <P>{fill(REL_TEXT[it.r](PILLAR_DOMAIN[it.pos], yearView + i), "year")}</P>
          </Inter>
        ))}
        {annualStars(chart, annual.yp.branch).map((st, i) => (
          <Inter key={"as" + i} kind={st.good ? "good" : "bad"} label={`${st.good ? "Auspicious" : "Caution"} star this year · ${st.name} ${st.cn} (${py(st.cn)})`}>
            <P>{st.text}</P>
          </Inter>
        ))}
      </View>

      </Disclosure>
      <Sec cn="月">Your months</Sec>
      {months.map((en, i) => (
        <MonthCard key={i} chart={chart} entry={en}
          open={openMonth === i}
          onToggle={() => setOpenMonth(openMonth === i ? -1 : i)} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  todayHead: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10,
    paddingBottom: 10,
  },
  todayPy: { color: C.dim, fontSize: 12, marginTop: 2 },
  todayDate: { color: C.text, fontFamily: serif, fontSize: 14, letterSpacing: 0.3 },
  todayTheme: { color: C.gold, fontSize: 12, marginTop: 3 },
  todayOfficer: { color: C.muted, fontSize: 12, marginTop: 2 },
  hoursBox: {
    marginTop: 10, paddingTop: 8,
  },
  hourRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 4, gap: 6 },
  hourDot: { width: 6, height: 6, borderRadius: 0, alignSelf: "center" },
  hourLabel: { fontSize: 12, fontWeight: "700", width: 104 },
  hourValue: { color: C.text, fontSize: 12, flexShrink: 1 },
  hourHint: { color: C.dim, fontSize: 12, marginLeft: "auto" },
  mcard: { backgroundColor: C.card2,    marginBottom: 16, overflow: "hidden" },
  mcardNow: { backgroundColor: C.card2 },
  mcardHead: { minHeight: 48, flexDirection: "row", alignItems: "center", padding: 11, gap: 10 },
  mcardMonth: { color: C.text, fontWeight: "700", fontSize: 14 },
  mcardTheme: { color: C.gold, fontSize: 12, marginTop: 1 },
  mcardDates: { color: C.dim, fontSize: 12, marginTop: 1 },
  mcardPy: { color: C.dim, fontSize: 12, marginTop: 1 },
  mcardTg: { color: C.gold, fontSize: 12, width: 96, textAlign: "right" },
  caret: { color: C.dim, fontSize: 14, width: 16, textAlign: "center" },
  mcardBody: { paddingHorizontal: 11, paddingBottom: 11,   paddingTop: 8 },
  tagline: { color: C.gold, fontSize: 12, marginBottom: 6, fontFamily: serif },
  yearRow: { flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 8, gap: 8 },
  yearBtn: { width: 34, height: 34,    alignItems: "center", justifyContent: "center" },
  yearBtnText: { color: C.gold, fontSize: 14, lineHeight: 20 },
  yearTitle: { flex: 1, textAlign: "center", color: C.text, fontFamily: serif, fontSize: 18 },
  annual: { backgroundColor: C.card2,    padding: 12 },
});

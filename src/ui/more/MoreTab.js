/* More tab 學, Compass tool (manual dial guaranteed; live heading via the OS-fused
 * compass, expo-location on native, DeviceOrientation on web) + Learn: personalized
 * FAQ and glossary. FAQ text generation is identical to the reference buildFAQ. */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import * as Location from "expo-location";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import {
  elementProfile, tenGodProfile, dmStrength, relate,
  TG, TG_LINE, EL_CAREERS, EL_COLORS, EL_DIR, EL_HEALTH, CONTROLS,
} from "../../engines/bazi";
import { lifeGua, GUA_DATA, DIR_TYPES } from "../../engines/mansions";
import { PILLAR_DOMAIN } from "../../content/banks";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { Sec, Inter, P, Under, Empty, Btn, ChipBtn, B, ExpandAction } from "../components";
import { LegalSection } from "./LegalSection";

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function CompassTool({ chart, profile }) {
  const [heading, setHeading] = useState(null);
  const [acc, setAcc] = useState(null);      // native heading accuracy 0-3 (3 best)
  const [manual, setManual] = useState(null);
  const [err, setErr] = useState("");
  const subRef = useRef(null);   // native LocationSubscription
  const webRef = useRef(null);   // web deviceorientation handler
  const g = lifeGua(chart.baziYear, profile.gender);
  const gd = GUA_DATA[g];
  const byDir = {};
  DIR_TYPES.forEach((d) => (byDir[gd.dirs[d.k]] = d));

  useEffect(() => () => {
    if (subRef.current) subRef.current.remove();
    if (webRef.current) window.removeEventListener("deviceorientation", webRef.current);
  }, []);

  const enable = async () => {
    setErr("");
    setManual(null); // resume live reading if a manual direction was tapped earlier
    try {
      /* web: DeviceOrientation (iOS needs explicit permission);
       * native: OS-fused compass via expo-location (tilt-compensated and calibrated). */
      if (Platform.OS === "web") {
        if (typeof DeviceOrientationEvent !== "undefined" && DeviceOrientationEvent.requestPermission) {
          const r = await DeviceOrientationEvent.requestPermission();
          if (r !== "granted") { setErr("Compass permission denied, use the manual dial below."); return; }
        }
        if (webRef.current) window.removeEventListener("deviceorientation", webRef.current);
        webRef.current = (e) => {
          const h = e.webkitCompassHeading != null ? e.webkitCompassHeading : e.alpha != null ? 360 - e.alpha : null;
          if (h != null) setHeading(Math.round((h + 360) % 360));
        };
        window.addEventListener("deviceorientation", webRef.current);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { setErr("Compass permission denied, use the manual dial below."); return; }
      if (subRef.current) subRef.current.remove();
      subRef.current = await Location.watchHeadingAsync((h) => {
        // trueHeading is -1 until a location fix is available; fall back to magHeading meanwhile
        const deg = h.trueHeading != null && h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
        if (deg != null && deg >= 0) setHeading(Math.round((deg + 360) % 360));
        if (h.accuracy != null) setAcc(h.accuracy);
      });
    } catch {
      setErr("Compass unavailable on this device, use the manual dial below.");
    }
  };

  const live = heading != null;
  const dir = manual || (live ? DIRS[Math.round(heading / 45) % 8] : null);
  const info = dir ? byDir[dir] : null;
  return (
    <View>
      <Sec cn="方">Compass, point & read</Sec>
      <Under>Point the top of your phone at a door, a desk facing, or a direction of travel, and read it against <B color={C.muted}>your</B> 8 Mansions. Or tap a direction below to read it without the sensor.</Under>
      <Btn label={live ? (manual ? "↩ Back to the live compass" : "● Compass is live") : "Enable live compass"} onPress={enable} />
      {err ? <Empty>{err}</Empty> : null}
      {live && !manual ? <Text style={s.headingLine}>Heading: <B color={C.gold}>{heading}°</B> → {DIRS[Math.round(heading / 45) % 8]}</Text> : null}
      {heading != null && acc != null && acc < 2 ? <Text style={s.headingLine}>Low compass accuracy, wave the phone in a figure-8 to calibrate, and move away from metal or magnets.</Text> : null}
      <View style={s.dirGrid}>
        {DIRS.map((d) => (
          <ChipBtn key={d} cn={d} cnColor={byDir[d].good ? C.green : C.red}
            label={byDir[d].name.split(" ")[0]} on={dir === d} onPress={() => setManual(d)} style={{ width: "22%" }} />
        ))}
      </View>
      {info ? (
        <Inter kind={info.good ? "good" : "bad"} label={`${dir} · ${info.name}, ${info.en}`}>
          <P>{info.text}</P>
        </Inter>
      ) : null}
    </View>
  );
}

/* buildFAQ, identical text generation to the reference */
function buildFAQ(chart, profile) {
  const dmEl = STEMS[chart.day.stem].el;
  const st = dmStrength(chart);
  const tp = tenGodProfile(chart);
  const prof = elementProfile(chart);
  const sorted = Object.entries(prof).sort((a, b) => b[1] - a[1]);
  const strongestEl = sorted[0][0], weakestEl = sorted[4][0];
  const spouseGods = profile.gender === "F" ? ["DO", "7K"] : ["DW", "IW"];
  const spousePct = spouseGods.reduce((a, g) => a + tp.pct[g], 0);
  const wealthPct = tp.pct.IW + tp.pct.DW;
  const spouseRels = ["year", "month", "hour"].map((pos) => ({ pos, r: relate(chart.day.branch, chart[pos].branch) })).filter((x) => x.r);
  const favCareers = st.favorable.map((el) => EL_CAREERS[el]).join("; ");
  return [
    { q: "What exactly is a Day Master?", a: `Of the eight characters in your chart, one is the anchor: the stem of your day of birth. Everything else, every element, every Ten God, is defined by its relationship to that one character. Yours is ${STEMS[chart.day.stem].p} (${STEMS[chart.day.stem].cn}), ${STEMS[chart.day.stem].yang ? "Yang" : "Yin"} ${EL_NAME[dmEl]}. When BaZi describes "you", it means this character; the other seven describe the world you were born carrying.` },
    { q: "Do the elements mean actual materials or jobs?", a: `No, this is the most common misreading. The five elements are qualities, not substances. Wood means growth and structure, not timber; Metal means precision and judgment, not steel. When the chart says an element is your Wealth or Output, it points to the character of that life area and the types of industry where it flows best, never to a literal material.` },
    { q: "Which careers actually suit me?", a: `Two signals, combined. First, your favorable elements (${st.favorable.map((e) => EL_NAME[e]).join(" and ")}) point to fields that strengthen you: ${favCareers}. Second, your dominant god, ${TG[tp.top].name}, describes HOW you work best: ${TG_LINE[tp.top].toLowerCase()} A role that matches both the field and the working style is the classical ideal; matching only the field is still better than matching neither.` },
    { q: "What are my lucky colors and directions?", a: `They follow your favorable elements. ${st.favorable.map((el) => `${EL_NAME[el]}: ${EL_COLORS[el]}, direction ${EL_DIR[el]}`).join(". ")}. Use them where they cost nothing, wardrobe, desk orientation, travel choices when options are equal. Treat them as a thumb on the scale, not a strategy.` },
    { q: "What does my chart say about love and marriage?", a: `Two places to look. Your spouse palace is your Day Branch, ${BRANCHES[chart.day.branch].animal} (${BRANCHES[chart.day.branch].cn} ${BRANCHES[chart.day.branch].p}), the seat your partner occupies in your life. ${spouseRels.length ? `In your chart it forms ${spouseRels.map((x) => `a ${x.r} with your ${x.pos} branch`).join(" and ")}, meaning your relationship life interacts strongly (and not always smoothly) with ${spouseRels.map((x) => PILLAR_DOMAIN[x.pos]).join("; ")}.` : "In your chart it sits without clash or combination from the other branches, a relatively undisturbed seat."} Your spouse star, ${spouseGods.map((g) => TG[g].name).join("/")} for you, occupies about ${spousePct}% of your chart: ${spousePct >= 20 ? "clearly present, so partner themes surface readily in your life" : spousePct >= 8 ? "present but not dominant, relationships matter without ruling the chart" : "faint in the natal chart, which classically means partner themes arrive mainly through luck pillars and annual cycles rather than being an ever-present focus. It does NOT mean no relationship."} Peach Blossom months and years (see your stars) are when attraction runs hottest.` },
    { q: "Will I be rich?", a: `BaZi won't answer that, and any app that claims to is selling you something. What the chart shows: your wealth element is ${EL_NAME[CONTROLS[dmEl]]}, wealth stars occupy about ${wealthPct}% of your chart (${wealthPct >= 25 ? "a strong presence, money is a recurring life theme, for better and worse" : wealthPct >= 10 ? "a moderate presence" : "a light presence, wealth tends to follow from your stronger themes rather than lead them"}), and your Day Master is ${st.strong ? "strong enough to hold wealth, classically, a strong DM can 'carry' more wealth when opportunities come" : "on the weaker side, classically, a weak DM holding heavy wealth gets exhausted by it, so building support (knowledge, allies, systems) before chasing scale is the traditional advice"}. Timing matters more than totals: wealth-god months and decades are listed in your Months and luck pillar readings.` },
    { q: "What about my health?", a: `Traditional correspondence only, not medical advice. Each element maps to organ systems: your scarcest element is ${EL_NAME[weakestEl]} (${EL_HEALTH[weakestEl]}), classically the system to be gentle with; your most abundant is ${EL_NAME[strongestEl]} (${EL_HEALTH[strongestEl]}), and excess is considered a burden too, not a bonus. Use this as a nudge toward checkups and habits, nothing more.` },
    { q: "What is a clash? Should I be scared of one?", a: `A clash (沖 chōng) is two branches in direct opposition, it brings movement, disruption and change to the life area involved. It is not a disaster forecast: clashes also break stagnation, push relocations and end things that needed ending. The practical rule: in a clash month or year, avoid locking long-term commitments in the affected area, keep schedules flexible, and let movement happen through travel or planned change rather than resisting until something snaps. Combinations (合 hé) are the opposite, things bonding and aligning.` },
    { q: "My chart has a lot of one element and almost none of another. Is that bad?", a: `Unbalanced, not bad. Every lopsided chart is lopsided in a direction: a flood of one element makes its themes dominant and reliable (and excessive), while a missing element marks themes that don't come naturally and arrive mainly through timing, people and conscious effort. Some of the most distinctive charts in classical literature are extremely unbalanced. The point of knowing is to stop trying to be naturally good at your missing element and start borrowing it, through skills, partners and environment.` },
    { q: "Can I change my destiny, or is everything fixed?", a: `The classical framing itself says no more than a third is fixed: the saying goes "first destiny, second luck, third feng shui, fourth virtue, fifth education." The chart is the hand you were dealt and the luck pillars are the order the cards turn, how you play is not in the chart. Treat every reading in this app as a description of tendencies and timing, useful for planning; treat any source that claims certainty about your future with suspicion.` },
    { q: "Why do different masters and apps give me different readings?", a: `Because BaZi has schools, not one canon. Practitioners disagree on the Zi-hour day boundary, on solar versus clock time, on how to weigh element strength, and on how much symbolic stars matter. The pillars themselves are pure calendar math, every competent source agrees on those, but interpretation layers differ. This app shows its methods openly (simplified strength rule, transparent Ten God weighting) precisely so you know which school of assumptions you're reading.` },
  ];
}

const GLOSSARY = [
  {
    cn: "基礎",
    label: "Foundations: shared by all three systems",
    items: [
      ["Yin & Yang 陰陽 (yīn yáng)", "the two polarities every character carries; the base alternation the rest is built on."],
      ["Five Elements 五行 (wǔ xíng)", "Wood, Fire, Earth, Metal and Water: the five phases that generate and control one another and underlie every stem, branch and star."],
      ["Stems 天干 (tiān gān)", "the ten \"sky\" characters (Jia…Gui): five elements, each in a Yang and Yin form. The top row of every pillar."],
      ["Branches 地支 (dì zhī)", "the twelve \"earth\" characters, better known as the animal signs. The bottom row. Each branch secretly contains one to three hidden stems."],
      ["Hidden stems 藏干 (cáng gān)", "the stems stored inside each branch; the small characters under your pillars. They are why an animal sign carries more than one element."],
      ["Sexagenary cycle 六十甲子 (jiǎ zǐ)", "the 60-step stem-and-branch cycle that names every year, month, day and hour; the shared calendar all three systems read from."],
      ["Solar terms 節氣 (jié qì)", "the 24 seasonal markers of the true solar year. They, not the 1st of the calendar month, set when a BaZi month turns."],
      ["Lunar vs solar calendar", "BaZi runs on the solar (seasonal) calendar; Zi Wei Dou Shu is cast from the lunar (new-moon) calendar. That is why your ZWDS month and day differ from your birthday."],
    ],
  },
  {
    cn: "八字",
    label: "BaZi 八字: the Four Pillars of your birth time",
    items: [
      ["Day Master 日主 (rì zhǔ)", "the stem of your day pillar. It represents you, and the whole chart is read as everything else's relationship to it."],
      ["Ten Gods 十神 (shí shén)", "the ten relationships any character can have to your Day Master. They translate raw elements into life language: wealth, authority, creativity, support, peers."],
      ["Month Command 月令 (yuè lìng)", "the branch of your birth month, the single most heavily weighted factor: it sets the season your Day Master must live in."],
      ["Luck pillars 大運 (dà yùn)", "ten-year chapters your life moves through, derived from your birth month and gender. The natal chart is the car; the luck pillar is the road."],
      ["Annual pillar 流年 (liú nián)", "the current year's stem and branch, interacting with everything above. The weather on top of the road."],
      ["Clash / Combine / Harm / Punishment", "the four main ways branches interact: opposition and movement (沖 chōng), bonding and alliance (合 hé), friction and mistrust (害 hài), entanglement and complication (刑 xíng)."],
      ["Symbolic stars 神煞 (shén shà)", "named auspicious or inauspicious markers layered on the pillars (Peach Blossom, Nobleman, and the rest). Flavor and timing, not the chart's structure."],
      ["Void / Empty 空亡 (kōng wáng)", "the two branches each day pillar leaves \"empty\" in its cycle; matters they touch tend to feel unanchored, delayed, or oddly weightless."],
    ],
  },
  {
    cn: "紫微",
    label: "Zi Wei Dou Shu 紫微斗數: the twelve-palace star chart",
    items: [
      ["Twelve Palaces 十二宮 (shí èr gōng)", "the twelve fixed life-areas (Life, Wealth, Spouse, Career, Health…). The rooms of the house; the stars are who lives in them."],
      ["Life & Body Palace 命宮 / 身宮", "your main room, and the room where the story concentrates after midlife."],
      ["Bureau 五行局 (wǔ xíng jú)", "your Water/Wood/Fire/Earth/Metal \"phase number\" (2 to 6), taken from the Na Yin of your Life Palace. It fixes where the Emperor star begins."],
      ["Major stars 主星 (zhǔ xīng)", "the fourteen lead stars (Emperor 紫微, Sun 太陽, Moon 太陰, and so on) whose natures color whatever palace they occupy."],
      ["Four Transformations 四化 (sì huà)", "four lifelong modifiers your birth year assigns to four stars: 祿 abundance, 權 authority, 科 merit, 忌 obstruction."],
      ["Star brightness 廟旺 (miào wàng)", "how well-placed a star is in its branch, from 廟 temple (strongest) through 旺 / 平 / 弱 down to 陷 fallen. A bright star leads with its gifts; a fallen one leads with its warnings."],
      ["Sha stars 煞星 (shà xīng)", "the harmful minor stars (Blade, Grindstone, Fire, Bell, Void, Plunder) that mark friction and caution. Shown in red."],
      ["Decade / Annual / Monthly 大限 / 流年 / 流月", "the three moving overlays: which palace each ten-year chapter, each lunar year, and each lunar month lands on. The clocks that move across the fixed rooms."],
      ["Dou Jun 斗君 (dǒu jūn)", "the rule that fixes where lunar month 1 sits in the monthly overlay, so it does not simply start at the Life Palace."],
      ["Empty palace / mirroring", "a palace with no major star borrows the character of the palace directly opposite; its affairs arrive second-hand."],
    ],
  },
];

export function LearnTab({ chart, profile }) {
  const [open, setOpen] = useState(0);
  const faq = useMemo(() => buildFAQ(chart, profile), [chart, profile]);
  return (
    <View>
      <Sec cn="問">Your questions, answered from your chart</Sec>
      {faq.map((f, i) => (
        <View key={i} style={s.faq}>
          <Pressable
            onPress={() => setOpen(open === i ? -1 : i)}
            accessibilityRole="button"
            accessibilityState={{ expanded: open === i }}
            style={s.faqHead}
          >
            <Text style={s.faqQ}>{f.q}</Text>
            <ExpandAction expanded={open === i} />
          </Pressable>
          {open === i ? <Text style={s.faqA}>{f.a}</Text> : null}
        </View>
      ))}
      <Sec cn="典">Quick glossary</Sec>
      <Text style={s.glossIntro}>Grouped by the three methods this app draws on. Foundations are shared; the rest belong to one system each.</Text>
      {GLOSSARY.map((grp) => (
        <View key={grp.label} style={s.gloss}>
          <View style={s.glossHead}>
            <Text style={s.glossChip}>{grp.cn}</Text>
            <Text style={s.glossLabel}>{grp.label}</Text>
          </View>
          {grp.items.map(([term, def]) => (
            <P key={term}><B>{term}</B>, {def}</P>
          ))}
        </View>
      ))}
    </View>
  );
}

export function MoreTab({ chart, profile }) {
  return (
    <View>
      <CompassTool chart={chart} profile={profile} />
      <LearnTab chart={chart} profile={profile} />
      <LegalSection />
    </View>
  );
}

const s = StyleSheet.create({
  headingLine: { color: C.muted, fontSize: 18, marginTop: 8 },
  dirGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, justifyContent: "flex-start" },
  faq: { backgroundColor: C.card2,    marginBottom: 6, padding: 10 },
  faqHead: { minHeight: 48, flexDirection: "row", alignItems: "center" },
  faqQ: { color: C.text, fontWeight: "600", fontSize: 14, flex: 1, fontFamily: serif },
  faqA: { color: C.muted, fontSize: 14, lineHeight: 19, marginTop: 8 },
  gloss: { backgroundColor: C.card,    padding: 12, marginBottom: 8 },
  glossIntro: { color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 8, fontStyle: "italic" },
  glossHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  glossChip: { fontFamily: cjk, fontSize: 13, color: C.gold,    paddingHorizontal: 5, paddingVertical: 1, marginRight: 8 },
  glossLabel: { color: C.gold, fontSize: 12, fontWeight: "600", flex: 1, fontFamily: serif },
});

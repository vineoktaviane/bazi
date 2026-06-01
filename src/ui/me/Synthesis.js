/* Synthesis, the cross-system overview: BaZi × Zi Wei Dou Shu × 8 Mansions side by side.
 * UI-only derivation: every fact shown is computed by the existing engines; the
 * comparisons intersect their outputs. No new interpretive tables are introduced. */
import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { STEMS, BRANCHES, EL_NAME } from "../../engines/data";
import { dmStrength, tenGodProfile, TG, EL_DIR } from "../../engines/bazi";
import { lifeGua, GUA_DATA, DIR_TYPES } from "../../engines/mansions";
import { zwdsChart, ZW_STARS } from "../../engines/zwds";
import { C, serif, cjk, EL_COLOR } from "../theme";
import { py } from "../pinyin";
import { SubSec, Inter, P, Under, Fine, B } from "../components";

const MINOR = ["wenchang", "wenqu", "zuofu", "youbi"];
/* EL_DIR words (engine) → compass letters used by the 8 Mansions tables */
const DIR_LETTERS = { East: ["E"], South: ["S"], West: ["W"], North: ["N"], "Southwest & Northeast": ["SW", "NE"] };

function Tile({ glyph, glyphColor, system, title, sub }) {
  return (
    <View style={s.tile}>
      <Text style={s.tileSystem}>{system}</Text>
      <Text style={[s.tileGlyph, { color: glyphColor }]}>{glyph}</Text>
      <Text style={s.tileTitle}>{title}</Text>
      <Text style={s.tileSub}>{sub}</Text>
    </View>
  );
}

// One section per comparison result; each source retains its own labeled row.
export function ElementInfluences({ entries, supported = false }) {
  if (!entries.length) return null;
  return <Inter kind={supported ? "good" : "dyn"} label={supported ? "Supporting element influences" : "Other element influences"}>
    <Under>{supported ? "These align with your BaZi supporting elements." : "These sit outside your BaZi supporting elements."}</Under>
    {entries.map((entry) => <View key={entry.system} style={s.influenceRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.influenceSystem}>{entry.system}</Text>
        <Text style={s.influenceDetail}>{entry.detail}</Text>
      </View>
      <Text style={[s.influenceElement, { color: EL_COLOR[entry.el] }]}>{EL_NAME[entry.el]}</Text>
    </View>)}
  </Inter>;
}

export function Synthesis({ chart, profile }) {
  const z = useMemo(() => zwdsChart(profile), [profile]);
  const st = dmStrength(chart);
  const tp = tenGodProfile(chart);
  const dmEl = STEMS[chart.day.stem].el;
  const g = lifeGua(chart.baziYear, profile.gender);
  const gd = GUA_DATA[g];
  const byDir = {};
  DIR_TYPES.forEach((d) => (byDir[gd.dirs[d.k]] = d));

  const mingStars = z ? (z.stars[z.ming] || []).filter((x) => !MINOR.includes(x)) : [];
  const borrowed = z && mingStars.length === 0 ? (z.stars[(z.ming + 6) % 12] || []).filter((x) => !MINOR.includes(x)) : [];

  /* each favorable element's direction, checked against the personal 8 Mansions map */
  const favDirs = [];
  st.favorable.forEach((el) => (DIR_LETTERS[EL_DIR[el]] || []).forEach((d) => favDirs.push({ d, el })));
  const agreeDirs = favDirs.filter((x) => byDir[x.d] && byDir[x.d].good);
  const splitDirs = favDirs.filter((x) => byDir[x.d] && !byDir[x.d].good);

  /* element echoes: does the lunar bureau / the Life Gua lean on a BaZi-favorable element? */
  const echoes = [];
  if (z) echoes.push({ el: z.mingEl, system: "Zi Wei Dou Shu", detail: "Bureau" });
  echoes.push({ el: gd.el, system: "8 Mansions", detail: `Life Gua ${g}` });
  const echoGood = echoes.filter((e) => st.favorable.includes(e.el));
  const echoOther = echoes.filter((e) => !st.favorable.includes(e.el));

  const nothingAgrees = agreeDirs.length === 0 && echoGood.length === 0;

  return (
    <View>
      <Under>
        Three classical systems read the same birth from different angles: <B color={C.muted}>BaZi</B> (solar calendar, energy & timing), <B color={C.muted}>Zi Wei Dou Shu</B> (lunar calendar, the twelve life areas) and <B color={C.muted}>8 Mansions</B> (birth year, personal directions). Here they are side by side, and where they point the same way.
      </Under>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Tile
          system="BaZi"
          glyph={STEMS[chart.day.stem].cn}
          glyphColor={EL_COLOR[dmEl]}
          title={`${STEMS[chart.day.stem].p} ${EL_NAME[dmEl]}`}
          sub={`${st.strong ? "strong" : "weak"} Day Master · ${TG[tp.top].name}`}
        />
        {z ? (
          <Tile
            system="Zi Wei"
            glyph={BRANCHES[z.ming].cn}
            glyphColor={C.gold}
            title={`Life Palace ${BRANCHES[z.ming].p}`}
            sub={mingStars.length
              ? mingStars.map((x) => ZW_STARS[x].en).join(" · ")
              : `open, borrows ${borrowed.map((x) => ZW_STARS[x].en).join(" · ") || "its opposite palace"}`}
          />
        ) : null}
        <Tile
          system="8 Mansions"
          glyph={gd.cn}
          glyphColor={EL_COLOR[gd.el]}
          title={`Gua ${g} ${gd.name}`}
          sub={`${gd.group} group · best ${gd.dirs.sq}`}
        />
      </View>

      <SubSec>Where the lenses agree</SubSec>
      {agreeDirs.map((x) => (
        <Inter key={"a" + x.d} kind="good" label={`${x.d} · endorsed twice`}>
          <P>
            BaZi points you {x.d}, the direction of your favorable element <B color={EL_COLOR[x.el]}>{EL_NAME[x.el]}</B>, and your 8 Mansions map independently marks {x.d} as {byDir[x.d].name} ({byDir[x.d].en}). When a facing is yours to choose, desk, bed, seat in a negotiation, departure bearing, this is the direction two systems endorse.
          </P>
        </Inter>
      ))}
      <ElementInfluences entries={echoGood} supported />
      {nothingAgrees ? (
        <Under>
          No direct overlap this time: your favorable directions and the other systems' elements each stress a different current. That is not a contradiction, the systems ask different questions, it simply means no single direction or element gets a double endorsement, so read each section on its own terms.
        </Under>
      ) : null}

      {splitDirs.length > 0 || echoOther.length > 0 ? <SubSec>Where they differ</SubSec> : null}
      {splitDirs.map((x) => (
        <Inter key={"s" + x.d} kind="dyn" label={`${x.d} · split verdict`}>
          <P>
            BaZi favors <B color={EL_COLOR[x.el]}>{EL_NAME[x.el]}</B>, whose direction is {x.d}, but your 8 Mansions map marks {x.d} as {byDir[x.d].name} ({byDir[x.d].en}). Traditional practice keeps both: draw on the element through colors, fields and timing, and respect the Mansions warning for physical facings.
          </P>
        </Inter>
      ))}
      <ElementInfluences entries={echoOther} />

      <Fine>
        The three systems are kept independent by design, none of their numbers feed each other, so an agreement above is a genuine coincidence of methods, the strongest kind of signal this app can offer.
      </Fine>
    </View>
  );
}

const s = StyleSheet.create({
  influenceRow: { flexDirection: "row", alignItems: "center", gap: 24, paddingVertical: 12 },
  influenceSystem: { color: C.text, fontFamily: serif, fontSize: 14, fontWeight: "600" },
  influenceDetail: { color: C.muted, fontFamily: serif, fontSize: 12, marginTop: 4 },
  influenceElement: { fontFamily: serif, fontSize: 14, fontWeight: "600" },
  tile: {
    flex: 1, backgroundColor: "transparent",
    paddingVertical: 16, alignItems: "center",
  },
  tileSystem: { color: C.muted, fontSize: 12, fontFamily: serif, letterSpacing: 0.5, marginBottom: 4 },
  tileGlyph: { fontFamily: cjk, fontSize: 30, lineHeight: 36 },
  tileTitle: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 4, textAlign: "center" },
  tileSub: { color: C.muted, fontSize: 12, marginTop: 2, textAlign: "center", lineHeight: 14 },
});

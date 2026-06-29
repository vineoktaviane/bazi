/* Legal & privacy, in-app copies of the Terms of Use, Privacy Policy and
 * Disclaimer. Text lives in ../../content/legal.js.
 * Each document is a collapsible card, matching the FAQ accordion pattern. */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { C, serif } from "../theme";
import { Sec, SubSec, P, Under, Fine, ExpandAction } from "../components";
import { LEGAL_DOCS, LEGAL_UPDATED } from "../../content/legal";

function Block({ block }) {
  if (typeof block === "string") return <P>{block}</P>;
  if (block.bullets) {
    return (
      <View style={{ marginBottom: 4 }}>
        {block.bullets.map((b, i) => (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bulletDot}>·</Text>
            <Text style={s.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    );
  }
  if (block.note) return <Under>{block.note}</Under>;
  if (block.fine) return <Fine>{block.fine}</Fine>;
  return null;
}

function LegalDoc({ doc }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.doc}>
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={doc.title}
        style={s.head}
      >
        <View style={s.headSeal}>
          <Text style={s.headSealCn}>{doc.cn}</Text>
        </View>
        <Text style={s.headTitle}>{doc.title}</Text>
        <ExpandAction expanded={open} />
      </Pressable>
      {open ? (
        <View style={s.body}>
          <Under>{doc.intro}</Under>
          {doc.sections.map((sec, i) => (
            <View key={i}>
              <SubSec>{sec.h}</SubSec>
              {sec.body.map((b, j) => (
                <Block key={j} block={b} />
              ))}
            </View>
          ))}
          <Fine>Last updated: {LEGAL_UPDATED}.</Fine>
        </View>
      ) : null}
    </View>
  );
}

export function LegalSection() {
  return (
    <View>
      <Sec cn="法">Legal &amp; privacy</Sec>
      <Under>
        BaZi Companion is a tool for reflection, not evidence-based prediction, and not professional advice. Your birth
        data stays on your device. Tap to read each document in full.
      </Under>
      {LEGAL_DOCS.map((doc) => (
        <LegalDoc key={doc.key} doc={doc} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  doc: {
    backgroundColor: C.card2,



    marginBottom: 6,
  },
  head: { minHeight: 48, flexDirection: "row", alignItems: "center", padding: 11, gap: 9 },
  headSeal: {



    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  headSealCn: { fontFamily: serif, color: C.gold, fontSize: 14 },
  headTitle: { color: C.text, fontFamily: serif, fontSize: 18, flex: 1, letterSpacing: 0.3 },
  headSign: { color: C.dim, fontSize: 14 },
  body: { paddingHorizontal: 11, paddingBottom: 11 },
  bulletRow: { flexDirection: "row", marginBottom: 5, paddingRight: 4 },
  bulletDot: { color: C.gold, fontSize: 14, lineHeight: 21, width: 12 },
  bulletText: { color: C.muted, fontSize: 14, lineHeight: 20, flex: 1 },
});

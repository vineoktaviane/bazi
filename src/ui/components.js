/* Shared UI primitives, the RN translation of the reference CSS classes
 * (.sec, .subsec, .dominant, .inter, .fine, .seal-chip, .primary, ...). */
import React, { useRef, useState, useContext, createContext, useId } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform } from "react-native";
import { C, serif, cjk } from "./theme";
import Svg, { Rect, Path, Circle } from "react-native-svg";

export function Sec({ cn, children, note }) {
  return (
    <View style={s.sec}>
      <Text style={s.secText} accessibilityRole="header">{children}</Text>
    </View>
  );
}

export function SubSec({ children }) {
  return <Text style={s.subsec}>{children}</Text>;
}

export function SealChip({ children }) {
  return (
    <View style={s.sealWrap}>
      <View style={s.seal}>
        <Text style={s.sealText}>{children}</Text>
      </View>
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Dominant({ label, children }) {
  return (
    <View style={s.dominant}>
      {label ? <Text style={s.dominantLabel}>{label}</Text> : null}
      {children}
    </View>
  );
}

/* .factor, titled reading block */
export function Factor({ chip, title, right, children }) {
  return (
    <View style={s.factor}>
      <View style={s.factorHead}>
        {chip ? <SealChip>{chip}</SealChip> : null}
        <Text style={s.factorTitle}>{title}</Text>
        {right ? <Text style={s.factorRight}>{right}</Text> : null}
      </View>
      {children}
    </View>
  );
}

/* .inter, colored finding box: good (green), bad (red), dyn (gold) */
export function Inter({ kind = "dyn", label, children }) {
  const color = kind === "good" ? C.green : kind === "bad" ? C.red : C.gold;
  return (
    <View style={s.inter}>
      {label ? <Text style={[s.interLabel, { color }]}>{label}</Text> : null}
      {children}
    </View>
  );
}

export function P({ children, style }) {
  return <Text style={[s.p, style]}>{children}</Text>;
}
export function Under({ children, style }) {
  return <Text style={[s.under, style]}>{children}</Text>;
}
export function Watch({ children }) {
  return <Text style={s.watch}>{children}</Text>;
}
export function Fine({ children, style }) {
  return <Text style={[s.fine, style]}>{children}</Text>;
}
export function Empty({ children }) {
  return <Text style={s.empty}>{children}</Text>;
}
export function B({ children, color }) {
  return <Text style={{ fontWeight: "700", color: color || C.text }}>{children}</Text>;
}
export function I({ children }) {
  return <Text style={{ fontStyle: "italic" }}>{children}</Text>;
}

export function Btn({ label, onPress, kind = "primary", disabled, small, style, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        kind === "primary" ? s.btnPrimary : s.btnGhost,
        small && s.btnSmall,
        disabled && { backgroundColor: C.card2, borderColor: C.line },
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      <Text style={[kind === "primary" ? s.btnPrimaryText : s.btnGhostText, disabled && { color: C.dim }, textStyle]}>{label}</Text>
      {kind === "primary" && <Text accessible={false} style={{ color: disabled ? C.dim : C.onAccent, fontSize: 18 }}>→</Text>}
    </Pressable>
  );
}

/* selectable chip (categories, question types, directions, tz…) */
export function ChipBtn({ label, cn, on, onPress, cnColor, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      accessibilityLabel={label}
      style={({ pressed }) => [s.chipBtn, on && s.chipBtnOn, pressed && { opacity: 0.75 }, style]}
    >
      {cn ? <Text style={[s.chipCn, cnColor ? { color: cnColor } : null]}>{cn}</Text> : null}
      <Text style={[s.chipLabel, on && { color: C.accent, fontWeight: "700" }]}>{label}</Text>
    </Pressable>
  );
}

/* labelled form field with optional inline error and hint (shared by all forms) */
const FieldContext = createContext({});
export function Field({ label, required = false, error, hint, children }) {
  const id = useId();
  return <FieldContext.Provider value={{ label, required, error, id, describedBy: error || hint ? id + "-help" : undefined }}>
    <View style={{ marginTop: 24 }}>
      <Text nativeID={id} style={s.fieldLabel}>{label}{required && <Text> *</Text>}</Text>
      {children}
      {error ? <Text nativeID={id + "-help"} accessibilityLiveRegion="polite" style={s.fieldError}>{error}</Text>
        : hint ? <Text nativeID={id + "-help"} style={s.fieldHint}>{hint}</Text> : null}
    </View>
  </FieldContext.Provider>;
}

export function RadioOption({ label, selected, onPress }) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress}
    style={{ flexDirection: "row", alignItems: "center", minHeight: 48, gap: 8, marginRight: 32 }}>
    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: C.text, alignItems: "center", justifyContent: "center" }}>
      {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.text }} />}
    </View>
    <Text style={{ color: C.text, fontSize: 14, fontFamily: serif }}>{label}</Text>
  </Pressable>;
}

/* shared text input (dark card style, red border when bad) */
export function Input({ bad, style, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  const field = useContext(FieldContext);
  return <TextInput
    accessibilityLabel={field.label}
    aria-required={field.required || undefined}
    aria-invalid={!!(bad || field.error)}
    aria-describedby={field.describedBy}
    placeholderTextColor={C.dim}
    selectionColor={C.focus}
    {...props}
    onFocus={(e) => { setFocused(true); onFocus?.(e); }}
    onBlur={(e) => { setFocused(false); onBlur?.(e); }}
    style={[s.input, focused && s.inputFocus, (bad || field.error) && s.inputBad, style]}
  />;
}

/* Segmented number input with visible separators, e.g. DD - MM - YYYY or HH : MM.
 * Each segment is its own box; the separator is printed between them so the
 * format is unmistakable. Typing auto-advances to the next box when a box fills,
 * and Backspace on an empty box jumps back to the previous one.
 *   segments: [{ len, placeholder }]   values: string[] (same length)
 *   onChange(nextValues) */
export function SegmentedInput({ segments, separator, values, onChange, bad }) {
  const refs = useRef([]);
  const field = useContext(FieldContext);
  const [focused, setFocused] = useState(-1);
  const setSeg = (i, text) => {
    const digits = text.replace(/[^\d]/g, "").slice(0, segments[i].len);
    const next = values.slice();
    next[i] = digits;
    onChange(next);
    if (digits.length >= segments[i].len && i < segments.length - 1 && refs.current[i + 1]) {
      refs.current[i + 1].focus();
    }
  };
  const onKey = (i, e) => {
    if (e.nativeEvent.key === "Backspace" && !values[i] && i > 0 && refs.current[i - 1]) {
      refs.current[i - 1].focus();
    }
  };
  return (
    <View style={s.segRow}>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Text style={s.segSep}>{separator}</Text> : null}
          <TextInput
            ref={(r) => (refs.current[i] = r)}
            value={values[i]}
            onChangeText={(t) => setSeg(i, t)}
            onKeyPress={(e) => onKey(i, e)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(-1)}
            selectionColor={C.accent}
            placeholder={seg.placeholder}
            placeholderTextColor={C.dim}
            keyboardType="number-pad"
            maxLength={seg.len}
            textAlign="center"
            accessibilityLabel={`${field.label || ""} ${seg.label}`}
            aria-required={field.required || undefined}
            aria-invalid={!!(bad || field.error)}
            aria-describedby={field.describedBy}
            style={[s.input, s.segInput, { width: seg.len > 2 ? 78 : 54 }, focused === i && s.inputFocus, (bad || field.error) && s.inputBad]}
          />
        </React.Fragment>
      ))}
    </View>
  );
}

/* UTC offset → label, e.g. 8 → "UTC+8", 5.5 → "UTC+5:30", -3.5 → "UTC-3:30" */
export function utcLabel(t) {
  const sign = t < 0 ? "-" : "+";
  const a = Math.abs(t);
  const h = Math.floor(a);
  const mm = Math.round((a - h) * 60);
  return `UTC${sign}${h}${mm ? ":" + String(mm).padStart(2, "0") : ""}`;
}

/* Birth date as DD-MM-YYYY (used everywhere a stored profile date is shown). */
export function birthDMY(p) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(p.d)}-${pad(p.m)}-${p.y}`;
}


/* The four pillars form the same seal at every brand touchpoint. */
export function BrandMark({ size = 44 }) {
  return <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="BaZi Companion four-pillar mark" accessibilityRole="image">
    <Rect width="64" height="64" rx="0" fill={C.accentFill} />
    {[{x:13,y:22,h:27},{x:24,y:14,h:35},{x:35,y:19,h:30},{x:46,y:27,h:22}].map(({x,y,h}) =>
      <Rect key={x} x={x} y={y} width="6" height={h} rx="3" fill="#FFFFFF" />)}
  </Svg>;
}


const NAV_PATHS = {
  chart: "M4 20V10h3v10M10 20V4h3v16M16 20v-8h3v8",
  months: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4 M8 13h2 M14 13h2 M8 17h2",
  ask: "M4 4h16v12H9l-5 4V4z M8 8h8 M8 12h5",
  people: "M3 20v-2a5 5 0 0 1 10 0v2 M15 14a4 4 0 0 1 6 4v2",
  more: "M16 8l-3 5-5 3 3-5 5-3z",
};

function NavigationIcon({ name, active }) {
  const color = active ? C.accent : C.muted;
  return <Svg width={20} height={20} viewBox="0 0 24 24" accessible={false}>
    {name === "people" && <><Circle cx="8" cy="7" r="3" fill="none" stroke={color} strokeWidth="1.5" /><Circle cx="17" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.5" /></>}
    {name === "more" && <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5" />}
    <Path d={NAV_PATHS[name]} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

/* Navigation has its own treatment; form choices continue to use ChipBtn. */
export function TabNavigation({ items, value, onChange, primary = false, label }) {
  const refs = useRef([]);
  const renderItems = items.map((item, index) => {
    const active = value === item.key;
    const keyboardProps = Platform.OS === "web" ? {
      tabIndex: active ? 0 : -1,
      onKeyDown: (event) => {
        const next = event.key === "ArrowRight" ? (index + 1) % items.length
          : event.key === "ArrowLeft" ? (index - 1 + items.length) % items.length
          : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
        if (next === null) return;
        event.preventDefault();
        onChange(items[next].key);
        refs.current[next]?.focus();
        if (!primary) refs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      },
    } : {};
    return <Pressable key={item.key} ref={node => { refs.current[index] = node; }}
      accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: active }}
      onPress={() => onChange(item.key)} {...keyboardProps}
      style={({ pressed }) => [primary ? nav.primaryItem : nav.sectionItem, pressed && { opacity: 0.65 }]}>
      {primary && <NavigationIcon name={item.key} active={active} />}
      <Text style={[primary ? nav.primaryLabel : nav.sectionLabel, active && nav.activeLabel]}>{item.label}</Text>
      <View accessible={false} style={[nav.dot, { backgroundColor: active ? C.accent : "transparent" }]} />
    </Pressable>;
  });
  return primary
    ? <View accessibilityRole="tablist" accessibilityLabel={label} style={nav.primary}>{renderItems}</View>
    : <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={nav.sections}>
        <View accessibilityRole="tablist" accessibilityLabel={label} style={nav.sectionList}>{renderItems}</View>
      </ScrollView>;
}

const nav = StyleSheet.create({
  primary: { flexDirection: "row", paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8, width: "100%", maxWidth: 720, alignSelf: "center" },
  primaryItem: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 60, gap: 5 },
  primaryLabel: { fontFamily: serif, fontSize: 12, lineHeight: 16, color: C.muted, fontWeight: "600" },
  sections: { paddingTop: 24, paddingBottom: 8 },
  sectionList: { flexDirection: "row", gap: 24 },
  sectionItem: { alignItems: "center", justifyContent: "center", minHeight: 48, minWidth: 44, gap: 8 },
  sectionLabel: { fontFamily: serif, fontSize: 14, lineHeight: 20, color: C.muted, fontWeight: "600" },
  activeLabel: { color: C.accent },
  dot: { width: 4, height: 4, borderRadius: 2 },
});

export function ExpandAction({ expanded }) {
  return <View accessible={false} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 12 }}>
    <Text style={{ color: C.accent, fontFamily: serif, fontSize: 12, fontWeight: "600" }}>{expanded ? "Hide" : "Show"}</Text>
    <Svg width={16} height={16} viewBox="0 0 16 16" accessible={false}>
      <Path d={expanded ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4"} fill="none" stroke={C.accent} strokeWidth="1.5" />
    </Svg>
  </View>;
}

export function Disclosure({ label, children }) {
  const [open, setOpen] = useState(false);
  return <View style={{ marginTop: 16, marginBottom: 8, backgroundColor: C.card2 }}>
    <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }}
      accessibilityLabel={label}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        minHeight: 56, padding: 16, backgroundColor: pressed ? C.line : C.card2 })}>
      <Text style={{ color: C.text, fontSize: 14, fontFamily: serif, fontWeight: "600", flex: 1 }}>{label}</Text>
      <ExpandAction expanded={open} />
    </Pressable>
    {open && <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{children}</View>}
  </View>;
}

const s = StyleSheet.create({
  sec: { flexDirection: "row", alignItems: "center", marginTop: 32, marginBottom: 12 },
  secText: { fontFamily: serif, color: C.text, fontSize: 18, lineHeight: 28, fontWeight: "400", flex: 1 },
  subsec: { fontFamily: serif, color: C.text, fontSize: 18, fontWeight: "600", marginTop: 24, marginBottom: 16 },
  sealWrap: { marginRight: 8 },
  seal: { paddingRight: 4 },
  sealText: { color: C.muted, fontFamily: cjk, fontSize: 14 },
  card: { backgroundColor: C.card2, padding: 16, marginBottom: 16 },
  dominant: { backgroundColor: C.card2, padding: 24, marginBottom: 16 },
  dominantLabel: { color: C.text, fontFamily: serif, fontSize: 14, fontWeight: "600", marginBottom: 16 },
  factor: { backgroundColor: C.card2, padding: 16, marginBottom: 16 },
  factorHead: { flexDirection: "row", alignItems: "center", marginBottom: 12, flexWrap: "wrap", rowGap: 8 },
  factorTitle: { fontFamily: serif, color: C.text, fontWeight: "600", fontSize: 18, flexShrink: 1 },
  factorRight: { color: C.muted, fontSize: 12, marginLeft: "auto" },
  inter: { backgroundColor: C.card2, padding: 16, marginTop: 12 },
  interLabel: { fontSize: 14, fontFamily: serif, fontWeight: "600", marginBottom: 8 },
  p: { fontFamily: serif, color: C.text, fontSize: 14, lineHeight: 22, marginBottom: 8 },
  under: { fontFamily: serif, color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 8 },
  watch: { fontFamily: serif, color: C.warn, fontSize: 14, lineHeight: 22, marginBottom: 8 },
  fine: { fontFamily: serif, color: C.dim, fontSize: 12, lineHeight: 16, marginTop: 16, marginBottom: 8 },
  empty: { color: C.muted, fontSize: 14, lineHeight: 22, marginVertical: 16 },
  btnPrimary: { backgroundColor: C.accentFill, paddingVertical: 12, paddingHorizontal: 16, minHeight: 48,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 32, marginTop: 24, minWidth: 192, alignSelf: "flex-start" },
  btnPrimaryText: { fontFamily: serif, color: C.onAccent, fontWeight: "400", fontSize: 14, flexShrink: 1 },
  btnGhost: { paddingVertical: 12, minHeight: 40, alignItems: "flex-start", justifyContent: "center", marginTop: 8 },
  btnGhostText: { fontFamily: serif, color: C.accent, fontSize: 14 },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 0, marginTop: 0, minHeight: 40 },
  chipBtn: { borderBottomWidth: 2, borderBottomColor: "transparent", backgroundColor: "transparent",
    paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center", margin: 0, minWidth: 72, minHeight: 48 },
  chipBtnOn: { borderBottomColor: C.accent, backgroundColor: C.card2 },
  chipCn: { fontFamily: cjk, color: C.muted, fontSize: 16, marginBottom: 4 },
  chipLabel: { fontFamily: serif, color: C.muted, fontSize: 14, textAlign: "center", flexShrink: 1 },
  fieldLabel: { fontFamily: serif, color: C.muted, fontSize: 12, lineHeight: 16, marginBottom: 8 },
  fieldError: { fontFamily: serif, color: C.warn, fontSize: 12, lineHeight: 16, marginTop: 4 },
  fieldHint: { fontFamily: serif, color: C.dim, fontSize: 12, lineHeight: 16, marginTop: 4 },
  input: { backgroundColor: C.card2, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: C.inputLine,
    color: C.text, fontFamily: serif, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, minHeight: 48 },
  inputFocus: Platform.select({ web: { outlineColor: C.focus, outlineStyle: "solid", outlineWidth: 2, outlineOffset: -2 },
    default: { borderBottomWidth: 2, borderBottomColor: C.focus } }),
  inputBad: { borderBottomColor: C.warn, borderBottomWidth: 2 },
  segRow: { flexDirection: "row", alignItems: "center" },
  segInput: { paddingHorizontal: 4 },
  segSep: { color: C.dim, fontSize: 14, marginHorizontal: 8 },
});

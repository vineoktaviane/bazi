/* Carbon-inspired white theme with a BaZi red action color. */
import { Platform } from "react-native";

export const C = {
  bg: "#FFFFFF",
  bg2: "#FFFFFF",
  card: "#FFFFFF",
  card2: "#F4F4F4",
  line: "#E0E0E0",
  text: "#161616",
  muted: "#525252",
  dim: "#6F6F6F",
  accent: "#DA1E28",
  accentFill: "#DA1E28",
  accentSoft: "#FFF1F1",
  onAccent: "#FFFFFF",
  focus: "#0F62FE",
  inputLine: "#8D8D8D",
  gold: "#806018",
  red: "#DA1E28",
  green: "#38684C",
  warn: "#A32B24",
  ink: "#FFFFFF",
};

export const sans = Platform.select({ ios: "System", android: "sans-serif", default: "IBM Plex Sans, Arial, sans-serif" });
// Compatibility token: existing reading headings now share the sans-serif system.
export const serif = sans;
export const cjk = Platform.select({ ios: "PingFang TC", android: "sans-serif", default: "'Noto Serif SC', 'PingFang TC', serif" });

// UI colors are independent from the traditional engine data.
export const EL_COLOR = { wood: "#356548", fire: "#B63A2D", earth: "#855F29", metal: "#64627F", water: "#356785" };

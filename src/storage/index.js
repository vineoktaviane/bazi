/* Storage layer, PRD §7. Single key, JSON. All computation happens on device
 * from raw birth data; derived charts are NEVER persisted (recompute so engine
 * upgrades stay retroactive).
 * This is the one module deliberately rewritten from the reference (which used
 * the artifact-only `window.storage` API): AsyncStorage backs native iOS/Android
 * and maps to localStorage on web via the Expo/RN-web adapter.
 * Shape: { profiles: [{id, name, y, m, d, hh, min, tz, gender, rel}], activeId, oracle: [last 20] } */
import AsyncStorage from "@react-native-async-storage/async-storage";

const SKEY = "bazi:data:v1";

export async function loadData() {
  try {
    const r = await AsyncStorage.getItem(SKEY);
    const d = r ? JSON.parse(r) : {};
    return { profiles: d.profiles || [], activeId: d.activeId || null, oracle: d.oracle || [] };
  } catch {
    return { profiles: [], activeId: null, oracle: [] };
  }
}

export async function saveData(data) {
  try {
    await AsyncStorage.setItem(SKEY, JSON.stringify(data));
  } catch (e) {
    console.error("save failed", e);
  }
}

/* Export/import, birth data is precious; users must be able to back it up (PRD §7). */
export async function exportData() {
  const d = await loadData();
  return JSON.stringify(d, null, 2);
}

export async function importData(json) {
  const d = JSON.parse(json);
  if (!d || !Array.isArray(d.profiles)) throw new Error("Not a valid backup file");
  const clean = {
    profiles: d.profiles.filter((p) => p && p.y && p.m && p.d),
    activeId: d.activeId || (d.profiles[0] && d.profiles[0].id) || null,
    oracle: Array.isArray(d.oracle) ? d.oracle.slice(0, 20) : [],
  };
  await saveData(clean);
  return clean;
}

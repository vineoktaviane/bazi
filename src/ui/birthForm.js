// Form validation shared by the required labels and submit state.
export function birthErrors({ name, date, time, tz, gender }) {
  const [day, month, year] = date.map(Number);
  const [hour, minute] = time.map(Number);
  const errors = {};
  if (!name.trim()) errors.name = "Enter a name.";
  const actual = new Date(Date.UTC(year, month - 1, day));
  if (!date.every(v => /^\d+$/.test(v)) || date[2].length !== 4 || year < 1900 || year > 2100 ||
    actual.getUTCFullYear() !== year || actual.getUTCMonth() !== month - 1 || actual.getUTCDate() !== day) {
    errors.date = "Enter a valid date (DD-MM-YYYY).";
  }
  if (!time.every(v => /^\d+$/.test(v)) || hour > 23 || minute > 59) errors.time = "Enter a time from 00:00 to 23:59.";
  if (tz == null || !Number.isFinite(tz) || tz < -12 || tz > 14) errors.tz = "Select a city or set its time zone.";
  if (!["F", "M"].includes(gender)) errors.gender = "Select an option.";
  return errors;
}

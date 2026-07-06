/* City → standard UTC offset lookup for the birth form.
 * Offsets are the region's STANDARD (non-DST) offset, which is the correct
 * anchor here: the app uses clock time exactly as entered, with no solar-time
 * or daylight-saving correction (see the Fine print on the birth form).
 * tz may be fractional (e.g. 5.5 for India); the engine's civilToJD divides
 * tz/24, so half- and quarter-hour zones work. */

export const CITIES = [
  // UTC-11 … UTC-3 (Americas / Pacific)
  { name: "Pago Pago", cc: "American Samoa", tz: -11 },
  { name: "Honolulu", cc: "United States", tz: -10 },
  { name: "Anchorage", cc: "United States", tz: -9 },
  { name: "Los Angeles", cc: "United States", tz: -8 },
  { name: "San Francisco", cc: "United States", tz: -8 },
  { name: "Vancouver", cc: "Canada", tz: -8 },
  { name: "Tijuana", cc: "Mexico", tz: -8 },
  { name: "Denver", cc: "United States", tz: -7 },
  { name: "Phoenix", cc: "United States", tz: -7 },
  { name: "Chicago", cc: "United States", tz: -6 },
  { name: "Mexico City", cc: "Mexico", tz: -6 },
  { name: "Guatemala City", cc: "Guatemala", tz: -6 },
  { name: "New York", cc: "United States", tz: -5 },
  { name: "Toronto", cc: "Canada", tz: -5 },
  { name: "Miami", cc: "United States", tz: -5 },
  { name: "Bogotá", cc: "Colombia", tz: -5 },
  { name: "Lima", cc: "Peru", tz: -5 },
  { name: "Santiago", cc: "Chile", tz: -4 },
  { name: "Caracas", cc: "Venezuela", tz: -4 },
  { name: "La Paz", cc: "Bolivia", tz: -4 },
  { name: "Halifax", cc: "Canada", tz: -4 },
  { name: "São Paulo", cc: "Brazil", tz: -3 },
  { name: "Rio de Janeiro", cc: "Brazil", tz: -3 },
  { name: "Buenos Aires", cc: "Argentina", tz: -3 },
  { name: "Montevideo", cc: "Uruguay", tz: -3 },
  { name: "Praia", cc: "Cape Verde", tz: -1 },
  { name: "Azores", cc: "Portugal", tz: -1 },

  // UTC+0 … UTC+2 (Europe / Africa)
  { name: "London", cc: "United Kingdom", tz: 0 },
  { name: "Dublin", cc: "Ireland", tz: 0 },
  { name: "Lisbon", cc: "Portugal", tz: 0 },
  { name: "Reykjavik", cc: "Iceland", tz: 0 },
  { name: "Casablanca", cc: "Morocco", tz: 0 },
  { name: "Accra", cc: "Ghana", tz: 0 },
  { name: "Paris", cc: "France", tz: 1 },
  { name: "Berlin", cc: "Germany", tz: 1 },
  { name: "Madrid", cc: "Spain", tz: 1 },
  { name: "Rome", cc: "Italy", tz: 1 },
  { name: "Amsterdam", cc: "Netherlands", tz: 1 },
  { name: "Brussels", cc: "Belgium", tz: 1 },
  { name: "Vienna", cc: "Austria", tz: 1 },
  { name: "Zürich", cc: "Switzerland", tz: 1 },
  { name: "Warsaw", cc: "Poland", tz: 1 },
  { name: "Stockholm", cc: "Sweden", tz: 1 },
  { name: "Lagos", cc: "Nigeria", tz: 1 },
  { name: "Cairo", cc: "Egypt", tz: 2 },
  { name: "Athens", cc: "Greece", tz: 2 },
  { name: "Helsinki", cc: "Finland", tz: 2 },
  { name: "Bucharest", cc: "Romania", tz: 2 },
  { name: "Kyiv", cc: "Ukraine", tz: 2 },
  { name: "Jerusalem", cc: "Israel", tz: 2 },
  { name: "Johannesburg", cc: "South Africa", tz: 2 },

  // UTC+3 … UTC+6 (Middle East / South & Central Asia)
  { name: "Moscow", cc: "Russia", tz: 3 },
  { name: "Istanbul", cc: "Türkiye", tz: 3 },
  { name: "Riyadh", cc: "Saudi Arabia", tz: 3 },
  { name: "Doha", cc: "Qatar", tz: 3 },
  { name: "Kuwait City", cc: "Kuwait", tz: 3 },
  { name: "Baghdad", cc: "Iraq", tz: 3 },
  { name: "Nairobi", cc: "Kenya", tz: 3 },
  { name: "Tehran", cc: "Iran", tz: 3.5 },
  { name: "Dubai", cc: "United Arab Emirates", tz: 4 },
  { name: "Abu Dhabi", cc: "United Arab Emirates", tz: 4 },
  { name: "Baku", cc: "Azerbaijan", tz: 4 },
  { name: "Tbilisi", cc: "Georgia", tz: 4 },
  { name: "Yerevan", cc: "Armenia", tz: 4 },
  { name: "Kabul", cc: "Afghanistan", tz: 4.5 },
  { name: "Karachi", cc: "Pakistan", tz: 5 },
  { name: "Lahore", cc: "Pakistan", tz: 5 },
  { name: "Tashkent", cc: "Uzbekistan", tz: 5 },
  { name: "Mumbai", cc: "India", tz: 5.5 },
  { name: "Delhi", cc: "India", tz: 5.5 },
  { name: "Bengaluru", cc: "India", tz: 5.5 },
  { name: "Kolkata", cc: "India", tz: 5.5 },
  { name: "Chennai", cc: "India", tz: 5.5 },
  { name: "Colombo", cc: "Sri Lanka", tz: 5.5 },
  { name: "Kathmandu", cc: "Nepal", tz: 5.75 },
  { name: "Dhaka", cc: "Bangladesh", tz: 6 },
  { name: "Almaty", cc: "Kazakhstan", tz: 6 },

  // UTC+6.5 … UTC+9.5 (Southeast & East Asia, Oceania)
  { name: "Yangon", cc: "Myanmar", tz: 6.5 },
  { name: "Bangkok", cc: "Thailand", tz: 7 },
  { name: "Hanoi", cc: "Vietnam", tz: 7 },
  { name: "Ho Chi Minh City", cc: "Vietnam", tz: 7 },
  { name: "Phnom Penh", cc: "Cambodia", tz: 7 },
  { name: "Jakarta", cc: "Indonesia", tz: 7 },
  { name: "Surabaya", cc: "Indonesia", tz: 7 },
  { name: "Bandung", cc: "Indonesia", tz: 7 },
  { name: "Medan", cc: "Indonesia", tz: 7 },
  { name: "Beijing", cc: "China", tz: 8 },
  { name: "Shanghai", cc: "China", tz: 8 },
  { name: "Guangzhou", cc: "China", tz: 8 },
  { name: "Hong Kong", cc: "Hong Kong", tz: 8 },
  { name: "Taipei", cc: "Taiwan", tz: 8 },
  { name: "Singapore", cc: "Singapore", tz: 8 },
  { name: "Kuala Lumpur", cc: "Malaysia", tz: 8 },
  { name: "Manila", cc: "Philippines", tz: 8 },
  { name: "Denpasar (Bali)", cc: "Indonesia", tz: 8 },
  { name: "Makassar", cc: "Indonesia", tz: 8 },
  { name: "Perth", cc: "Australia", tz: 8 },
  { name: "Tokyo", cc: "Japan", tz: 9 },
  { name: "Osaka", cc: "Japan", tz: 9 },
  { name: "Seoul", cc: "South Korea", tz: 9 },
  { name: "Pyongyang", cc: "North Korea", tz: 9 },
  { name: "Jayapura", cc: "Indonesia", tz: 9 },
  { name: "Adelaide", cc: "Australia", tz: 9.5 },
  { name: "Darwin", cc: "Australia", tz: 9.5 },

  // UTC+10 … UTC+13 (Pacific)
  { name: "Sydney", cc: "Australia", tz: 10 },
  { name: "Melbourne", cc: "Australia", tz: 10 },
  { name: "Brisbane", cc: "Australia", tz: 10 },
  { name: "Guam", cc: "Guam", tz: 10 },
  { name: "Nouméa", cc: "New Caledonia", tz: 11 },
  { name: "Honiara", cc: "Solomon Islands", tz: 11 },
  { name: "Auckland", cc: "New Zealand", tz: 12 },
  { name: "Wellington", cc: "New Zealand", tz: 12 },
  { name: "Suva", cc: "Fiji", tz: 12 },
  { name: "Nukuʻalofa", cc: "Tonga", tz: 13 },
];

/* Rank matches: prefer a name that starts with the query, then any substring
 * match on name or country. Returns at most `limit` cities. */
export function searchCities(q, limit = 8) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const scored = [];
  for (const c of CITIES) {
    const name = c.name.toLowerCase();
    const cc = c.cc.toLowerCase();
    let rank = -1;
    if (name.startsWith(s)) rank = 0;
    else if (name.includes(s)) rank = 1;
    else if (cc.startsWith(s)) rank = 2;
    else if (cc.includes(s)) rank = 3;
    if (rank >= 0) scored.push({ c, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || a.c.name.localeCompare(b.c.name));
  return scored.slice(0, limit).map((x) => x.c);
}

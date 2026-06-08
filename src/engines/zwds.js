/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { lunarDate } from "../astro/lunar";
import { FIVE_TIGERS, sexIndex } from "./bazi";
import { pick } from "../content/banks";

/* ---------------- ZI WEI DOU SHU ENGINE ---------------- */
const NAYIN_EL = ["metal","fire","wood","earth","metal","fire","water","earth","metal","wood","water","earth","fire","wood","water","metal","fire","wood","earth","metal","fire","water","earth","metal","wood","water","earth","fire","wood","water"];
const ZW_BUREAU = { water: 2, wood: 3, metal: 4, earth: 5, fire: 6 };
const ZW_PALACES = [
  { cn: "命宮", en: "Life", text: "The self: temperament, life direction, the face destiny gave you before circumstance edited it." },
  { cn: "兄弟", en: "Siblings", text: "Siblings and close peers: the horizontal bonds, rivalry and backup of your generation." },
  { cn: "夫妻", en: "Spouse", text: "Marriage and partnership: who you attract, how you bond, and the weather inside commitment." },
  { cn: "子女", en: "Children", text: "Children, creations and what you launch into the world, including students, works and ventures." },
  { cn: "財帛", en: "Wealth", text: "Money in motion: how you earn, hold and lose it; your relationship with the material scoreboard." },
  { cn: "疾厄", en: "Health", text: "Constitution and vulnerabilities: where stress lands in the body and what maintenance it demands." },
  { cn: "遷移", en: "Travel", text: "The outside world: journeys, relocation, how strangers receive you and how you fare away from home." },
  { cn: "交友", en: "Friends", text: "Networks, subordinates and supporters: the quality of the crowd around you and what it costs or gives." },
  { cn: "官祿", en: "Career", text: "Vocation and station: the arena of achievement, and what kind of work your chart calls proper." },
  { cn: "田宅", en: "Property", text: "Home, assets and roots: real estate, the household, and the accumulation that stays put." },
  { cn: "福德", en: "Fortune", text: "The inner life: happiness capacity, tastes, spiritual leanings, what your mind does when nothing demands it." },
  { cn: "父母", en: "Parents", text: "Parents, elders and origins: the support or weight of the generation above you." },
];
const ZW_STARS = {
  ziwei: { cn: "紫微", en: "Emperor", text: "Dignity, command and the need to matter: this star raises the palace it sits in to a throne, with a throne's expectations of respect." },
  tianji: { cn: "天機", en: "Strategist", text: "The turning mind: plans, adjustments, cleverness in motion. Restless where it sits; brilliant when the palace gives it problems to solve." },
  taiyang: { cn: "太陽", en: "Sun", text: "Radiance and giving: visibility, generosity, the father current. It spends itself lighting others, magnificent, and prone to burnout in excess." },
  wuqu: { cn: "武曲", en: "Finance General", text: "Hard competence: money handled decisively, skills over sentiment, action over discussion. Firm to the point of solitary." },
  tiantong: { cn: "天同", en: "Bliss", text: "The child-heart: optimism, comfort, late blooming. Softens whatever palace it occupies, sometimes into ease, sometimes into inertia." },
  lianzhen: { cn: "廉貞", en: "Politician", text: "Intense duality: principle and desire in one flame. Charismatic, strategic, capable of both rectitude and rebellion, the palace decides which." },
  tianfu: { cn: "天府", en: "Treasurer", text: "The vault: stability, stewardship, conservative accumulation. Where it sits, things are kept, managed and quietly grown." },
  taiyin: { cn: "太陰", en: "Moon", text: "Quiet wealth and the mother current: property, savings, tenderness, night work. Gains that accumulate silently, feelings likewise." },
  tanlang: { cn: "貪狼", en: "Wolf of Desire", text: "Appetite and versatility: charm, arts, longevity practices, wanting more of everything. The most life-hungry star, its palace is where you feast or overindulge." },
  jumen: { cn: "巨門", en: "Great Gate", text: "The mouth and the scrutiny: speech, debate, investigation, and misunderstanding. Where it sits, words build careers and start fires." },
  tianxiang: { cn: "天相", en: "Seal", text: "The minister: fairness, service, presentation, the loyal second. It dignifies its palace with duty, and can chain it to others' agendas." },
  tianliang: { cn: "天梁", en: "Elder", text: "The shade tree: protection, principles, medicine and teaching. It arrives with storms to shelter you from, blessing and trouble travel together here." },
  qisha: { cn: "七殺", en: "Marshal", text: "The frontier general: courage, upheaval, decisive breaks. Its palace lives in campaigns, periods of order won by periods of battle." },
  pojun: { cn: "破軍", en: "Vanguard", text: "Destruction before renewal: the star that spends, breaks and rebuilds. Expensive, brave, and incapable of leaving things as they were." },
  wenchang: { cn: "文昌", en: "Scholar", text: "Letters and formality: exams, documents, literary polish, refinement to whatever it touches." },
  wenqu: { cn: "文曲", en: "Muse", text: "Eloquence and art: the romantic word, the performing talent, charm through expression." },
  zuofu: { cn: "左輔", en: "Left Aide", text: "Steady helpers: reliable support arriving through proper channels." },
  youbi: { cn: "右弼", en: "Right Aide", text: "Timely allies: assistance arriving sideways, informal and warm." },
};
const ZW_HUA = {
  lu: { cn: "祿", en: "Abundance", text: "transformed to Abundance: this star's gifts flow, resources, ease and opportunity gather around its themes for life" },
  quan: { cn: "權", en: "Authority", text: "transformed to Authority: this star's themes come with command and intensity, power here, and power struggles" },
  ke: { cn: "科", en: "Merit", text: "transformed to Merit: this star earns reputation gently, recognition, refinement and face accrue to its themes" },
  ji: { cn: "忌", en: "Obstruction", text: "transformed to Obstruction: this star marks your lifelong homework, its themes knot, delay and demand maturity before they pay" },
};
const ZW_SIHUA = {
  0: ["lianzhen", "pojun", "wuqu", "taiyang"], 1: ["tianji", "tianliang", "ziwei", "taiyin"],
  2: ["tiantong", "tianji", "wenchang", "lianzhen"], 3: ["taiyin", "tiantong", "tianji", "jumen"],
  4: ["tanlang", "taiyin", "youbi", "tianji"], 5: ["wuqu", "tanlang", "tianliang", "wenqu"],
  6: ["taiyang", "wuqu", "taiyin", "tiantong"], 7: ["jumen", "taiyang", "wenqu", "wenchang"],
  8: ["tianliang", "ziwei", "zuofu", "wuqu"], 9: ["pojun", "jumen", "taiyin", "tanlang"],
};
const ZW_STARS2 = {
  ziwei: "The Emperor star: born to preside, wounded by being overlooked. Wherever it sits, you set standards, attract responsibility, and quietly require the room to acknowledge it.",
  tianji: "The gearwork star: a mind that cannot stop optimizing. Its palace is in constant renovation, brilliant with change, allergic to stagnation, prone to overthinking the finished.",
  taiyang: "The daylight star: it must shine and it must give. Its palace becomes a stage of service and visibility, admired, busy, and periodically exhausted by its own generosity.",
  wuqu: "The steel star: competence without ceremony. Its palace handles money, tools and hard calls well, and conversations about feelings less well.",
  tiantong: "The soft-landing star: whatever palace holds it gets cushions, optimism and second chances. Its risk is that comfort postpones the necessary.",
  lianzhen: "The two-faced flame: discipline and desire share one star. Its palace runs hot, principled crusades or magnetic entanglements, rarely neither.",
  tianfu: "The storehouse star: it conserves, organizes and endures. Its palace becomes the stable ground of the chart, reliable, propertied, and slow to gamble.",
  taiyin: "The moonlight star: accumulation by night, savings, property, quiet affection. Its palace prospers in stillness and suffers in glare.",
  tanlang: "The appetite star: charm, versatility, hunger for experience. Its palace is where life tastes strongest, talent and temptation served on the same plate.",
  jumen: "The dark-gate star: the power and peril of the spoken word. Its palace argues, investigates, persuades, and collects misunderstandings that only clarity dissolves.",
  tianxiang: "The chancellor star: image, fairness, capable support. Its palace serves and stabilizes, respected by all, occasionally captive to others' scripts.",
  tianliang: "The old-tree star: shelter, longevity, moral weight. It protects its palace through storms, and quietly attracts storms worth protecting from.",
  qisha: "The lone-general star: decisive, austere, built for campaigns. Its palace lives in chapters, conquest, consolidation, and the restlessness between.",
  pojun: "The wave-breaker star: it demolishes the outgrown. Its palace never keeps the factory settings, costly, courageous, permanently under renovation.",
  wenchang: "The examination star: formal intellect, credentials, the well-drafted document. It refines its palace's paperwork and polish.",
  wenqu: "The silver-tongue star: art, eloquence and the romance of expression. It makes its palace charming, and occasionally too persuasive for its own good.",
  zuofu: "The left hand of heaven: institutional helpers, proper-channel support arriving when its palace calls.",
  youbi: "The right hand of heaven: informal rescue, the friend of a friend who happens to know exactly the right person.",
};
const ZW_PAL2 = [
  "The command room of the chart: who you are before circumstances negotiate.",
  "Your generation's bench: brothers, sisters and the peers who function as them.",
  "The chamber of committed love: patterns of attraction, partnership and its weather.",
  "The nursery and the studio: offspring, creations, and everything you launch that carries your name.",
  "The counting house: earning style, holding power, and money's temperament toward you.",
  "The body's ledger: constitution, weak points, and where pressure sends its invoices.",
  "The road palace: how the world beyond your door treats you, and who you become away from home.",
  "The retinue: networks, staff, supporters, the crowd's quality and its price.",
  "The hall of station: vocation, rank, and the arena your effort was built for.",
  "The estate: home, land, holdings, and the family vault across generations.",
  "The inner court: capacity for contentment, tastes, and the mind's private weather.",
  "The ancestral hall: elders, origins, and the support or shadow of the generation above.",
];
const ZW_HUA2 = {
  lu: "carries the Abundance transformation: a lifelong tailwind on this star's themes, resources, ease and opportunity gather here with unusual willingness",
  quan: "carries the Authority transformation: this star's themes come armed, command, escalation, and the occasional power struggle are built into them",
  ke: "carries the Merit transformation: gentle fame attaches to this star's themes, reputation, refinement, and examinations passed",
  ji: "carries the Obstruction transformation: this star names your recurring lesson, its themes tangle, delay and repeat until maturity unties them",
};
const ZW_SHEN = {
  0: "Your Body Palace coincides with your Life Palace: what you are and what you become are one project. Self-development is the whole game for you, and midlife changes you less than it changes most people.",
  2: "Your Body Palace sits in the Spouse Palace: partnership increasingly defines your center of gravity. From midlife onward, who you are with shapes who you are, choose accordingly, early.",
  4: "Your Body Palace sits in Wealth: the material scoreboard grows in importance with age. Your later chapters organize around earning, holding and deploying resources, make peace with that ambition rather than apologizing for it.",
  6: "Your Body Palace sits in Travel: the second half of life pulls outward. Movement, relocation and the world beyond your origin become your defining stage, plant roots that are portable.",
  8: "Your Body Palace sits in Career: vocation becomes identity as you mature. The work will choose you as much as you chose it, so choose work worth being chosen by.",
  10: "Your Body Palace sits in Fortune: with age, the inner life takes command. Contentment, meaning and mental cultivation become your true career, the outer scoreboard matters less every decade.",
};
const ZW_OPEN = [
  "An open palace: no major star resides here, so it borrows the character of its opposite palace, the themes arrive second-hand, shaped elsewhere, and reward flexibility over fixed plans in this area.",
  "No major star claims this palace: its affairs run on borrowed light from the room opposite, arriving through other people and shifting circumstances. Keep this life-area adaptable; it punishes rigid blueprints.",
];
const ZW_PLAIN = {
  ziwei: "In plain terms: natural leader energy. This works best in charge or respected, management, ownership, any role with a title. Being micromanaged or ignored is what breaks it.",
  tianji: "In plain terms: the planner and problem-solver. Quick thinking, loves change, gets bored fast. Great for strategy, tech, consulting and anything that keeps moving; terrible at leaving well enough alone.",
  taiyang: "In plain terms: the giver who needs to be seen. Works hard for others, shines in public-facing roles, teaching, leadership, service, and burns out when the giving is one-way. Learn to say no.",
  wuqu: "In plain terms: practical, tough, good with money and tools. Prefers doing over talking; finance, engineering and disciplined work suit it. Soft skills need deliberate practice here.",
  tiantong: "In plain terms: easygoing, kind, comfort-loving. Life tends to work out, often later rather than sooner. The risk is coasting; the gift is that people relax around this energy.",
  lianzhen: "In plain terms: intense and magnetic. Strong principles or strong desires run the show, politics, passion, ambition. Channel it into a cause or a craft, or it channels itself into drama.",
  tianfu: "In plain terms: the safe pair of hands. Saves rather than spends, manages rather than gambles, keeps things running, banking, administration, property. Boring in the best possible way.",
  taiyin: "In plain terms: gentle, private, good with savings and property. Money grows quietly here; feelings run deep but unspoken. Real estate and steady accumulation suit this star.",
  tanlang: "In plain terms: charming, multi-talented, wants everything. Excellent in sales, entertainment and socialising; the danger is excess, food, romance, spending, hobbies. Pick your appetites deliberately.",
  jumen: "In plain terms: the talker and questioner. Earns by mouth, teaching, law, sales, media, and gets into trouble by mouth too. Precision in speech turns this from liability into career.",
  tianxiang: "In plain terms: the reliable deputy. Fair, presentable, trusted with responsibility, a superb second-in-command, coordinator or adviser. The growth edge: learning to want things for yourself too.",
  tianliang: "In plain terms: the protector and adviser. People bring their problems here; medicine, teaching, insurance and counselling fit. Trouble arrives so it can be fixed, that is the deal with this star.",
  qisha: "In plain terms: bold, independent, all-or-nothing. Thrives on challenge, entrepreneurship, field work, competition. Life comes in big chapters with sharp turns; routine office life suffocates it.",
  pojun: "In plain terms: the change-maker. Breaks old setups and builds new ones, career switches, renovations, reinventions. Expensive but never stuck: budget for the rebuilds and this star delivers.",
  wenchang: "In plain terms: strong with documents, exams and formal writing.",
  wenqu: "In plain terms: artistic and eloquent, a talent for expression and charm.",
  zuofu: "In plain terms: helpful people arrive through official channels.",
  youbi: "In plain terms: helpful people arrive through friends and informal ties.",
};
const ZW_PALQ = [
  "Who am I, at core?", "How do I get along with siblings and close peers?", "What is my love and married life like?",
  "What about my children and the things I create?", "How do I earn and keep money?", "Where is my body vulnerable?",
  "How do I fare away from home, moves, travel, strangers?", "What kind of people surround me, and do they actually help?",
  "What work suits me, and how far can I go?", "What about home, assets and family holdings?",
  "Am I built for contentment? What does my mind do at rest?", "How do elders and parents figure in my life?",
];
const zwStar = (st, seed) => pick([ZW_STARS[st].text, ZW_STARS2[st]], seed);
const zwPal = (i, seed) => pick([ZW_PALACES[i].text, ZW_PAL2[i]], seed);
const zwHua = (k, seed) => pick([ZW_HUA[k].text, ZW_HUA2[k]], seed);
function zwdsChart(profile) {
  const lunar = lunarDate(profile.y, profile.m, profile.d);
  if (!lunar) return null;
  const h = Math.floor(((profile.hh + 1) % 24) / 2);
  const yStem = (((lunar.lunarYear - 4) % 10) + 10) % 10;
  const m = lunar.month, day = lunar.day;
  const ming = (((2 + (m - 1) - h) % 12) + 12) % 12;
  const shen = (((2 + (m - 1) + h) % 12) + 12) % 12;
  const yinStem = FIVE_TIGERS[yStem];
  const stemOf = (b) => (yinStem + ((b - 2 + 12) % 12)) % 10;
  const mingEl = NAYIN_EL[Math.floor(sexIndex(stemOf(ming), ming) / 2)];
  const ju = ZW_BUREAU[mingEl];
  const q = Math.ceil(day / ju), r = q * ju - day;
  const zw = (((2 + (q - 1) + (r % 2 === 1 ? -r : r)) % 12) + 12) % 12;
  const tf = (16 - zw) % 12;
  const P = (x) => ((x % 12) + 12) % 12;
  const stars = {};
  const put = (b, n) => { (stars[b] = stars[b] || []).push(n); };
  put(zw, "ziwei"); put(P(zw - 1), "tianji"); put(P(zw - 3), "taiyang"); put(P(zw - 4), "wuqu"); put(P(zw - 5), "tiantong"); put(P(zw - 8), "lianzhen");
  put(tf, "tianfu"); put(P(tf + 1), "taiyin"); put(P(tf + 2), "tanlang"); put(P(tf + 3), "jumen"); put(P(tf + 4), "tianxiang"); put(P(tf + 5), "tianliang"); put(P(tf + 6), "qisha"); put(P(tf + 10), "pojun");
  put(P(10 - h), "wenchang"); put(P(4 + h), "wenqu"); put(P(4 + (m - 1)), "zuofu"); put(P(10 - (m - 1)), "youbi");
  return { lunar, ming, shen, ju, mingEl, stars, sihua: ZW_SIHUA[yStem], yStem };
}

/* ---------------- ZWDS ADDITIONS (PRD §9 item 5): star brightness + tier-two minor stars.
   Everything from here to the end of zwdsMinors is ADDITIVE, the verified placement code above (PRD §3) is untouched. ---------------- */
/* Brightness (廟旺平弱陷) of the 14 major stars per branch, five grades: 1 廟 temple, 2 旺 prosperous, 3 平 neutral, 4 弱 weak, 5 陷 fallen.
   Source: the five-grade San He table published by ZWDS-Calculator.com (natal chart, "Show Star Brightness", legend "1 = Brightest, 5 = Dimmest";
   its manual-plotting reference is chinese-astrology.blogspot.com). Extracted cell-by-cell on 2026-07-05 from charts spanning all 12 Zi Wei
   positions, so every (star, branch) cell below was observed directly. Schools differ on a handful of cells (e.g. 紫微斗數全書-derived tables
   grade 天府 in 丑 as 廟); this file follows the ZWDS-Calculator.com table throughout so charts can be spot-checked against it 1:1.
   Canonical sanity cells: taiyang (Sun) is 1 (temple) in wu[6] and 5 (fallen) in zi[0]; taiyin (Moon) is the reverse.
   Branch order: 子0 丑1 寅2 卯3 辰4 巳5 午6 未7 申8 酉9 戌10 亥11. */
const ZW_BRIGHT = {}; /* FILLED_FROM_SCRAPE */
const ZW_BRIGHT_LV = {
  1: { cn: "廟", en: "Temple" }, 2: { cn: "旺", en: "Prosperous" }, 3: { cn: "平", en: "Neutral" },
  4: { cn: "弱", en: "Weak" }, 5: { cn: "陷", en: "Fallen" },
};
/* One phrase pair per grade (not per star): woven in FRONT of the composed star reading, so temple/prosperous
   placements lead with the star's gifts and weak/fallen placements lead with its warnings. */
const ZW_BRIGHT_MOD = {
  1: [
    "Enthroned in temple brightness (廟) here, this star gives its best: its gifts arrive first and at full strength, and even its flaws bend toward usefulness.",
    "This is a temple (廟) placement, the star at its brightest seat: lead with its strengths, they are dependable here, and its warnings shrink to footnotes.",
  ],
  2: [
    "The star is prosperous (旺) in this branch, bright and well-seated: expect its better nature to do most of the talking.",
    "A prosperous (旺) placement: the star works with the grain here, its gifts are the headline and its costs stay manageable.",
  ],
  3: [
    "Here the star sits neutral (平), neither enthroned nor exiled: it delivers its themes at ordinary strength, gifts and flaws in roughly equal measure.",
    "A neutral (平) seat: this star's story plays out plainly here, what you feed is what grows.",
  ],
  4: [
    "The star is weak (弱) in this branch: read its warnings before its gifts, the brighter promises need deliberate effort to cash.",
    "A weak (弱) placement: the star's shadow side speaks first here, its gifts still exist but must be earned against the grain.",
  ],
  5: [
    "Here the star is fallen (陷), at its dimmest: take its warnings as the lead, its classic troubles surface easily and its gifts arrive only with conscious work.",
    "A fallen (陷) placement: expect this star's difficult face first, discipline and structure are what redeem it in this seat.",
  ],
};
const zwBright = (st, b) => (ZW_BRIGHT[st] || [])[b] || 0;
const zwBrightMod = (st, b, seed) => { const g = zwBright(st, b); return g ? pick(ZW_BRIGHT_MOD[g], seed) + " " : ""; };
/* Tier-two minor stars. good:false marks the six sha (煞) stars, rendered with the red "bad" styling. */
const ZW_MINOR = {
  tiankui: { cn: "天魁", en: "Senior Nobleman", good: true,
    text: "The daylight nobleman: doors opened by elders, examiners and those above you. Where it sits, merit gets witnessed, and help arrives with a title and a desk.",
    plain: "In plain terms: helpful senior people, bosses, teachers, officials, show up in this life-area at the right moments. Say yes to the introductions." },
  tianyue: { cn: "天鉞", en: "Quiet Nobleman", good: true,
    text: "The night nobleman: patronage that works after hours, recommendations made in rooms you never enter. Softer than its daylight twin, and it often wears a kind face.",
    plain: "In plain terms: behind-the-scenes helpers, often women or quiet mentors, smooth this life-area without asking for credit." },
  lucun: { cn: "祿存", en: "Keeper of Wealth", good: true,
    text: "The stipend star: salary, reserves, the granary that refills. It guards its palace's resources jealously, wealth that stays, and a thrift that can tighten into worry.",
    plain: "In plain terms: steady income and savings gather in this life-area. The watch-out is stinginess, budget for generosity on purpose." },
  qingyang: { cn: "擎羊", en: "Blade", good: false,
    text: "The drawn blade: competition, sharp words, sharp tools, sudden cuts. It gives its palace an edge, decisive in able hands, injurious in careless ones.",
    plain: "In plain terms: friction lives here, rivalry, arguments, accidents involving edges and speed. Channel it into disciplined competition, and double-check the sharp stuff." },
  tuoluo: { cn: "陀羅", en: "Grindstone", good: false,
    text: "The spinning grindstone: delay, entanglement, matters that turn without advancing. Troubles here do not strike, they grind, and grudges keep their own calendar.",
    plain: "In plain terms: things drag and repeat in this life-area, slow paperwork, old resentments, decisions that circle. Patience and clean breaks beat force." },
  huoxing: { cn: "火星", en: "Fire Star", good: false,
    text: "The sudden flame: flare-ups, urgency, tempers and windfalls that arrive burning. Explosive beside the Wolf of Desire; scorching where it finds dry ground.",
    plain: "In plain terms: this life-area runs hot, sudden crises, quick tempers, fast chances that demand fast decisions. Fireproof it with margins and cool-down rules." },
  lingxing: { cn: "鈴星", en: "Bell Star", good: false,
    text: "The smouldering bell: the burn you do not see, low resentment, chronic irritation, alarms that ring at odd hours. Slower than Fire, and it burns longer.",
    plain: "In plain terms: slow-burn trouble, nagging issues that simmer instead of exploding. Fix the small annoyances in this life-area before they harden." },
  dikong: { cn: "地空", en: "Void", good: false,
    text: "The empty sky: gains that evaporate, plans that open onto air. It spiritualizes its palace, hostile to speculation, generous to philosophy.",
    plain: "In plain terms: don't gamble in this life-area, windfalls slip through it. It rewards ideas, faith and letting go far more than accumulation." },
  dijie: { cn: "地劫", en: "Plunder", good: false,
    text: "The taker: expenses, losses, enthusiasms that cost. Where it sits, resources leak toward whatever glitters, the classical purse with a hole in it.",
    plain: "In plain terms: money and energy leak here, impulse buys, bad bets, rescuing people. Automate the savings and sleep on the purchases in this life-area." },
  tianma: { cn: "天馬", en: "Sky Horse", good: true,
    text: "The post-horse: movement, journeys, activation. It saddles its palace, matters advance when you physically move, and stall when you refuse to.",
    plain: "In plain terms: motion is medicine for this life-area, travel, relocation and mobile work all help it. Meeting the Keeper of Wealth, it classically becomes wealth in motion." },
};
/* Placement formulas: the standard San He lookups, per chinese-astrology.blogspot.com (ZWDS-Calculator.com's cited
   manual-plotting reference), Steps 10, 13 and 14, cross-checked against the iztro engine on multiple charts.
   Stem order 甲0乙1丙2丁3戊4己5庚6辛7壬8癸9; branch order 子0…亥11.
   - 天魁/天鉞 by year stem (甲戊庚→丑/未, 乙己→子/申, 丙丁→亥/酉, 辛→午/寅, 壬癸→卯/巳)
   - 祿存 by year stem (甲寅 乙卯 丙巳 丁午 戊巳 己午 庚申 辛酉 壬亥 癸子); 擎羊/陀羅 the branch after/before 祿存
   - 火星/鈴星 start by year-branch trio (寅午戌→丑/卯, 申子辰→寅/戌, 巳酉丑→卯/戌, 亥卯未→酉/戌), both advanced clockwise by the hour index
   - 地劫 clockwise / 地空 anti-clockwise from 亥 by the hour index
   - 天馬 by year-branch trio (申子辰→寅, 寅午戌→申, 巳酉丑→亥, 亥卯未→巳) */
function zwdsMinors(z, profile) {
  const P = (x) => ((x % 12) + 12) % 12;
  const h = Math.floor(((profile.hh + 1) % 24) / 2);
  const yb = P(z.lunar.lunarYear - 4);
  const KUI = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3], YUE = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5];
  const LU = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  const HUO = [2, 3, 1, 9, 2, 3, 1, 9, 2, 3, 1, 9], LING = [10, 10, 3, 10, 10, 10, 3, 10, 10, 10, 3, 10];
  const MA = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5];
  const minors = {};
  const put = (b, n) => { (minors[b] = minors[b] || []).push(n); };
  put(KUI[z.yStem], "tiankui"); put(YUE[z.yStem], "tianyue");
  put(LU[z.yStem], "lucun"); put(P(LU[z.yStem] + 1), "qingyang"); put(P(LU[z.yStem] - 1), "tuoluo");
  put(P(HUO[yb] + h), "huoxing"); put(P(LING[yb] + h), "lingxing");
  put(P(11 + h), "dijie"); put(P(11 - h), "dikong");
  put(MA[yb], "tianma");
  return minors;
}
/* Time layers (PRD §9 item 5): decade 大限, annual 流年 and monthly 流月 overlays. Standard San He rules:
   - Decades start at the Life Palace at the nominal age equal to the bureau number (水二局 starts at 2, 金四局 at 4, …),
     ten years per palace; 陽男陰女 run clockwise, 陰男陽女 anti-clockwise. Each decade takes the Four Transformations
     of its palace stem (via the Five Tigers month-stem rule, same one used to seat the natal chart).
   - The annual layer sits in the palace whose branch equals the lunar year's branch, with the year stem's Transformations.
   - Lunar month 1 sits at the Dou Jun 斗君 palace: from the annual branch count anti-clockwise to the birth month,
     then clockwise to the birth hour; months then proceed clockwise. Ages here are nominal (虛歲): lunar-year difference + 1. */
function zwdsDecades(z, profile) {
  const P = (x) => ((x % 12) + 12) % 12;
  const dir = (z.yStem % 2 === 0) === (profile.gender === "M") ? 1 : -1;
  const yinStem = FIVE_TIGERS[z.yStem];
  const stemOf = (b) => (yinStem + P(b - 2)) % 10;
  return Array.from({ length: 12 }, (_, i) => {
    const b = P(z.ming + dir * i);
    return { b, from: z.ju + i * 10, to: z.ju + i * 10 + 9, stem: stemOf(b), sihua: ZW_SIHUA[stemOf(b)] };
  });
}
function zwdsYearLayer(z, lunarYear) {
  const b = (((lunarYear - 4) % 12) + 12) % 12;
  const stem = (((lunarYear - 4) % 10) + 10) % 10;
  return { b, stem, sihua: ZW_SIHUA[stem], age: lunarYear - z.lunar.lunarYear + 1 };
}
function zwdsMonthLayer(z, profile, annualB) {
  const P = (x) => ((x % 12) + 12) % 12;
  const h = Math.floor(((profile.hh + 1) % 24) / 2);
  const douJun = P(annualB - (z.lunar.month - 1) + h);
  return Array.from({ length: 12 }, (_, k) => P(douJun + k));
}
const ZW_DEC_HUA = {
  lu: "carries this decade's 祿 Abundance, and it lives in your {PAL} Palace: for these ten years, resources and ease flow through that room's affairs, build there deliberately.",
  quan: "carries this decade's 權 Authority into your {PAL} Palace: command gathers there for ten years, push in that room, and expect pushback worth having.",
  ke: "carries this decade's 科 Merit into your {PAL} Palace: this chapter quietly builds your name through that room, invest in being seen there.",
  ji: "carries this decade's 忌 Obstruction into your {PAL} Palace: that room is where this chapter knots, delays and teaches, budget patience for it.",
};
const ZW_YR_HUA = {
  lu: "carries this year's 祿: until the lunar year turns, luck and resources favour your {PAL} Palace, collect there.",
  quan: "carries this year's 權: authority themes activate your {PAL} Palace this year, take the lead in that room.",
  ke: "carries this year's 科: recognition finds your {PAL} Palace this year, show the work.",
  ji: "carries this year's 忌: your {PAL} Palace is this year's friction point, double-check that room's affairs and don't force them.",
};

export { NAYIN_EL, ZW_BUREAU, ZW_PALACES, ZW_STARS, ZW_HUA, ZW_SIHUA, ZW_STARS2, ZW_PAL2, ZW_HUA2, ZW_SHEN, ZW_OPEN, ZW_PLAIN, ZW_PALQ, zwStar, zwPal, zwHua, zwdsChart,
  ZW_BRIGHT, ZW_BRIGHT_LV, ZW_BRIGHT_MOD, zwBright, zwBrightMod, ZW_MINOR, zwdsMinors, zwdsDecades, zwdsYearLayer, zwdsMonthLayer, ZW_DEC_HUA, ZW_YR_HUA };

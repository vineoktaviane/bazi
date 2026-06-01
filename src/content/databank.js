/* ============================================================================
   BAZI DATABANK, comprehensive Chinese-metaphysics data module
   Drop-in for any JS build. Pure data + pure functions, no dependencies.
   Conventions: stems 0-9 (Jia..Gui), branches 0-11 (Zi..Hai),
   sexagenary index 0-59 (0 = Jia Zi). Elements: wood fire earth metal water.
   Formulas verified against reference chart 10 Oct 1989 01:25 (+8) F where noted [V].
   ============================================================================ */

/* ---------------- 1. NA YIN 納音, the 30 melodic elements ----------------
   nayinOf(sexIndex) = NAYIN[Math.floor(sexIndex / 2)]
   Each covers a stem-branch pair (e.g. Jia-Zi & Yi-Chou = Gold in the Sea). */
export const NAYIN = [
  { cn: "海中金", en: "Gold in the Sea", el: "metal", text: "Treasure not yet surfaced: worth that must be discovered and refined before the world prices it." },
  { cn: "爐中火", en: "Fire in the Furnace", el: "fire", text: "Contained, working heat: a nature made for transforming raw material, and people, under pressure." },
  { cn: "大林木", en: "Wood of the Great Forest", el: "wood", text: "Strength in numbers and scale: grows tallest in community, shelters many, dislikes standing alone." },
  { cn: "路旁土", en: "Earth by the Roadside", el: "earth", text: "Patient ground that everyone travels over: enduring, useful, and easily taken for granted until it's gone." },
  { cn: "劍鋒金", en: "Sword-Edge Gold", el: "metal", text: "Metal at maximum sharpness: decisive, brilliant, dangerous to mishandle, including to its owner." },
  { cn: "山頭火", en: "Fire on the Mountain Top", el: "fire", text: "A beacon: visible from far away, inspiring, exposed to every wind. Needs fuel carried up to it." },
  { cn: "澗下水", en: "Water of the Ravine", el: "water", text: "Small, fast, persistent: carves canyons not by force but by never stopping." },
  { cn: "城頭土", en: "Earth of the City Wall", el: "earth", text: "Protective structure: built to defend others, defined by responsibility, strongest under siege." },
  { cn: "白蠟金", en: "White-Wax Gold", el: "metal", text: "Delicate, ornamental metal: refined taste and sensitivity, brilliance that must be protected while it hardens." },
  { cn: "楊柳木", en: "Willow Wood", el: "wood", text: "Grace under pressure: bends in every storm and breaks in none. Softness as a survival strategy." },
  { cn: "泉中水", en: "Spring Water", el: "water", text: "A self-renewing source: quiet, essential, generous, but a spring dug at too greedily runs dry." },
  { cn: "屋上土", en: "Earth on the Roof", el: "earth", text: "Shelter made of soil: practical protection for a household; identity through what it keeps safe." },
  { cn: "霹靂火", en: "Thunderbolt Fire", el: "fire", text: "Sudden, electric force: transformative in an instant, impossible to schedule, unforgettable when it strikes." },
  { cn: "松柏木", en: "Pine and Cypress Wood", el: "wood", text: "Evergreen endurance: keeps its color through winter, principle that outlasts every season of fashion." },
  { cn: "長流水", en: "Long-Flowing Water", el: "water", text: "The river that always arrives: patient momentum, long journeys, goals reached by continuing rather than sprinting." },
  { cn: "沙中金", en: "Gold in the Sand", el: "metal", text: "Value scattered through the ordinary: wealth and talent that must be panned for, grain by grain." },
  { cn: "山下火", en: "Fire below the Mountain", el: "fire", text: "Warmth close to the ground: hearth-light for a community, felt more than seen." },
  { cn: "平地木", en: "Wood of the Plain", el: "wood", text: "Growth in the open: no shelter, all sky, freedom and exposure in equal measure." },
  { cn: "壁上土", en: "Earth on the Wall", el: "earth", text: "Finishing plaster: the touch that makes a structure livable; refinement in service of others' foundations." },
  { cn: "金箔金", en: "Gold-Foil Gold", el: "metal", text: "Thin brilliance spread wide: the gilder's art, beauty and influence over surface area, fragile in depth." },
  { cn: "覆燈火", en: "Lamp Fire", el: "fire", text: "Shielded flame: steady light for study and household; thrives indoors, gutters in the open wind." },
  { cn: "天河水", en: "Water of the Heavenly River", el: "water", text: "Rain from the Milky Way: blessing that falls where it will, generosity on a scale beyond bookkeeping." },
  { cn: "大驛土", en: "Earth of the Great Post-Road", el: "earth", text: "The road that connects capitals: a life of traffic, networks and passage, significance through what moves across it." },
  { cn: "釵釧金", en: "Hairpin Gold", el: "metal", text: "Precious metal shaped for intimacy: worth expressed in adornment and closeness, not in vaults." },
  { cn: "桑柘木", en: "Mulberry Wood", el: "wood", text: "The tree that feeds silk: quiet industry whose value appears in what others weave from it." },
  { cn: "大溪水", en: "Water of the Great Stream", el: "water", text: "Broad current between banks: purposeful flow, strong opinions about direction, impatient with dams." },
  { cn: "沙中土", en: "Earth in the Sand", el: "earth", text: "Shifting ground learning to hold: adaptability first, stability earned, foundations built late but built knowingly." },
  { cn: "天上火", en: "Fire in the Sky", el: "fire", text: "The sun's own category: radiance as a fact of nature, warming everything, answerable to nothing." },
  { cn: "石榴木", en: "Pomegranate Wood", el: "wood", text: "Late sweetness: unremarkable growth that fruits abundantly, a life whose best evidence comes in its second half." },
  { cn: "大海水", en: "Water of the Great Sea", el: "water", text: "The ocean: absorbs every river without changing name, depth, capacity, and moods that ships must respect." },
];
export const nayinOf = (sexIndex) => NAYIN[Math.floor(((sexIndex % 60) + 60) % 60 / 2)];

/* ---------------- 2. TWELVE GROWTH STAGES 長生十二宮 ----------------
   Stage of a Day Master at any branch. Yang stems count forward from their
   Growth point, yin stems backward. [V]: all 12 stages match reference PDF
   for Gui DM (Mao=Growth, Zi=Thriving, Wei=Grave, Wu=Extinction, ...). */
export const GROWTH_START = { 0: 11, 2: 2, 4: 2, 6: 5, 8: 8, 1: 6, 3: 9, 5: 9, 7: 0, 9: 3 };
export const GROWTH_STAGES = [
  { cn: "長生", en: "Growth", text: "The sprout: fresh capability, support from elders, everything ahead. Matters touched by this stage are young and favor beginnings." },
  { cn: "沐浴", en: "Bath", text: "The infant washed: charming, exposed, changeable. Classically linked to attraction and instability, delightful energy that shouldn't sign contracts." },
  { cn: "冠帶", en: "Cap & Sash", text: "Coming of age: first honors, growing confidence, ambition finding its clothes. Good for stepping into roles slightly too big, they'll fit soon." },
  { cn: "臨官", en: "Thriving", text: "The official at his desk: full working strength, salary and station earned. One of the most productive stages, capacity meets opportunity." },
  { cn: "帝旺", en: "Peak", text: "Maximum power: command, dominance, the summit. Magnificent, and by definition, the step after the summit goes down. Spend peak energy, don't hoard it." },
  { cn: "衰", en: "Weakening", text: "The turn: strength ebbing gently, wisdom replacing force. Favors consolidation, mentoring and defense over expansion." },
  { cn: "病", en: "Sickness", text: "Low vitality: energy directed inward to repair. Matters here need patience and maintenance, not demands." },
  { cn: "死", en: "Death", text: "Stillness: the cycle's pause, not its malice. Endings complete themselves; the classical advice is to let them, and to start nothing new on this ground." },
  { cn: "墓", en: "Grave", text: "The storehouse: things collected, buried, banked. Excellent for saving, archiving and closure, a vault, and occasionally a rut." },
  { cn: "絕", en: "Extinction", text: "The void between cycles: nothing left, nothing yet begun. The most fragile stage, and the exact point where reinvention becomes possible." },
  { cn: "胎", en: "Conception", text: "The new spark in darkness: plans forming that no one can see yet. Protect ideas at this stage; they are real but not yet robust." },
  { cn: "養", en: "Nourishing", text: "Gestation: quiet feeding of what was conceived. Growth is happening invisibly, trust the process and keep supplying it." },
];
export function growthStage(dmStem, branch) {
  const start = GROWTH_START[dmStem];
  const yang = dmStem % 2 === 0;
  const idx = yang ? (branch - start + 12) % 12 : (start - branch + 12) % 12;
  return { idx, ...GROWTH_STAGES[idx] };
}

/* ---------------- 3. VOID BRANCHES 空亡 (Kong Wang / Death & Emptiness) ----
   Each 10-day cycle (xun) leaves two branches uncovered. Derived from DAY pillar.
   [V]: reference chart (day Gui-Mao, index 39, Jia-Wu xun) -> voids Chen & Si;
   PDF marks her year branch Si with 空亡 DE. */
export function voidBranches(daySexIndex) {
  const xunStartBranch = (daySexIndex - (daySexIndex % 10) + 120) % 12;
  return [(xunStartBranch + 10) % 12, (xunStartBranch + 11) % 12];
}
export const VOID_TEXT = {
  natal: "A void palace holds its themes loosely: what it governs tends to arrive late, feel distant, or matter less than the world says it should. Classically it is not misfortune but hollowness, the cure is filling it deliberately (attention, ritual, presence) rather than waiting for it to fill itself.",
  palace: {
    year: "Your year pillar is void: roots, ancestry and early foundations sit lightly on you, freedom from the past, and a certain unmoored feeling that self-made traditions can fix.",
    month: "Your month pillar is void: career structures and parental script hold you loosely, conventional ladders satisfy less; build your own definition of arrival.",
    day: "Your spouse palace is void: partnership themes arrive on their own late schedule and resist standard templates. Presence, not paperwork, fills this seat.",
    hour: "Your hour pillar is void: legacy and later-life plans stay abstract until deliberately made concrete, write them down early and revisit them often.",
  },
  activation: "In months and years of your void branches, plans in the affected areas feel delayed or unreal, schedule patience, avoid launching cornerstone commitments there, and use those periods for the inner work voids are best at.",
};

/* ---------------- 4. TWELVE DAY OFFICERS 建除十二神 -------------------------
   The classical date-selection cycle. officerOf(dayBranch, monthBranch):
   day branch == month branch -> Jian (Establish), then forward in order.
   Note: on the day a solar term changes the month, the officer repeats, handle
   at the calendar layer. */
export const DAY_OFFICERS = [
  { cn: "建", en: "Establish", good: "beginnings: openings, taking office, proposals, planting flags", avoid: "groundbreaking, demolition, burial", text: "The founding day: what starts today carries the month's own authority. Start things meant to last; don't dig up what already stands." },
  { cn: "除", en: "Remove", good: "cleaning, ending bad habits, medical treatment, clearing debts", avoid: "weddings, opening businesses", text: "The sweeping day: made for removal, of clutter, ailments, obligations and bad arrangements. Subtract today; add tomorrow." },
  { cn: "滿", en: "Full", good: "celebrations, gratitude, storage, signing what is already agreed", avoid: "burials, starting lawsuits", text: "The abundance day: containers fill. Harvest, celebrate and store, but a full vessel accepts nothing new, so don't force fresh starts." },
  { cn: "平", en: "Balance", good: "negotiations, mediation, road work, routine matters", avoid: "planting ambitions, dramatic moves", text: "The leveling day: extremes flatten. Excellent for settling disputes and evening accounts; dull for glory." },
  { cn: "定", en: "Stable", good: "contracts, engagements, hiring, setting foundations", avoid: "travel, relocation, lawsuits", text: "The anchoring day: what is fixed today stays fixed. Sign, commit, engage, and don't choose it for anything that needs to move." },
  { cn: "執", en: "Initiate", good: "grasping tasks, hiring, hunting for what's owed, ceremonies", avoid: "moving house, travel, opening", text: "The grasping day: authority in the hand. Take hold of tasks, people and debts, a day for grip, not release." },
  { cn: "破", en: "Destruction", good: "demolition, ending contracts, surgery to remove", avoid: "almost everything constructive, weddings, openings, signings", text: "The breaking day: the month's own clash. Nothing built today holds. Use it only for what should break, then stand back." },
  { cn: "危", en: "Danger", good: "caution, prayer, quiet work at heights avoided", avoid: "risk of any kind: climbing, sailing, ventures, surgery if electable", text: "The precipice day: margins are thin. Move carefully, defer the daring, and let the adrenaline find you another day." },
  { cn: "成", en: "Success", good: "completions, openings, weddings, launches, moving in", avoid: "lawsuits, endings", text: "The completion day: efforts mature. The classic all-purpose auspicious day, finish, launch, celebrate, marry." },
  { cn: "收", en: "Receive", good: "collecting, harvesting, banking, receiving payments and goods", avoid: "funerals, dispersing, lending out", text: "The gathering day: what is owed comes home. Collect, store, bank and file, a day for intake, not outflow." },
  { cn: "開", en: "Open", good: "grand openings, starting studies, breaking ground, first meetings", avoid: "burials", text: "The open-gate day: doors swing easily. Begin what needs welcome, enterprises, courses, introductions." },
  { cn: "閉", en: "Close", good: "sealing, finishing accounts, security, burial, rest", avoid: "openings, taking office, travel", text: "The sealed day: energy turns inward and shuts. Close books, lock doors, rest deeply, begin nothing." },
];
export const officerOf = (dayBranch, monthBranch) => DAY_OFFICERS[(dayBranch - monthBranch + 12) % 12];

/* ---------------- 5. ADDITIONAL SYMBOLIC STARS 神煞 ------------------------ */
/* Thriving / Salary star 祿神, by Day Master stem -> branch. [V]: Gui -> Zi. */
export const LU_STAR = { 0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0 };
/* Yang Blade 羊刃 (yang stems only): the branch after Lu, power's sharp edge. */
export const YANG_BLADE = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };
/* Golden Carriage 金輿: comfort, vehicles, quiet wealth. By Day Master stem. */
export const GOLDEN_CARRIAGE = { 0: 4, 1: 5, 2: 7, 3: 8, 4: 7, 5: 8, 6: 10, 7: 11, 8: 1, 9: 2 };
/* Month Virtue 月德 (by month-branch trio -> protective stem) */
export const MONTH_VIRTUE = { "2,6,10": 2, "8,0,4": 8, "11,3,7": 0, "5,9,1": 6 };
export const EXTRA_STAR_TEXT = {
  lu: { name: "Thriving Star", cn: "祿神", good: true, text: "Your salary star: the branch where your Day Master draws its official pay. Months and years here favor income, employment and material footing; people of this sign steady your finances." },
  blade: { name: "Yang Blade", cn: "羊刃", good: false, text: "Power's overshoot: the edge past your peak. Its activations bring fierce capability and equal risk, injuries, conflicts, forced moves. Superb for surgeons, athletes and crises; handle everything sharp (words included) with respect." },
  carriage: { name: "Golden Carriage", cn: "金輿", good: true, text: "The comfort star: quiet wealth, vehicles, being carried by life for a stretch. Its activations ease logistics and material worries, a good time to upgrade what carries you." },
  monthVirtue: { name: "Month Virtue", cn: "月德", good: true, text: "A protective blessing: mishaps soften, forgiveness comes easier, and dangerous moments tend to graze rather than strike." },
};

/* ---------------- 6. 28 LUNAR MANSIONS 二十八宿 ----------------------------
   Names, elements-of-day (Seven Luminaries), and almanac verdicts.
   CALIBRATION REQUIRED: mansion-of-day = MANSIONS[(JDN + OFFSET) % 28].
   Each mansion is permanently tied to a weekday (four per weekday); calibrate
   OFFSET once against any published Tong Shu, then it never drifts. */
export const MANSIONS = [
  { cn: "角", en: "Horn", day: "Thu", good: true, text: "Favors construction, weddings and new clothes; avoid burials." },
  { cn: "亢", en: "Neck", day: "Fri", good: false, text: "Quarrelsome; avoid weddings and building." },
  { cn: "氐", en: "Root", day: "Sat", good: false, text: "Unstable ground; avoid launching and marrying." },
  { cn: "房", en: "Room", day: "Sun", good: true, text: "Broadly auspicious: weddings, moving, building." },
  { cn: "心", en: "Heart", day: "Mon", good: false, text: "Emotionally volatile; avoid litigation and weddings." },
  { cn: "尾", en: "Tail", day: "Tue", good: true, text: "Good for openings, weddings and construction." },
  { cn: "箕", en: "Winnowing Basket", day: "Wed", good: true, text: "Good for gathering wealth and construction; windy, secure loose plans." },
  { cn: "斗", en: "Dipper", day: "Thu", good: true, text: "Broadly auspicious; favors earthworks and enterprise." },
  { cn: "牛", en: "Ox", day: "Fri", good: false, text: "Heavy and slow; inauspicious for most undertakings." },
  { cn: "女", en: "Girl", day: "Sat", good: false, text: "Disputes among women classically; avoid weddings." },
  { cn: "虛", en: "Emptiness", day: "Sun", good: false, text: "Hollow day: avoid beginnings and burials alike." },
  { cn: "危", en: "Rooftop", day: "Mon", good: false, text: "Precarious; avoid heights, sailing and risk." },
  { cn: "室", en: "Encampment", day: "Tue", good: true, text: "Strongly auspicious: building, weddings, moving in." },
  { cn: "壁", en: "Wall", day: "Wed", good: true, text: "Auspicious for construction, weddings and study." },
  { cn: "奎", en: "Legs", day: "Thu", good: false, text: "Mixed: good for study and travel, poor for openings." },
  { cn: "婁", en: "Bond", day: "Fri", good: true, text: "Good for weddings, agreements and construction." },
  { cn: "胃", en: "Stomach", day: "Sat", good: true, text: "Good for storage, banking and ceremonies." },
  { cn: "昴", en: "Pleiades", day: "Sun", good: false, text: "Harsh light: avoid weddings and lawsuits." },
  { cn: "畢", en: "Net", day: "Mon", good: true, text: "Good for construction, hunting goals and earth matters." },
  { cn: "觜", en: "Beak", day: "Tue", good: false, text: "Sharp tongues: avoid ceremonies and signings." },
  { cn: "參", en: "Three Stars", day: "Wed", good: true, text: "Good for travel, construction and bold moves; poor for weddings." },
  { cn: "井", en: "Well", day: "Thu", good: true, text: "Good for study, ritual and water matters; avoid burials." },
  { cn: "鬼", en: "Ghost", day: "Fri", good: false, text: "Only funerals prosper; begin nothing." },
  { cn: "柳", en: "Willow", day: "Sat", good: false, text: "Drooping energy: avoid openings and weddings." },
  { cn: "星", en: "Star", day: "Sun", good: false, text: "Mixed: good for renovation, poor for weddings." },
  { cn: "張", en: "Extended Net", day: "Mon", good: true, text: "Strongly auspicious: weddings, openings, ceremonies." },
  { cn: "翼", en: "Wings", day: "Tue", good: false, text: "Flighty: avoid weddings; fine for planting and study." },
  { cn: "軫", en: "Chariot", day: "Wed", good: true, text: "Auspicious for travel, vehicles, weddings and trade." },
];

/* ---------------- 7. AUSPICIOUS HOURS method ------------------------------
   For any day: hour branch that COMBINES the person's day branch = personal
   golden hour; hour branch that CLASHES it = personal broken hour. Hour of
   personal Nobleman = helpful-people hour. Texts: */
export const HOUR_TEXT = {
  golden: "Your golden hour: the two-hour window whose branch combines your day pillar. Schedule the ask, the signing, the first meeting here.",
  broken: "Your broken hour: the window clashing your day pillar. Expect friction and interruptions; route routine work here, never negotiations.",
  noble: "Nobleman hours: windows carrying your helpful-people star, favors requested now find warmer hands.",
};

/* ---------------- 8. EXTENDED TEXT VARIANTS -------------------------------
   Fourth & fifth variants for the Ten God month/decade/year banks.
   Merge into your existing arrays: TG_MONTH[g].focus.push(...TG_V4V5[g].focus) etc. */
export const TG_V4V5 = {
  F: { focus: [
      "Old names resurface this {P}, the classmate, the former colleague, the friend from another chapter. These returns are the period's gift: reconnection now builds the network your next chapter will run on.",
      "Strength arrives in plural form this {P}. Whatever you're carrying, someone at your level is carrying its twin, find them, compare notes, and split the load; solo heroics are the one strategy this influence refuses to reward.",
    ], watch: [
      "Equality has a price tag: this influence blurs the line between yours and ours. Name the owner of every asset, credit and task now, while everyone is still smiling.",
      "Your circle's habits become yours faster than usual this {P}, choose the company whose spending, standards and tempo you'd be content to inherit.",
    ] },
  RW: { focus: [
      "The competitive field is where you shine this {P}: auditions, bids, tournaments, salary talks. You read opponents faster than usual and bluff better, enter contests you'd normally watch from the stands.",
      "Allies with sharp elbows gather around you this {P}. Led well, they're an army; led loosely, a bar tab. Give the boldness a target and a budget on day one.",
    ], watch: [
      "Generosity is this influence's favorite disguise for loss. The friend in need, the sure investment, the round for the table, each is real, and each is also how this {P} empties pockets. Decide your giving in advance, in writing, to yourself.",
      "Speed is the pickpocket now: fast deals, fast friends, fast promises. Anything that can't survive a 48-hour pause probably shouldn't survive at all.",
    ] },
  EG: { focus: [
      "Your standards are the asset this {P}: what you find beautiful, delicious or well-made, others will too. Curate, review, host, recommend, taste itself becomes productive.",
      "Gentle output compounds now: the daily page, the practiced dish, the tended garden, the maintained habit. Nothing dramatic, and by the end of the {P}, something substantial.",
    ], watch: [
      "The muse and the nap are easily confused this {P}. If rest keeps needing one more day, it has quietly become avoidance, give the comfort a curfew.",
      "Sweetness accumulates invisibly: in the diet, the schedule, the standards. Weigh all three at the {P}'s midpoint, not just its end.",
    ] },
  HO: { focus: [
      "Your unconventional take is the valuable one this {P}. Where everyone recites the standard answer, your sideways version lands, pitch the weird idea, publish the contrarian piece, be the interesting one in the room.",
      "Audiences find you now without being hunted: algorithms, introductions, open mics, forwarded messages. Make sure what they find is your best material and not your unfiltered feed.",
    ], watch: [
      "Brilliance and insubordination are one substance under this influence, separated only by aim. Before you speak truth to power, confirm the truth is load-bearing and the power is worth the invoice.",
      "The rules you find stupid this {P} are still enforced. Break them as art if you must, never as paperwork.",
    ] },
  IW: { focus: [
      "Your radar for undervalued things, objects, skills, people, moments, runs hot this {P}. What others overlook, you can flip, fix or feature. Browse widely; the bargain is real this time.",
      "Income wants to diversify now: the side gig, the small stake, the weekend market. Streams started this {P} tend to keep trickling after it ends.",
    ], watch: [
      "The father, or a father-figure, may need attention this {P}, classically this influence touches his health or affairs. A call costs nothing.",
      "Opportunity's twin is distraction wearing better clothes. For each opening you chase, name the one you're deliberately declining, unchosen options should be decisions, not accidents.",
    ] },
  DW: { focus: [
      "Precision pays this {P}: the renegotiated rate, the audited subscription, the collected invoice, the itemized claim. Money respects whoever counts it, count yours.",
      "Assets want stewardship now: maintain the property, service the machine, rebalance the account. Boring verbs, compounding nouns.",
    ], watch: [
      "The ledger can become a lens: this influence tempts you to price things that shouldn't have prices, favors, affection, rest. Keep two books: one for money, one deliberately blank.",
      "Diligence without a stop-time is just slow-motion burnout. Set closing hours for yourself the way a shop does, and honor them like a shopkeeper.",
    ] },
  DO: { focus: [
      "Institutions answer this {P}: the application processes, the permit clears, the committee says yes. Anything requiring official machinery, file it now while the machinery likes you.",
      "Your word hardens into reputation faster than usual this {P}. Promise precisely, deliver visibly, and let the record do your networking.",
    ], watch: [
      "Titles attract weight: every role accepted this {P} arrives with invisible obligations attached. Read the unwritten job description before nodding.",
      "Being the responsible one is a compliment that compounds into a cage. Delegate one duty this {P} on principle, even if you'd do it better.",
    ] },
  "7K": { focus: [
      "Crisis is your stage this {P}: when things break, you get sharper while others get louder. Volunteer for the fire, it's where your reputation is being written.",
      "The intimidating thing on your list has never been more approachable: the confrontation, the application, the ask, the diagnosis. This influence exists to spend on exactly that door.",
    ], watch: [
      "Your force is contagious this {P}, rooms harden around you without your noticing. Soften deliberately with the people who aren't the problem.",
      "Under pressure the body keeps the minutes: jaw, shoulders, sleep, stomach. Read those minutes weekly and adjourn before they escalate.",
    ] },
  DR: { focus: [
      "The right teacher appears when the student schedules time: enrol, subscribe, apprentice, ask the senior person to lunch. Doors marked 'knowledge' are unlocked this {P}.",
      "Paperwork is quietly powerful now: the certificate, the license, the properly filed claim, the updated will. Documents completed this {P} protect for years.",
    ], watch: [
      "Advice is abundant this {P}, which is precisely the risk. Collect counsel widely, then make the decision alone; a committee cannot live your life.",
      "Being understood is soothing and can substitute for being underway. After every supportive conversation, take one concrete step, however small.",
    ] },
  IR: { focus: [
      "Your private studies pay off strangely this {P}: the obscure skill becomes relevant, the odd reading answers a real question. Trust the curriculum only you are following.",
      "Solitude is productive now, not lonely: the retreat, the deep-work week, the early morning hours. Guard them like appointments with your most important client, because they are.",
    ], watch: [
      "The mind that sees hidden patterns can also embroider them. Once a suspicion survives three days, test it against a person, not another search.",
      "Depth can become a hiding place. Set a ship-date for the current investigation, insight owes the world an appearance.",
    ] },
};

/* Second variants for the dominant-god profiles */
export const TG_DOMINANT_ALT = {
  F: "A Friend-led chart walks through life flanked: siblings, comrades, co-founders. Your instinct in trouble is to call someone, and someone answers. The lifelong ledger to watch is the shared one: split ventures, joint accounts and borrowed credit are where this gift collects its fee.",
  RW: "Rob Wealth in command makes you the one who dares first: the opener of negotiations, the taker of dares, the friend who makes dull evenings historic. Money is your weather, it comes and goes in fronts. Build the boring reservoir (automatic savings, untouchable accounts) precisely because your nature won't.",
  EG: "An Eating God chart is a fortunate temperament: you generate pleasure and product from the same motion. Your work rarely feels like war, which is a blessing with one clause, nothing in you volunteers for hardship, so growth must be invited in deliberately.",
  HO: "Hurting Officer dominant is the performer's constitution: allergic to scripts, gifted at spotlight, dangerous in captivity. Your career either includes an audience or manufactures conflict to feel alive. Choose the audience.",
  IW: "Indirect Wealth in command is the trader's eye as a personality: everything is inventory, timing and margin. Fortunes visit you more than once in life, the skill to practice is keeping a floor under the swings, because your ceiling takes care of itself.",
  DW: "Direct Wealth dominant builds like sediment: layer on layer, decade on decade. You will likely out-own your flashier peers by sheer consistency. The examined risk: mistaking accumulation for purpose, and discovering at sixty a full vault and an unwritten life.",
  DO: "A Direct Officer chart is trusted on sight and promoted on schedule: you embody the institution's better self. Two disciplines keep it healthy, saying no before overload rather than after, and keeping one corner of life gloriously unofficial.",
  "7K": "Seven Killings dominant is command psychology: you organize under fire, decide while others deliberate, and secretly relax in emergencies. Peace is your hard mode. Keep a worthy war on the calendar, a mountain, a startup, a mastery, or your nervous system will draft one from your household.",
  DR: "Direct Resource in command is the protected scholar's life: knowledge accretes, references vouch, safety nets appear. Its single tax is initiative, everything in your chart waits for sanction. Practice starting unsanctioned things at small scale, forever.",
  IR: "Indirect Resource dominant is the strategist's solitude: you know things sideways, early and deeply, and explain them only when asked twice. Institutions underprice you; niches crown you. Find the room where your strange map is the official one.",
};

/* Extra oracle verdict variants, push into ORACLE_VERDICT[key].texts */
export const ORACLE_VERDICT_EXTRA = {
  supports: "Rarely does a configuration lean this kindly: the matter itself works on your behalf, like a door already opening as you reach for it. Walk through without theatrics, gratitude, not force, is the correct posture here.",
  peer: "Neither servant nor master, the matter meets you as kin. {D} advances through mutuality: share information freely, split gains fairly, and the configuration keeps renewing itself.",
  command: "The matter is clay and you are hands: {D} takes whatever shape your effort insists on. The only failure mode is leaving the clay on the table.",
  drains: "Count the true price before proceeding: {D} charges in the currency you have least of, time, vitality, attention. Paid knowingly, it may still be worth it; paid absentmindedly, it always overcharges.",
  presses: "Iron against your grain: {D} currently outweighs you, and effort spent now mostly proves the point. Retreat here is technique, not defeat, the configuration will rotate, and the prepared return wins what the stubborn stand loses.",
};

/* ---------------- 9. IMPLEMENTATION NOTES ----------------------------------
   Systems present in commercial charts but NOT included here, with reasons:
   - Zi Wei Dou Shu: a complete parallel astrology (14 major stars, 12 palaces,
     lunar-calendar based). Viable phase 3; needs a lunar calendar first.
   - Joey Yap's extended annual star table & "10 Profiles" branding: proprietary.
     The classical stars above are the public-domain core.
   ============================================================================ */


/* ---------------- 10. EXPANSION PACK: second-variant banks ----------------
   Rotate with your existing single-variant banks via seeded pick(). */
export const GOD_IN_PALACE2 = {
  year: {
    F: "The family cast you as a companion, not a subordinate, you argued at the dinner table and were heard. Strangers still read that in you: someone who expects to be dealt with as an equal.",
    RW: "Your origins taught risk by demonstration: fortunes rising and dipping somewhere in the family weather. It left you unafraid of stakes, and it left the world reading appetite in your public face.",
    EG: "Somewhere at your roots stands a maker, of food, of things, of comfort. You inherited the licence to enjoy life openly, and people sense it before you speak.",
    HO: "The household voice was loud, praised or punished, never ignored. You carry that inheritance publicly: a face the room turns to when silence needs breaking.",
    IW: "Commerce runs in the bloodline's background: deals, stalls, ventures, movements of money. Your public self reads as someone who knows what things are worth.",
    DW: "You come from counted money and kept promises, a lineage of the reliable. It shows: institutions trust your face before your CV.",
    DO: "Somewhere behind you stands a uniform, a title, or a rulebook honoured. You arrived pre-approved: the world extends you the credit of the orderly.",
    "7K": "Your beginnings had a commander in them, circumstance or person, and demanded early competence. The residue is visible: people instinctively straighten slightly around you.",
    DR: "Books, elders or faith stood guard over your beginnings. You wear that protection publicly, the stranger who gets asked for directions, the newcomer who is trusted first.",
    IR: "Your roots hold a secret room, an unusual believer, a solitary mind, a path the neighbours didn't take. From outside, you read as someone with more behind the eyes than on the card.",
  },
  month: {
    F: "Your best professional years are co-authored: partnerships, guilds, teams of equals. Titles matter less to you than being in the right company, literally.",
    RW: "Your prime working years carry a gambler's rhythm: wins, resets, comebacks. Careers with scoreboards suit you; careers with only salaries starve you.",
    EG: "Work, for you, must produce something tasteable, a made thing, a served thing, a finished thing. Pure process jobs erode you; craft restores you.",
    HO: "Your professional currency is voice: the pitch, the class, the column, the stage. Silence is the only career move that fails you every time.",
    IW: "Your career is a portfolio, not a post: incomes, projects and ventures in rotation. The org chart was never going to hold all of you.",
    DW: "Your working prime compounds quietly: mastery of systems, custody of resources, the slow trust of institutions. You get rich the way trees get tall.",
    DO: "Ranks, boards and charters recognize you on contact, the career built inside legitimate structures. Your ascents are steady, documented, and deserved.",
    "7K": "Your résumé's best lines are battles: turnarounds, launches under fire, impossible deadlines met. Hire yourself out to difficulty; ease wastes you.",
    DR: "Your career is an accumulating library: credentials, protégés, institutional memory. You become more valuable every year you stay in the knowledge game.",
    IR: "Your professional edge is the knowledge nobody else bothered to acquire. Depth-first careers, research, strategy, rare specialisms, pay you twice: in money and in freedom.",
  },
  hour: {
    F: "Your final chapters are crowded in the best way, friendships that outlast careers, children met as adults and liked. Build the porch; people will come to it.",
    RW: "The fire doesn't bank with age: late bets, generous hands, children with their own weather. Appoint a guardian for the reserves, possibly against yourself.",
    EG: "Your legacy is made things and fed people: recipes, works, gardens, gatherings. Old age, for you, is a workshop with better hours.",
    HO: "You will not go quietly, the late memoir, the second career, the opinions at eighty. Your children inherit the volume; teach them the aim.",
    IW: "Retirement is a word other people use: your later years keep spotting openings. Keep one venture small enough to enjoy and large enough to matter.",
    DW: "The harvest years are literal for you: holdings, order, a will that's actually organized. Make sure the estate includes memories, not only assets.",
    DO: "You are building something with your name on the cornerstone, a practice, a family standard, an institution. Later life is when the weight becomes visible; carry it with help.",
    "7K": "Ambition retires last in your chart. Give the later decades campaigns, causes, summits, apprentices to forge, or the intensity will audit your family instead.",
    DR: "Your last profession is teacher, whatever the business card said. What you know wants heirs; start naming them early.",
    IR: "The final act turns inward and strange, in the richest sense: the deep interest, the quiet practice, the archive only you can read. Leave a key to it somewhere findable.",
  },
  spouse: {
    F: "The marriage seat holds a colleague-in-life: someone to build alongside, argue with as an equal, and never carry. Divide the territory early, two captains need two decks.",
    RW: "Voltage lives in your spouse palace: a partner of appetite and nerve. The romance is real and so is the invoice, merge hearts, not necessarily accounts.",
    EG: "Your spouse palace is furnished for comfort: a partner, or a partnership, of meals, ease and unforced affection. Its only enemy is taking the sweetness as furniture.",
    HO: "The occupant of your marriage seat sparkles and detonates in the same gesture: expressive, proud, allergic to being managed. Applaud first, negotiate second.",
    IW: "The spouse seat is on wheels: a partner entangled with enterprise, travel or turning money. Build rituals that travel well, the stability is portable or it is nothing.",
    DW: "Your marriage seat is held by the steady hand: provision, planning, loyalty in deeds. Say the appreciation out loud; this occupant never invoices, but it keeps records.",
    DO: "Propriety keeps your marriage seat: a partner of standards and standing. The relationship photographs well and files correctly, schedule the unphotographed hours deliberately.",
    "7K": "Your spouse palace runs hot: attraction with an edge, a partner who tests and is tested. The great version is two strong wills aimed at the same enemy, never at each other for long.",
    DR: "The marriage seat is a haven: care, counsel, the partner who brings soup and sense. Guard against the gentle slide from being loved to being managed.",
    IR: "A quiet cipher holds your spouse palace: the partner of few words and deep files. Intimacy here is earned by understanding, and its silences are usually full, not empty.",
  },
};
export const TG_PERSON2 = {
  F: "your reflection with its own passport, same instincts, separate itinerary. Comfortable instantly, competitive occasionally, and the first call you make when something breaks.",
  RW: "gasoline in human form: everything gets faster, louder and more expensive around them. Magnificent in campaigns; budget-adjacent in friendship.",
  EG: "dessert as a person, around them you soften, create and order the good wine. Zero threat, mild gravity: too much and ambition naps.",
  HO: "the person who makes you say the true thing out loud. Your edits disappear around them, career-changing in both directions.",
  IW: "a walking opportunity: plans, angles and openings follow them through the door. They activate your appetite, bring your own brakes.",
  DW: "the embodiment of getting-it-done: around them you invoice, finish and file. Love or work with them is a construction project with good foundations.",
  DO: "a standard you volunteer to meet. You stand straighter, deliver earlier and swear less around them, and occasionally miss slouching.",
  "7K": "the pressure you chose: they demand, you rise. The healthiest form is a sparring partner with your best interests; the worst is a drill sergeant in your living room.",
  DR: "a roof in human form: their presence lowers your pulse and raises your competence. Careful only that shelter doesn't become supervision.",
  IR: "a locked library you have a card for: strange knowledge, sideways counsel, insight on delay. You leave conversations with them thinking differently, the rarest effect there is.",
};
export const DM_BLURB2 = {
  Jia: "Yang Wood, the pillar and the oak. You grow by commitment: one direction, deep roots, visible rings for every year survived. The world leans on you; learn to lean occasionally back.",
  Yi: "Yin Wood, ivy, orchid, climbing rose. You succeed by attachment and adaptation, decorating whatever structure you choose. Choose structures worthy of your winding.",
  Bing: "Yang Fire, daylight itself. You don't try to shine; absence of you is simply noticed. The discipline is dosage: even the sun sets daily, on schedule, without apology.",
  Ding: "Yin Fire, lamplight and lit fuses. Precise warmth, aimed insight, influence one mind at a time. You are proof that a small flame decides what the room sees.",
  Wu: "Yang Earth, the mountain range. Immovability is your gift and your tax: everything shelters against you, and nothing moves you, including sometimes yourself.",
  Ji: "Yin Earth, the field that feeds. You improve everything planted in you and call it nothing. Insist on rotation and rest: even the best soil unreplenished becomes dust.",
  Geng: "Yang Metal, the unforged blade and the axe that clears. You solve by cutting: clean, early, final. The craft of a lifetime is learning which knots deserve untying instead.",
  Xin: "Yin Metal, the cut gem. You are finished goods: precise, polished, priced accordingly. Scratches show on you more than on ore, choose settings that deserve the stone.",
  Ren: "Yang Water, the open sea and the flood. Scale is your instinct: big ideas, wide circles, momentum that carries others. Direction, chosen and held, turns the flood into a shipping lane.",
  Gui: "Yin Water, dew, mist and the underground spring. You arrive quietly, penetrate completely, and are underestimated exactly once per person. Find channels; diffusion is your only real enemy.",
};
export const SEASON_REL2 = {
  companion: "Born in your own season, you carry the month's mandate: the raw material of your element arrived in bulk. Self-trust is native; the acquired skill is listening, since nothing in your foundation ever forced you to.",
  resource: "The season that made you was busy feeding you: support is your birth climate, and you assume rescue exists the way fish assume water. It mostly does, but your finest chapters start where you stop waiting for it.",
  output: "You arrived in the season that spends you: expression was never optional, it is your metabolism. The lifelong bookkeeping is energy in versus works out, genius drained is just fatigue with a portfolio.",
  wealth: "Your birth season put you straight to work: the world handed you objects, tasks and prices before it handed you rest. Competence came early; the art is remembering that you own the work, not the reverse.",
  influence: "Pressure was your first weather, born under the element that governs yours, you learned rules before you learned preferences. It made you durable; make sure it also left room for wanting things.",
};
export const SHENSHA_ALT = {
  general: "The chair at the head of the table has your name this cycle: propose, preside, decide. Deference now reads as absence.",
  huagai: "The canopy opens over you: study deepens, art sharpens, crowds tire. Take the solitude as a residency, not an exile, and mail something out of it.",
  calamity: "The month walks with sharp corners: mind vehicles, ladders, water and fine print. Slowness is the entire remedy, nothing here outruns a careful person.",
  robbery: "Hands near your pockets this cycle, some belonging to circumstances, some to charming people. Inventory what you own, insure what moves, and let no urgency skip the paperwork.",
  hongluan: "The red thread pulls: meetings that feel scripted, introductions that land. If a union is on your mind, this is the window tradition books it in.",
  tianxi: "Occasions gather: toasts, arrivals, good envelopes. Say yes to the invitations, celebration is this star's whole vocabulary.",
  taisui: "The year wears your own sign's face: everything personal is up for renovation. Move first, the Grand Duke respects initiative and remodels the idle.",
  suipo: "The year leans its shoulder on your foundations: something long-settled asks to move. Pick which wall comes down; refusing the choice only delays the demolition.",
  sickness: "The body presents last year's receipts: small aches with old dates. Pay early, rest, checkups, the boring maintenance, and the collector leaves quietly.",
  lu: "Payday energy runs through this window: employment firms up, invoices clear, the material floor rises. Ask for the number you actually want.",
  blade: "The edge is out this cycle: your force cuts faster than intended. Superb for the gym, the operating list and the hard decision, keep it sheathed at dinner.",
  carriage: "Life offers to carry you a stretch: smoother logistics, better seats, timely upgrades. Accept, and upgrade whatever carries the people you love while the star pays half.",
};

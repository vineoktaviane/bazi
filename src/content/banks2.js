/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
import { pick } from "./banks";

/* ---------------- DEEP NATAL BANKS ---------------- */
/* The Month Command 月令: DM's relation to the birth-season element, classically the heaviest single factor */
const SEASON_REL = {
  companion: "You were born in your own element's season, the month command backs you at full strength. This is the root of a self-possessed chart: you recover fast, hold your ground under pressure, and rarely need external validation to act. The classical caution for in-season charts is arrogance of supply, assuming your energy is infinite and everyone else's opinion optional.",
  resource: "You were born in the season that feeds you, the month command nourishes your Day Master like a spring feeding a stream. Learning, protection and support are woven into your foundation: help tends to exist for you even when you haven't asked. The lifelong caution is dependence, a well-fed chart can wait too long for rescue that it could have been.",
  output: "You were born in your output season, the month command draws your energy outward into expression. You are built to produce: ideas, words, works, results pour out more naturally than they stay in. The cost is drainage; this placement spends the Day Master, so rest, resource elements and people who feed you are not luxuries but maintenance.",
  wealth: "You were born in your wealth season, the month command keeps you commanding results from the start. Work, tasks, money and tangible outcomes organise your life whether you choose them or not; idleness feels almost physically wrong. The caution: a Day Master busy controlling wealth is a Day Master being spent, ambition needs the counterweight of replenishment or the ledger wins and you lose.",
  influence: "You were born under your influence season, the month command presses on your Day Master from birth. Discipline, expectation and authority were the climate, not the exception; you know how to function under demand better than most. Whether that pressure forged backbone or fatigue depends on the rest of the chart, a supported Day Master under influence becomes formidable, an unsupported one must actively build its own allies and knowledge.",
};
const BRANCH_SEASON = {
  0: "Zi, deep winter, the midnight of the year: water at maximum, stillness holding motion.",
  1: "Chou, late winter's frozen earth: the storehouse month, everything held in reserve.",
  2: "Yin, first spring: wood breaking ground, raw beginnings and rising sap.",
  3: "Mao, mid-spring: wood in full command, growth at its purest.",
  4: "Chen, spring's end, wet earth: the reservoir month, wood softening into transition.",
  5: "Si, early summer: fire kindling, heat gathering with metal hidden in its core.",
  6: "Wu, midsummer: fire at zenith, the year's noon.",
  7: "Wei, late summer's dry earth: the ripening month, heat stored in soil.",
  8: "Shen, first autumn: metal emerging, the year's first cutting edge.",
  9: "You, mid-autumn: metal in full command, harvest and judgment.",
  10: "Xu, late autumn: earth holding fire's ember, the year banking its fires.",
  11: "Hai, first winter: water beginning, wood already germinating unseen inside it.",
};
/* God-in-palace: what each Ten God means occupying each pillar (stem for year/month/hour; branch occupant for the day = spouse palace) */
const GOD_IN_PALACE = {
  year: {
    F: "You came from an environment of equals, treated as one among many, independence learned early. You meet the world as a peer, never a supplicant, and your public face is approachable rather than imposing.",
    RW: "The family backdrop carried competition or moving money, resources came and went, and you learned early that nothing shared is guaranteed. Publicly you read as bold, sometimes reckless, always noticed.",
    EG: "A current of nurture and comfort runs through your origins, food, warmth, creativity somewhere in the family line. The world meets your easy, expressive face first and underestimates what's behind it.",
    HO: "Your early world rewarded, or punished, speaking out; either way it produced a voice. There is a performer or a rebel in your lineage's shadow, and your public face carries that edge of the unscripted.",
    IW: "An enterprising current runs through your roots: business, ventures, money in motion somewhere in the family story. From a distance you read as someone who spots angles, because you grew up around people who did.",
    DW: "Your foundations are practical: a family that valued work, counted carefully, and taught that results are earned. Publicly you look dependable, and people hand you responsibility on sight.",
    DO: "Order stood at your origin, rules, propriety, expectations, a household with standards. The world reads you as respectable before you say a word, which opens formal doors early.",
    "7K": "Pressure arrived early: a strict figure, hardship, or demands beyond your years stood at the gate of your life. It left an edge of authority in your public bearing, people sense you have been tested.",
    DR: "Protection stands at your roots: elders who taught, a tradition that held, support that predates your memory of it. You appear trustworthy and learned from a distance, and doors open on that impression.",
    IR: "Something unconventional marks your origins, unusual beliefs, solitude, a family that thought differently. From afar you read as enigmatic; people are never quite sure they have the measure of you, which is its own power.",
  },
  month: {
    F: "Your career palace is held by an equal: you work best among peers, in partnerships and flat structures. Hierarchies that demand deference underuse you; ventures built shoulder-to-shoulder are your natural habitat.",
    RW: "Competition occupies your career seat: sales, deals, contests, high-stakes environments, arenas where nerve earns. The shadow is money friction with colleagues; keep professional finances ruthlessly clean.",
    EG: "Craft holds your career palace: your prime working years reward creating at your own pace, content, cuisine, design, therapy, anything made with care. Careers of pure administration slowly suffocate this placement.",
    HO: "Your career needs an audience: performance, media, advocacy, teaching, sales, anywhere your voice is the product. The recurring career shadow is friction with hierarchy; choose bosses who enjoy being challenged.",
    IW: "Deals occupy your working prime: business development, trading, ventures, income from multiple directions. A single fixed salary will always feel like a cage to this placement, build side capacity even in stable jobs.",
    DW: "Diligence holds your career seat: operations, management, finance, anything where methodical control of resources compounds. Your career grows like interest, slowly, then substantially. Guard against being the reliable one who's never promoted.",
    DO: "The classic ladder occupies your career palace: rank, titles, institutions, formal recognition. Government, corporate, professional bodies, structures reward you. Your risk is over-identifying with the title.",
    "7K": "Pressure is your professional element: crisis roles, command, competition, turnarounds, you rise exactly where others burn out. The placement demands hard problems; comfortable jobs make it destructive.",
    DR: "Credentials hold your career seat: teaching, advisory, medicine, law, research, fields where accumulated knowledge is the currency. Mentors and senior backers shape your path more than job boards ever will.",
    IR: "The specialist path occupies your career palace: strategy, research, niche mastery, the unconventional expertise nobody else has. You advance by depth, not breadth, the generalist ladder wastes this placement.",
  },
  hour: {
    F: "Your later chapter is peopled with friends: children treated as equals, ambitions shared, a future built in company. Loneliness is the one retirement risk this placement does not have.",
    RW: "Boldness persists to the end: strong-willed children, late ventures, generosity that outruns prudence. The classical advice is blunt, ringfence the retirement fund from your own big heart.",
    EG: "A creative, comfortable legacy: warmth with children, works that outlive projects, a later life of making and enjoying. This is one of the gentlest hour placements, protect it from being sacrificed to endless work now.",
    HO: "Late-blooming expression: outspoken, talented children; plans that demand a stage; a voice that gets stronger, not quieter, with age. Retirement in the conventional sense will bore this placement into mischief.",
    IW: "Enterprise never retires here: business flair in your children, late opportunities, moves still being made past the age others stop. Keep a project alive always, this placement rusts without motion.",
    DW: "An accumulating later life: careful legacy, disciplined estate, children raised with clear ideas about money. The work of your prime converts into holdings, provided the middle decades weren't spent instead of saved.",
    DO: "Standing is your legacy: children who carry responsibility, long-term plans of an institutional weight, a name that means something after you. This placement builds things meant to outlast their builder.",
    "7K": "Ambition drives to the horizon: demanding standards for your team and children, restlessness in later years that needs missions, not hobbies. Give the old general campaigns or the household becomes the battlefield.",
    DR: "A mentoring later chapter: knowledge passed down, supportive bonds with the young, a legacy of what you taught rather than what you owned. The most peaceful destination this palace offers, if you let yourself arrive.",
    IR: "A contemplative final act: unusual pursuits after fifty, depth over company, children or protégés of unconventional minds. Solitude here is a feature, but keep one or two humans close enough to interrupt it.",
  },
  spouse: {
    F: "An equal sits in your spouse palace: partnership between peers, independence on both sides, love that looks like friendship. The test is territory, two equals sharing one space must divide it deliberately.",
    RW: "A bold, willful presence occupies the marriage seat: exciting, assertive, financially opinionated. Magnetic, and expensive if money rules aren't agreed early. This palace rewards couples who negotiate like allies.",
    EG: "Gentleness occupies your spouse palace: a partner of comfort, food, unhurried company, or a marriage that becomes those things. One of the classically favourable placements, provided comfort never fully replaces conversation.",
    HO: "An expressive, dramatic energy holds the marriage seat: a partner who performs, provokes and refuses to be background. Kept interested, brilliant; kept bored, rebellious. Dullness is the only real enemy here.",
    IW: "A mobile, enterprising presence occupies the spouse seat: a partner tied to business, movement, money in motion, or a marriage that lives around those rhythms. Stability here is built from shared ventures, not shared routines.",
    DW: "Steadiness holds your spouse palace: provider energy, practical devotion, love expressed in acts and arrangements rather than speeches. Enduring, as long as effort is noticed out loud from time to time.",
    DO: "Propriety occupies the marriage seat: a principled, responsible partner; a marriage with the weight and strength of an institution. The strength is reliability; the weight is formality, keep some part of it unofficial.",
    "7K": "Intensity occupies your spouse palace: powerful attraction, a strong-willed partner, a relationship periodically tested under pressure. This placement produces the deepest bonds and the loudest storms, often in the same marriage.",
    DR: "Care occupies the marriage seat: a supportive, protective partner; mothering energy in the marriage from one side or both. Deeply secure, watch only that being cared for doesn't slide into being managed.",
    IR: "An enigmatic presence holds your spouse palace: a private, cerebral partner; intimacy built through understanding rather than noise. The bond is deep and undemonstrative, never mistake its quietness for absence.",
  },
};
/* Natal palace pairs: what a relation between two of YOUR OWN pillars connects */
const PALACE_PAIR = {
  "year-month": "your family roots and your career world",
  "year-day": "your background and your personal/married life",
  "year-hour": "your origins and your future plans",
  "month-day": "your working world and your home",
  "month-hour": "your career and your children & long-term plans",
  "day-hour": "your marriage and your children & later years",
};
/* What another person's Day Master IS to you */
const TG_PERSON = {
  F: "a mirror, an equal who shares your instincts. Easy company, honest competition; you understand each other without translation, and occasionally want exactly the same thing at the same time.",
  RW: "a spark, bold, charismatic, competitive energy in your life. They embolden you and loosen your grip on your wallet; thrilling ally, expensive habit.",
  EG: "a comfort, someone who draws out your softer, creative, well-fed side. Around them you relax, produce and indulge. Almost purely pleasant; mildly de-motivating in large doses.",
  HO: "a provocateur, they pull your boldest, most expressive, least filtered self forward. Brilliant for your growth and visibility; occasionally hazardous for your relationship with authority.",
  IW: "an opportunity, they represent reward, motion and things you can act on. Energising and useful; the classical note is that what excites you about them also asks effort of you.",
  DW: "a result, they embody the tangible, the practical, the earned in your life. Being with them makes you more productive and more responsible; romance with a DW person often feels like building something.",
  DO: "a standard, they embody legitimacy, structure and expectation to you. You behave better around them and feel it; respect flows naturally, and so, occasionally, does the sense of being graded.",
  "7K": "a force, pressure, challenge and intensity wear their face. They push you past your defaults; magnetic and demanding. The healthiest version is a worthy opponent you happen to love.",
  DR: "a shelter, support, wisdom and protection in human form. They calm and teach you; the exchange risks tilting parental if you let them carry too much.",
  IR: "a mystery that feeds you, unconventional insight, strange knowledge, a different lens on everything. They change how you think; expect to never fully have their measure.",
};
/* Second-variant banks: rotation via pick() */
const GOD_IN_PALACE2 = {
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
const TG_PERSON2 = {
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
const DM_BLURB2 = {
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
const SEASON_REL2 = {
  companion: "Born in your own season, you carry the month's mandate: the raw material of your element arrived in bulk. Self-trust is native; the acquired skill is listening, since nothing in your foundation ever forced you to.",
  resource: "The season that made you was busy feeding you: support is your birth climate, and you assume rescue exists the way fish assume water. It mostly does, but your finest chapters start where you stop waiting for it.",
  output: "You arrived in the season that spends you: expression was never optional, it is your metabolism. The lifelong bookkeeping is energy in versus works out, genius drained is just fatigue with a portfolio.",
  wealth: "Your birth season put you straight to work: the world handed you objects, tasks and prices before it handed you rest. Competence came early; the art is remembering that you own the work, not the reverse.",
  influence: "Pressure was your first weather, born under the element that governs yours, you learned rules before you learned preferences. It made you durable; make sure it also left room for wanting things.",
};
const SHENSHA_ALT = {
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
/* Cross-chart relation texts for compatibility (couple/pair framing, with advice) */
const CROSS_REL = {
  combine: (a, b, seed = 0) => pick([
    `These two areas bond: ${a} and ${b} naturally reinforce each other. Life decisions touching both tend to go smoothly, this is where cooperation between you is effortless, so route joint plans through it.`,
    `A combination ties ${a} to ${b}, the classical glue of a pairing. Where these areas meet, you two align without negotiating; lean on this connection when other fronts are strained.`,
    `Where ${a} meets ${b}, the pairing has factory-fitted joinery: cooperation without negotiation. Route the difficult conversations through this zone, it metabolizes them.`,
    `${a} and ${b} naturally support each other in this pairing. Where these two areas meet, you two agree without effort, plan the big things there.`,
  ], seed),
  harmony: (a, b, seed = 0) => pick([
    `${a} and ${b} sit in the same harmony frame: shared rhythm, compatible pace, quiet mutual support between these parts of your lives.`,
    `A quiet accord links ${a} and ${b}, nothing dramatic happens between these areas, which is precisely the asset: this zone simply does not generate trouble between you.`,
    `Between ${a} and ${b} runs a shared timezone: things simply sync. Underuse is the only mistake available.`,
    `${a} and ${b} run at the same easy pace. This part of your life together simply works, enjoy it and lean on it when other areas are hard.`,
  ], seed),
  clash: (a, b, seed = 0) => pick([
    `${a} collides with ${b}: these parts of your lives pull opposite directions, producing recurring disruption, schedules, priorities or places that refuse to align. The workable strategy is separation, not fusion: give each side its own territory and stop trying to merge exactly here.`,
    `A clash runs between ${a} and ${b}, expect this seam to reopen whenever life gets busy: conflicting demands, moves, timing that never quite works. Couples survive clashes by planning around them deliberately (separate domains, explicit calendars) rather than hoping the friction matures away.`,
    `${a} and ${b} are opposed by construction: schedules, geographies or loyalties that refuse to merge. The mature play is federalism, separate jurisdictions, shared summits, not forced union.`,
    `${a} and ${b} pull in opposite directions. Don't force them to merge: give each its own space and time, and plan around the friction instead of fighting it.`,
  ], seed),
  harm: (a, b, seed = 0) => pick([
    `A harm links ${a} and ${b}: friction here is quiet, small betrayals of expectation, things assumed rather than said. The antidote is unglamorous: overcommunicate in exactly this zone, and never let third parties carry messages between you.`,
    `An undercurrent of misreading runs between ${a} and ${b}: offence taken where none was meant, help experienced as interference. Slow, explicit, face-to-face communication in this zone prevents most of it.`,
    `Between ${a} and ${b}, small misunderstandings grow quietly. Talk plainly and often in this zone, and never let a third person carry your messages.`,
  ], seed),
  punish: (a, b, seed = 0) => pick([
    `A punishment entangles ${a} with ${b}: obligations, complications and score-keeping tend to accumulate between these areas. Keep arrangements here formal and explicit, ambiguity is what this relation feeds on.`,
    `${a} and ${b} tangle: shared obligations grow strings, favours become ledgers, logistics multiply. Treat this zone like a contract even when you'd rather not, here, clarity is the kindness.`,
    `${a} and ${b} tend to tangle: favors turn into debts, plans grow strings. Keep agreements here clear and written down, in this zone, clarity is the kindest thing you can offer.`,
  ], seed),
  selfpunish: (a, b, seed = 0) => pick([
    `A self-punishment echoes between ${a} and ${b}: the friction here is often self-generated on both sides, second-guessing, testing, poking the sore spot. Name the pattern out loud; it loses most of its power when seen.`,
    `Between ${a} and ${b}, both of you tend to poke your own bruise, testing loyalty, re-litigating settled things. Agree on what is closed, and keep it closed.`,
    `Between ${a} and ${b}, you both tend to reopen what was already settled, testing, second-guessing, asking again. Name the habit out loud; it loses most of its power once it is seen.`,
  ], seed),
  same: (a, b, seed = 0) => pick([
    `${a} and ${b} mirror each other: instant familiarity in these areas, identical blind spots included. What one of you misses here, the other will miss too, borrow an outside eye for decisions in this zone.`,
    `${a} and ${b} are cut from the same cloth: comfort and recognition on sight. Just remember that two identical maps share the same missing streets, check this zone against someone outside it.`,
    `${a} and ${b} mirror each other: instant understanding, and the same blind spots. What one of you misses here, the other misses too, ask an outsider before big decisions in this zone.`,
  ], seed),
};
const REL_LABEL = { clash: "Clash 沖", harm: "Harm 害", punish: "Punishment 刑", selfpunish: "Self-punishment 刑", combine: "Combine 合", harmony: "Harmony 合", same: "Echo 伏" };
const REL_GOOD = { combine: true, harmony: true };

export { SEASON_REL, BRANCH_SEASON, GOD_IN_PALACE, PALACE_PAIR, TG_PERSON, GOD_IN_PALACE2, TG_PERSON2, DM_BLURB2, SEASON_REL2, SHENSHA_ALT, CROSS_REL, REL_LABEL, REL_GOOD };

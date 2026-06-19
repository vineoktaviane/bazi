/* PORTED VERBATIM from bazi-companion.jsx, DO NOT hand-edit formulas or tables.
 * Any change here must re-pass the PRD §3 verification suite (npm test). */
/* ---------------- CONTENT LIBRARY (rule-based, no AI) ---------------- */
const DM_BLURB = {
  Jia: "Yang Wood, the tall tree. Principled, upright and steady; you grow in one direction and dislike bending. Strength comes from patience; rigidity is the trap.",
  Yi: "Yin Wood, the vine and flower. Adaptable, resourceful and quietly persistent; you find a way around obstacles rather than through them. Guard against over-accommodating others.",
  Bing: "Yang Fire, the sun. Warm, generous and impossible to ignore; you energise rooms and people. The risk is burning too bright for too many, leaving nothing for yourself.",
  Ding: "Yin Fire, the candle and hearth. Precise, perceptive warmth; you illuminate details others miss and influence quietly. Protect your flame from draining company.",
  Wu: "Yang Earth, the mountain. Dependable, protective and slow to move; people build on your stability. Watch for stubbornness disguised as steadiness.",
  Ji: "Yin Earth, the garden soil. Nurturing, tolerant and detail-minded; you make things grow for others. Remember that soil needs replenishing too.",
  Geng: "Yang Metal, raw ore and the axe. Decisive, dutiful and tough under pressure; you cut through what others avoid. Bluntness is your gift and your liability.",
  Xin: "Yin Metal, the finished jewel. Refined, image-conscious and precise; you value quality and are sensitive to how things (and you) are perceived. Don't let polish become pride.",
  Ren: "Yang Water, the ocean and river. Broad-minded, driven and restless; you carry ideas and people along with force. Direction matters more than volume.",
  Gui: "Yin Water, rain, mist and spring water. Intuitive, imaginative and quietly penetrating; you nourish invisibly and read people well. Beware of drifting when no one gives you a channel.",
};
/* deterministic variation: same seed -> same text, different seeds -> different phrasing */
const pick = (arr, seed) => arr[Math.abs(seed) % arr.length];
const fill = (t, period) => t.replaceAll("{P}", period);

const TG_MONTH = {
  F: {
    tag: "Peers & alliances",
    focus: [
      "Friend energy puts equals around you. It is a strong {P} for teamwork, networking, reconnecting with old friends and asking peers for help, people at your level are unusually willing to cooperate.",
      "The people beside you matter most now. Alliances form easily, old contacts resurface, and anything done shoulder-to-shoulder, joint projects, group efforts, communities, moves faster than anything done alone this {P}.",
    ],
    watch: [
      "Shared resources are the weak point: split bills clearly, avoid vague money arrangements with friends, and expect a little healthy competition for the same opportunities.",
      "Friendship and finance mix badly under this influence. Keep agreements explicit, resist splitting costs on trust alone, and don't be surprised when a peer wants the same prize you do.",
    ],
  },
  RW: {
    tag: "Competition & bold moves",
    focus: [
      "Rob Wealth brings competitive, high-energy company. Good for sales pushes, sports, negotiations where you need nerve, and rallying allies behind a bold move.",
      "Nerve is the currency of this {P}. Rivals sharpen you, charm comes easily, and audacious asks land better than careful ones, spend the boldness on negotiations and campaigns, not on the casino.",
    ],
    watch: [
      "This is the classic money-leak {P}. Avoid lending, gambling, impulse purchases and going guarantor. Keep agreements with friends and siblings in writing.",
      "Money slips sideways now, through generosity, through 'sure things', through friends in need. Say no to loans and guarantees, and put every shared arrangement on paper.",
    ],
  },
  EG: {
    tag: "Creativity & enjoyment",
    focus: [
      "Eating God favours creative output, cooking and food ventures, wellbeing, and anything expressive done at your own pace. Ideas flow more easily and your taste is sharper, a good {P} to produce, publish or present gentle work.",
      "This is the artisan's {P}: unhurried creation, good food, restored health, work that feels like play. What you make now carries unusual charm, finish something and let people see it.",
    ],
    watch: [
      "The shadow side is indulgence and complacency. Watch diet and routine, and don't let comfort delay a hard decision.",
      "Pleasure has momentum, a little too much food, rest and 'later' compounds fast. Keep one discipline non-negotiable so ease doesn't become drift.",
    ],
  },
  HO: {
    tag: "Performance & visibility",
    focus: [
      "Hurting Officer puts you on stage. Excellent for performing, pitching, marketing yourself, and breaking out of a rut, your wit and presence are amplified.",
      "You are louder than usual this {P}, sharper, funnier, harder to ignore. Point that at an audience: launches, auditions, publicity and bold pitches thrive. Silence wastes it.",
    ],
    watch: [
      "So is your tongue. This {P} punishes careless words: avoid public spats with bosses, authorities and rules. Read contracts twice and resist the urge to say the clever, cutting thing.",
      "The same brilliance that wins the room can torch a career in one sentence. Bite back the retort aimed at authority, and stay scrupulously inside the rules, this influence loves to test them.",
    ],
  },
  IW: {
    tag: "Opportunity & fast money",
    focus: [
      "Indirect Wealth opens doors for deals, side income, investments and business development. Opportunities arrive quickly and reward quick, calculated action rather than long deliberation.",
      "Money is in motion this {P}, openings appear at odd angles, side ventures sprout, and the decisive eat first. Scan widely, move fast on the good ones, and keep the exit in view.",
    ],
    watch: [
      "Fast money moves both ways, size your risks, avoid overextending, and be alert to matters involving your father or windfall promises that sound too smooth.",
      "Every open door has a draught: overreach is the danger, not scarcity. Cap what you stake, finish what you start, and treat frictionless windfalls as the trap they usually are.",
    ],
  },
  DW: {
    tag: "Steady results & pay-off",
    focus: [
      "Direct Wealth rewards routine and diligence. Salary matters, budgeting, collecting what you're owed, and grinding through methodical work all go well, effort converts to tangible results this {P}.",
      "The ledger balances in your favour now. Chase invoices, tidy finances, negotiate the raise, and let unglamorous consistency do the earning, this {P} pays wages, not lottery tickets.",
    ],
    watch: [
      "Don't let diligence become tunnel vision: overwork, penny-pinching, and neglecting relationships for the to-do list are the traps.",
      "Guard against becoming the accountant of your own life, counting everything, enjoying nothing, and mistaking exhaustion for progress. Schedule the people you love like appointments.",
    ],
  },
  DO: {
    tag: "Career & recognition",
    focus: [
      "Direct Officer is the career {P}. Promotions, formal recognition, dealing with government or management, signing proper contracts, and taking on responsibility are all favoured, act like the version of you that deserves the title.",
      "Rank and reputation are live this {P}. Authority looks at you kindly: step forward for the role, formalise the agreement, handle the official paperwork, respectability compounds now.",
    ],
    watch: [
      "Status comes with scrutiny. Keep commitments precisely, protect your reputation, and don't take on obligations you can't honour.",
      "Visibility cuts both ways: the same spotlight that promotes you audits you. Deliver exactly what you promise, and decline gracefully what you can't.",
    ],
  },
  "7K": {
    tag: "Pressure & breakthrough",
    focus: [
      "Seven Killings brings pressure, and pressure is useful. It is the best {P} for tackling the hard thing you've been avoiding, decisive action, competitive situations and proving yourself under stress.",
      "The heat is on this {P}, and heat forges. Deadlines bite, demands stack, rivals push, and you are at your most formidable. Pick the hardest problem on your list and charge it.",
    ],
    watch: [
      "Manage the intensity: guard sleep and temper, be careful with sharp tools, traffic and aggressive people, and don't pick fights that cost more than they pay.",
      "Unspent pressure turns inward as stress or outward as conflict. Burn it with exercise and hard work, drive and handle tools with extra care, and walk away from provocations that win you nothing.",
    ],
  },
  DR: {
    tag: "Learning & support",
    focus: [
      "Direct Resource favours study, mentors, certifications, paperwork and recovery. Support arrives from senior figures; it is an ideal {P} to learn, document, rest and put proper systems in place.",
      "Help finds you this {P}, teachers, backers, protectors, good advice. Enrol, certify, read, recover, and get the documents in order; what you absorb now feeds everything after.",
    ],
    watch: [
      "The comfort of being supported can turn into passivity, don't wait for permission on things only you can start.",
      "Being looked after is pleasant and quietly paralysing. Accept the support, but keep one initiative that is entirely, uncomfortably yours.",
    ],
  },
  IR: {
    tag: "Strategy & the unconventional",
    focus: [
      "Indirect Resource sharpens intuition and unconventional thinking. Research, strategy, spiritual or psychological work, and solitary deep focus all thrive, you'll see angles others miss.",
      "Your mind runs deeper than usual this {P}: patterns surface, odd knowledge connects, the sideways solution appears. Give it solitude, research problems and strategic questions to chew on.",
    ],
    watch: [
      "The same energy breeds overthinking, isolation and doubt. Verify information before acting on it, and don't disappear from people who matter.",
      "Insight curdles into rumination when it never leaves your head. Fact-check what your intuition insists on, speak to humans daily, and ship at least one conclusion instead of refining it forever.",
    ],
  },
};
const PILLAR_DOMAIN = {
  year: "your elders, extended family and public foundations",
  month: "your career environment, parents and colleagues",
  day: "you personally, your partner, home and health",
  hour: "your plans, children, team and things you're building",
};
/* third-wave variants, extend the banks (arrays mutated on load; add more anytime) */
TG_MONTH.F.focus.push("Doors open through people, not paperwork, this {P}. The favour you need is one call away, collaborations click into place quickly, and being seen as a good ally is worth more than being seen as impressive.");
TG_MONTH.F.watch.push("Beware the arithmetic of groups: rounds you didn't drink, projects where credit blurs, costs that 'we'll sort out later'. Later never comes, sort it now.");
TG_MONTH.RW.focus.push("Fortune favours the brazen in this {P}. Where you'd normally hesitate, push; where you'd discount, hold your price. Rivalry is in the air, harness it as motivation rather than suffering it as threat.");
TG_MONTH.RW.watch.push("The influence that makes you daring makes everyone around you daring too, including with your money. Triple-check joint accounts, split ventures and any handshake deal made in high spirits.");
TG_MONTH.EG.focus.push("Talent ripens quietly this {P}. Recipes, drafts, prototypes and half-finished pieces want completion; health routines take root with less struggle than usual. Make, taste, refine, the muse is patient and present.");
TG_MONTH.EG.watch.push("Ease is the hazard: deadlines feel negotiable and the couch persuasive. Enjoy the softness, but put one hard commitment on the calendar and honour it.");
TG_MONTH.HO.focus.push("Charisma runs hot this {P}. Interviews, showcases, contests and campaigns favour you, people remember what you say and how you said it. If you've been invisible, this is the window to be seen.");
TG_MONTH.HO.watch.push("Every microphone is live now, including the metaphorical ones. Assume screenshots, assume forwarding, and never send the message written in heat.");
TG_MONTH.IW.focus.push("Think merchant, not clerk, this {P}: buy well, sell well, spot the gap. Chance meetings carry deals inside them, and small stakes placed cleverly return outsized results.");
TG_MONTH.IW.watch.push("Opportunity plural is the trap singular: chasing three openings usually lands none. Choose, commit, and be suspicious of anything urgent that only rewards you if you skip due diligence.");
TG_MONTH.DW.focus.push("Substance over show this {P}: audits, renewals, negotiations over terms, the slow work that compounds. What you organise now, accounts, contracts, systems, quietly pays out for months.");
TG_MONTH.DW.watch.push("Prudence can curdle into hoarding, of money, credit and time. Spend deliberately on what matters, and remember that people are not line items.");
TG_MONTH.DO.focus.push("The system is on your side this {P}: applications process, officials cooperate, seniority notices you. Present yourself formally, follow procedure to the letter, and let correctness do the persuading.");
TG_MONTH.DO.watch.push("Respectability is a glass asset. One shortcut, one bent rule, one promise quietly dropped costs more now than in ordinary times, the record being written about you is permanent.");
TG_MONTH["7K"].focus.push("Fortune sides with the decisive this {P}. Confront, commit, compete: postponed battles cost double, chosen ones pay. If leadership is going spare, take it, this influence crowns whoever steps up.");
TG_MONTH["7K"].watch.push("Force leaks if not aimed: irritability at home, recklessness on the road, hardness with the wrong people. Point the intensity at the mission and keep it out of the kitchen.");
TG_MONTH.DR.focus.push("Wisdom compounds this {P}. Old teachers resurface, applications get approved, the manual finally makes sense. Bank knowledge and credentials now, this is sowing season for the mind.");
TG_MONTH.DR.watch.push("Support can become a hammock. Take the help, but set your own deadline for standing without it, protection unused eventually becomes protection needed.");
TG_MONTH.IR.focus.push("The strange door is the right one this {P}: obscure sources, sideways methods, questions nobody else is asking. Trust the hunch enough to investigate it, your pattern-recognition is running ahead of your reasoning.");
TG_MONTH.IR.watch.push("Not every depth needs diving. Cap the research phase, beware conclusions that flatter your suspicions, and remember that isolation feels like clarity right up until it isn't.");
/* fourth & fifth wave */
TG_MONTH.F.focus.push("Old names resurface this {P}, the classmate, the former colleague, the friend from another chapter. These returns are the period's gift: reconnection now builds the network your next chapter will run on.", "Strength arrives in plural form this {P}. Whatever you're carrying, someone at your level is carrying its twin, find them, compare notes, and split the load; solo heroics are the one strategy this influence refuses to reward.");
TG_MONTH.F.watch.push("Equality has a price tag: this influence blurs the line between yours and ours. Name the owner of every asset, credit and task now, while everyone is still smiling.", "Your circle's habits become yours faster than usual this {P}, choose the company whose spending, standards and tempo you'd be content to inherit.");
TG_MONTH.RW.focus.push("The competitive field is where you shine this {P}: auditions, bids, tournaments, salary talks. You read opponents faster than usual and bluff better, enter contests you'd normally watch from the stands.", "Allies with sharp elbows gather around you this {P}. Led well, they're an army; led loosely, a bar tab. Give the boldness a target and a budget on day one.");
TG_MONTH.RW.watch.push("Generosity is this influence's favorite disguise for loss. The friend in need, the sure investment, the round for the table, each is real, and each is also how this {P} empties pockets. Decide your giving in advance.", "Speed is the pickpocket now: fast deals, fast friends, fast promises. Anything that can't survive a 48-hour pause probably shouldn't survive at all.");
TG_MONTH.EG.focus.push("Your standards are the asset this {P}: what you find beautiful, delicious or well-made, others will too. Curate, review, host, recommend, taste itself becomes productive.", "Gentle output compounds now: the daily page, the practiced dish, the tended garden, the maintained habit. Nothing dramatic, and by the end of the {P}, something substantial.");
TG_MONTH.EG.watch.push("The muse and the nap are easily confused this {P}. If rest keeps needing one more day, it has quietly become avoidance, give the comfort a curfew.", "Sweetness accumulates invisibly: in the diet, the schedule, the standards. Weigh all three at the {P}'s midpoint, not just its end.");
TG_MONTH.HO.focus.push("Your unconventional take is the valuable one this {P}. Where everyone recites the standard answer, your sideways version lands, pitch the weird idea, publish the contrarian piece, be the interesting one in the room.", "Audiences find you now without being hunted: algorithms, introductions, forwarded messages. Make sure what they find is your best material and not your unfiltered feed.");
TG_MONTH.HO.watch.push("Brilliance and insubordination are one substance under this influence, separated only by aim. Before you speak truth to power, confirm the truth is load-bearing and the power is worth the invoice.", "The rules you find stupid this {P} are still enforced. Break them as art if you must, never as paperwork.");
TG_MONTH.IW.focus.push("Your radar for undervalued things, objects, skills, people, moments, runs hot this {P}. What others overlook, you can flip, fix or feature. Browse widely; the bargain is real this time.", "Income wants to diversify now: the side gig, the small stake, the weekend market. Streams started this {P} tend to keep trickling after it ends.");
TG_MONTH.IW.watch.push("The father, or a father-figure, may need attention this {P}, classically this influence touches his health or affairs. A call costs nothing.", "Opportunity's twin is distraction wearing better clothes. For each opening you chase, name the one you're deliberately declining, unchosen options should be decisions, not accidents.");
TG_MONTH.DW.focus.push("Precision pays this {P}: the renegotiated rate, the audited subscription, the collected invoice, the itemized claim. Money respects whoever counts it, count yours.", "Assets want stewardship now: maintain the property, service the machine, rebalance the account. Boring verbs, compounding nouns.");
TG_MONTH.DW.watch.push("The ledger can become a lens: this influence tempts you to price things that shouldn't have prices, favors, affection, rest. Keep two books: one for money, one deliberately blank.", "Diligence without a stop-time is just slow-motion burnout. Set closing hours for yourself the way a shop does, and honor them like a shopkeeper.");
TG_MONTH.DO.focus.push("Institutions answer this {P}: the application processes, the permit clears, the committee says yes. Anything requiring official machinery, file it now while the machinery likes you.", "Your word hardens into reputation faster than usual this {P}. Promise precisely, deliver visibly, and let the record do your networking.");
TG_MONTH.DO.watch.push("Titles attract weight: every role accepted this {P} arrives with invisible obligations attached. Read the unwritten job description before nodding.", "Being the responsible one is a compliment that compounds into a cage. Delegate one duty this {P} on principle, even if you'd do it better.");
TG_MONTH["7K"].focus.push("Crisis is your stage this {P}: when things break, you get sharper while others get louder. Volunteer for the fire, it's where your reputation is being written.", "The intimidating thing on your list has never been more approachable: the confrontation, the application, the ask. This influence exists to spend on exactly that door.");
TG_MONTH["7K"].watch.push("Your force is contagious this {P}, rooms harden around you without your noticing. Soften deliberately with the people who aren't the problem.", "Under pressure the body keeps the minutes: jaw, shoulders, sleep, stomach. Read those minutes weekly and adjourn before they escalate.");
TG_MONTH.DR.focus.push("The right teacher appears when the student schedules time: enrol, subscribe, apprentice, ask the senior person to lunch. Doors marked knowledge are unlocked this {P}.", "Paperwork is quietly powerful now: the certificate, the license, the properly filed claim, the updated will. Documents completed this {P} protect for years.");
TG_MONTH.DR.watch.push("Advice is abundant this {P}, which is precisely the risk. Collect counsel widely, then make the decision alone; a committee cannot live your life.", "Being understood is soothing and can substitute for being underway. After every supportive conversation, take one concrete step, however small.");
TG_MONTH.IR.focus.push("Your private studies pay off strangely this {P}: the obscure skill becomes relevant, the odd reading answers a real question. Trust the curriculum only you are following.", "Solitude is productive now, not lonely: the retreat, the deep-work week, the early morning hours. Guard them like appointments with your most important client, because they are.");
TG_MONTH.IR.watch.push("The mind that sees hidden patterns can also embroider them. Once a suspicion survives three days, test it against a person, not another search.", "Depth can become a hiding place. Set a ship-date for the current investigation, insight owes the world an appearance.");

/* sixth wave: plain-language variants. Short sentences, everyday words,
 * written for readers whose English is a second language. */
TG_MONTH.F.focus.push(
  "This {P} is about the people at your side. Friends and equals are ready to help, so ask. Work done together goes further than work done alone.",
  "Team energy is strong this {P}. Share your plans and let others carry part of the load. An old friend may come back into your life, welcome them."
);
TG_MONTH.F.watch.push(
  "Keep money simple with friends this {P}. Agree who pays what before anything starts. A friend may also want the same prize as you, stay warm, but stay sharp.",
  "Don't mix friendship with loose money habits. Put shared costs in writing, even small ones. 'We'll sort it out later' is how friendships crack."
);
TG_MONTH.RW.focus.push(
  "This is a {P} for courage. Ask for more, aim higher, and speak first. Bold moves win where careful ones stall.",
  "Energy runs high and so does competition this {P}. Use it for sales, contests and hard talks. You have more nerve than usual, spend it on something that matters."
);
TG_MONTH.RW.watch.push(
  "Money leaks easily this {P}. Don't lend, don't gamble, and don't sign for anyone else's debt. If a friend asks for money, decide with your head, not the mood.",
  "Big feelings lead to big spending now. Wait two days before any large purchase, and keep every deal with friends or family on paper."
);
TG_MONTH.EG.focus.push(
  "A gentle, creative {P}. Make things, cook, write, tend your health. Work done at your own pace turns out unusually well, finish one thing and show it.",
  "Enjoyment and talent flow together now. Good food, good company and slow craft all feed you. A health habit started this {P} sticks more easily than usual."
);
TG_MONTH.EG.watch.push(
  "Comfort is sweet this {P}, and a little sticky. Watch what you eat, and don't let 'tomorrow' become your favorite word. Keep one firm deadline.",
  "Too much ease dulls the edge. Rest well, but keep moving on the one task that matters. Comfort should refill you, not replace your plans."
);
TG_MONTH.HO.focus.push(
  "People notice you this {P}. Speak, pitch, perform, publish, your words carry further than usual. If you have been waiting to be seen, this is the window.",
  "Your charm and wit are turned up now. Use them in interviews, on stage, in marketing. Say the brave thing, to the right audience."
);
TG_MONTH.HO.watch.push(
  "Sharp words cut both ways this {P}. Don't argue with your boss in public, and never send a message written in anger. Read contracts twice before signing.",
  "One clever, cutting sentence can cost a lot right now. Pause before you reply. Stay inside the rules even when they annoy you, this {P} punishes shortcuts."
);
TG_MONTH.IW.focus.push(
  "Chances to earn appear quickly this {P}: a side project, a good deal, a well-timed buy or sell. Look around, choose one, and act while the door is open.",
  "Money moves fast now, and rewards fast thinkers. Keep your eyes open for the opening others miss. Small, smart bets can return more than usual."
);
TG_MONTH.IW.watch.push(
  "Fast money can leave as fast as it comes. Set your limit before you invest, and keep it. If an offer sounds too smooth, it probably is.",
  "Don't chase every opening, pick one and finish it. Overreach, not bad luck, is the real danger this {P}."
);
TG_MONTH.DW.focus.push(
  "Steady work pays this {P}. Chase unpaid invoices, tidy your budget, ask for the raise. Careful, unglamorous effort turns into real money now.",
  "This {P} rewards routine. Sort the accounts, renew the contracts, fix what's broken. What you organize now keeps paying long after."
);
TG_MONTH.DW.watch.push(
  "Don't work so hard that life becomes a checklist. Plan time with the people you love, and actually show up. Money counts, but not more than they do.",
  "Watch the penny-pinching this {P}. Saving is good; squeezing every joy out of the week is not. Spend a little on what makes the effort worth it."
);
TG_MONTH.DO.focus.push(
  "A good {P} for career steps. Apply for the role, sign the proper contract, handle the official paperwork. People in charge look on you kindly, act like you deserve it.",
  "Doors of rank and duty open now. Take responsibility in public, follow the process, and let your record speak. Formal moves succeed more easily this {P}."
);
TG_MONTH.DO.watch.push(
  "More eyes are on you this {P}. Keep every promise exactly, or don't make it. Your reputation is being written down, keep the record clean.",
  "Don't take on duties you can't carry just to look good. Say yes slowly. One broken commitment now costs more than three in ordinary times."
);
TG_MONTH["7K"].focus.push(
  "Pressure is high this {P}, and that is useful. Face the hard thing you have been avoiding, it will never be easier to attack than now.",
  "This is a fighter's {P}. Deadlines, rivals and demands sharpen you instead of wearing you down. Pick the toughest problem on your list and go straight at it."
);
TG_MONTH["7K"].watch.push(
  "Let the pressure out safely: exercise, hard work, early nights. Be extra careful in traffic and with sharp tools, and walk away from fights that win you nothing.",
  "Stress builds fast this {P}. Guard your sleep and your temper, and be gentle with the people at home, they are not the enemy."
);
TG_MONTH.DR.focus.push(
  "Help arrives this {P}: teachers, mentors, good advice, useful documents. Study, get certified, put your papers in order. Rest counts as progress now too.",
  "A learning {P}. Ask a senior person for guidance, they will likely say yes. What you learn now supports everything you do after."
);
TG_MONTH.DR.watch.push(
  "Being helped feels good, but don't wait for permission on things only you can start. Take the support, then take a step of your own.",
  "Advice piles up this {P}. Listen widely, then decide alone. No one else can live your plan for you."
);
TG_MONTH.IR.focus.push(
  "Your mind runs deep this {P}. Research, strategy and quiet study go unusually well. You will see angles other people miss, trust the hunch enough to check it.",
  "A {P} for the thinker in you. Work alone on the hard question, read the odd book, follow the strange clue. The sideways answer is often the right one now."
);
TG_MONTH.IR.watch.push(
  "Thinking can turn into overthinking this {P}. Check your facts before acting, and talk to a real person every day. Don't vanish into your own head.",
  "Doubt grows in the dark. Set a date to finish your research and act on it. An imperfect step beats a perfect plan that never leaves your notebook."
);

/* natal-pattern closers: rotating framings for lifelong in-chart relations */
const NATAL_CLOSER = (pair) => [
  `Because this sits in your natal chart, it is not a passing event but a lifelong pattern between ${pair}, the theme every triggering year and month will replay.`,
  `This lives in your natal chart, so it is standing architecture, not passing weather: the link between ${pair} is a lifelong motif, and activating years press exactly this button.`,
  `Written into the chart itself, the connection between ${pair} is permanent furniture, annual and monthly energies don't create the pattern, they merely knock on its door.`,
  `As a natal feature, this bond between ${pair} runs for life. Learn its storyline early: a pattern you can name loses half its force each time it returns.`,
  `Natal patterns don't visit, they reside. The calendar merely turns the lights on in this particular room between ${pair}; knowing the floor plan is your advantage.`,
  `Chart-borne, this connection between ${pair} predates every situation it will ever appear in. Treat its recurrences as weather over fixed terrain, the terrain is what you can learn.`,
  `This sits inside your birth chart, so it is a lifelong pattern between ${pair}, not a passing event. Certain years and months will wake it up; knowing the pattern is how you stay ahead of it.`,
  `Because it is written into the chart itself, this link between ${pair} travels with you for life. When it flares up, remember: it is an old, familiar story, and you already know how it goes.`,
];

const REL_TEXT = {
  clash: (dom, seed = 0) => pick([
    `A clash touches ${dom}: expect movement, schedule changes or disruption there. Avoid locking in major commitments in that area this {P}; travel and change of routine release the pressure more safely.`,
    `Opposition strikes ${dom}, plans wobble, people relocate, arrangements break and reform. Don't cement anything major there now; give the energy somewhere to move (a trip, a reorganisation) before it moves something for you.`,
    `The {P} drives a wedge through ${dom}: what was settled there wants to move, jobs, homes, arrangements, minds. Ride the change deliberately (choose the move) rather than having it choose you, and postpone any signature meant to last years.`,
    `Tectonics under ${dom}: settled plates shift, and what refuses to bend gets to break. Choose your earthquake, a planned move, a scheduled ending, and the {P} spends its force on your terms.`,
    `A clash hits ${dom} this {P}: plans there may shift, break or move. Don't lock in big commitments in that area yet. If change must come, choose it yourself, a planned move beats a forced one.`,
  ], seed),
  harm: (dom, seed = 0) => pick([
    `A harm affects ${dom}: friction and misread intentions are likely. Double-check agreements, avoid gossip, and don't assume silence means agreement.`,
    `Quiet friction runs through ${dom}, the harm works by misunderstanding, not confrontation. Say the awkward thing early, confirm what you think was agreed, and stay out of other people's whisper networks.`,
    `Splinters, not spears, trouble ${dom} this {P}: the forgotten reply, the assumed agreement, the joke received as verdict. Sweep daily, small and early beats large and late.`,
    `A harm touches ${dom}: expect small misunderstandings, not big fights. Say clearly what you mean, ask what they meant, and stay out of gossip. Most of this friction dies once things are said out loud.`,
  ], seed),
  punish: (dom, seed = 0) => pick([
    `A punishment involves ${dom}: watch for tangled paperwork, small legal or administrative snags, and slow-burning resentments. Handle details early and formally.`,
    `Entanglement colours ${dom}, obligations loop back, small print bites, old grievances resurface. Be scrupulous with documents and generous with clarifications; mess left unattended compounds here.`,
    `Red tape grows like ivy over ${dom} now: clauses, conditions, old promises with interest. Prune formally and in writing; goodwill alone won't cut it here.`,
    `A punishment tangles ${dom}: paperwork, small print and old obligations get sticky. Handle documents early, keep everything in writing, and clear small messes before they grow.`,
  ], seed),
  selfpunish: (dom, seed = 0) => pick([
    `A self-punishment stirs ${dom}: restlessness and self-sabotage are the risks. Slow down before undoing your own work.`,
    `The pressure in ${dom} is self-inflicted this time, second-guessing, redoing, picking at what was fine. Decide once, then defend the decision from yourself.`,
    `The saboteur in ${dom} has your fingerprints: re-checking, re-opening, re-deciding. One decision, dated and defended, starves the loop.`,
    `A self-punishment stirs ${dom}: the biggest risk there is you, redoing, second-guessing, undoing your own work. Decide once, write the decision down, and let it stand.`,
  ], seed),
  combine: (dom, seed = 0) => pick([
    `A combination supports ${dom}: cooperation and bonding come easily there. A good {P} to invest attention in that part of life.`,
    `Things knit together in ${dom}, alliances form, tensions settle, help appears without being begged for. Whatever you plant in that area now roots easily.`,
    `A season of glue runs through ${dom} this {P}: the right people say yes, loose ends tie themselves, goodwill accumulates without being courted. Bank progress in this area while the current runs your way.`,
    `Welding weather over ${dom}: joints made now hold. Introduce, merge, commit in that area while the metal is warm.`,
    `A combination blesses ${dom}: people cooperate, help shows up, and things fit together there. Give that part of life your attention this {P}, whatever you start there tends to hold.`,
  ], seed),
  harmony: (dom, seed = 0) => pick([
    `A harmony supports ${dom}: things align there with little effort, use it.`,
    `A quiet tailwind blows through ${dom}: same direction, shared rhythm, doors ajar. Push on them.`,
    `Downhill grade through ${dom}: effort travels farther than it should. Load the cart accordingly.`,
    `A harmony flows through ${dom}: things go your way there with little pushing. Use the easy current while it lasts.`,
  ], seed),
  same: (dom, seed = 0) => pick([
    `The {P} echoes ${dom}: whatever is already happening there gets amplified, for better or worse.`,
    `A mirror is held up to ${dom}, existing momentum there doubles. Feed what's good in that area and starve what isn't, because both will grow.`,
    `Double exposure over ${dom}: the existing picture prints twice as dark. Curate what's in the frame before the {P} develops it.`,
    `The {P} doubles ${dom}: whatever is already happening there grows louder, good or bad. Feed the good, and deal with the bad early, before it doubles again.`,
  ], seed),
};


export { DM_BLURB, pick, fill, TG_MONTH, PILLAR_DOMAIN, NATAL_CLOSER, REL_TEXT };

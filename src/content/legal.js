/* Legal content: Terms of Use, Privacy Policy, Disclaimer.
 * Data-only. Rendered by ../ui/more/LegalSection.js and shown under More → Legal.
 *
 * Block shapes inside a section's `body` array:
 *   "string"            → paragraph
 *   { bullets: [...] }  → bulleted list
 *   { note: "string" }  → muted note line
 *   { fine: "string" }  → fine print line
 */

export const LEGAL_UPDATED = "14 September 2026";

export const LEGAL_DOCS = [
  {
    key: "disclaimer",
    cn: "誡",
    title: "Disclaimer",
    intro:
      "BaZi Companion is a cultural, educational and self-reflection tool based on traditional Chinese metaphysics. It is a framework for reflection, not evidence-based prediction, and not professional advice of any kind.",
    sections: [
      {
        h: "Please read this first",
        body: [
          "This app is based on historical interpretive frameworks, principally BaZi (八字, the Four Pillars), Zi Wei Dou Shu (紫微斗數), the Eight Mansions (八宅), the Twelve Day Officers and Plum Blossom (梅花易數) divination. These are traditions, not sciences.",
          "Every reading is offered for reflection and cultural interest only. By using the app you accept everything set out below.",
        ],
      },
      {
        h: "No professional advice",
        body: [
          "The app does not provide, and must never be relied on as, professional advice. In particular, nothing here is:",
          {
            bullets: [
              "medical, health, psychological or psychiatric advice; the “health” correspondences are traditional element-to-organ associations only, not diagnostic, and no substitute for a qualified professional;",
              "financial, investment, tax or business advice; the app expressly refuses to predict wealth;",
              "legal advice;",
              "relationship, family, parenting or fertility advice; or",
              "career, employment or educational counselling.",
            ],
          },
          "Always consult an appropriately qualified professional for any decision that carries real consequences. Never disregard, delay or discontinue professional advice, especially medical care, because of anything you read here, and never make important decisions based solely on a reading.",
          "If you may be experiencing a medical or mental-health emergency, contact your local emergency services immediately. This app is not a crisis or support service.",
        ],
      },
      {
        h: "No guarantee of accuracy or outcomes",
        body: [
          "Readings are computed deterministically on your device from the birth data you enter. They are not predictions and carry no guarantee of accuracy, completeness or fitness for any purpose.",
          "BaZi and related systems have many schools that disagree. This app makes documented simplifications and school choices (the 23:00 Zi-hour day rollover; clock time used as entered with no solar-time correction; a simplified Day-Master strength rule; a specific San He Si Hua table; a solar adaptation of Plum Blossom). Another practitioner, book or app may reasonably give different results.",
          "Where a method is uncertain or unavailable, the app says so rather than inventing an answer (for example, the 28 Mansions day-offset awaits calibration and is not shown). Where schools disagree, one documented lineage is followed throughout.",
        ],
      },
      {
        h: "Outcomes are your responsibility",
        body: [
          "Any action you take, or choose not to take, on the basis of the app is your own decision and your sole responsibility. Treat every reading as a description of tendencies and timing for your own reflection, never as certainty about you, another person, or the future.",
        ],
      },
      {
        h: "Readings about other people",
        body: [
          "The People Book lets you create charts and compatibility readings for others, for personal reflection only. You must not use the app or any reading to:",
          {
            bullets: [
              "screen, hire, fire or evaluate employees, candidates, tenants or clients;",
              "make medical, psychiatric or safeguarding decisions about anyone;",
              "discriminate against, profile, harass, stalk or harm any person; or",
              "select or schedule a birth date or medical procedure to “optimise” a chart.",
            ],
          },
          "Compatibility scores are friction maps, not judgements of people, and must be treated that way.",
        ],
      },
      {
        h: "Cultural framing",
        body: [
          "The app presents classical, public-domain systems of Chinese metaphysics. It is independent and not affiliated with, endorsed by, or derived from the proprietary methods, branding, profile names or chart layouts of any commercial practitioner or teacher.",
        ],
      },
      {
        h: "“As is”",
        body: [
          "The app and all content are provided “as is” and “as available”, without warranties of any kind. The warranty disclaimers and liability limits in the Terms of Use apply to this Disclaimer in full, and this Disclaimer forms part of those Terms.",
        ],
      },
    ],
  },

  {
    key: "privacy",
    cn: "私",
    title: "Privacy Policy",
    intro:
      "BaZi Companion is private by design: your birth data and readings never leave your device, there is no AI or network call behind a reading, and the app contains no ads, third-party analytics or tracking.",
    sections: [
      {
        h: "The short version",
        body: [
          {
            bullets: [
              "Your birth data and readings never leave your device. Names, dates and times of birth, time zones, sex, relationship tags, oracle history, journal notes and settings are stored only in local storage on your own device. We have no server that receives them.",
              "All readings are calculated on your device, with no AI or network call to interpret your data.",
              "We do not track you: no advertising, no third-party analytics SDKs, no tracking cookies.",
              "The compass tool uses your device heading only while open; your location is never stored or transmitted.",
              "Payments are handled entirely by Apple, Google or the web payment provider; we never see or store your card or billing details.",
            ],
          },
        ],
      },
      {
        h: "What data the app handles, and where it lives",
        body: [
          "Data you enter is stored locally only. To calculate charts, the app asks (for you and anyone you add): name/label, date of birth, time of birth, time zone of the birthplace, sex at birth (used only to determine luck-cycle direction), and an optional relationship tag. It also stores your oracle history, journal notes and settings, all locally.",
          "A date of birth with a name can be personal data, which is exactly why all of it stays on your device under a single stored record. We do not transmit it to us or any third party and cannot access it. Derived charts are not stored; they are recomputed from the raw data each time.",
          "Device sensors (compass). The optional 8 Mansions compass reads your device orientation/heading: on the web via the browser DeviceOrientation sensor (iOS asks permission), on native via the OS compass (which uses the location permission). Your location is never recorded, stored or transmitted; a manual dial is always available.",
          "Payments and subscriptions. Purchases are processed by the Apple App Store, Google Play or the web payment provider under their own privacy policies. We never receive your card details. We may receive a non-identifying confirmation that a purchase is active so the app can unlock paid features.",
          "App stores. When you download, update or purchase, Apple and Google collect their own data as independent controllers. We may see only aggregated, anonymised statistics (e.g. total downloads, crash counts).",
          "Contacting us. If you email us, we receive your email address and whatever you write, used only to answer you.",
          "What we do NOT do: no user-account backend storing your birth data; no third-party analytics, advertising or tracking SDKs; no selling or “sharing” of personal data for advertising; no automated decision-making with legal or similarly significant effects.",
        ],
      },
      {
        h: "Legal bases (GDPR)",
        body: [
          "Where GDPR applies: providing the on-device functionality you request rests on performance of a contract / your request (most of this data never reaches us); handling a support request on that request and our legitimate interest in replying; the compass sensor on your consent via the OS permission (withdraw it any time in device settings); payments on performance of a contract; and tax/accounting records on legal obligation.",
          "We do not rely on processing special categories of data about you; the birth information you enter is not transmitted to us.",
        ],
      },
      {
        h: "Data retention",
        body: [
          "Data on your device is kept until you delete it, remove a profile, clear the app's storage, or uninstall; you control it at all times. Support emails are kept only as long as needed. Store/payment and invoice records are retained by the stores and, where we hold them, for periods required by tax and accounting law.",
        ],
      },
      {
        h: "Sharing and international transfers",
        body: [
          "We do not sell your personal data. We share it only: with the payment providers for purchases you make; with service providers strictly necessary to run the business (e.g. an email host for support), under confidentiality terms; and where required by law or to defend legal claims.",
          "Because your birth data stays on your device, it is not transferred internationally by us. Where a provider or store processes limited data outside the EEA, their own safeguards (e.g. EU Standard Contractual Clauses or an adequacy decision) apply.",
        ],
      },
      {
        h: "Security",
        body: [
          "Data on your device is protected mainly by your device's own security. Use a passcode/biometric lock and keep your OS updated. The app provides (or plans to provide) export/import so you can back up your data; keep any exported file safe. No storage is perfectly secure, but keeping data local materially reduces breach risk.",
        ],
      },
      {
        h: "Your rights",
        body: [
          "Because your data lives on your device, you can exercise most rights yourself: view, edit, add, delete and (via export) port your data any time inside the app.",
          "For any data we hold (e.g. support emails), and where GDPR or a comparable law applies, you have rights of access, rectification, erasure, restriction, objection, portability, and to withdraw consent (e.g. revoke the compass permission in device settings).",
          "Complaints: in the EEA you may complain to a supervisory authority: in the Netherlands, the Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl). UK users: the ICO. California (CCPA/CPRA): we do not sell or share personal information or use it for cross-context behavioural advertising, and you keep rights to know, delete, correct and non-discrimination.",
        ],
      },
      {
        h: "Children",
        body: [
          "The app is not directed to children. You must be at least 16 (or your country's minimum age of digital consent, if higher) to use it. We do not knowingly collect data from children; contact us if you believe a child has provided data and we will delete it.",
        ],
      },
      {
        h: "Changes",
        body: [
          "We may update this policy to reflect changes to the app or the law. We will change the “Last updated” date and, for material changes, give notice in the app or store listing. Continued use means you accept the update.",
        ],
      },
    ],
  },

  {
    key: "terms",
    cn: "約",
    title: "Terms of Use",
    intro:
      "These Terms govern your use of the BaZi Companion app. By using the app you accept these Terms, the Privacy Policy and the Disclaimer.",
    sections: [
      {
        h: "Agreement & eligibility",
        body: [
          "By downloading, installing, accessing or using the app you confirm you have read and accept these Terms, the Privacy Policy and the Disclaimer. If you do not agree, do not use the app. If you use it through the Apple App Store or Google Play, that store's terms also apply.",
          "You must be at least 16 years old (or your country's minimum age of digital consent, if higher) and have the capacity to enter into these Terms.",
        ],
      },
      {
        h: "Nature of the app",
        body: [
          "The app is a cultural, educational and self-reflection tool. All readings are computed on your device for reflection only; they are not predictions and not professional advice. Your use is subject to the Disclaimer in full: never make medical, health, financial, legal, relationship or other significant decisions based on the app, and always consult a qualified professional.",
        ],
      },
      {
        h: "Licence to use the app",
        body: [
          "Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, revocable licence to install and use the app on devices you own or control, for your own personal, non-commercial use.",
        ],
      },
      {
        h: "Acceptable use",
        body: [
          "You agree not to:",
          {
            bullets: [
              "copy, modify, distribute, sell, rent, sub-license or commercially exploit the app or its content, except as these Terms or mandatory law allow;",
              "reverse-engineer or decompile the app, or extract its source, algorithms, tables or text banks, except where such restriction is prohibited by law;",
              "remove or obscure any proprietary notices;",
              "use the app or any reading to screen or make decisions about other people in employment, tenancy, insurance, credit, education or similar contexts;",
              "use the app to discriminate against, profile, harass, stalk or harm any person, or to select or schedule a birth date or medical procedure to “optimise” a chart;",
              "use the app for any unlawful purpose or in breach of any law or third-party right; or",
              "interfere with, disrupt or gain unauthorised access to the app or connected systems.",
            ],
          },
        ],
      },
      {
        h: "Your content and data",
        body: [
          "The birth data, notes and other information you enter are stored locally on your device and are yours; we do not receive or store them. You are responsible for their accuracy and for backing them up (e.g. via any export feature). We are not responsible for data lost when you delete a profile, clear storage, uninstall, or lose or change your device.",
          "If you enter another person's details, you confirm you are entitled to do so for your own personal reflection and will use any reading responsibly and in line with Acceptable use.",
        ],
      },
      {
        h: "Intellectual property",
        body: [
          "The app, including its software, design, interface, original written interpretations and text banks, and their selection and arrangement, is owned by us or our licensors and protected by law. The underlying classical systems of Chinese metaphysics are public-domain traditions; our particular expression, wording, code and presentation of them are not. Except for the licence above, no rights are granted to you. The app is independent and not affiliated with any commercial practitioner, teacher or brand.",
        ],
      },
      {
        h: "Purchases, subscriptions & refunds",
        body: [
          "The app offers free features and optional paid features via auto-renewing subscriptions and/or one-off purchases. All payments are processed by the platform you purchase through (Apple, Google, or the web payment provider); we do not process or store your payment details.",
          "Auto-renewing subscriptions renew automatically at the then-current price unless you cancel at least 24 hours before the period ends. Manage or cancel in your App Store / Google Play account settings; deleting the app does not cancel a subscription. Prices and paid-tier contents are shown at purchase and may change; changes do not affect a period already paid for.",
          "Refunds are handled under the store's or payment provider's policy. Where you have a statutory withdrawal right under EU/Dutch consumer law for digital content, note that by starting to use paid digital content immediately you may be asked to acknowledge the loss of that right, as permitted by law.",
        ],
      },
      {
        h: "Availability & changes",
        body: [
          "We may add, change, suspend or discontinue any part of the app and may release updates. We do not guarantee the app will always be available, uninterrupted or error-free. Some features rely on your device's hardware and permissions and may not work on every device.",
        ],
      },
      {
        h: "Disclaimer of warranties",
        body: [
          "To the fullest extent permitted by law, the app and all content are provided “as is” and “as available”, without warranties of any kind, express, implied or statutory, including merchantability, fitness for a particular purpose, accuracy and non-infringement. We do not warrant that any reading is accurate, reliable or fit for any purpose, or that the app will be error-free. Nothing here excludes rights that cannot be excluded under mandatory consumer law applicable to you.",
        ],
      },
      {
        h: "Limitation of liability",
        body: [
          "To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, data, goodwill or opportunity, arising from your use of or inability to use the app or any reliance on a reading.",
          "Our total aggregate liability is limited to the greater of (a) the amount you paid us for the app in the 12 months before the event giving rise to the claim, or (b) EUR 50.",
          "Nothing in these Terms limits liability that cannot be limited under applicable law, including for death or personal injury caused by negligence, for fraud, or under mandatory consumer-protection or product-liability law. If you are a consumer you keep all mandatory statutory rights, and these limits apply only to the extent permitted.",
        ],
      },
      {
        h: "App Store terms (Apple / Google)",
        body: [
          "These Terms are between you and us, not Apple or Google, who are not responsible for the app and have no obligation to provide support or maintenance. To the extent required by Apple, Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them. You represent that you are not in an embargoed country or on a prohibited-parties list, and you agree to comply with applicable third-party terms (e.g. your carrier agreement).",
        ],
      },
      {
        h: "Termination",
        body: [
          "You may stop using and uninstall the app any time. We may suspend or end your licence if you materially breach these Terms or use the app unlawfully. Sections that by nature should survive do so. Ending the licence does not cancel a store subscription; cancel that through your store account.",
        ],
      },
      {
        h: "Governing law & disputes",
        body: [
          "These Terms are governed by the laws of the Netherlands, without prejudice to mandatory consumer-protection rights you enjoy where you live. Disputes go to the competent Dutch courts unless mandatory law lets you use, or requires, your local courts. EU consumers may also use the European Commission's Online Dispute Resolution platform (ec.europa.eu/consumers/odr).",
        ],
      },
      {
        h: "General",
        body: [
          "We may update these Terms; we will change the “Last updated” date and, for material changes, give notice in the app or store listing. If a provision is unenforceable, the rest remains in effect. Our failure to enforce a provision is not a waiver. These Terms, the Privacy Policy and the Disclaimer are the entire agreement about the app. You may not assign these Terms; we may assign them to a successor of our business.",
        ],
      },
    ],
  },
];

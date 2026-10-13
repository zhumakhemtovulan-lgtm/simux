// Built-in practice cases (work even without the AI connection — useful for live demos)
window.SIMUX_SAMPLES = [
  {
    id: "sample-steppe-coffee",
    title: "Steppe Coffee: Is Shymkent Worth It?",
    company: "Steppe Coffee",
    industry: "Retail / Food & Beverage",
    caseType: "Market entry",
    difficulty: "Beginner",
    minutes: 30,
    hook: "A fast-growing Astana coffee chain must decide whether its next 10 stores go to Shymkent or stay at home.",
    background: [
      "Steppe Coffee is a specialty coffee chain founded in Astana in 2019. It operates 24 stores (18 in Astana, 6 in Almaty) and earned KZT 4.1 bn revenue last year with a 14% operating margin. Its customers are mostly students and young office workers aged 18–30.",
      "The Kazakhstan coffee-shop market grew ~18% per year since 2021. International chains are present in Almaty and Astana, but Shymkent — the country's third-largest city with 1.2 mln residents — has mostly independent cafés."
    ],
    situation: [
      "The board approved KZT 600 mln to open 10 new stores in the next 18 months. The CEO is split: the expansion team pushes Shymkent (\"first-mover advantage\"), while the CFO wants to densify Astana where the brand is known. A regional influencer has also offered a paid partnership for KZT 25 mln, which the marketing team is excited about."
    ],
    task: "Should Steppe Coffee open its next 10 stores in Shymkent or in Astana? Recommend a plan and justify it with numbers.",
    deliverables: [
      "A clear go / no-go recommendation for Shymkent",
      "Estimated payback period for one new store in each city",
      "Top 3 risks and how to mitigate them",
      "A 12-month rollout plan with KPIs"
    ],
    exhibits: [
      {
        title: "Exhibit 1: Unit economics per store (estimates)",
        columns: ["Metric", "Astana (new store)", "Shymkent (new store)"],
        rows: [
          ["Capex per store, KZT mln", "60", "52"],
          ["Avg. cups per day", "420", "310"],
          ["Avg. ticket, KZT", "1,650", "1,350"],
          ["Monthly rent, KZT mln", "2.4", "1.3"],
          ["Monthly staff + other opex, KZT mln", "6.8", "5.2"],
          ["COGS, % of revenue", "32%", "34%"]
        ],
        note: "Expansion team estimates; Shymkent figures based on 2 competitor interviews. 30 trading days per month."
      },
      {
        title: "Exhibit 2: Market snapshot",
        columns: ["Indicator", "Astana", "Shymkent"],
        rows: [
          ["Population, mln", "1.4", "1.2"],
          ["Avg. monthly salary, KZT thous.", "520", "330"],
          ["Specialty coffee shops", "~310", "~90"],
          ["Steppe Coffee brand awareness (survey)", "61%", "9%"],
          ["Share of population aged 18–30", "24%", "27%"]
        ],
        note: "Bureau of National Statistics (2025), company survey. Influencer audience data not provided."
      }
    ],
    answerKey: {
      keyInsights: [
        "Astana new store: revenue ≈ 420×1,650×30 ≈ KZT 20.8 mln/month; gross profit ≈ 14.1; minus rent+opex 9.2 → ≈ KZT 4.9 mln/month → payback ≈ 12 months.",
        "Shymkent new store: revenue ≈ 310×1,350×30 ≈ KZT 12.6 mln/month; gross profit ≈ 8.3; minus 6.5 → ≈ KZT 1.8 mln/month → payback ≈ 29 months.",
        "Shymkent volume estimate is weak (2 interviews) and brand awareness is only 9% — real cups/day could be lower in year 1.",
        "Astana cannibalisation risk is the key unknown for densification; 310 competitors suggests saturation pressure.",
        "The influencer offer is a distraction without audience data — irrelevant to the location decision."
      ],
      strongRecommendation: "Prioritise most of the 10 stores in Astana (≈12-month payback) while running a low-risk Shymkent pilot of 1–2 stores to validate volume and awareness before committing more capital. Set go/no-go KPIs for the pilot (e.g., ≥380 cups/day by month 6).",
      commonTraps: [
        "Choosing Shymkent because of 'first-mover advantage' without calculating payback",
        "Ignoring the lower salaries and ticket size in Shymkent",
        "Spending time on the influencer offer",
        "Not stating assumptions about cannibalisation in Astana"
      ]
    }
  },
  {
    id: "sample-qazpay",
    title: "QazPay: Where Did Our Active Users Go?",
    company: "QazPay",
    industry: "FinTech",
    caseType: "Growth strategy",
    difficulty: "Intermediate",
    minutes: 45,
    hook: "A mobile wallet with 2.3 mln downloads is losing monthly active users — and the board wants a fix in 6 months.",
    background: [
      "QazPay is a Kazakhstani mobile wallet launched in 2021 that lets users pay bills, transfer money by phone number and pay with QR in shops. It has 2.3 mln downloads, but competes with super-apps from large banks that offer the same features plus cashback and loans.",
      "QazPay earns revenue from merchant fees (0.9% of QR payment volume) and from bill-payment commissions. The company is not yet profitable and is preparing for a Series B round in 2027."
    ],
    situation: [
      "Monthly active users (MAU) fell from 640k to 470k over the last 12 months. The marketing team proposes a nationwide cashback campaign (KZT 1.2 bn budget). The product team argues that the problem is onboarding and wants to rebuild the app. The board wants one focused plan.",
      "QazPay recently redesigned its logo, which received mixed feedback on social media."
    ],
    task: "Diagnose why QazPay is losing active users and recommend the single most effective 6-month plan to return to growth.",
    deliverables: [
      "Root cause of the MAU decline backed by the data",
      "A recommended plan with expected impact on MAU",
      "Budget logic: why your plan beats the KZT 1.2 bn cashback campaign",
      "KPIs to track monthly"
    ],
    exhibits: [
      {
        title: "Exhibit 1: User funnel (monthly averages)",
        columns: ["Stage", "12 months ago", "Last month"],
        rows: [
          ["New downloads", "95,000", "88,000"],
          ["Completed registration (eKYC)", "71%", "48%"],
          ["Made first payment within 7 days", "52%", "50%"],
          ["Still active after 3 months", "38%", "37%"]
        ],
        note: "eKYC provider was changed 9 months ago to cut costs by KZT 40 mln/year."
      },
      {
        title: "Exhibit 2: Active user behaviour",
        columns: ["Segment", "Share of MAU", "Avg. transactions / month", "Churn / month"],
        rows: [
          ["Bill payers only", "46%", "2.1", "6%"],
          ["P2P transfers", "31%", "5.4", "4%"],
          ["QR in shops", "23%", "9.8", "2%"]
        ],
        note: "QR users generate ~70% of revenue."
      },
      {
        title: "Exhibit 3: App store reviews mentioning a topic (last 6 months)",
        columns: ["Topic", "Share of 1–2★ reviews"],
        rows: [
          ["Registration / ID verification fails", "44%"],
          ["Fewer shops accept QazPay QR", "21%"],
          ["No cashback vs bank apps", "17%"],
          ["New logo", "3%"],
          ["Other", "15%"]
        ],
        note: "n = 1,840 reviews. Data on competitors' acquisition costs is not available."
      }
    ],
    answerKey: {
      keyInsights: [
        "Registration completion fell from 71% to 48% after the eKYC provider switch — ≈ 20k fewer new registered users per month (95k×71% vs 88k×48%), which explains most of the MAU decline.",
        "Post-registration metrics (first payment, 3-month retention) are stable, so the product after onboarding is not the main problem.",
        "QR users have the lowest churn and generate ~70% of revenue — growth should focus on QR merchants and QR habit.",
        "Cashback attacks a smaller pain (17%) at a very high cost; the eKYC saving of KZT 40 mln/year is tiny vs the lost users.",
        "The logo is noise (3% of complaints)."
      ],
      strongRecommendation: "Fix onboarding first: revert or fix the eKYC flow (add fallback verification), targeting ≥68% completion within 2 months; then invest a fraction of the cashback budget in QR merchant acquisition and targeted QR incentives. Track registration completion, MAU, QR share and merchant count monthly.",
      commonTraps: [
        "Recommending the cashback campaign without looking at the funnel",
        "Rebuilding the whole app when only onboarding broke",
        "Treating all users equally instead of prioritising QR users",
        "Discussing the logo"
      ]
    }
  }
];

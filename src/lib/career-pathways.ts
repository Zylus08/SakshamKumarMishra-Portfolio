// Editorial selections resolve against the existing catalogue; no duplicate articles.
export const homepageProjectOrder = [
  "tradecore",
  "flowstate",
  "roadvision",
  "hydra-stream",
  "risklab",
  "project-janus",
  "thermodynamic-evolution",
] as const;

export const projectPreviews: Record<string, string> = {
  tradecore:
    "A C++20 matching-engine prototype with compile-time risk rules and fill-conservation assertions. The case study examines a fill-or-kill edge case before making latency claims.",
  flowstate:
    "A market-making simulator that makes queue assumptions, quote latency and inventory explicit. Fill records track fees and markouts; simulated execution is not live trading.",
  risklab:
    "A momentum and tail-risk framework with volatility scaling and turnover accounting. Thirteen offline tests passed in the source audit; neutral-date handling still limits return comparisons.",
  roadvision:
    "A road-segmentation evaluation harness around pretrained models, with explicit confusion-matrix and ignored-label semantics. Its documented five-scene audit is not broad driving validation.",
  "hydra-stream":
    "A collaborative Rust streaming system. My merged contribution connects the gateway, authenticated CLI and policy configuration into a coherent local workflow; distributed deployment remains unverified.",
  "project-janus":
    "A chess engine combining classical search with optional neural evaluation and phase-tapered blending. Source confirms the mechanisms; exploratory comparisons do not establish a strength gain.",
  "thermodynamic-evolution":
    "Collaborative software-analysis tooling with cached semantic summaries and gated, isolated candidate execution. Fixture evidence bounds the claims; general autonomous remediation remains deferred.",
};

export const careerPathways = [
  {
    id: "quant",
    label: "Quantitative Finance",
    documentId: "quantitative",
    statement:
      "Market microstructure, C++ execution systems and systematic research—examined through correctness, risk and evaluation integrity.",
    kind: "projects",
    slugs: ["tradecore", "flowstate", "risklab"],
    rationales: [
      "Order execution: inspect bounded result storage, static risk-rule composition and matching invariants, including the unresolved fill-or-kill boundary.",
      "Microstructure: examine queue and latency assumptions through fee, inventory and markout records rather than a live-return headline.",
      "Systematic research: trace volatility scaling and turnover costs, with a tested offline subset and explicit calendar-accounting limitations.",
    ],
    moreLabel: "Explore all quantitative work",
    moreHref: "/projects?category=Quantitative%20Finance",
  },
  {
    id: "research",
    label: "Research",
    documentId: "academic",
    statement:
      "Methods worth inspecting: experimental design, reproducibility and uncertainty, with limitations treated as part of the result.",
    kind: "research",
    slugs: ["eeg-representation", "chess-evaluation", "software-analysis"],
    rationales: [
      "Temporal contrastive learning and subject-level evaluation. The seed-handling correction explains why earlier rankings cannot support robust improvement.",
      "Classical and learned chess evaluation under controlled search budgets. Opening sensitivity and uncertain comparisons bound the reported findings.",
      "Cached semantic summaries and execution gates make change proposals inspectable. Reused fixture corpora limit generalization; remediation remains deferred.",
    ],
    moreLabel: "Explore the research archive",
    moreHref: "/research",
  },
  {
    id: "ml",
    label: "Applied ML",
    documentId: "machine-learning",
    statement:
      "From data preparation to model evaluation: understand the architecture, inspect the metric and make the deployment boundary explicit.",
    kind: "projects",
    slugs: ["roadvision", "aerospace-rul", "big-five-chatbot"],
    rationales: [
      "Pretrained segmentation meets an inspectable corruption-evaluation harness. Confusion matrices and ignored labels matter more than an unreplicated robustness claim.",
      "C-MAPSS sequence preparation and MSE/Adam training expose the end-to-end modeling problem. Entrypoint mismatches prevent claiming a reproduced comparison.",
      "An adaptive interview prototype with external session state and structured parsing. Public-source exemplar scoring is not population or clinical validation.",
    ],
    moreLabel: "Explore machine-learning projects",
    moreHref: "/projects?category=Machine%20Learning%20%26%20AI",
  },
  {
    id: "systems",
    label: "SWE / Systems",
    documentId: "software",
    statement:
      "Systems programming and software architecture, with attention to correctness, test design and the boundaries between trusted components.",
    kind: "projects",
    slugs: ["hydra-stream", "tradecore", "thermodynamic-evolution"],
    rationales: [
      "My merged contribution to Kamish aligns gateway, authenticated CLI and policy trust configuration. The collaborative system's multi-region guarantees remain unverified.",
      "C++20 static rule composition and bounded result storage make execution contracts inspectable. Conservation assertions reveal where correctness needs stronger tests.",
      "Collaborative analysis tooling separates semantic summaries from candidate execution. Container gates reduce exposure without establishing universal security or autonomous repair.",
    ],
    moreLabel: "Explore systems projects",
    moreHref: "/projects?category=Systems%20%26%20Infrastructure",
  },
] as const;

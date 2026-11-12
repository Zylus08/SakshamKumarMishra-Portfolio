// Editorial selections resolve against the existing catalogue; no duplicate articles.
export const homepageProjectOrder = [
  "tradecore",
  "flowstate",
  "risklab",
  "roadvision",
  "hydra-stream",
  "project-janus",
  "thermodynamic-evolution",
] as const;

export const projectPreviews: Record<string, string> = {
  tradecore:
    "A C++20 order-matching prototype built around bounded result storage and compile-time risk rules. The implementation pairs price-constrained fills with conservation assertions to make execution contracts inspectable.",
  flowstate:
    "A market-making research simulator that models quote latency, queue position and inventory. Fill-level fee, edge and markout records expose how execution assumptions shape simulated outcomes.",
  risklab:
    "A volatility-scaled momentum and tail-risk research framework with explicit turnover-cost accounting. An offline test subset checks signal prefix stability, backtest accounting, volatility and metrics.",
  roadvision:
    "A road-segmentation evaluation harness around pretrained models, with explicit confusion-matrix accumulation. Ignored-label and absent-class policies make metric definitions inspectable across clean and corrupted inputs.",
  "hydra-stream":
    "A collaborative Rust event-streaming system that enforces signed residency policies at broker boundaries. My merged contribution connects gateway behavior, authenticated CLI operations and policy trust configuration.",
  "project-janus":
    "A chess-engine research platform integrating classical search, native neural accumulators and phase-tapered evaluation. Its architecture separates search correctness, evaluator behavior and playing-strength experiments.",
  "thermodynamic-evolution":
    "Collaborative software-analysis tooling that combines cached semantic summaries with gated candidate execution. Source hashes and completeness fields track analysis context, while isolated execution keeps proposed changes behind validation boundaries.",
};

export const careerPathways = [
  {
    id: "quant",
    label: "Quantitative Finance",
    documentId: "quantitative",
    statement:
      "Execution systems, market microstructure and systematic research.",
    kind: "projects",
    slugs: ["tradecore", "flowstate", "risklab"],
    rationales: [
      "Compile-time risk rules and bounded matching results.",
      "Queue-aware market-making simulation and markout analysis.",
      "Volatility scaling, turnover costs and offline accounting tests.",
    ],
    moreLabel: "Explore all quantitative work",
    moreHref: "/projects?category=Quantitative%20Finance",
  },
  {
    id: "research",
    label: "Research",
    documentId: "academic",
    statement:
      "Experimental methods, reproducibility and learning under uncertainty.",
    kind: "research",
    slugs: ["eeg-representation", "chess-evaluation", "software-analysis"],
    rationales: [
      "Temporal contrastive objectives and subject-level evaluation.",
      "Neural accumulators and controlled search comparisons.",
      "Interprocedural summaries and evidence-gated execution.",
    ],
    moreLabel: "Explore the research archive",
    moreHref: "/research",
  },
  {
    id: "ml",
    label: "Applied ML",
    documentId: "machine-learning",
    statement: "Data pipelines, model integration and evaluation design.",
    kind: "projects",
    slugs: ["roadvision", "aerospace-rul", "big-five-chatbot"],
    rationales: [
      "Pretrained segmentation with explicit metric semantics.",
      "C-MAPSS sequence preparation and recurrent-model training components.",
      "Public prototype: stateful interviews and structured trait scoring.",
    ],
    moreLabel: "Explore machine-learning projects",
    moreHref: "/projects?category=Machine%20Learning%20%26%20AI",
  },
  {
    id: "systems",
    label: "SWE / Systems",
    documentId: "software",
    statement:
      "Systems programming, software architecture and trust boundaries.",
    kind: "projects",
    slugs: ["hydra-stream", "tradecore", "thermodynamic-evolution"],
    rationales: [
      "Collaborative Rust streaming; my gateway and CLI integration.",
      "C++20 memory bounds and fill-conservation assertions.",
      "Collaborative semantic analysis and isolated candidate evaluation.",
    ],
    moreLabel: "Explore systems projects",
    moreHref: "/projects?category=Systems%20%26%20Infrastructure",
  },
] as const;

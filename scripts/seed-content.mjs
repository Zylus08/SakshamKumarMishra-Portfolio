import fs from "node:fs";
const entries = [
  [
    "research",
    "h-star",
    "H-STAR",
    "Computer Vision",
    "Sign language recognition: exploring how visual representations can capture the structure of signed communication.",
    ["Computer vision", "Representation learning"],
    "How can a model represent the spatial and temporal structure of sign language?",
  ],
  [
    "research",
    "eeg-representation",
    "Self-Supervised EEG Representation Learning",
    "Time-series Modeling",
    "Self-supervised EEG representation learning for sleep apnea detection.",
    ["EEG", "Self-supervised learning", "Time series"],
    "Can self-supervised representations of EEG support sleep apnea detection with fewer labeled examples?",
  ],
  [
    "research",
    "mobilelora",
    "MobileLoRA",
    "Efficient ML",
    "Hardware-aware on-device adapter management under memory and compute constraints.",
    ["On-device ML", "Adapters", "Efficiency"],
    "How should adapters be managed when device memory and compute are constrained?",
  ],
  [
    "projects",
    "project-janus",
    "Project Janus",
    "Machine Learning",
    "Chess engine and neural evaluation research, at the intersection of search and learned representations.",
    ["Chess", "Neural evaluation", "Search"],
    "How can search and learned evaluation work together in a chess engine?",
  ],
  [
    "projects",
    "hydra-stream",
    "Kamish / HydraStream",
    "Systems Engineering",
    "Streaming broker and distributed systems engineering: exploring the path from producer to consumer.",
    ["Streaming", "Distributed systems", "Brokers"],
    "How should a streaming system balance ordering, durability, and delivery semantics?",
  ],
  [
    "projects",
    "tradecore",
    "TradeCore",
    "Quantitative Research",
    "A low-latency C++ order book and matching engine project.",
    ["C++", "Order book", "Matching engine"],
    "How can an order book make matching behavior explicit while controlling the cost of each operation?",
  ],
];
for (const [kind, slug, title, category, summary, tags, question] of entries) {
  const research = kind === "research";
  const body = `---\ntitle: ${JSON.stringify(title)}\nsummary: ${JSON.stringify(summary)}\ncategory: ${JSON.stringify(category)}\nstatus: Verification pending\nfeatured: true\ntags: ${JSON.stringify(tags)}\n---\n\n<Note>Candidate ${research ? "research note" : "case study"} supplied in the portfolio brief. Project stage, methods, authorship details, and outcomes have not yet been verified. This page introduces the topic; it does not report completed work.</Note>\n\n## ${research ? "Research question" : "Problem statement"}\n\n${question}\n\n## ${research ? "Abstract" : "Project overview"}\n\n${summary} The scope described here comes from the project brief. A full technical account will be added after supporting material is available.\n\n## ${research ? "Motivation" : "Engineering decisions"}\n\n${research ? "The central interest is in useful representations under practical constraints. Specific hypotheses and comparisons are awaiting the research notes." : "The final case study should explain the chosen data structures, interfaces, and trade-offs using evidence from the implementation. Those decisions are not yet documented here."}\n\n## ${research ? "Methodology" : "Implementation details"}\n\n${research ? "Model design, preprocessing, training objectives, and baselines are awaiting verification." : "Source code and implementation notes have not been supplied. No implementation or deployment claims are made."}\n\n## Architecture\n\n<Diagram steps={${research ? '["Observations", "Representation", "Evaluation"]' : '["Input", "Core system", "Output"]'}} />\n\nThis diagram is a conceptual reading aid, not an architecture recovered from source code.\n\n## ${research ? "Experimental setup" : "Testing methodology"}\n\n${research ? "Dataset provenance, participant-level splits where relevant, hardware, seeds, and evaluation metrics must be documented before results are shared." : "The verified case study should include correctness checks, failure cases, reproducible workloads, and the conditions of any performance measurements."}\n\n## Results\n\nNo verified ${research ? "experimental results" : "benchmarks or implementation outcomes"} are available for this note.\n\n## Limitations\n\nThe current description is limited to the topic supplied in the brief. It should not be treated as a publication, a reproducibility report, or evidence of production deployment.\n\n## ${research ? "Reproducibility" : "Future work"}\n\n${research ? "Code, data access instructions, dependency versions, and exact experiment commands will be linked when verified." : "Confirm the repository and implementation scope, document the architecture, and add reproducible tests before expanding this case study."}\n`;
  fs.writeFileSync(`src/content/${kind}/${slug}.mdx`, body);
}

import type { Entry } from "./content";

type Proof = {
  label: string;
  classification: "Source-reviewed" | "Offline tests reproduced";
  sourcePaths: string[];
  count?: number;
  auditDate?: string;
};
export const homepageEvidence: Record<string, Proof> = {
  "projects/tradecore": {
    label: "Inline result storage · conservation assertions",
    classification: "Source-reviewed",
    sourcePaths: [
      "include/tradecore/common/static_vector.hpp",
      "include/tradecore/matching/matching_engine.hpp",
    ],
  },
  "projects/flowstate": {
    label: "Fill-level fees, inventory and markouts",
    classification: "Source-reviewed",
    sourcePaths: ["src/execution.py"],
  },
  "projects/risklab": {
    label: "13 selected tests passed · 9 Nov 2026 audit",
    classification: "Offline tests reproduced",
    count: 13,
    auditDate: "2026-11-09",
    sourcePaths: ["tests/test_backtest.py", "tests/test_no_lookahead.py"],
  },
  "projects/roadvision": {
    label: "Confusion matrix · ignored-label handling",
    classification: "Source-reviewed",
    sourcePaths: ["src/metrics.py"],
  },
  "projects/hydra-stream": {
    label: "5 broker operation types",
    classification: "Source-reviewed",
    count: 5,
    sourcePaths: ["crates/kamish-enforce/src/lib.rs"],
  },
  "projects/project-janus": {
    label: "Native neural accumulators · phase blending",
    classification: "Source-reviewed",
    sourcePaths: [
      "analysis/v0.64/native/nnue_v3.cpp",
      "analysis/v0.64/native/janus_native.cpp",
    ],
  },
  "projects/thermodynamic-evolution": {
    label: "4 structural code metrics",
    classification: "Source-reviewed",
    count: 4,
    sourcePaths: ["thermodynamic-ast-engine/src/main.rs"],
  },
  "research/eeg-representation": {
    label: "3 temporal weighting kernels",
    classification: "Source-reviewed",
    count: 3,
    sourcePaths: ["SleepApneaSSL/temporal_loss.py"],
  },
  "research/chess-evaluation": {
    label: "Classical, neural and blended evaluation",
    classification: "Source-reviewed",
    sourcePaths: ["analysis/v0.64/native/janus_native.cpp"],
  },
  "research/software-analysis": {
    label: "Source-hashed summaries · execution gates",
    classification: "Source-reviewed",
    sourcePaths: [
      "go-backend/agent/repo_intel/diagnostic/semantic/function_summary.go",
      "go-backend/agent/repo_intel/execution/executor.go",
    ],
  },
};

export const researchPreviews: Record<string, string> = {
  "eeg-representation":
    "Temporal contrastive learning for EEG, with subject-level partitions and a frozen-encoder evaluation pipeline. The study examines how temporal distance changes the training objective.",
  "chess-evaluation":
    "A study of classical and learned chess evaluation using native neural accumulators and phase-dependent blending. Controlled search comparisons separate evaluator design from playing-strength estimates.",
  "software-analysis":
    "Collaborative research into inspectable code-change proposals. Function summaries track taint, resource effects and completeness, while approval and execution gates bound candidate evaluation.",
};

export function proofFor(entry: Entry) {
  const proof = homepageEvidence[`${entry.kind}/${entry.slug}`];
  if (!proof || !entry.evidence)
    throw new Error(`Missing homepage evidence: ${entry.slug}`);
  const sources = proof.sourcePaths.map(
    (path) =>
      `https://github.com/${entry.evidence!.repository}/blob/${entry.evidence!.commit}/${path}`,
  );
  if (sources.some((url) => !entry.body.includes(url)))
    throw new Error(`Unreferenced proof source: ${entry.slug}`);
  return { ...proof, sources };
}

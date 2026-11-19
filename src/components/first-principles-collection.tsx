import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface FirstPrinciplesProject {
  id: string;
  slug: string;
  name: string;
  layer: string;
  domain: string;
  description: string;
  proofPoint: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  essayHref: string;
  essayLabel: string;
}

export const firstPrinciplesProjects: FirstPrinciplesProject[] = [
  {
    id: "01",
    slug: "axiom",
    name: "AXIOM",
    layer: "Storage & Query Layer",
    domain: "SQL Execution",
    description:
      "A from-scratch C++20 analytical query engine with external-memory Grace Hash Join, hierarchical merge sort, and out-of-core spill management under strict memory budgets.",
    proofPoint: "5.37 GB / 164M rows processed · 120/120 DuckDB differential tests passed",
    tags: ["C++20", "Grace Hash Join", "External Sort", "DuckDB 2.0.0"],
    metrics: [
      { label: "Spilled Data", value: "3.74 GB" },
      { label: "Working Set", value: "-88.3%" },
      { label: "Differential", value: "100%" },
    ],
    essayHref: "/writing/sql-query-outgrows-memory",
    essayLabel: "Engineering essay",
  },
  {
    id: "02",
    slug: "praxis",
    name: "PRAXIS",
    layer: "Execution Runtime",
    domain: "Language Interpretation",
    description:
      "A restricted, lifetime-safe C++ interpreter written in C++20. Employs an Abstract Validated Handle Reference Model to eliminate host pointer exposure while supporting RAII, templates, and STL.",
    proofPoint: "1,614/1,614 checks passed · 258/258 MSVC differential programs matched",
    tags: ["C++20", "Handle Reference Model", "RAII Chains", "Templates"],
    metrics: [
      { label: "MSVC Differentials", value: "258 / 258" },
      { label: "Total Checks", value: "1,614" },
      { label: "Memory Leaks", value: "0" },
    ],
    essayHref: "/writing/building-a-cpp-interpreter",
    essayLabel: "Engineering essay",
  },
  {
    id: "03",
    slug: "forge",
    name: "FORGE",
    layer: "Training Infrastructure",
    domain: "Neural Training",
    description:
      "An experimental PyTorch CPU training accelerator featuring AVX2 zero-mask kernels and autograd integration, backed by an Amdahl's Law forensic analysis of its 0.8504× throughput result.",
    proofPoint: "29/29 bitwise numerical parity tests (L∞ = 0.0) · Amdahl bound verified",
    tags: ["PyTorch", "AVX2 SIMD", "Zero-Mask", "Amdahl's Law"],
    metrics: [
      { label: "Stock Throughput", value: "0.8504×" },
      { label: "Amdahl Max", value: "1.0965×" },
      { label: "Bitwise Parity", value: "L∞ = 0.0" },
    ],
    essayHref: "/research/faster-kernels-slower-training",
    essayLabel: "Research paper",
  },
  {
    id: "04",
    slug: "vectra",
    name: "VECTRA",
    layer: "Inference Engine",
    domain: "Model Inference",
    description:
      "A clean-room C++20 CPU inference runtime for quantized transformer LLMs with zero dependencies on llama.cpp, featuring AVX2 INT8 GEMV and DDR5 memory streaming.",
    proofPoint: "16.82 tok/s sustained median · 1,061.4 MB peak RAM (saves 111 MB vs llama.cpp)",
    tags: ["C++20", "Clean-Room Runtime", "Q4_K / Q6_K", "DDR5 Streaming"],
    metrics: [
      { label: "Sustained Speed", value: "16.82 tok/s" },
      { label: "Peak RAM", value: "1,061.4 MB" },
      { label: "DDR5 Bandwidth", value: "33.8 GB/s" },
    ],
    essayHref: "/research/cpu-language-model-inference",
    essayLabel: "Performance study",
  },
];

export function FirstPrinciplesCollection() {
  return (
    <div className="first-principles-collection" id="first-principles">
      <div className="first-principles-header">
        <div className="first-principles-badge micro">
          <i className="dot" /> SPECIAL EDITORIAL COLLECTION
        </div>
        <p className="eyebrow">BUILT FROM FIRST PRINCIPLES</p>
        <div className="first-principles-title-row">
          <h3>
            Four explorations into <em>computational infrastructure.</em>
          </h3>
          <p className="first-principles-summary">
            Independent investigations into the layers between raw hardware and software
            abstractions—tracing the journey from relational query execution to safe language
            interpretation, neural operator fusion, and quantized model inference.
          </p>
        </div>
        <div className="first-principles-pipeline micro" aria-label="Conceptual progression">
          <span className="pipeline-node">
            <b>01</b> SQL Execution
          </span>
          <span className="pipeline-arrow" aria-hidden="true">
            →
          </span>
          <span className="pipeline-node">
            <b>02</b> Language Interpretation
          </span>
          <span className="pipeline-arrow" aria-hidden="true">
            →
          </span>
          <span className="pipeline-node">
            <b>03</b> Neural Training
          </span>
          <span className="pipeline-arrow" aria-hidden="true">
            →
          </span>
          <span className="pipeline-node">
            <b>04</b> Model Inference
          </span>
        </div>
        <p className="first-principles-disclaimer micro">
          * These four systems are standalone, independent repositories sharing a common design philosophy of
          first-principles construction and empirical verification; they do not constitute a single monolithic product.
        </p>
      </div>

      <div className="first-principles-grid">
        {firstPrinciplesProjects.map((project) => (
          <div key={project.slug} className="first-principles-card">
            <div className="fp-card-header">
              <span className="fp-id micro">{project.id}</span>
              <span className="fp-layer micro">{project.layer}</span>
              <span className="fp-domain micro">{project.domain}</span>
            </div>
            <div className="fp-card-body">
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <div className="fp-metrics">
                {project.metrics.map((m) => (
                  <div key={m.label} className="fp-metric-item">
                    <span className="fp-metric-value">{m.value}</span>
                    <span className="fp-metric-label micro">{m.label}</span>
                  </div>
                ))}
              </div>
              <p className="fp-proof-point micro">
                <span>VERIFIED</span> · {project.proofPoint}
              </p>
            </div>
            <div className="fp-card-footer">
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="fp-card-actions">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-link"
                >
                  Case study <ArrowUpRight size={14} />
                </Link>
                <Link
                  href={project.essayHref}
                  className="text-link fp-essay-link"
                >
                  {project.essayLabel} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

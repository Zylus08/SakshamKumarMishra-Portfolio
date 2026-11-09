# Thermodynamic Evolution — M3 audit

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

Reviewed snapshot: [CV-Code-Vitals/Thermodynamic-Evolution-UCS503 at d5ae3189dcbc](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/tree/d5ae3189dcbcc34b1261f9a5d16145006c6144bb).

## Implementation and evidence

The Go backend separates repository intelligence, diagnostics, remediation planning, and execution. Semantic analysis adds call resolution, dataflow, resource-lifecycle reasoning, and cached function summaries. Rust AST components and an administrative frontend support the broader system.

Function summaries encode parameter-to-return taint relationships, resource acquisition/release effects, and error behavior. Summary entries record source hashes and completeness. The executor checks task eligibility and approval before creating a workspace and choosing a registered strategy. The Rust engine computes a weighted structural score from cyclomatic complexity, maximum nesting, log AST size, and concurrency primitives. The Go annealer requires configured candidate and energy evaluators before starting.

## Results and limitations

VERIFIED by source inspection: semantic summaries, eligibility checks, isolated execution orchestration, and Docker containment arguments are implemented. DOCUMENTED: the latest Phase 1.1 report describes counterfactual and adversarial verification, bounded recursion, and reused evaluation corpora. Those experiments were not rerun here.

The latest inspected report explicitly limits the milestone to verification and does not authorize general autonomous remediation. Polymorphic dispatch, ownership escape, multi-hop aliases, and corpus reuse constrain generalization. Small fixture suites do not establish universal diagnostic accuracy or optimization superiority.

## Detailed review

The personal fork and organization repository are consolidated. Merged Zylus08 PRs #26 and #27 support the stated contribution; they do not establish sole authorship. The latest verification report is verification-only and explicitly defers autonomous remediation. Earlier reports use differing external/held-out corpus names; do not merge denominators or headline a generalized 100% result.

The implemented structural score is 0.45 times cyclomatic complexity + 0.25 times maximum nesting + 0.15 times log2(AST node count) + 0.15 times concurrency count, rounded to two decimal places. Lower score is not measured physical energy, runtime speed, correctness, or security. The annealer requires evaluator interfaces and applies candidate checks; passing tests does not establish semantic equivalence on all inputs.

Sandbox source includes no-network, nonroot, read-only, dropped capabilities, resource limits, and timeout controls. README defaults and current implementation defaults differ; runtime deployment was not exercised. Semantic summaries cover taint, resource, and error effects with hashed caching. Conservative unresolved dispatch/ownership and corpus reuse limit generalization. No formal soundness, autonomous security remediation, publication acceptance, or independent accuracy benchmark is claimed.

## Sources

- [go-backend/agent/repo_intel/diagnostic/semantic/function_summary.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/repo_intel/diagnostic/semantic/function_summary.go)
- [go-backend/agent/repo_intel/execution/executor.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/repo_intel/execution/executor.go)
- [go-backend/agent/evaluator.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/evaluator.go)
- [go-backend/agent/mutation.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/mutation.go)
- [reports/milestone3_5_phase1_1_independent_verification.md](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/reports/milestone3_5_phase1_1_independent_verification.md)
- [thermodynamic-ast-engine/src/main.rs](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/thermodynamic-ast-engine/src/main.rs)
- [go-backend/agent/annealer.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/annealer.go)

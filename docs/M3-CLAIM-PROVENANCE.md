# M3 claim provenance

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

## Claim rules

No return, latency, speedup, accuracy, clinical effectiveness, security certification, acceptance, or production-adoption headline is inferred from a README. Commit-pinned links below identify evidence examined and adjacent implementation context. Not every line of every linked file was reviewed. No private source links or snippets are published.

## TradeCore

Commit: `fed1e79d7d144a6485055585a42a32a4864b93ea`. Review date: 2026-11-09.

- Implementation claim: The risk pipeline evaluates a tuple of rules using a short-circuit fold expression. The matcher contains debug assertions for trade quantities, resting prices, and the conservation of filled plus remaining volume. StaticVector uses inline arrays rather than an unbounded result container.
- Evidence classification: VERIFIED by source inspection: price-constrained matching, compile-time risk-rule composition, and conservation assertions exist. DOCUMENTED only: allocator timing artifacts and README latency contracts. The contracts are targets, not independently measured P99 results.
- Qualification: The fill-or-kill prescan counts total opposing liquidity without receiving a limit price, whereas the matching loop enforces that price. This can admit a request that cannot be completely filled at its limit. RiskResult contains std::string and long rejection messages, so a universal zero-allocation claim is unsupported. The contract checker can report success when no matching benchmark rows exist. No institutional-readiness claim is made.

- [include/tradecore/matching/matching_engine.hpp](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/include/tradecore/matching/matching_engine.hpp)
- [include/tradecore/matching/liquidity_analyzer.hpp](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/include/tradecore/matching/liquidity_analyzer.hpp)
- [include/tradecore/matching/risk_pipeline.hpp](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/include/tradecore/matching/risk_pipeline.hpp)
- [include/tradecore/common/static_vector.hpp](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/include/tradecore/common/static_vector.hpp)
- [scripts/validate_contracts.py](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/scripts/validate_contracts.py)
- [benchmarks/results/allocator_baseline.json](https://github.com/Zylus08/TradeCore/blob/fed1e79d7d144a6485055585a42a32a4864b93ea/benchmarks/results/allocator_baseline.json)
## FlowState

Commit: `d0410dab812dd51d0603c1d089a4e49f73bddd8b`. Review date: 2026-11-09.

- Implementation claim: The execution model combines a crossing condition with a queue-depth and price-penetration probability. It tracks maker fees, delayed quote eligibility, inventory bounds, and later markouts. These are model assumptions, not reconstructions of an exchange matching engine.
- Evidence classification: VERIFIED by source inspection: simulated fill records contain inventory, fee, edge, and markout fields. The default configuration includes quote latency and an inventory limit. DOCUMENTED experiment reports are available, but no live-capital performance or independent return estimate is asserted.
- Qualification: The default maker fee is zero, so reported net performance requires inspecting the configuration used for each run. Queue position and penetration remain approximations. Historical, synthetic, and paper execution must be compared separately; a live data feed does not establish live trading.

- [src/execution.py](https://github.com/Zylus08/FlowState/blob/d0410dab812dd51d0603c1d089a4e49f73bddd8b/src/execution.py)
- [src/strategy.py](https://github.com/Zylus08/FlowState/blob/d0410dab812dd51d0603c1d089a4e49f73bddd8b/src/strategy.py)
- [research/queue_model.py](https://github.com/Zylus08/FlowState/blob/d0410dab812dd51d0603c1d089a4e49f73bddd8b/research/queue_model.py)
- [research/latency_sim.py](https://github.com/Zylus08/FlowState/blob/d0410dab812dd51d0603c1d089a4e49f73bddd8b/research/latency_sim.py)
## RiskLab

Commit: `971422295d94772d7f792753a5ba889da204ce74`. Review date: 2026-11-09.

- Implementation claim: The backtester multiplies supplied signal and volatility exposure, computes turnover from position differences, and deducts basis-point costs. Its contract expects signals and scaling to be shifted before entry.
- Evidence classification: VERIFIED: 13 existing tests passed in an isolated copy on 9 November 2026, covering backtest columns/accounting, signal prefix stability, volatility, and metrics. This is a selected offline subset, not a full research reproduction or C++ speed benchmark.
- Qualification: The backtester removes neutral-signal dates before calculating turnover and wealth. Exit costs and calendar-consistent benchmark comparison therefore need review. The tests that passed do not establish profitable out-of-sample performance.

- [src/backtest.py](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/src/backtest.py)
- [src/signals.py](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/src/signals.py)
- [src/volatility.py](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/src/volatility.py)
- [tests/test_no_lookahead.py](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/tests/test_no_lookahead.py)
- [tests/test_backtest.py](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/tests/test_backtest.py)
## Regime-Shift

Commit: `f1f4ea017b78db07e7faed924d34711e5c34a81a`. Review date: 2026-11-09.

- Implementation claim: Training-only scaler fitting is implemented. However, the entire test window is passed to Viterbi decoding and forward-backward posterior inference. The portfolio simulator then applies date-specific weights to that same date's returns.
- Evidence classification: VERIFIED by source inspection: fold-specific fitting and overlap removal exist. The inspected inference/accounting path does not justify the report's leakage-free out-of-sample claim. Published return tables are not repeated here as validated outcomes.
- Qualification: Future observations within a test sequence can affect smoothed state estimates. Same-day signal/return timing also needs correction or explicit justification. Failed folds are skipped after logging, so the successful-fold denominator matters. Fixed-universe and capacity assumptions remain research limitations.

- [validation/walk_forward.py](https://github.com/Zylus08/Regime-Shift/blob/f1f4ea017b78db07e7faed924d34711e5c34a81a/validation/walk_forward.py)
- [models/hmm_model.py](https://github.com/Zylus08/Regime-Shift/blob/f1f4ea017b78db07e7faed924d34711e5c34a81a/models/hmm_model.py)
- [reports/research_report.md](https://github.com/Zylus08/Regime-Shift/blob/f1f4ea017b78db07e7faed924d34711e5c34a81a/reports/research_report.md)
## DeepHedge-RL

Commit: `e85e7adcfe413444fdbfe988a6c3c6884493fa0e`. Review date: 2026-11-09.

- Implementation claim: The inspected harness defines five expanding training windows followed by annual evaluation periods from 2019 through 2023. It records transaction-cost, slippage, capital, lot, strike, and reward configuration alongside results. Option values and Greeks are calculated with Black–Scholes rather than replayed option quotes. Volatility comes from lagged VIX with a multiplier or realized-volatility fallbacks.
- Evidence classification: VERIFIED: the expanding-window harness and action-mask evaluation path are implemented. Model training and market-data provenance were not reproduced in this portfolio audit. Stored training artifacts do not establish actual trading returns.
- Qualification: Repeated evaluation episodes are not automatically independent market samples. Option pricing assumptions, feature causality, cost calibration, and episode overlap need to accompany any quantitative conclusion. No live deployment, realized profit, or superiority claim is made. The inspected near-expiry and near-zero-volatility branches return zero put delta even for an in-the-money put. Reset also samples with global NumPy randomness rather than the Gymnasium seeded generator; reproducibility needs explicit verification.

- [walk_forward_validation.py](https://github.com/Zylus08/DeepHedge-RL/blob/e85e7adcfe413444fdbfe988a6c3c6884493fa0e/walk_forward_validation.py)
- [envs/intraday_option_env.py](https://github.com/Zylus08/DeepHedge-RL/blob/e85e7adcfe413444fdbfe988a6c3c6884493fa0e/envs/intraday_option_env.py)
- [envs/intraday_option_env_maskPPO.py](https://github.com/Zylus08/DeepHedge-RL/blob/e85e7adcfe413444fdbfe988a6c3c6884493fa0e/envs/intraday_option_env_maskPPO.py)
- [utils/black_scholes.py](https://github.com/Zylus08/DeepHedge-RL/blob/e85e7adcfe413444fdbfe988a6c3c6884493fa0e/utils/black_scholes.py)
## Satoshi_Flow

Commit: `0fe06286b3b86263c184c6b543b46d0fd7bd396f`. Review date: 2026-11-09.

- Implementation claim: The loop executes pending signals at the following open, applies directional slippage and fees, and checks the low against a previously established stop. Gap-down execution uses the lower of open and stop before slippage. Trailing stops update after that check.
- Evidence classification: VERIFIED by source inspection: the described ordering and cost hooks are implemented. The repository includes validation and robustness artifacts, but their returns have not been independently reproduced here.
- Qualification: OHLC bars cannot identify every intrabar path or exchange fill. Liquidity, market impact, data selection, and parameter selection remain important assumptions. This is historical simulation, not evidence of paper or live capital deployment.

- [backtester/engine.py](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/backtester/engine.py)
- [portfolio/risk.py](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/portfolio/risk.py)
- [portfolio/accounting.py](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/portfolio/accounting.py)
- [research/validation.py](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/research/validation.py)
## AQC

Commit: `ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3`. Review date: 2026-11-09.

- Implementation claim: The backtester preloads market columns into NumPy arrays. PaperBroker delegates fills to a simulator and charges commission; the inspected call supplies a fixed daily-volatility assumption and a fallback volume when reported volume is absent.
- Evidence classification: VERIFIED by source inspection: event orchestration and paper-broker state transitions exist. Directory names such as institutional, deployment, and live_capital do not prove institutional use or real-money trading.
- Qualification: Bar-by-bar iteration alone does not guarantee causality when a strategy can access data arrays. Same-bar fill timing, missing-volume defaults, fixed volatility, multiple-testing controls, and calibration require scrutiny before performance interpretation.

- [aqc/backtester/engine.py](https://github.com/Zylus08/AQC/blob/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3/aqc/backtester/engine.py)
- [aqc/live/paper_broker.py](https://github.com/Zylus08/AQC/blob/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3/aqc/live/paper_broker.py)
- [aqc/live/fill_simulator.py](https://github.com/Zylus08/AQC/blob/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3/aqc/live/fill_simulator.py)
## Thermodynamic Evolution

Commit: `d5ae3189dcbcc34b1261f9a5d16145006c6144bb`. Review date: 2026-11-09.

- Implementation claim: Function summaries encode parameter-to-return taint relationships, resource acquisition/release effects, and error behavior. Summary entries record source hashes and completeness. The executor checks task eligibility and approval before creating a workspace and choosing a registered strategy. The Rust engine computes a weighted structural score from cyclomatic complexity, maximum nesting, log AST size, and concurrency primitives. The Go annealer requires configured candidate and energy evaluators before starting.
- Evidence classification: VERIFIED by source inspection: semantic summaries, eligibility checks, isolated execution orchestration, and Docker containment arguments are implemented. DOCUMENTED: the latest Phase 1.1 report describes counterfactual and adversarial verification, bounded recursion, and reused evaluation corpora. Those experiments were not rerun here.
- Qualification: The latest inspected report explicitly limits the milestone to verification and does not authorize general autonomous remediation. Polymorphic dispatch, ownership escape, multi-hop aliases, and corpus reuse constrain generalization. Small fixture suites do not establish universal diagnostic accuracy or optimization superiority.

- [go-backend/agent/repo_intel/diagnostic/semantic/function_summary.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/repo_intel/diagnostic/semantic/function_summary.go)
- [go-backend/agent/repo_intel/execution/executor.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/repo_intel/execution/executor.go)
- [go-backend/agent/evaluator.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/evaluator.go)
- [go-backend/agent/mutation.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/mutation.go)
- [reports/milestone3_5_phase1_1_independent_verification.md](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/reports/milestone3_5_phase1_1_independent_verification.md)
- [thermodynamic-ast-engine/src/main.rs](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/thermodynamic-ast-engine/src/main.rs)
- [go-backend/agent/annealer.go](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/blob/d5ae3189dcbcc34b1261f9a5d16145006c6144bb/go-backend/agent/annealer.go)
## Kamish

Commit: `5682594cb50450c66bad839de1d30ceccc4b4ac4`. Review date: 2026-11-09.

- Implementation claim: The inspected enforcement function evaluates ingress, replication, export, fetch, and promotion operations against class and destination rules. Denials and accepted operations are recorded through the audit layer.
- Evidence classification: VERIFIED: enforcement decisions exist in source, and Zylus08's PR #1 was merged. DOCUMENTED: the PR handoff records Rust, SDK, frontend, and clean-room checks. These counts describe that repository's run, not a rerun by this portfolio audit.
- Qualification: The inspected handoff explicitly does not verify external etcd, KMS, independent witnesses, a production browser deployment, or persistent multi-region rollout. Cryptographic policy checks do not by themselves establish legal compliance, zero data loss, or production readiness.

- [crates/kamish-enforce/src/lib.rs](https://github.com/abhinav29102005/kamish/blob/5682594cb50450c66bad839de1d30ceccc4b4ac4/crates/kamish-enforce/src/lib.rs)
- [audit/pr1_review_fixes_20261107/REPORT.md](https://github.com/abhinav29102005/kamish/blob/5682594cb50450c66bad839de1d30ceccc4b4ac4/audit/pr1_review_fixes_20261107/REPORT.md)
- [docs/CONTRACT.md](https://github.com/abhinav29102005/kamish/blob/5682594cb50450c66bad839de1d30ceccc4b4ac4/docs/CONTRACT.md)
## Project Janus

Commit: `12fd92f436186348697a009bc597fe7110a5086d`. Review date: 2026-11-09.

- Implementation claim: The native v0.64 source implements phase-dependent blending between classical and neural scores. Its default disables neural evaluation. The v0.65 report documents factorial comparisons, endgame evaluation, numerical parity checks, and a distinction between frozen classical and neural research baselines.
- Evidence classification: VERIFIED by source inspection: optional neural evaluation, accumulator-based native evaluation, and phase-tapered blending exist. DOCUMENTED only: tournament estimates, latency numbers, and manuscript-readiness conclusions in repository reports. No official Elo rating or accepted publication is claimed.
- Qualification: The report's exploratory comparison against the classical baseline includes uncertainty spanning no improvement. An older README describes only the initial baseline and is not a complete account of the pinned tree. Reproduction must identify a specific native version, model, corpus, and budget.

- [analysis/v0.64/native/nnue_v3.cpp](https://github.com/Zylus08/Project-Janus/blob/12fd92f436186348697a009bc597fe7110a5086d/analysis/v0.64/native/nnue_v3.cpp)
- [analysis/v0.64/native/janus_native.cpp](https://github.com/Zylus08/Project-Janus/blob/12fd92f436186348697a009bc597fe7110a5086d/analysis/v0.64/native/janus_native.cpp)
- [docs/v0.65_report.md](https://github.com/Zylus08/Project-Janus/blob/12fd92f436186348697a009bc597fe7110a5086d/docs/v0.65_report.md)
## RoadVision

Commit: `8353d5166ddb5ff2204dcd644a8bc999cdedbe90`. Review date: 2026-11-09.

- Implementation claim: The evaluator filters ignored ground-truth pixels, accumulates class-pair counts, and computes IoU from true-positive, false-positive, and false-negative totals. Its default averages over classes present in predictions or ground truth.
- Evidence classification: VERIFIED: the confusion-matrix implementation and explicit ignored-label handling exist. DOCUMENTED: a five-scene audit and corruption results are stored in the repository. They have not been reproduced here and must not be described as full-dataset or real-world driving validation.
- Qualification: The model is pretrained, not a newly established architecture. Five selected scenes do not support broad safety or robustness claims. Invalid predictions are clipped into class range by the evaluator, so upstream validation also matters. No autonomous-driving deployment is asserted.

- [src/metrics.py](https://github.com/Zylus08/RoadVision/blob/8353d5166ddb5ff2204dcd644a8bc999cdedbe90/src/metrics.py)
- [src/inference.py](https://github.com/Zylus08/RoadVision/blob/8353d5166ddb5ff2204dcd644a8bc999cdedbe90/src/inference.py)
- [docs/audit_report.md](https://github.com/Zylus08/RoadVision/blob/8353d5166ddb5ff2204dcd644a8bc999cdedbe90/docs/audit_report.md)
- [tests/test_metrics.py](https://github.com/Zylus08/RoadVision/blob/8353d5166ddb5ff2204dcd644a8bc999cdedbe90/tests/test_metrics.py)
## Aerospace Remaining Useful Life

Commit: `934d8de704e1fb93e9362741b2d70e141770e68f`. Review date: 2026-11-09.

- Implementation claim: The inspected loader uses FD001 files and constructs test RUL using the official remaining-life offsets. Scaling is fitted on training records. Targets are capped at 125 cycles, and 30-cycle windows predict the following row. Evaluation is over overlapping windows, not simply the last window of each engine.
- Evidence classification: VERIFIED: sequence preparation, MSE/Adam training, and regression/thresholded classification metrics exist. The current main script imports load_FD001 while the loader defines load_dataset; it also requests lowercase metric keys while the evaluator returns uppercase keys. The current entrypoint is therefore not a reproduced experiment.
- Qualification: The dataset argument is ignored by the inspected loader, so an FD004-named result does not establish FD004 reproduction. There is no NASA score in the inspected evaluator. Published model metrics are withheld pending a corrected, seeded, engine-aware protocol. The repository name does not imply Rolls-Royce collaboration or endorsement.

- [main.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/main.py)
- [src/data_loader.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/data_loader.py)
- [src/preprocessing.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/preprocessing.py)
- [src/sequence_generator.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/sequence_generator.py)
- [src/train.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/train.py)
- [src/evaluate.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/evaluate.py)
## Big Five Conversational Assessment

Commit: `b09a90640dcf81e96c7004b465bcc0594efd5e35`. Review date: 2026-11-09.

- Implementation claim: The public agent uses a prompt, Groq-backed model, and Pydantic output parser. It tracks facet coverage and limits repeated probing. The axis scorer subtracts low-pole from high-pole exemplar embeddings, projects responses onto that direction, and maps the result to a bounded scale.
- Evidence classification: VERIFIED by source inspection: external session state, structured parsing, contrastive exemplar scoring, and transcript persistence exist. A separately audited private revision is not published here and is not represented as a second project.
- Qualification: Exemplar calibration is not population validation. No clinical diagnosis, reliability estimate, or validated psychological inference is established. The public version's client-supplied session identifiers and persistent transcripts require privacy and authorization review before use. Stored participant data was not read or copied.

- [src/agent/interview_agent.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/agent/interview_agent.py)
- [src/embeddings/axis_scorer.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/embeddings/axis_scorer.py)
- [src/db/database.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/db/database.py)
- [app.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/app.py)
## MeshNet

Commit: `23f7a3dd0e3033d86542d4440291a41e5c868772`. Review date: 2026-11-09.

- Implementation claim: The inspected fragmenter emits a four-byte header containing flags, an eight-bit sequence number, and a transfer identifier. It splits payloads to a configured size and handles single-fragment messages separately.
- Evidence classification: VERIFIED: application-layer fragmentation and the module interfaces exist. Device-to-device operation, battery behavior, mesh scale, and cryptographic security were not independently validated in this review.
- Qualification: Physical-device tests are needed across MTUs, packet loss, sequence wraparound, and reconnects. The presence of X3DH and ratchet modules is not a security certification. The inspected LICENSE contains Apache 2.0 text, while API license detection was inconclusive.

- [core/mesh/src/main/kotlin/net/meshnet/core/mesh/ble/PacketFragmenter.kt](https://github.com/Zylus08/MeshNet/blob/23f7a3dd0e3033d86542d4440291a41e5c868772/core/mesh/src/main/kotlin/net/meshnet/core/mesh/ble/PacketFragmenter.kt)
- [README.md](https://github.com/Zylus08/MeshNet/blob/23f7a3dd0e3033d86542d4440291a41e5c868772/README.md)
- [LICENSE](https://github.com/Zylus08/MeshNet/blob/23f7a3dd0e3033d86542d4440291a41e5c868772/LICENSE)
## Fault-tolerant Compute Scheduler

Commit: `445baf9c8a339e81dedce93fbbac7b59230429bd`. Review date: 2026-11-09.

- Implementation claim: The inspected Raft module models terms, votes, log entries, append requests, and leader state. Its own implementation explicitly describes a single-process simulation; persistent state is held in memory.
- Evidence classification: VERIFIED: consensus state structures and simulation-oriented control flow exist. The README's production-quality language is not supported by distributed deployment evidence in this audit.
- Qualification: Single-process simulation does not validate network partitions, durable consensus recovery, or behavior across independent hosts. Dashboard node counts are not a measured cluster deployment.

- [src/control_plane/raft_consensus.py](https://github.com/Zylus08/Fault-tolerant-Compute-Scheduler/blob/445baf9c8a339e81dedce93fbbac7b59230429bd/src/control_plane/raft_consensus.py)
- [src/scheduler/scheduling_algorithms.py](https://github.com/Zylus08/Fault-tolerant-Compute-Scheduler/blob/445baf9c8a339e81dedce93fbbac7b59230429bd/src/scheduler/scheduling_algorithms.py)
- [README.md](https://github.com/Zylus08/Fault-tolerant-Compute-Scheduler/blob/445baf9c8a339e81dedce93fbbac7b59230429bd/README.md)
## Neural-Surrogate Monte Carlo Collision Simulator

Commit: `99574db97977ca93543b023ffa68450d53aa9984`. Review date: 2026-11-09.

- Implementation claim: The physics module computes momentum magnitudes and invariant mass and provides a simplified two-body energy calculation. The training script uses MSE, Adam, shuffled minibatches, and a held-out array for evaluation.
- Evidence classification: VERIFIED: the kinematic functions and surrogate training loop are implemented. No independently reproduced speedup, detector realism, or physical-discovery result is claimed.
- Qualification: The module explicitly leaves full frame transformations and detector noise as future work. Clamping final-state energies is not a general conservation proof for forbidden configurations. Training reproducibility and out-of-distribution validation require further work.

- [particle-collision-simulator/src/physics.py](https://github.com/Zylus08/Neural-Surrogate-Monte-Carlo-Collision-Simulator/blob/99574db97977ca93543b023ffa68450d53aa9984/particle-collision-simulator/src/physics.py)
- [ml/train_surrogate.py](https://github.com/Zylus08/Neural-Surrogate-Monte-Carlo-Collision-Simulator/blob/99574db97977ca93543b023ffa68450d53aa9984/ml/train_surrogate.py)
- [ml/prepare_dataset.py](https://github.com/Zylus08/Neural-Surrogate-Monte-Carlo-Collision-Simulator/blob/99574db97977ca93543b023ffa68450d53aa9984/ml/prepare_dataset.py)
## Resume–JD Semantic Matcher

Commit: `b268ee2fcb7dadb2e6f54c3395bcc491672612d1`. Review date: 2026-11-09.

- Implementation claim: The inspected matcher creates a 384-dimensional FAISS IndexFlatIP, normalizes document and query vectors, and returns nearest-neighbor scores and identifiers.
- Evidence classification: VERIFIED by source inspection: normalized inner-product retrieval is implemented. Ranking quality and hiring validity have not been established.
- Qualification: Similarity is not evidence of job performance or candidate suitability. Document privacy, retrieval evaluation, and input handling remain deployment considerations.

- [matcher.py](https://github.com/Zylus08/resume_jd_match/blob/b268ee2fcb7dadb2e6f54c3395bcc491672612d1/matcher.py)
- [embedder.py](https://github.com/Zylus08/resume_jd_match/blob/b268ee2fcb7dadb2e6f54c3395bcc491672612d1/embedder.py)
- [main.py](https://github.com/Zylus08/resume_jd_match/blob/b268ee2fcb7dadb2e6f54c3395bcc491672612d1/main.py)
## Delivery-risk Modeling

Commit: `a85a7c6630673c8e2759b8e182b76fc00b186fd8`. Review date: 2026-11-09.

- Implementation claim: The main pipeline preprocesses data, trains multiple models including TabNet, evaluates predictions, and invokes SHAP and integrated-gradients explanations.
- Evidence classification: VERIFIED: orchestration for these components exists in main.py. No corporate endorsement or independently validated predictive performance is asserted.
- Qualification: The main pipeline passes X_test and y_test into the TabNet helper as its validation set, which is used for early stopping, then evaluates on those same records. This is not an untouched test estimate. Explanations do not establish causal factors.

- [main.py](https://github.com/Zylus08/Amazon-delivery-AI-project/blob/a85a7c6630673c8e2759b8e182b76fc00b186fd8/main.py)
- [data/preprocess.py](https://github.com/Zylus08/Amazon-delivery-AI-project/blob/a85a7c6630673c8e2759b8e182b76fc00b186fd8/data/preprocess.py)
- [models/train_tabnet.py](https://github.com/Zylus08/Amazon-delivery-AI-project/blob/a85a7c6630673c8e2759b8e182b76fc00b186fd8/models/train_tabnet.py)
## IPS Time-series Experiments

Commit: `8d340b45b82409d33bb860ab16bd8fc549fcb066`. Review date: 2026-11-09.

- Implementation claim: The inspected experiment runner registers PatchTST, TimesNet, NHITS, Prophet, and Chronos wrappers, sets NumPy and PyTorch seeds, and calls split/window utilities across a dataset registry.
- Evidence classification: VERIFIED: model registration and experiment orchestration are implemented. This audit does not reproduce the model rankings.
- Qualification: The runner contains absolute local dataset paths. Portable dataset provisioning, wrapper parity, and split consistency need verification before comparative performance claims.

- [run_experiment.py](https://github.com/Zylus08/IPS/blob/8d340b45b82409d33bb860ab16bd8fc549fcb066/run_experiment.py)
- [utils/data_loader.py](https://github.com/Zylus08/IPS/blob/8d340b45b82409d33bb860ab16bd8fc549fcb066/utils/data_loader.py)
- [models/registry.py](https://github.com/Zylus08/IPS/blob/8d340b45b82409d33bb860ab16bd8fc549fcb066/models/registry.py)
## GPT-2 Architecture Exploration

Commit: `c07656c4cb6725ecd4d99b00b5e061c962ab4170`. Review date: 2026-11-09.

- Implementation claim: CausalSelfAttention projects queries, keys, and values, reshapes them into heads, applies a lower-triangular mask, uses scaled dot-product attention and dropout, then projects the merged heads.
- Evidence classification: VERIFIED: the attention mechanism exists in source. The repository also contains assistant/provider abstractions, but no pretrained-GPT-2 equivalence or independently trained language-model quality is claimed.
- Qualification: Architectural similarity does not establish weight compatibility, benchmark parity, or a new model contribution.

- [transformer/model/attention.py](https://github.com/Zylus08/gpt2/blob/c07656c4cb6725ecd4d99b00b5e061c962ab4170/transformer/model/attention.py)
- [core/agent.py](https://github.com/Zylus08/gpt2/blob/c07656c4cb6725ecd4d99b00b5e061c962ab4170/core/agent.py)
## E-summit 26 App

Commit: `ce3abd9cca8bb20b55031f5cdb4f4b85d571012e`. Review date: 2026-11-09.

- Implementation claim: TicketService queries Firestore, streams tickets by authenticated user, parses a structured QR payload, compares ownership, and marks a ticket as used.
- Evidence classification: VERIFIED: ticket and QR handling exist, with commits attributed to Zylus08 for ticketing and accessibility work. Attendance, production adoption, and security of deployed rules are unverified.
- Qualification: The inspected check-then-update ticket redemption is not a transaction, so concurrent scans need review. Client logic does not substitute for server-side authorization and Firestore rules.

- [lib/core/services/ticket_service.dart](https://github.com/Zylus08/E-summit-26-app/blob/ce3abd9cca8bb20b55031f5cdb4f4b85d571012e/lib/core/services/ticket_service.dart)
- [lib/core/services/accessibility_service.dart](https://github.com/Zylus08/E-summit-26-app/blob/ce3abd9cca8bb20b55031f5cdb4f4b85d571012e/lib/core/services/accessibility_service.dart)
## IIH App

Commit: `01da42a21c6ede33bbe1d30f886c1b8152804037`. Review date: 2026-11-09.

- Implementation claim: The inspected mentor service persists a request to Firestore and attempts an administrator notification through OneSignal.
- Evidence classification: VERIFIED: the request and notification code paths exist. The checked-in service uses placeholder notification configuration, so working delivery is not established.
- Qualification: Privileged notification credentials should not be embedded in a client application. No live backend, delivery, or production use was tested.

- [lib/features/call_mentor/services/mentor_request_service.dart](https://github.com/Zylus08/IIH-app/blob/01da42a21c6ede33bbe1d30f886c1b8152804037/lib/features/call_mentor/services/mentor_request_service.dart)
- [README.md](https://github.com/Zylus08/IIH-app/blob/01da42a21c6ede33bbe1d30f886c1b8152804037/README.md)
## MLSC Timetable Parser

Commit: `cbd082eafd24b290391145cb0399e81c6b41303c`. Review date: 2026-11-09.

- Implementation claim: The parser uses Excelize, discovers batch headers, reads merged-cell day ranges, and extracts subject, faculty, room, and time information using layout heuristics.
- Evidence classification: VERIFIED: spreadsheet-to-lecture parsing is implemented. Compatibility with arbitrary timetable formats is not established.
- Qualification: Fixed header rows and heuristic room/faculty detection make the parser format-dependent. Unsupported layouts can be skipped rather than diagnosed explicitly.

- [internal/parser/excel_parser.go](https://github.com/Zylus08/mlsc-timetable/blob/cbd082eafd24b290391145cb0399e81c6b41303c/internal/parser/excel_parser.go)
- [server.go](https://github.com/Zylus08/mlsc-timetable/blob/cbd082eafd24b290391145cb0399e81c6b41303c/server.go)
## Sama Engine — Maintenance Contributions

Commit: `c2ed9df9dcb4fcaff61fb80e05e5d4225e37cfb6`. Review date: 2026-11-09.

- Implementation claim: The inspected merged changes add issue indexing to the retrieval agent, construct typed knowledge entries, rename a database column to reference_links, and initialize retrieval in the orchestration path.
- Evidence classification: VERIFIED: PR #8 is merged and the reviewed source contains its issue-indexing and schema changes. No independent end-to-end maintenance or retrieval-quality measurement was performed.
- Qualification: The fallback embedding is a one-dimensional Python hash value, not a semantic representation. When an event loop is already running, initialization is scheduled without awaiting completion before the synchronous workflow proceeds. Successful initialization and vector-store compatibility require targeted tests. This is a contribution to a shared project, not sole authorship.

- [scripts/rag_agent.py](https://github.com/Foldinc/sama-engine/blob/c2ed9df9dcb4fcaff61fb80e05e5d4225e37cfb6/scripts/rag_agent.py)
- [scripts/knowledge_base.py](https://github.com/Foldinc/sama-engine/blob/c2ed9df9dcb4fcaff61fb80e05e5d4225e37cfb6/scripts/knowledge_base.py)
- [scripts/orchestration_agent.py](https://github.com/Foldinc/sama-engine/blob/c2ed9df9dcb4fcaff61fb80e05e5d4225e37cfb6/scripts/orchestration_agent.py)


## Additional isolated audit probes

At the pinned commits, two offline probes reproduced specific defects: TradeCore exits 0 and reports all contracts satisfied for an empty benchmarks array; DeepHedge-RL returns put delta 0 for in-the-money inputs at expiry and at zero volatility. Both observations were reproduced on 2026-11-09. They are defect reproductions, not passing upstream correctness suites or performance validations. No market data, provider API, or live service was contacted.

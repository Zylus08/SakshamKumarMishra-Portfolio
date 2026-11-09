# M3 technical audit

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

## Scope of technical inspection

The 24 selected project cases and SleepApnea research note have implementation-level inspection. Priority projects received deeper review of interfaces, correctness, evaluation, and attribution. Other repositories received source samples or metadata/tree/history screening as explicitly recorded in the inventory. No claim is made that all 144 repositories were fully source-audited, all history was read, or upstream CI/benchmarks passed.

## TradeCore

Repository: [Zylus08/TradeCore](https://github.com/Zylus08/TradeCore/tree/fed1e79d7d144a6485055585a42a32a4864b93ea). Tier: Case study. License metadata: MIT. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The inspected matcher applies a templated risk pipeline, scans liquidity for fill-or-kill requests, matches against the opposite book side, and inserts residual limit orders. AVL price levels and pooled orders separate price lookup from order storage.

The risk pipeline evaluates a tuple of rules using a short-circuit fold expression. The matcher contains debug assertions for trade quantities, resting prices, and the conservation of filled plus remaining volume. StaticVector uses inline arrays rather than an unbounded result container.

**Evidence and outcomes.** VERIFIED by source inspection: price-constrained matching, compile-time risk-rule composition, and conservation assertions exist. DOCUMENTED only: allocator timing artifacts and README latency contracts. The contracts are targets, not independently measured P99 results.

**Risks and limits.** The fill-or-kill prescan counts total opposing liquidity without receiving a limit price, whereas the matching loop enforces that price. This can admit a request that cannot be completely filled at its limit. RiskResult contains std::string and long rejection messages, so a universal zero-allocation claim is unsupported. The contract checker can report success when no matching benchmark rows exist. No institutional-readiness claim is made.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 27 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `cmake/GoogleTest.cmake`, `tests`, `tests/CMakeLists.txt`, `tests/unit`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## FlowState

Repository: [Zylus08/FlowState](https://github.com/Zylus08/FlowState/tree/d0410dab812dd51d0603c1d089a4e49f73bddd8b). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The source separates market-data ingestion, features, quote generation, and a local PaperExecutionSimulator. Research modules add synthetic scenarios, queue models, latency experiments, and inventory diagnostics.

The execution model combines a crossing condition with a queue-depth and price-penetration probability. It tracks maker fees, delayed quote eligibility, inventory bounds, and later markouts. These are model assumptions, not reconstructions of an exchange matching engine.

**Evidence and outcomes.** VERIFIED by source inspection: simulated fill records contain inventory, fee, edge, and markout fields. The default configuration includes quote latency and an inventory limit. DOCUMENTED experiment reports are available, but no live-capital performance or independent return estimate is asserted.

**Risks and limits.** The default maker fee is zero, so reported net performance requires inspecting the configuration used for each run. Queue position and penetration remain approximations. Historical, synthetic, and paper execution must be compared separately; a live data feed does not establish live trading.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 4 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `tests`, `tests/test_experiments.py`, `tests/test_invariants.py`, `tests/test_phase3.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## RiskLab

Repository: [Zylus08/RiskLab](https://github.com/Zylus08/RiskLab/tree/971422295d94772d7f792753a5ba889da204ce74). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Python modules separate signals, volatility scaling, backtesting, metrics, tail estimation, and stress testing. A separate C++ Monte Carlo extension is present; it was not loaded or benchmarked in this review.

The backtester multiplies supplied signal and volatility exposure, computes turnover from position differences, and deducts basis-point costs. Its contract expects signals and scaling to be shifted before entry.

**Evidence and outcomes.** VERIFIED: 13 existing tests passed in an isolated copy on 9 November 2026, covering backtest columns/accounting, signal prefix stability, volatility, and metrics. This is a selected offline subset, not a full research reproduction or C++ speed benchmark.

**Risks and limits.** The backtester removes neutral-signal dates before calculating turnover and wealth. Exit costs and calendar-consistent benchmark comparison therefore need review. The tests that passed do not establish profitable out-of-sample performance.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 10 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `notebooks/02_Main_Backtest.ipynb`, `src/backtest.py`, `src/stress_testing.py`, `tests`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Regime-Shift

Repository: [Zylus08/Regime-Shift](https://github.com/Zylus08/Regime-Shift/tree/f1f4ea017b78db07e7faed924d34711e5c34a81a). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Feature preparation, HMM fitting, regime estimation, allocation, rebalancing, and reporting are separate modules. A rolling or expanding walk-forward validator refits the scaler and HMM for each training fold.

Training-only scaler fitting is implemented. However, the entire test window is passed to Viterbi decoding and forward-backward posterior inference. The portfolio simulator then applies date-specific weights to that same date's returns.

**Evidence and outcomes.** VERIFIED by source inspection: fold-specific fitting and overlap removal exist. The inspected inference/accounting path does not justify the report's leakage-free out-of-sample claim. Published return tables are not repeated here as validated outcomes.

**Risks and limits.** Future observations within a test sequence can affect smoothed state estimates. Same-day signal/return timing also needs correction or explicit justification. Failed folds are skipped after logging, so the successful-fold denominator matters. Fixed-universe and capacity assumptions remain research limitations.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## DeepHedge-RL

Repository: [Zylus08/DeepHedge-RL](https://github.com/Zylus08/DeepHedge-RL/tree/e85e7adcfe413444fdbfe988a6c3c6884493fa0e). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Training and evaluation scripts instantiate options environments and Stable-Baselines agents. The walk-forward harness supports PPO, A2C, and MaskablePPO with explicit calendar ranges.

The inspected harness defines five expanding training windows followed by annual evaluation periods from 2019 through 2023. It records transaction-cost, slippage, capital, lot, strike, and reward configuration alongside results. Option values and Greeks are calculated with Black–Scholes rather than replayed option quotes. Volatility comes from lagged VIX with a multiplier or realized-volatility fallbacks.

**Evidence and outcomes.** VERIFIED: the expanding-window harness and action-mask evaluation path are implemented. Model training and market-data provenance were not reproduced in this portfolio audit. Stored training artifacts do not establish actual trading returns.

**Risks and limits.** Repeated evaluation episodes are not automatically independent market samples. Option pricing assumptions, feature causality, cost calibration, and episode overlap need to accompany any quantitative conclusion. No live deployment, realized profit, or superiority claim is made. The inspected near-expiry and near-zero-volatility branches return zero put delta even for an in-the-money put. Reset also samples with global NumPy randomness rather than the Gymnasium seeded generator; reproducibility needs explicit verification.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 35 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `A2C_test.py`, `Mask_PPO_explainability_test.py`, `Mask_PPO_test.py`, `PPO_test.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Satoshi_Flow

Repository: [Zylus08/Satoshi_Flow](https://github.com/Zylus08/Satoshi_Flow/tree/0fe06286b3b86263c184c6b543b46d0fd7bd396f). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Indicators and signals feed an event-driven backtester. Portfolio accounting tracks cash and holdings; a risk manager sizes positions and calculates stop levels.

The loop executes pending signals at the following open, applies directional slippage and fees, and checks the low against a previously established stop. Gap-down execution uses the lower of open and stop before slippage. Trailing stops update after that check.

**Evidence and outcomes.** VERIFIED by source inspection: the described ordering and cost hooks are implemented. The repository includes validation and robustness artifacts, but their returns have not been independently reproduced here.

**Risks and limits.** OHLC bars cannot identify every intrabar path or exchange fill. Liquidity, market impact, data selection, and parameter selection remain important assumptions. This is historical simulation, not evidence of paper or live capital deployment.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 3 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `backtester`, `backtester/__init__.py`, `backtester/engine.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## AQC

Repository: [Zylus08/AQC](https://github.com/Zylus08/AQC/tree/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The BacktestEngine coordinates market, signal, order, and fill events. A separate PaperBroker registers orders, checks available market context, simulates partial fills, and updates order state.

The backtester preloads market columns into NumPy arrays. PaperBroker delegates fills to a simulator and charges commission; the inspected call supplies a fixed daily-volatility assumption and a fallback volume when reported volume is absent.

**Evidence and outcomes.** VERIFIED by source inspection: event orchestration and paper-broker state transitions exist. Directory names such as institutional, deployment, and live_capital do not prove institutional use or real-money trading.

**Risks and limits.** Bar-by-bar iteration alone does not guarantee causality when a strategy can access data arrays. Same-bar fill timing, missing-volume defaults, fixed volatility, multiple-testing controls, and calibration require scrutiny before performance interpretation.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 58 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `aqc/backtester`, `aqc/backtester/__init__.py`, `aqc/backtester/broker.py`, `aqc/backtester/engine.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Thermodynamic Evolution

Repository: [CV-Code-Vitals/Thermodynamic-Evolution-UCS503](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/tree/d5ae3189dcbcc34b1261f9a5d16145006c6144bb). Tier: Flagship. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The Go backend separates repository intelligence, diagnostics, remediation planning, and execution. Semantic analysis adds call resolution, dataflow, resource-lifecycle reasoning, and cached function summaries. Rust AST components and an administrative frontend support the broader system.

Function summaries encode parameter-to-return taint relationships, resource acquisition/release effects, and error behavior. Summary entries record source hashes and completeness. The executor checks task eligibility and approval before creating a workspace and choosing a registered strategy. The Rust engine computes a weighted structural score from cyclomatic complexity, maximum nesting, log AST size, and concurrency primitives. The Go annealer requires configured candidate and energy evaluators before starting.

**Evidence and outcomes.** VERIFIED by source inspection: semantic summaries, eligibility checks, isolated execution orchestration, and Docker containment arguments are implemented. DOCUMENTED: the latest Phase 1.1 report describes counterfactual and adversarial verification, bounded recursion, and reused evaluation corpora. Those experiments were not rerun here.

**Risks and limits.** The latest inspected report explicitly limits the milestone to verification and does not authorize general autonomous remediation. Polymorphic dispatch, ownership escape, multi-hop aliases, and corpus reuse constrain generalization. Small fixture suites do not establish universal diagnostic accuracy or optimization superiority.

**Attribution.** This is collaborative work. Merged pull requests #26 and #27 are authored by Zylus08; inspected commits attribute semantic-analysis and verification changes to Saksham Mishra. That evidence supports those contributions, not sole ownership of every subsystem.

**Test/CI presence.** 230 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `.github/workflows/check-frontend.yml`, `.github/workflows/ci-go.yml`, `.github/workflows/cleanup-analysis.yml`, `.github/workflows/deploy-analysis.yml`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Kamish

Repository: [abhinav29102005/kamish](https://github.com/abhinav29102005/kamish/tree/5682594cb50450c66bad839de1d30ceccc4b4ac4). Tier: Flagship. License metadata: Apache-2.0. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The Rust workspace separates policy, enforcement, append-only storage, ownership, outboxes, routing, and audit records. A gateway, CLI, TypeScript SDK, and frontend expose the system. Earlier research used the name Hydra Stream; this existing route is retained for continuity.

The inspected enforcement function evaluates ingress, replication, export, fetch, and promotion operations against class and destination rules. Denials and accepted operations are recorded through the audit layer.

**Evidence and outcomes.** VERIFIED: enforcement decisions exist in source, and Zylus08's PR #1 was merged. DOCUMENTED: the PR handoff records Rust, SDK, frontend, and clean-room checks. These counts describe that repository's run, not a rerun by this portfolio audit.

**Risks and limits.** The inspected handoff explicitly does not verify external etcd, KMS, independent witnesses, a production browser deployment, or persistent multi-region rollout. Cryptographic policy checks do not by themselves establish legal compliance, zero data loss, or production readiness.

**Attribution.** Saksham's merged PR and commit history document gateway, CLI packaging, policy-trust, static-path containment, and release-evidence work. Kamish remains a collaborative project; the portfolio does not attribute the complete platform to one author.

**Test/CI presence.** 143 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `.github/workflows/ci.yml`, `.github/workflows/release-dry-run.yml`, `audit/application_resolution_2026-11-01/results/frontend-tests.txt`, `audit/application_resolution_2026-11-01/results/rust-tests.txt`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Project Janus

Repository: [Zylus08/Project-Janus](https://github.com/Zylus08/Project-Janus/tree/12fd92f436186348697a009bc597fe7110a5086d). Tier: Flagship. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The repository includes a Python baseline and later native C++ research engines. Native NNUE components support accumulator refresh, quantized evaluation, and optional AVX2 paths. The latest inspected native engine exposes neural evaluation as an option while retaining a classical default.

The native v0.64 source implements phase-dependent blending between classical and neural scores. Its default disables neural evaluation. The v0.65 report documents factorial comparisons, endgame evaluation, numerical parity checks, and a distinction between frozen classical and neural research baselines.

**Evidence and outcomes.** VERIFIED by source inspection: optional neural evaluation, accumulator-based native evaluation, and phase-tapered blending exist. DOCUMENTED only: tournament estimates, latency numbers, and manuscript-readiness conclusions in repository reports. No official Elo rating or accepted publication is claimed.

**Risks and limits.** The report's exploratory comparison against the classical baseline includes uncertainty spanning no improvement. An older README describes only the initial baseline and is not a complete account of the pinned tree. Reproduction must identify a specific native version, model, corpus, and budget.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 161 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `analysis/v0.45/ITERATION_INVARIANCE_TESTS.md`, `analysis/v0.50/tests`, `analysis/v0.50/tests/run_differential_search_benchmark.py`, `analysis/v0.50/tests/run_native_performance.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## RoadVision

Repository: [Zylus08/RoadVision](https://github.com/Zylus08/RoadVision/tree/8353d5166ddb5ff2204dcd644a8bc999cdedbe90). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Inference, video processing, corruptions, visualization, and confusion-matrix metrics are separate modules. A Streamlit interface brings image, video, and evaluation workflows together.

The evaluator filters ignored ground-truth pixels, accumulates class-pair counts, and computes IoU from true-positive, false-positive, and false-negative totals. Its default averages over classes present in predictions or ground truth.

**Evidence and outcomes.** VERIFIED: the confusion-matrix implementation and explicit ignored-label handling exist. DOCUMENTED: a five-scene audit and corruption results are stored in the repository. They have not been reproduced here and must not be described as full-dataset or real-world driving validation.

**Risks and limits.** The model is pretrained, not a newly established architecture. Five selected scenes do not support broad safety or robustness claims. Invalid predictions are clipped into class range by the evaluator, so upstream validation also matters. No autonomous-driving deployment is asserted.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 10 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `scripts/robustness_test.py`, `scripts/smoke_test_deliverables.py`, `scripts/test_download_model.py`, `scripts/test_torchvision_model.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Aerospace Remaining Useful Life

Repository: [Zylus08/Rolls-Royce-Aerospace-RUL](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/tree/934d8de704e1fb93e9362741b2d70e141770e68f). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Separate modules load data, normalize features, build engine-wise windows, train models, and evaluate predictions. Model checkpoints and result files are present even though a top-level README is absent.

The inspected loader uses FD001 files and constructs test RUL using the official remaining-life offsets. Scaling is fitted on training records. Targets are capped at 125 cycles, and 30-cycle windows predict the following row. Evaluation is over overlapping windows, not simply the last window of each engine.

**Evidence and outcomes.** VERIFIED: sequence preparation, MSE/Adam training, and regression/thresholded classification metrics exist. The current main script imports load_FD001 while the loader defines load_dataset; it also requests lowercase metric keys while the evaluator returns uppercase keys. The current entrypoint is therefore not a reproduced experiment.

**Risks and limits.** The dataset argument is ignored by the inspected loader, so an FD004-named result does not establish FD004 reproduction. There is no NASA score in the inspected evaluator. Published model metrics are withheld pending a corrected, seeded, engine-aware protocol. The repository name does not imply Rolls-Royce collaboration or endorsement.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 5 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `Dataset/test_FD001.txt`, `Dataset/test_FD002.txt`, `Dataset/test_FD003.txt`, `Dataset/test_FD004.txt`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Big Five Conversational Assessment

Repository: [Zylus08/big5-chatbot](https://github.com/Zylus08/big5-chatbot/tree/b09a90640dcf81e96c7004b465bcc0594efd5e35). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

A FastAPI application connects survey routes, an interview session, structured LLM output, an embedding-based comparator, and SQLite persistence. Conversation history and facet coverage are maintained outside the model chain.

The public agent uses a prompt, Groq-backed model, and Pydantic output parser. It tracks facet coverage and limits repeated probing. The axis scorer subtracts low-pole from high-pole exemplar embeddings, projects responses onto that direction, and maps the result to a bounded scale.

**Evidence and outcomes.** VERIFIED by source inspection: external session state, structured parsing, contrastive exemplar scoring, and transcript persistence exist. A separately audited private revision is not published here and is not represented as a second project.

**Risks and limits.** Exemplar calibration is not population validation. No clinical diagnosis, reliability estimate, or validated psychological inference is established. The public version's client-supplied session identifiers and persistent transcripts require privacy and authorization review before use. Stored participant data was not read or copied.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 1 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `big-five-personality-test.pdf`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## MeshNet

Repository: [Zylus08/MeshNet](https://github.com/Zylus08/MeshNet/tree/23f7a3dd0e3033d86542d4440291a41e5c868772). Tier: Case study. License metadata: NOASSERTION. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The Kotlin multi-module layout separates transport, routing, protocol, storage, cryptography, and application features. The BLE layer includes fragmentation and reassembly components.

The inspected fragmenter emits a four-byte header containing flags, an eight-bit sequence number, and a transfer identifier. It splits payloads to a configured size and handles single-fragment messages separately.

**Evidence and outcomes.** VERIFIED: application-layer fragmentation and the module interfaces exist. Device-to-device operation, battery behavior, mesh scale, and cryptographic security were not independently validated in this review.

**Risks and limits.** Physical-device tests are needed across MTUs, packet loss, sequence wraparound, and reconnects. The presence of X3DH and ratchet modules is not a security certification. The inspected LICENSE contains Apache 2.0 text, while API license detection was inconclusive.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 47 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `.github/workflows/ci.yml`, `core/crypto/src/test`, `core/crypto/src/test/kotlin`, `core/crypto/src/test/kotlin/net`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Fault-tolerant Compute Scheduler

Repository: [Zylus08/Fault-tolerant-Compute-Scheduler](https://github.com/Zylus08/Fault-tolerant-Compute-Scheduler/tree/445baf9c8a339e81dedce93fbbac7b59230429bd). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Python modules separate control-plane logic, simulated nodes, execution, heartbeats, retries, storage, and API routes. The frontend uses Next.js and a three-dimensional cluster view.

The inspected Raft module models terms, votes, log entries, append requests, and leader state. Its own implementation explicitly describes a single-process simulation; persistent state is held in memory.

**Evidence and outcomes.** VERIFIED: consensus state structures and simulation-oriented control flow exist. The README's production-quality language is not supported by distributed deployment evidence in this audit.

**Risks and limits.** Single-process simulation does not validate network partitions, durable consensus recovery, or behavior across independent hosts. Dashboard node counts are not a measured cluster deployment.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 1 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `src/utils/load_test.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Neural-Surrogate Monte Carlo Collision Simulator

Repository: [Zylus08/Neural-Surrogate-Monte-Carlo-Collision-Simulator](https://github.com/Zylus08/Neural-Surrogate-Monte-Carlo-Collision-Simulator/tree/99574db97977ca93543b023ffa68450d53aa9984). Tier: Case study. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

NumPy-based kinematics and event simulation feed a dataset pipeline. A PyTorch surrogate trains on saved arrays, and a dashboard presents simulations and results.

The physics module computes momentum magnitudes and invariant mass and provides a simplified two-body energy calculation. The training script uses MSE, Adam, shuffled minibatches, and a held-out array for evaluation.

**Evidence and outcomes.** VERIFIED: the kinematic functions and surrogate training loop are implemented. No independently reproduced speedup, detector realism, or physical-discovery result is claimed.

**Risks and limits.** The module explicitly leaves full frame transformations and detector noise as future work. Clamping final-state energies is not a general conservation proof for forbidden configurations. Training reproducibility and out-of-distribution validation require further work.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 2 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `ml/data/X_test.npy`, `ml/data/y_test.npy`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Resume–JD Semantic Matcher

Repository: [Zylus08/resume_jd_match](https://github.com/Zylus08/resume_jd_match/tree/b268ee2fcb7dadb2e6f54c3395bcc491672612d1). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The project explores ranking résumé text against a job-description query.

The inspected matcher creates a 384-dimensional FAISS IndexFlatIP, normalizes document and query vectors, and returns nearest-neighbor scores and identifiers.

**Evidence and outcomes.** VERIFIED by source inspection: normalized inner-product retrieval is implemented. Ranking quality and hiring validity have not been established.

**Risks and limits.** Similarity is not evidence of job performance or candidate suitability. Document privacy, retrieval evaluation, and input handling remain deployment considerations.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Delivery-risk Modeling

Repository: [Zylus08/Amazon-delivery-AI-project](https://github.com/Zylus08/Amazon-delivery-AI-project/tree/a85a7c6630673c8e2759b8e182b76fc00b186fd8). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

The repository explores prediction and explanation for delivery-related records.

The main pipeline preprocesses data, trains multiple models including TabNet, evaluates predictions, and invokes SHAP and integrated-gradients explanations.

**Evidence and outcomes.** VERIFIED: orchestration for these components exists in main.py. No corporate endorsement or independently validated predictive performance is asserted.

**Risks and limits.** The main pipeline passes X_test and y_test into the TabNet helper as its validation set, which is used for early stopping, then evaluates on those same records. This is not an untouched test estimate. Explanations do not establish causal factors.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## IPS Time-series Experiments

Repository: [Zylus08/IPS](https://github.com/Zylus08/IPS/tree/8d340b45b82409d33bb860ab16bd8fc549fcb066). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Forecasting comparisons need consistent data splits, horizons, metrics, and compute conditions.

The inspected experiment runner registers PatchTST, TimesNet, NHITS, Prophet, and Chronos wrappers, sets NumPy and PyTorch seeds, and calls split/window utilities across a dataset registry.

**Evidence and outcomes.** VERIFIED: model registration and experiment orchestration are implemented. This audit does not reproduce the model rankings.

**Risks and limits.** The runner contains absolute local dataset paths. Portable dataset provisioning, wrapper parity, and split consistency need verification before comparative performance claims.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## GPT-2 Architecture Exploration

Repository: [Zylus08/gpt2](https://github.com/Zylus08/gpt2/tree/c07656c4cb6725ecd4d99b00b5e061c962ab4170). Tier: Experiment. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Implementing the attention mechanism directly makes its masking and tensor transformations easier to study.

CausalSelfAttention projects queries, keys, and values, reshapes them into heads, applies a lower-triangular mask, uses scaled dot-product attention and dropout, then projects the merged heads.

**Evidence and outcomes.** VERIFIED: the attention mechanism exists in source. The repository also contains assistant/provider abstractions, but no pretrained-GPT-2 equivalence or independently trained language-model quality is claimed.

**Risks and limits.** Architectural similarity does not establish weight compatibility, benchmark parity, or a new model contribution.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## E-summit 26 App

Repository: [Zylus08/E-summit-26-app](https://github.com/Zylus08/E-summit-26-app/tree/ce3abd9cca8bb20b55031f5cdb4f4b85d571012e). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

An event app brings schedules, ticket access, and participant-facing information into one mobile interface.

TicketService queries Firestore, streams tickets by authenticated user, parses a structured QR payload, compares ownership, and marks a ticket as used.

**Evidence and outcomes.** VERIFIED: ticket and QR handling exist, with commits attributed to Zylus08 for ticketing and accessibility work. Attendance, production adoption, and security of deployed rules are unverified.

**Risks and limits.** The inspected check-then-update ticket redemption is not a transaction, so concurrent scans need review. Client logic does not substitute for server-side authorization and Firestore rules.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 6 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `ios/RunnerTests`, `ios/RunnerTests/RunnerTests.swift`, `macos/RunnerTests`, `macos/RunnerTests/RunnerTests.swift`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## IIH App

Repository: [Zylus08/IIH-app](https://github.com/Zylus08/IIH-app/tree/01da42a21c6ede33bbe1d30f886c1b8152804037). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Participants need a way to request mentor support and access event information.

The inspected mentor service persists a request to Firestore and attempts an administrator notification through OneSignal.

**Evidence and outcomes.** VERIFIED: the request and notification code paths exist. The checked-in service uses placeholder notification configuration, so working delivery is not established.

**Risks and limits.** Privileged notification credentials should not be embedded in a client application. No live backend, delivery, or production use was tested.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** 6 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `ios/RunnerTests`, `ios/RunnerTests/RunnerTests.swift`, `macos/RunnerTests`, `macos/RunnerTests/RunnerTests.swift`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## MLSC Timetable Parser

Repository: [Zylus08/mlsc-timetable](https://github.com/Zylus08/mlsc-timetable/tree/cbd082eafd24b290391145cb0399e81c6b41303c). Tier: Archive. License metadata: not established from API metadata. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

Institutional spreadsheets often encode schedules through merged cells and visual layout rather than normalized data.

The parser uses Excelize, discovers batch headers, reads merged-cell day ranges, and extracts subject, faculty, room, and time information using layout heuristics.

**Evidence and outcomes.** VERIFIED: spreadsheet-to-lecture parsing is implemented. Compatibility with arbitrary timetable formats is not established.

**Risks and limits.** Fixed header rows and heuristic room/faculty detection make the parser format-dependent. Unsupported layouts can be skipped rather than diagnosed explicitly.

**Attribution.** Matching user-author commits were found in the sampled pinned history; this does not establish sole authorship.

**Test/CI presence.** No test/workflow-named paths found in the inspected tree; this is a path-based screen, not proof that all validation is absent. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Sama Engine — Maintenance Contributions

Repository: [Foldinc/sama-engine](https://github.com/Foldinc/sama-engine/tree/c2ed9df9dcb4fcaff61fb80e05e5d4225e37cfb6). Tier: Archive. License metadata: MIT. A public repository is not itself a redistribution license; this portfolio paraphrases and links instead of copying implementation.

A maintenance workflow needs to pass analysis findings into its knowledge and retrieval components.

The inspected merged changes add issue indexing to the retrieval agent, construct typed knowledge entries, rename a database column to reference_links, and initialize retrieval in the orchestration path.

**Evidence and outcomes.** VERIFIED: PR #8 is merged and the reviewed source contains its issue-indexing and schema changes. No independent end-to-end maintenance or retrieval-quality measurement was performed.

**Risks and limits.** The fallback embedding is a one-dimensional Python hash value, not a semantic representation. When an event loop is already running, initialization is scheduled without awaiting completion before the synchronous workflow proceeds. Successful initialization and vector-store compatibility require targeted tests. This is a contribution to a shared project, not sole authorship.

**Attribution.** Zylus08 authored merged pull requests #2, #7, and #8. This entry focuses on the inspected #8 patch and its presence in the reviewed default-branch source. PR #12 was unmerged at review; its proposed work is not presented as an upstream release.

**Test/CI presence.** 16 test/workflow-named paths found in the pinned tree; presence is not passing status. Examples: `.github/workflows/ai-maintain.yml`, `scripts/comprehensive_tests.py`, `scripts/run_test.py`, `scripts/test_agent.py`. Upstream execution was not performed except the isolated RiskLab subset documented below.

Evidence: [claim ledger](M3-CLAIM-PROVENANCE.md).

## Reproduced upstream checks

RiskLab pinned `971422295d94772d7f792753a5ba889da204ce74`: four isolated existing modules (`test_backtest`, `test_no_lookahead`, `test_volatility`, `test_metrics`) ran with pytest plugin autoload disabled and no network access required. **13 passed in 0.88 seconds.** This does not validate all backtest assumptions, the complete repository, or C++ performance. Training workloads, market feeds, LLM providers, GPU jobs, and mail-sending applications were not executed.

## Other inspected public source

- **finger-counter**: Source inspected: MediaPipe landmarks and orientation-sensitive finger heuristics; small educational demo, excluded from curated catalogue.
- **vcf-maker**: Source inspected: spreadsheet-to-vCard conversion with fixed column names and India-specific phone normalization; narrow utility, excluded.
- **practical-task1**: Source inspected: educational hashing, mining, and simplified consensus simulation; not a blockchain deployment.
- **helmet-main**: Source inspected: short Ultralytics training/prediction wrappers; referenced dataset/model/video absent from tree. Excluded pending substantive reproducible evidence.
- **aircraft-dashboard**: Source inspected: related RUL visualization; random confidence display and hard-coded comparison values are not uncertainty estimates. Not selected as a separate project.
- **ti-talks**: Partial source inspection: localhost authentication demo; insufficient scope for a case study.
- **casequest-25**: Source inspected: mail-sending backend needs validation, escaping, and abuse controls. Not executed; excluded pending security review.
- **dbms-project**: Source inspected: plaintext password handling and client-supplied authority identifiers; excluded from public project selection despite merged contribution evidence.
- **quantstorm-iitd**: Fork/history screening: inspected default branch has no Zylus08 author match; local later commits are upstream-authored. Do not claim ownership or alpha.
- **visdom**: PR #1094 inspected: unmerged PlotPane change. Includes export handling but removes prior visibility/zoom preservation; not represented as released upstream work. Contribution retained in audit only.
- **ai-interview-backend**: PR #3 inspected: unmerged API cleanup and audio/video proposal. No validated behavioral inference or cheating-detection claim; not an upstream release. Manual security and attribution review before public case study.
- **ratan-tata-innovation-hub-hack**: User-authored frontend commit identified; full implementation and collaborative scope require manual review before a separate case study.
- **sleepapnea**: Selected as the EEG research note only; fork attribution retained and earlier experimental rankings explicitly qualified.
- **udhaari**: Source sample inspected: single-page student-finance interface; no personal authorship established by screened default history. Excluded.
- **cognito**: Source sample inspected: video/text processing backend; no personal authorship established by screened default history. Excluded.
- **valentine**: Small static personal interaction site; tree/history screened, excluded from professional catalogue.

## Shared-project attribution

- [Zylus08/Project-Janus #5](https://github.com/Zylus08/Project-Janus/pull/5): authored by Zylus08, merged. Head `6500b3f84b432a483685e8c0d0f3e264c685af8c`.
- [abhinav29102005/kamish #1](https://github.com/abhinav29102005/kamish/pull/1): authored by Zylus08, merged. Head `29731e1d148447eb6e6836c1748cb127d594ca7f`.
- [CV-Code-Vitals/Thermodynamic-Evolution-UCS503 #27](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/pull/27): authored by Zylus08, merged. Head `5e7f0b6460d0576f07a72911ee38afe41ce1112f`.
- [Zylus08/Project-Janus #4](https://github.com/Zylus08/Project-Janus/pull/4): authored by Zylus08, merged. Head `f6025c33e714aafd6da881941e2ecf7f5bd5015e`.
- [CV-Code-Vitals/Thermodynamic-Evolution-UCS503 #26](https://github.com/CV-Code-Vitals/Thermodynamic-Evolution-UCS503/pull/26): authored by Zylus08, merged. Head `2166d222e75d6daae058cbb39d371f73531186d5`.
- [Zylus08/Project-Janus #3](https://github.com/Zylus08/Project-Janus/pull/3): authored by Zylus08, merged. Head `fd2589ea39152a5964a0a4c73a3ea9283161b598`.
- [Zylus08/Project-Janus #2](https://github.com/Zylus08/Project-Janus/pull/2): authored by Zylus08, merged. Head `41f407db7ab06658d9c05ac3017e36c361b255b6`.
- [Zylus08/Project-Janus #1](https://github.com/Zylus08/Project-Janus/pull/1): authored by Zylus08, merged. Head `716bac15016dcbdb315818568b4831c394adfd92`.
- [AdityaGulalia/dbms-project #1](https://github.com/AdityaGulalia/dbms-project/pull/1): authored by Zylus08, merged. Head `91b463842fe19de9540aff23656d932c790f9404`.
- [Foldinc/sama-engine #12](https://github.com/Foldinc/sama-engine/pull/12): authored by Zylus08, unmerged at review. Head `a2556f995a7d69a7d5d4c4e517d1de57c440dddf`.
- [fossasia/visdom #1094](https://github.com/fossasia/visdom/pull/1094): authored by Zylus08, unmerged at review. Head `33a5e3a119f9a28d75868c78ebfd48fd8c91baa9`.
- [Foldinc/sama-engine #8](https://github.com/Foldinc/sama-engine/pull/8): authored by Zylus08, merged. Head `767bc30f1246df2393ecbeaf20334365e5cb9298`.
- [Foldinc/sama-engine #7](https://github.com/Foldinc/sama-engine/pull/7): authored by Zylus08, merged. Head `c44a97652d1712c8e1466f848ccef19e31ed06a0`.
- [Foldinc/sama-engine #2](https://github.com/Foldinc/sama-engine/pull/2): authored by Zylus08, merged. Head `8d7b0ad6894a74aa45ee9178e2535c2677c55bb8`.
- [rahat15/AI-Interview-backend #3](https://github.com/rahat15/AI-Interview-backend/pull/3): authored by Zylus08, unmerged at review. Head `7be1f3f75a3c2994f0c076f51366d73917718adf`.

## Private coverage

Private repositories were read under explicit authorization. Their source, experiment details, documents, datasets, credentials, and implementation findings are withheld from these public reports. This is an intentional publication boundary, not an assertion that private work lacks merit. The inventory records access gaps without disclosing private content.


## Additional isolated audit probes

At the pinned commits, two offline probes reproduced specific defects: TradeCore exits 0 and reports all contracts satisfied for an empty benchmarks array; DeepHedge-RL returns put delta 0 for in-the-money inputs at expiry and at zero volatility. Both observations were reproduced on 2026-11-09. They are defect reproductions, not passing upstream correctness suites or performance validations. No market data, provider API, or live service was contacted.

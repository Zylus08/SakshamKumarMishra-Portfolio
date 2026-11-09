# M3 quantitative finance audit

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

## Evaluation standard

A walk-forward filename is not evidence of causal out-of-sample inference. Separate training, model selection, and final testing; use information available at decision time; account for fees, slippage, liquidity, market impact, and selection bias. Recorded simulated PnL is not realized profit. This audit does not make financial recommendations.

## TradeCore

[fed1e79d7d14](https://github.com/Zylus08/TradeCore/tree/fed1e79d7d144a6485055585a42a32a4864b93ea)

The risk pipeline evaluates a tuple of rules using a short-circuit fold expression. The matcher contains debug assertions for trade quantities, resting prices, and the conservation of filled plus remaining volume. StaticVector uses inline arrays rather than an unbounded result container.

**Observed:** VERIFIED by source inspection: price-constrained matching, compile-time risk-rule composition, and conservation assertions exist. DOCUMENTED only: allocator timing artifacts and README latency contracts. The contracts are targets, not independently measured P99 results.

**Validity limits:** The fill-or-kill prescan counts total opposing liquidity without receiving a limit price, whereas the matching loop enforces that price. This can admit a request that cannot be completely filled at its limit. RiskResult contains std::string and long rejection messages, so a universal zero-allocation claim is unsupported. The contract checker can report success when no matching benchmark rows exist. No institutional-readiness claim is made.

## FlowState

[d0410dab812d](https://github.com/Zylus08/FlowState/tree/d0410dab812dd51d0603c1d089a4e49f73bddd8b)

The execution model combines a crossing condition with a queue-depth and price-penetration probability. It tracks maker fees, delayed quote eligibility, inventory bounds, and later markouts. These are model assumptions, not reconstructions of an exchange matching engine.

**Observed:** VERIFIED by source inspection: simulated fill records contain inventory, fee, edge, and markout fields. The default configuration includes quote latency and an inventory limit. DOCUMENTED experiment reports are available, but no live-capital performance or independent return estimate is asserted.

**Validity limits:** The default maker fee is zero, so reported net performance requires inspecting the configuration used for each run. Queue position and penetration remain approximations. Historical, synthetic, and paper execution must be compared separately; a live data feed does not establish live trading.

## RiskLab

[971422295d94](https://github.com/Zylus08/RiskLab/tree/971422295d94772d7f792753a5ba889da204ce74)

The backtester multiplies supplied signal and volatility exposure, computes turnover from position differences, and deducts basis-point costs. Its contract expects signals and scaling to be shifted before entry.

**Observed:** VERIFIED: 13 existing tests passed in an isolated copy on 9 November 2026, covering backtest columns/accounting, signal prefix stability, volatility, and metrics. This is a selected offline subset, not a full research reproduction or C++ speed benchmark.

**Validity limits:** The backtester removes neutral-signal dates before calculating turnover and wealth. Exit costs and calendar-consistent benchmark comparison therefore need review. The tests that passed do not establish profitable out-of-sample performance.

## Regime-Shift

[f1f4ea017b78](https://github.com/Zylus08/Regime-Shift/tree/f1f4ea017b78db07e7faed924d34711e5c34a81a)

Training-only scaler fitting is implemented. However, the entire test window is passed to Viterbi decoding and forward-backward posterior inference. The portfolio simulator then applies date-specific weights to that same date's returns.

**Observed:** VERIFIED by source inspection: fold-specific fitting and overlap removal exist. The inspected inference/accounting path does not justify the report's leakage-free out-of-sample claim. Published return tables are not repeated here as validated outcomes.

**Validity limits:** Future observations within a test sequence can affect smoothed state estimates. Same-day signal/return timing also needs correction or explicit justification. Failed folds are skipped after logging, so the successful-fold denominator matters. Fixed-universe and capacity assumptions remain research limitations.

## DeepHedge-RL

[e85e7adcfe41](https://github.com/Zylus08/DeepHedge-RL/tree/e85e7adcfe413444fdbfe988a6c3c6884493fa0e)

The inspected harness defines five expanding training windows followed by annual evaluation periods from 2019 through 2023. It records transaction-cost, slippage, capital, lot, strike, and reward configuration alongside results. Option values and Greeks are calculated with Black–Scholes rather than replayed option quotes. Volatility comes from lagged VIX with a multiplier or realized-volatility fallbacks.

**Observed:** VERIFIED: the expanding-window harness and action-mask evaluation path are implemented. Model training and market-data provenance were not reproduced in this portfolio audit. Stored training artifacts do not establish actual trading returns.

**Validity limits:** Repeated evaluation episodes are not automatically independent market samples. Option pricing assumptions, feature causality, cost calibration, and episode overlap need to accompany any quantitative conclusion. No live deployment, realized profit, or superiority claim is made. The inspected near-expiry and near-zero-volatility branches return zero put delta even for an in-the-money put. Reset also samples with global NumPy randomness rather than the Gymnasium seeded generator; reproducibility needs explicit verification.

## Satoshi_Flow

[0fe06286b3b8](https://github.com/Zylus08/Satoshi_Flow/tree/0fe06286b3b86263c184c6b543b46d0fd7bd396f)

The loop executes pending signals at the following open, applies directional slippage and fees, and checks the low against a previously established stop. Gap-down execution uses the lower of open and stop before slippage. Trailing stops update after that check.

**Observed:** VERIFIED by source inspection: the described ordering and cost hooks are implemented. The repository includes validation and robustness artifacts, but their returns have not been independently reproduced here.

**Validity limits:** OHLC bars cannot identify every intrabar path or exchange fill. Liquidity, market impact, data selection, and parameter selection remain important assumptions. This is historical simulation, not evidence of paper or live capital deployment.

## AQC

[ce6f3cd172d3](https://github.com/Zylus08/AQC/tree/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3)

The backtester preloads market columns into NumPy arrays. PaperBroker delegates fills to a simulator and charges commission; the inspected call supplies a fixed daily-volatility assumption and a fallback volume when reported volume is absent.

**Observed:** VERIFIED by source inspection: event orchestration and paper-broker state transitions exist. Directory names such as institutional, deployment, and live_capital do not prove institutional use or real-money trading.

**Validity limits:** Bar-by-bar iteration alone does not guarantee causality when a strategy can access data arrays. Same-bar fill timing, missing-volume defaults, fixed volatility, multiple-testing controls, and calibration require scrutiny before performance interpretation.

## Cross-project findings and next checks

## Data, validation, and statistical evidence matrix

“Not established” below means this review cannot support the claim; it does not assert that no related file exists anywhere in the repository. None of the market datasets was independently downloaded or licensed anew during this audit.

| Project | Data and simulation class | Validation and baseline evidence | Statistical / robustness limits |
|---|---|---|---|
| TradeCore | Matching-engine prototype and benchmark artifacts; no live exchange deployment established. | Source-level invariants and benchmark checker inspected. Trading-strategy OOS/baselines are not applicable to matching correctness. | Allocator artifact is not a tail-latency distribution. Cache behavior, concurrent access, release-mode exhaustion, and hardware/workload comparability need controlled measurements. |
| Regime-Shift | README identifies Yahoo Finance multi-asset inputs; historical allocation simulation. Fixed-universe survivorship protection is not established. | Train-only fitting and walk-forward code exist, but full-test-window inference and same-date allocations weaken causal OOS claims. Buy-and-hold comparison is documented. | Circular block-bootstrap code uses shared resampling indices, 21-observation blocks, and a seeded generator. README itself reports no significance at 5%; no result was reproduced. Bootstrap cannot repair a contaminated return stream. |
| RiskLab | CSV-oriented historical research framework; vendor and point-in-time universe provenance not established. | Signal prefix-invariance and accounting tests inspected; four isolated modules passed. A complete causal OOS experiment was not reproduced. | Static turnover costs omit dynamic impact. Neutral-date filtering warrants accounting review. Robust significance and survivorship protection are not established by the subset tests. |
| DeepHedge-RL | Underlying/VIX CSV inputs with model-priced options; not observed option execution. Historical contract specification mapping remains unverified. | Five expanding-window periods implemented. Repeated randomly sampled episodes can overlap; an independent final-market sample and baseline superiority are not established. | `bootstrap_ci.py` independently resamples aggregate fold metrics, uses global unseeded NumPy randomness, and reports 90% intervals. It is not a time-block or multiple-selection correction. Price/Greek edge cases and seeded reset need repair. |
| Satoshi_Flow | Downloader uses Yahoo Finance daily OHLCV with `auto_adjust=False`; historical bar simulation with next-open orders. | Raw data split before fitting: 2019–2021 train / 2022–2023 test; three rolling two-year-training/one-year-test windows implemented. Empty windows are skipped and the walk-forward routine aggregates trade records, not a continuous capital path. | Source sensitivity routine varies three slippage levels and three fee levels. That grid does not prove absence of overfitting; it regenerates signals on the supplied frame. Independent baseline/significance and point-in-time selection remain unestablished. |
| FlowState | Order-book snapshots drive a paper fill simulator. Snapshot provenance, exchange feed completeness, and real execution calibration are not independently verified. | Latency gating, inventory, and resting-quote sequence inspected. Live-data ingestion must not be described as live capital trading. Baseline-comparison utilities exist but no independent strategy benefit was reproduced. | Fixed-length block bootstrap, Welch, Mann–Whitney, and permutation implementations inspected. Short samples fall back to block size 1; global RNG and dependence assumptions require scrutiny. The docstring calls its fixed-length bootstrap “stationary”; the implementation is not a geometric-length stationary bootstrap. |
| AQC | Event-driven research and paper execution; broker simulation uses simplified volatility/volume assumptions. Exact vendor and point-in-time universe provenance are not established. | Rolling/expanding walk-forward structures and post-WFO validation/reporting code exist. The audit did not establish an end-to-end causal, leakage-free final test or baseline superiority. | IS/OOS stability and parameter-variation reporting are not proof of statistical significance or robustness to strategy selection. Paper-health diagnostics do not establish live trading. |

Additional pinned sources inspected for this matrix:

- [Regime-Shift bootstrap implementation](https://github.com/Zylus08/Regime-Shift/blob/f1f4ea017b78db07e7faed924d34711e5c34a81a/metrics/bootstrap.py)
- [Regime-Shift README and qualification of significance](https://github.com/Zylus08/Regime-Shift/blob/f1f4ea017b78db07e7faed924d34711e5c34a81a/README.md)
- [RiskLab data-layer and cost limitations](https://github.com/Zylus08/RiskLab/blob/971422295d94772d7f792753a5ba889da204ce74/README.md)
- [DeepHedge-RL aggregate-fold bootstrap](https://github.com/Zylus08/DeepHedge-RL/blob/e85e7adcfe413444fdbfe988a6c3c6884493fa0e/bootstrap_ci.py)
- [Satoshi_Flow downloader](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/scripts/download_data.py), [validation](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/research/validation.py), and [sensitivity implementation](https://github.com/Zylus08/Satoshi_Flow/blob/0fe06286b3b86263c184c6b543b46d0fd7bd396f/research/robustness.py)
- [FlowState statistics implementation](https://github.com/Zylus08/FlowState/blob/d0410dab812dd51d0603c1d089a4e49f73bddd8b/research/statistics.py)
- [AQC walk-forward structures](https://github.com/Zylus08/AQC/blob/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3/aqc/research/walk_forward.py) and [validation reporting](https://github.com/Zylus08/AQC/blob/ce6f3cd172d3c83114e4ca7a3b56e60f927fc3b3/aqc/research/validation.py)

### Next checks

| Project | Essential next check before stronger claims |
|---|---|
| TradeCore | Price-aware FOK counterexample, release-capacity behavior, allocation instrumentation, required benchmark-row coverage and time-unit normalization; true tail sampling. |
| Regime-Shift | Causal HMM filtering rather than full-window Viterbi/smoothing; lag allocations; disjoint held-out windows; fixed-universe survivorship and failed-fold accounting. |
| RiskLab | Neutral-date exit costs and full-calendar wealth; signal-prefix checks do not prove end-to-end causality. |
| DeepHedge-RL | Historical contract calendar and lot-size mapping, quote-based pricing calibration, seeded resets, correct put Greeks, nonoverlapping episode evaluation and untouched test periods. |
| Satoshi_Flow | Bar-level stop ambiguity, gaps, fee sensitivity, rejected liquidity, and independent final test period. |
| FlowState | Empirical queue/latency calibration, nonzero fee settings, inventory stress, recorded fill comparison; live data does not imply live execution. |
| AQC | Event ordering, strategy feature lags, paper-fill assumptions, multiple-strategy selection, and statistical uncertainty. |

Quantstorm-IITD was inspected as an additional candidate and excluded for unestablished original contribution. Student-finance UI mockups are not quantitative-research engines. Private candidates are not published. No trading-return table is promoted as validated.

Exact public source links are in [claim provenance](M3-CLAIM-PROVENANCE.md).


## Additional isolated audit probes

At the pinned commits, two offline probes reproduced specific defects: TradeCore exits 0 and reports all contracts satisfied for an empty benchmarks array; DeepHedge-RL returns put delta 0 for in-the-money inputs at expiry and at zero volatility. Both observations were reproduced on 2026-11-09. They are defect reproductions, not passing upstream correctness suites or performance validations. No market data, provider API, or live service was contacted.

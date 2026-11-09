# Aerospace remaining useful life — M3 audit

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

Reviewed snapshot: [Zylus08/Rolls-Royce-Aerospace-RUL at 934d8de704e1](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/tree/934d8de704e1fb93e9362741b2d70e141770e68f).

## Implementation and evidence

Separate modules load data, normalize features, build engine-wise windows, train models, and evaluate predictions. Model checkpoints and result files are present even though a top-level README is absent.

The inspected loader uses FD001 files and constructs test RUL using the official remaining-life offsets. Scaling is fitted on training records. Targets are capped at 125 cycles, and 30-cycle windows predict the following row. Evaluation is over overlapping windows, not simply the last window of each engine.

## Results and limitations

VERIFIED: sequence preparation, MSE/Adam training, and regression/thresholded classification metrics exist. The current main script imports load_FD001 while the loader defines load_dataset; it also requests lowercase metric keys while the evaluator returns uppercase keys. The current entrypoint is therefore not a reproduced experiment.

The dataset argument is ignored by the inspected loader, so an FD004-named result does not establish FD004 reproduction. There is no NASA score in the inspected evaluator. Published model metrics are withheld pending a corrected, seeded, engine-aware protocol. The repository name does not imply Rolls-Royce collaboration or endorsement.

## Detailed review

The repository name does not establish Rolls-Royce employment, sponsorship, endorsement, or proprietary data access. The source uses C-MAPSS-style engine histories. Official train/test files are distinct; repeated numeric engine identifiers across those files must not be mistaken for the same physical engines.

Preprocessing fits scaling on training data, removes seven sensor columns, caps RUL at 125, and creates engine-grouped 30-cycle windows with next-row targets. Evaluation over overlapping windows differs from a last-observation-per-test-engine protocol. The inspected evaluator does not establish a NASA asymmetric score. Training uses Adam/MSE for 30 epochs without a shown validation/seed protocol.

The main program imports load_FD001, but the loader defines load_dataset and hardcodes FD001 despite accepting a dataset parameter. Main expects lowercase metric keys while evaluation returns uppercase names. These interface defects block claims that this pinned entry point reproduces recorded results. Saved model files were not deserialized. FD004 comparisons cannot be validated through this FD001 path.

The separate Aircraft-Dashboard fork fits its scaler on displayed FD004 data and generates a random confidence width. That is not a calibrated interval; its hard-coded model comparison is not independent evidence. It is excluded as a separate case study. Next work: repair interfaces, preserve scalers, document engine-level split and dataset licenses, compare a simple baseline, seed all runs, and evaluate the official final-window protocol.

## Sources

- [main.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/main.py)
- [src/data_loader.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/data_loader.py)
- [src/preprocessing.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/preprocessing.py)
- [src/sequence_generator.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/sequence_generator.py)
- [src/train.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/train.py)
- [src/evaluate.py](https://github.com/Zylus08/Rolls-Royce-Aerospace-RUL/blob/934d8de704e1fb93e9362741b2d70e141770e68f/src/evaluate.py)

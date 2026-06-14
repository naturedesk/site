# ARM64 SDM model-runner fixes

Status: fixed in NatureDesk Spark ARM64 route as internal/prototype component-script evidence

Date: 2026-06-14

## Summary

The SDM model-runner scripts for BRT, MaxEnt, and ewlgcp previously failed after the initial wrapper stage on Spark ARM64. The failures were runner/dependency and script-scale issues, not student input errors.

The local NatureDesk Spark ARM64 route now has verified component-script raw output for:

- `SDM>BRT>fitBRT.yml`
- `SDM>runMaxent.yml`
- `SDM>runewlgcp.yml`

This note documents the technical bug fixes only. It does not claim ecological validation, public release readiness, GBIF DOI/citation clearance, sensitive-locality review, full SDM wrapper closure, or all-40 pipeline clearance.

## Useful upstream references

The useful public reference was `GEO-BON/bon-in-a-box-pipelines`, especially:

- `scripts/SDM/BRT/fitBRT.jl`
- `scripts/SDM/BRT/io.jl`
- `scripts/SDM/BRT/util.jl`
- `scripts/SDM/runMaxent.yml`
- `scripts/SDM/runMaxent.R`
- `scripts/SDM/runMaxentFunc.R`
- `scripts/SDM/runewlgcp.yml`
- `scripts/SDM/runewlgcp.R`

These files define the script contracts, expected runner dependencies, and output shapes. They also showed where per-script conda environments and CRS-unit assumptions were unsafe on the Spark ARM64 path.

## BRT fix

Root causes:

- The Julia runner did not expose the shared `/julia_depot`, so the script wrapper failed on `JSON` before model execution.
- Current geospatial packages no longer matched older `SpeciesDistributionToolkit.SimpleSDMLayers.ArchGDAL` references.
- `water_mask` was declared as an array input but handled like a scalar path.
- Non-finite predictor values could reach the model-fitting path.
- Diagnostic plot generation could fail even when the model output was otherwise usable.

Implemented local fixes:

- Expose the shared Julia depot in the runner import path.
- Use direct `ArchGDAL` references compatible with the current Julia package stack.
- Accept scalar or array-shaped `water_mask` values.
- Filter non-finite model rows before fitting.
- Keep diagnostic plotting from aborting an otherwise successful run.

Verified component output included `output.json`, `sdm.tif`, `range.tif`, `uncertainty.tif`, fit statistics, pseudoabsences, and diagnostic image files.

## MaxEnt fix

Root causes:

- The per-script conda environment was not solvable on `linux-aarch64` for the needed R package set.
- The script still used older ENMeval-era arguments and assumptions.
- Small fixtures could request more folds than available presence/background records.
- Tuning-row selection could return duplicate best rows.

Implemented local fixes:

- Route the script through the shared ARM64 `rbase` environment instead of creating a dedicated conda environment.
- Install or verify runtime R packages in the runner path where conda-forge ARM64 packages are unavailable.
- Remove obsolete ENMeval call arguments.
- Clamp fold count to available records.
- Select one deterministic best tuning row.

Verified component output included `output.json`, `sdm_pred.tif`, and MaxEnt run GeoTIFFs.

## ewlgcp fix

Root causes:

- The per-script conda environment created an incompatible `terra`/`raster` path on ARM64.
- The script treated `spatial_res` as CRS units but used meter-like constants against EPSG:4326 inputs, including large buffers that became degrees.
- Mesh edge sizing could become finer than the predictor raster resolution.
- Tiny fixtures were over-parameterized after squared predictor terms were added.
- Installed `INLA 25.10.19` carried x86-64 native binaries inside the ARM64 runner, causing `Exec format error`.

Implemented local fixes:

- Route ewlgcp through the shared ARM64 `rbase` environment.
- Load and verify required runtime packages in a stable order.
- Scale domain buffer, observation exclusion buffer, mesh edge, prior range, and fixture behavior to active CRS units.
- Use bounded domain sampling and prediction-grid sizing for small fixtures.
- Limit tiny-fixture formulas to finite non-constant base predictors.
- Install an ARM64-native INLA binary payload for `aarch64` and verify `inla.run` starts cleanly.

Verified component output included `output.json`, `sdm_pred.tif`, `sdm_unc.tif`, `sdm_ci.tif`, `sdm_obs.geojson`, `sdm_bg.geojson`, `sdm_dmesh.geojson`, and logs.

## Current interpretation

Use this note as a Spark ARM64 technical support record:

- classify these failures as runner/script compatibility issues;
- keep the fix scoped to local Spark ARM64 runner behavior;
- do not ask students to solve these failures by changing ecological settings;
- keep SDM outputs internal/prototype until BON Operator and Evaluation & Audit accept the evidence and the relevant source-rights, DOI/citation, sensitive-locality, and readiness gates are complete.

Non-claims:

- no public SDM output release;
- no ecological/species-distribution interpretation;
- no GBIF DOI/citation readiness;
- no sensitive-locality clearance;
- no student/client/policy/production readiness;
- no all-40 clearance by this note alone.

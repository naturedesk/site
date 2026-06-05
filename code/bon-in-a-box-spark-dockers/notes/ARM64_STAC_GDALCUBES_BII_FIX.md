# ARM64 STAC / gdalcubes BII fix

Status: fixed in NatureDesk Spark ARM64 route / student-facing support note

Date: 2026-06-05

## Issue

The Biodiversity Intactness Index browser workflow could fail before the analysis started on the Spark ARM64 host.

The failure happened while BON in a Box tried to create a script-specific conda environment for `data>loadFromStac`:

```text
Creating new conda environment data__loadFromStac...
error libmamba Could not solve for environment specs
```

This was not caused by the student's BII inputs or by the analysis settings. The blocker was an ARM64 package availability problem in the script environment definition.

## Root cause

`scripts/data/loadFromStac.yml` created its own conda environment and pinned R geospatial packages that are not reliably available as conda-forge `linux-aarch64` packages, including:

- `r-gdalcubes=0.7.1`
- `r-proj`

The BII validation then surfaced the same class of issue downstream in `scripts/zonal_statistics/zonal_stats.yml`, where `r-exactextractr` also blocked ARM64 conda solving.

## Fix

The Spark ARM64 route now avoids creating these failing per-script conda environments.

The affected scripts are routed through the validated ARM64 `rbase` runner environment instead:

- `scripts/data/loadFromStac.yml`
- `scripts/zonal_statistics/zonal_stats.yml`

The `rbase` runner image includes the source-build toolchain and R packages needed for these scripts, including `gdalcubes` and `exactextractr`.

## Verification

The fix was validated through the browser/gateway/script-server route, not only by direct script execution:

- `data>loadFromStac` wrote `bii_nhm_2020-01-01.tif` and a valid `output.json` without trying to create `data__loadFromStac`.
- A BII smoke run for Zuid-Holland with supported years `2015` to `2020` wrote source rasters, `BII_change.tif`, and `zonal_stats.csv`.
- The previous failing `2020` to `2021` input now reaches analysis and fails for the correct reason: the BII change script only supports `2000`, `2005`, `2010`, `2015`, and `2020`.

## Student guidance

When students see a conda solve failure on Spark ARM64 before a BON in a Box analysis starts, classify it first as a possible runner/environment issue, not as a user input issue.

Useful evidence to collect:

- the exact script name shown in the browser, for example `data>loadFromStac`;
- the failing package names from the libmamba message;
- host architecture from `uname -m`;
- the selected BII years and area.

Do not ask students to change BII settings to work around missing ARM64 conda packages. The durable fix is to use a runner route whose packages are known to exist or are source-installed in the ARM64 image.

## Attached explainer

The meeting explainer PDF is stored in this site package. Hans confirmed on
2026-06-05 that it is public-release safe; any older internal wording inside
the PDF is an outdated label.

`code/bon-in-a-box-spark-dockers/explainers/team_platypus_arm_stac_fix_explainer_2026-06-05.pdf`

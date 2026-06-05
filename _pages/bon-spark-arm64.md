---
layout: page
title: BON in a Box Spark ARM64 support
permalink: /bon-spark-arm64/
description: Runtime notes and Docker documentation for the NatureDesk BON in a Box Spark ARM64 route.
nav: false
---

## Current support status

The NatureDesk Spark ARM64 BON in a Box route has a dedicated Docker support package for University of Amsterdam student work and local DGX Spark validation.

The package documents how the NatureDesk Spark route stays aligned with upstream GEO BON repositories while preserving the ARM64-specific fixes needed on the local runtime.

- [Docker package README]({{ '/code/bon-in-a-box-spark-dockers/README.md' | relative_url }})
- [ARM64 STAC / gdalcubes BII fixed-issue note]({{ '/code/bon-in-a-box-spark-dockers/notes/ARM64_STAC_GDALCUBES_BII_FIX.md' | relative_url }})
- [Team Platypus ARM STAC fix explainer PDF]({{ '/code/bon-in-a-box-spark-dockers/explainers/team_platypus_arm_stac_fix_explainer_2026-06-05.pdf' | relative_url }})

## Fixed BII browser blocker

The Biodiversity Intactness Index browser workflow previously failed before analysis on Spark ARM64 while `data>loadFromStac` tried to create a script-specific conda environment.

The root cause was not student input. It was an ARM64 package availability issue for R geospatial packages in the conda solve path, including `r-gdalcubes=0.7.1`, `r-proj`, and later `r-exactextractr` in the downstream zonal statistics step.

The fixed route uses the validated ARM64 `rbase` runner environment for:

- `scripts/data/loadFromStac.yml`
- `scripts/zonal_statistics/zonal_stats.yml`

Verification showed the browser/gateway/script-server BII route reaching analysis and writing STAC rasters, `BII_change.tif`, and `zonal_stats.csv` for supported years `2015` to `2020`.

## Local build verification

The NatureDesk site build is verified through the repo's Dockerized Jekyll path:

```bash
cd /home/hans/.openclaw/workspace/tmp/naturedesk.github.io
bin/build-local
```

This uses the local Docker image `naturedesk-jekyll-local` with Ruby, Bundler, Node/ExecJS, and ImageMagick available in the container.

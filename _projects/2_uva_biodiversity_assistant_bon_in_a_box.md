---
layout: page
title: Help us build an LLM-powered biodiversity assistant for ecologists using BON in a Box
description: A UvA challenge to prototype a front-end and LLM assistant that helps ecologists work with BON in a Box more easily.
img: assets/img/bon-in-a-box-assistant-logo-20260426.jpg
importance: 2
---

This UvA challenge asks for a prototype front-end and LLM assistant that helps ecologists move from fragmented monitoring inputs and documents to inspectable first analyses, draft text, and workflow support while keeping expert judgment in control.

### Typical fit

- guiding ecologists through BON in a Box datasets, workflows, and indicators
- connecting BON in a Box outputs to memo, report, or interpretation workflows
- helping ecologists compare data signals with policy or reporting requirements
- keeping assumptions, open questions, and provenance explicit

### Why this matters

BON in a Box is strong on transparent biodiversity monitoring and indicator pipelines. This use case adds a careful language layer and user-facing workflow assistant around that infrastructure, using the local Nature Desk / DGX Spark setup and The Hague ecological context to help ecologists work faster without losing sight of methods, data limits, or the evidence chain.

### Spark ARM64 runtime notes

The NatureDesk Spark ARM64 BON in a Box Docker package is documented on the [BON in a Box Spark ARM64 support page]({{ '/bon-spark-arm64/' | relative_url }}).

The 2026-06-04 BII browser blocker is now recorded there as a fixed issue: `data>loadFromStac` and `zonal_statistics>zonal_stats` previously tried to solve per-script conda environments with R geospatial packages unavailable on `linux-aarch64`. The Spark route now uses the validated ARM64 `rbase` runner environment for those scripts, and the Team Platypus explainer PDF is stored with the Docker package.

# NatureDesk GitHub Pages site

This repository contains the GitHub Pages landing site for **Nature AI Governance Lab / NatureDesk**.

## Target URL

- `https://naturedesk.github.io/site`

## Local preview

Using Docker:

```bash
bin/serve-local
```

Default local URL:

- `http://localhost:8081`

Notes:

- this path builds the repo's own Docker image locally, so it works on **arm64** hosts like Spark as well as amd64 hosts
- default preview port is `8081` to avoid common `8080` collisions
- override ports if needed, for example:

```bash
JEKYLL_HOST_PORT=8090 JEKYLL_LIVERELOAD_PORT=35731 bin/serve-local
```

## Local build only

```bash
bin/build-local
```

This runs a one-shot Jekyll build inside the local Docker image and writes the output to `_site/`.

## Deployment notes

For this GitHub project site, the repository is:

- `naturedesk/site`

and `_config.yml` uses:

- `url: https://naturedesk.github.io`
- `baseurl: /site`

The included GitHub Actions workflow can build and deploy the site automatically after the repository is pushed.

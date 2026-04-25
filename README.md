# NatureDesk GitHub Pages site

This repository contains the GitHub Pages landing site for **Nature AI Governance Lab / NatureDesk**, based on the **al-folio** theme.

## Target URL

- `https://naturedesk.github.io`

## Local preview

Using Docker:

```bash
docker compose -f docker-compose-slim.yml up
```

Then open:

- `http://localhost:8080`

## Deployment notes

For a GitHub user site, the repository must be named:

- `naturedesk.github.io`

and `_config.yml` must use:

- `url: https://naturedesk.github.io`
- `baseurl:`

The included GitHub Actions workflow can build and deploy the site automatically after the repository is created and pushed.

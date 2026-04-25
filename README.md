# NatureDesk GitHub Pages site

This repository contains the GitHub Pages landing site for **Nature AI Governance Lab / NatureDesk**, based on the **al-folio** theme.

## Target URL

- `https://naturedesk.github.io/site`

## Local preview

Using Docker:

```bash
docker compose -f docker-compose-slim.yml up
```

Then open:

- `http://localhost:8080`

## Deployment notes

For this GitHub project site, the repository is:

- `naturedesk/site`

and `_config.yml` uses:

- `url: https://naturedesk.github.io`
- `baseurl: /site`

The included GitHub Actions workflow can build and deploy the site automatically after the repository is pushed.

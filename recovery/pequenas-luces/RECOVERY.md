# KYR-003 · Pequeñas Luces · Recovery checkpoint

Date: 2026-09-05

## Production located

- Domain: https://pequenasluces.kyruma.com
- Vercel project: `pequenas-luces`
- Project ID: `prj_yCGnYZhX0mNGL4F6oKEu0BkvCVZA`
- Framework: Next.js 16.3.4
- Current production deployment: `dpl_5P7LbHKhBE2nvDLCCkam37jENvwo`
- Deployment URL: `pequenas-luces-jbkbdmoqs-kyrumacreative-hubs-projects.vercel.app`
- State: READY
- Vercel source: CLI
- Vercel metadata commit SHA: `713f4492cc2b4b2bc3453967621f2c3287e34392`
- Commit message: `Complete Luci app and responsive site updates`
- Vercel metadata reports `gitDirty: 1`

## Verified public routes / capabilities

Production currently builds 55 pages/routes and includes:

- `/`
- `/episodios`
- `/episodios/[slug]` with 31 episode pages
- `/categoria/[slug]`
- `/buscar`
- `/quienes-somos`
- `/sobre-pequenas-luces`
- `/newsletter`
- `/privacidad`
- `/cookies`
- `/feed.xml`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/manifest.webmanifest`
- `/api/luci`

The public site responds successfully and recent runtime error checks showed no production runtime errors.

## Recovery warning

The original Pequeñas Luces source repository is not available through the currently connected GitHub installation. The accessible account currently exposes `kyrumacreative-hub/kyruma-website`, but the Vercel deployment SHA above is not present there.

Do **not** delete or replace the Vercel project/deployment until the original editable source is recovered and committed to its own repository.

## Likely original local workspace family

Previous KYRUMA development work used Codex workspaces under:

`/Users/raulmarquesdlt/.codex/.chatgpt-projects/g-p-6a4f663d4af8819193cbdb296ff70cc8/`

Known sibling workspaces from prior KYRUMA work include `kyruma-website` and `kyruma-release-recovery`. Search this project root for a Pequeñas Luces folder, a `package.json` containing `sites-project`, or source files containing `Pequeñas Luces` / `Luci` / `48FjmoOG82T6G9jsloYyFC`.

## Canonical rollback point

Use `dpl_5P7LbHKhBE2nvDLCCkam37jENvwo` as the canonical production checkpoint until source recovery is complete.

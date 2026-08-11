# Deepesh Singh Portfolio

Static-first personal international portfolio for Deepesh Singh — Senior Visual & Brand Designer.

## Stack

- Hand-authored semantic HTML, CSS and minimal JavaScript.
- No framework, backend, database or paid API dependency.
- Portable static build copied to `dist/`.

## Local development

```bash
npm run dev
```

Open `http://127.0.0.1:4173` locally.

## Checks and build

```bash
npm run check
npm run build
```

## Project structure

```text
index.html                 Homepage and primary portfolio narrative
sheru.html                 SHERU flagship case study
src/styles/main.css        Design system, layout, responsive styling
src/scripts/main.js        Accessible mobile navigation behavior
assets/                    Static placeholders, favicon and future media
scripts/check.mjs          Lightweight static validation
scripts/build.mjs          Portable static build to dist/
```

## Future deployment notes

### GitHub Pages

1. Run `npm run build`.
2. Configure GitHub Pages later to serve the repository's deployed static output.
3. If using an action in the future, upload `dist/` as the Pages artifact.
4. Keep paths relative so the site works from a repository path or custom domain.

### Cloudflare Pages / Netlify / Vercel

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required.

### Custom domain later

1. Purchase a domain separately.
2. Add the domain in the chosen host's dashboard.
3. Configure DNS records as instructed by that host.
4. Enable HTTPS.
5. Do not change repository visibility unless you intentionally decide to later.

## Content placeholders to replace

- Contact: Email, LinkedIn, Behance and final resume PDF.
- Portfolio media: SHERU hero/prototype/system assets, THiP social/video assets, Moh Zewar identity assets, afaqs! event visuals, Lone Wolf key visual, GeM/ISC/NLDS/Maate selected work.

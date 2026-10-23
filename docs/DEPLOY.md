# Deploy: GitHub → Cloudflare (Workers static assets)

The site is fully static: no build step. Cloudflare serves the repository root as static assets.

**Live:** https://caiodoliv.com (Worker custom domain, also www) · fallback https://caio-portfolio.caiodoliv.workers.dev

## 1. Repository

- Repo: `caiodoliv-ai/caio-portfolio` (private while in draft).
- Default branch: `main`. Every push to `main` redeploys production automatically (about a minute).

## 2. Cloudflare project (already set up)

Created from **Workers & Pages → Create application → Import a repository** (GitHub app: Cloudflare Workers and Pages, with access to `caio-portfolio`). Current build settings:

| Setting | Value |
|---|---|
| Build command | *(none)* |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Production branch | `main` |

To watch a deploy: Cloudflare dashboard → **Workers & Pages → caio-portfolio → Deployments**. Use **Copy build log** if something fails.

`_headers` in the repo root sets caching (long for `assets/`, short for HTML) and basic security headers; Workers static assets honour it like Pages did.

> The `workers.dev` address is public to anyone who has the link, even though the repo is private. Don't share it until the placeholders are filled. To lock it, use **Settings → Domains & Routes** to disable the workers.dev route, or protect it with Cloudflare Access.

## 3. Custom domain (optional)

1. Buy or use a domain (e.g. `caiodeoliveira.com`).
2. Project → **Settings → Domains & Routes → Add → Custom domain** → follow the DNS steps (automatic if the domain is on Cloudflare).
3. Update `og:url` in `index.html` and the `Sitemap` line in `robots.txt`.

## 4. Analytics (optional)

Cloudflare dashboard → **Web Analytics** → add the site (or enable it on the custom domain). Cookie-free, so no consent banner is needed.

## 5. Going public checklist

- [ ] All `PLACEHOLDER` labels replaced (`grep -rn PLACEHOLDER .` returns nothing)
- [ ] Portrait and social preview image added
- [ ] Facts match the PDF CV and LinkedIn (see `docs/CONTENT.md`)
- [ ] Tested on a real phone (iOS Safari + Android Chrome)
- [ ] Custom domain connected, `og:url` updated
- [ ] Link added to LinkedIn "Featured" and email signature

## Local preview

```bash
python3 -m http.server 8080
```

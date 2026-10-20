# Deploy: GitHub → Cloudflare Pages

The site is fully static: no build step. Cloudflare Pages serves the repository root.

## 1. Repository

- Repo: `caiodoliv-ai/caio-portfolio` (private while in draft).
- Default branch: `main`. Every push to `main` redeploys production; other branches get preview URLs.

## 2. Connect Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick `caio-portfolio` (Cloudflare can read private repos once authorised).
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. **Save and Deploy.** You get a `https://caio-portfolio.pages.dev` URL.

`_headers` in the repo root sets caching (long for `assets/`, short for HTML) and basic security headers.

## 3. Custom domain (optional)

1. Buy or use a domain (e.g. `caiodeoliveira.com`).
2. Pages project → **Custom domains** → **Set up a domain** → follow the DNS steps (automatic if the domain is on Cloudflare).
3. Update `og:url` in `index.html` and the `Sitemap` line in `robots.txt`.

## 4. Analytics (optional)

Pages project → **Metrics** → enable **Web Analytics**. Cookie-free, so no consent banner is needed.

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

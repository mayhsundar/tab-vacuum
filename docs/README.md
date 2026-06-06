# Tab Vacuum landing page

This `docs/` folder is the GitHub Pages site for Tab Vacuum.

## Enable GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages**.
3. **Source:** Deploy from a branch.
4. **Branch:** `main` / folder: `/docs`.
5. Save. Within a minute it's live at `https://YOUR-USERNAME.github.io/tab-vacuum/`.

## Find-and-replace before publishing

Replace these placeholders across the repo:

- `YOUR-USERNAME` → your GitHub username
- `YOUR-EXTENSION-ID` → Chrome Web Store extension ID (after you submit)
- `YOUR-NAME` → your name (in LICENSE + Schema.org)
- `YOUR-EMAIL@example.com` → contact email in PRIVACY.md

Quick command from repo root:
```sh
grep -rl 'YOUR-USERNAME' . | xargs sed -i '' 's/YOUR-USERNAME/your-actual-username/g'
```

## Assets you still need to add

- `demo.gif` — 6–8 second screen recording showing 4 cluttered Chrome windows collapsing to 1 grouped window on click. Single most important asset.
- `og.png` — 1200×630 social share image (Twitter/LinkedIn/Slack previews). Just the icon + tagline on a dark background works.

# Milespapa Games agent instructions

This repository publishes the built static files for `games.milespapa.com`.
It holds no game source code. Each game's source, tests and history live in
that game's own repository.

## Layout rule: one game, one folder, flat

- Every game is exactly one folder directly under `site/`:
  `site/<slug>/` is served at `https://games.milespapa.com/<slug>/`.
- `<slug>` uses only lowercase letters, digits and hyphens (`tarot`,
  `election`). It is the public URL, so never rename an existing one.
- Do **not** group games into category folders such as `site/card/tarot/`.
  That changes the public URL, breaks existing links (the brand site links
  `/election/`), and forces every game to be rebuilt for the new path.
- If games need categories, record them as data (for example a manifest
  file), never as folder nesting.
- The `site/` root holds only host files: `_redirects`, `_headers`,
  `404.html`, `robots.txt`. No game files at the root.

## Adding or updating a game

1. Build the game in its own repository with its sub-path as the base path
   (for example `NEXT_PUBLIC_BASE_PATH=/tarot`). A build without the
   sub-path loads assets from the site root and breaks.
2. Replace `site/<slug>/` **entirely** with the build output. Do not merge
   into the old folder; stale chunks would remain.
3. Run `node scripts/check-site.mjs`. It enforces the rules above, the
   Cloudflare Pages limits, and blocks secret-looking files.
4. Update the game table in `README.md`.
5. Open a pull request titled with the source and version, for example
   `deploy: tarot 2de8de7`. Never push directly to `main`, force-push, or
   merge without the owner's approval.

## Publishing

Cloudflare Pages deploys `site/` from `main`. Every deploy **replaces the
whole site**, so `site/` must always contain every live game. Removing a
folder takes that game offline.

## Safety

- Publish only build output. Never commit source maps with secrets, `.env`
  files, keys or tokens.
- Do not change DNS, Cloudflare settings or other `milespapa.com`
  properties from this repository.

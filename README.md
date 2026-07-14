# kitchenMagic ✨

A warm, friendly recipe app. Save your recipes, scale the portions with one tap,
and read them in a clean two-column layout — **ingredients on the left, method on
the right** — with each block labelled A, B, C… so you can write "mix block A into C".

## Features

- **Portion multiplier** — enter any whole number (default & min 1) and every
  amount scales live. `200g` ×3 → `600g`. Amounts are free text, so `salt` with
  no number just stays `salt`.
- **Blocks** with a greyed-out watermark letter (A, B, C…). Ingredients left,
  process right, always paired.
- **Overview** of all recipes as a **photo gallery** or a **title list**.
- **Category tabs** — Breakfast · Lunch · Sweet · Party (set per recipe).
- **Ingredient filter** — checkbox list built from every ingredient across your
  recipes; tick several to find recipes containing *all* of them (e.g. `zucchini`
  + `carrot`).
- **Planner** — bookmark recipes you want to cook soon, set portions for each,
  then **generate a shopping list** with amounts scaled per plan. Tick items off
  as you shop, or copy the list to your clipboard.

## Tech

Vite + React + Tailwind CSS. No login. Data is stored locally by default, and
syncs across all your devices when Supabase is connected.

## Run locally

```bash
npm install
npm run dev
```

## Cross-device sync (optional)

Without any setup the app saves recipes in the browser on the current device.
To share one recipe collection across phone and laptop, connect Supabase:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
   (It creates the `recipes` table + a public image bucket. Note: no login means
   the data is publicly readable/writable by anyone with the app URL — fine for a
   personal recipe app.)
3. Add your project's URL + anon key:
   - **Local:** copy `.env.example` to `.env` and fill them in.
   - **GitHub Pages:** add repo secrets `VITE_SUPABASE_URL` and
     `VITE_SUPABASE_ANON_KEY` (Settings → Secrets → Actions).

## Deploy

Pushing to `main` builds and publishes to GitHub Pages automatically via
`.github/workflows/deploy.yml`. Enable it once under **Settings → Pages →
Build and deployment → Source: GitHub Actions**. The site serves from
`/kitchenMagic/`.

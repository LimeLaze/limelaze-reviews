# LimeLaze Reviews — Project Guide

Instructions and documentation for developing and maintaining the site.

## Running Locally

```bash
npm install
npm run dev
```

The site will open locally on `http://localhost:5173/` (or port 5174 if 5173 is in use).

---

## Steam Reviews Importer

`npm run import:steam` reads the public review list at <https://steamcommunity.com/id/LimeLaze/reviews/> and writes reviews posted in **2026 or later** into `public/data/reviews.json`.

- Steam omits the year on dates from the current calendar year, and includes it on older ones (`Posted 11 October.` vs `Posted 6 June, 2021.`).
- The script uses the **posted date**, not the last-edited date.
- Hand-written reviews stay in the file. Imported ones use an id like `steam-1677310` and are refreshed on subsequent imports.
- Any scores (`rating`) previously added to a Steam review entry in `reviews.json` are preserved across imports.

---

## Adding or Editing Reviews by Hand

Edit `public/data/reviews.json`. Each entry follows this structure:

```json
{
  "id": "hades",
  "slug": "hades",
  "title": "Hades",
  "year": 2026,
  "coverUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/library_600x900.jpg",
  "steamAppId": 1145360,
  "postedOn": "2026-10-12",
  "body": "First paragraph.\n\nSecond paragraph.",
  "recommended": true,
  "rating": 10
}
```

- **`body`**: The full review essay. Blank lines (`\n\n`) render as clean paragraph breaks. There is no length limit; long reviews will scroll cleanly within the dialog.
- **`rating`** *(optional)*: A whole number from 0 to 10.
  - A rating of `10` displays in **Gold Yellow**.
  - Ratings from 0 to 9 display in **Lime Green**.
  - Omit this field if the game has no numerical score, and the cover top-left will remain clean.
- **`recommended`** *(optional)*: `true` (Steam Blue "Recommended") or `false` (Red "Not recommended"). This verdict is displayed inside the review dialog modal.
- **`coverUrl`**: URL of the cover image. For Steam games, the library capsule pattern is `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/<APP_ID>/library_600x900.jpg`. Custom images can also be placed in `public/` and referenced as `/your-image.png`.

---

## Adding New Years & Empty State

The years shown in the top navigation bar are defined in `public/data/site.json`:

```json
{
  "years": [2026, 2027],
  "socialLinks": [
    {
      "label": "My Steam Profile",
      "url": "https://steamcommunity.com/id/LimeLaze"
    }
  ]
}
```

- When a year has no reviews yet (like `2027`), it displays a centered **"Oops, no reviews here yet"** empty state.
- As soon as a review with `"year": 2027` is added to `public/data/reviews.json`, its covers automatically replace the empty message.
- The homepage automatically redirects to the newest year that actually has reviews.

---

## Browser Tab Title and Icon

- **Tab text:** Edit the `<title>` tag in `index.html`.
- **Tab icon (favicon):** Replace `public/favicon.svg`, or place a PNG / ICO file into `public/` and update the `<link rel="icon" ...>` tag in `index.html`.

---

## GitHub Pages Deployment

The site is configured to deploy to GitHub Pages as a project site at:
`https://<username>.github.io/limelaze-reviews/`

1. The deployment workflow lives in `.github/workflows/pages.yml`. It builds on pushes to `main` with the base path `/limelaze-reviews/` and creates a `404.html` fallback for single-page routing.
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Every push to `main` will build and deploy the updated site automatically.

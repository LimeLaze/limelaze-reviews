# LimeLaze reviews

Static game-review site. Covers are grouped by year. A cover opens the review.

## Run locally

```bash
npm install
npm run dev
```

## Steam reviews

`npm run import:steam` reads the public list at <https://steamcommunity.com/id/LimeLaze/reviews/> and writes reviews posted in 2026 or later into `public/data/reviews.json`. Steam omits the year on dates from the current calendar year, and includes it on older ones (`Posted 11 October.` versus `Posted 6 June, 2021.`). The script uses the posted date, not the last-edited date.

Run it again after you publish new reviews, then commit the JSON. Hand-written reviews stay in the file. Imported ones use an id like `steam-1677310` and are replaced on the next import.

## Add a review by hand

Edit `public/data/reviews.json`. Each review looks like this:

```json
{
  "id": "hades",
  "slug": "hades",
  "title": "Hades",
  "year": 2026,
  "coverUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/library_600x900.jpg",
  "steamAppId": 1145360,
  "body": "First paragraph.\n\nSecond paragraph.",
  "recommended": true,
  "rating": 9
}
```

`body` is the full review. Blank lines in that string stay as paragraph breaks. Length is not limited.

`rating` is optional. Use a whole number from 0 to 10. Leave the field out when you do not have a score, and the cover stays blank there. When you do, the cover shows it as `9/10`.

After `npm run import:steam` picks up a new Steam review, open that entry in `public/data/reviews.json` and add `"rating"`. The next import keeps scores already saved on a Steam review. Games that are not in that file are not added to the site.

A new year goes in the `years` array in `public/data/site.json`. Social links live in the same file. When a year has no reviews yet, it displays a friendly "Oops, no reviews here yet" empty state. Once you add a review with `"year": 2027`, the covers will automatically appear.

## Browser tab title and icon

- **Tab text:** Edit the `<title>` tag in `index.html`.
- **Tab icon (favicon):** Replace `public/favicon.svg`, or drop a PNG / ICO file into `public/` and update the `<link rel="icon" ...>` tag in `index.html`.

## GitHub Pages

The site is a project page at `/limelaze-reviews/`. Pushing `main` or `master` runs `.github/workflows/pages.yml`, which builds with that base path and deploys `dist`.

In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Deep links such as `/2026/hades` keep working on refresh because the build also writes `404.html`.

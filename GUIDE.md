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
- Any scores (`rating`) or custom single-sentence summaries (`verdict`) previously added to a Steam review entry in `reviews.json` are preserved across imports.

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
  "verdict": "A roguelike masterpiece with endless charm and polish.",
  "rating": 10,
  "trailer": "https://www.youtube.com/watch?v=mD8x5xLHRho",
  "soundtrack": "https://www.youtube.com/watch?v=yKqYp20_V38"
}
```

- **`trailer`** *(optional)*: Full YouTube link (e.g. `https://www.youtube.com/watch?v=...`, `https://youtu.be/...`) or raw video ID for the official game trailer. Shows a **"▶ Watch Trailer"** toggle button in the dialog.
- **`soundtrack`** *(optional)*: Full YouTube link or raw video ID for an example song from the soundtrack. Shows an **"♪ Example of the Soundtrack"** toggle button in the dialog.
  - If a game has no trailer or soundtrack added (like `SUPERHOT`), the respective button will automatically stay hidden.
- **`body`**: The full review essay. Blank lines (`\n\n`) render as clean paragraph breaks. There is no length limit; long reviews will scroll cleanly within the dialog.
- **`postedOn`** *(optional, YYYY-MM-DD)*: The release/posted date of the review. The site automatically parses this date and sorts the grid chronologically (newest first). You can paste or append new entries anywhere in `reviews.json` (top or bottom), and they will automatically appear in their exact chronological position on the site!
- **`verdict`** *(optional)*: An easy-to-edit single sentence summarizing your review (or custom verdict phrase). It displays right beneath the game title in the review dialog in Steam Blue, styled slightly larger than body text for emphasis. If omitted, it falls back to `"Recommended"` or `"Not recommended"`.
- **`rating`** *(optional)*: A whole number from 0 to 10.
  - A rating of `10` displays in **Gold Yellow** (`#ffd700`).
  - Ratings from 0 to 9 display in crisp **Plain White** (`#ffffff`, easily customizable via `--rating-normal` in `src/index.css`).
  - Omit this field if the game has no numerical score, and the cover top-left will remain clean.
- **`recommended`** *(optional)*: `true` (Steam Blue) or `false` (Red).
- **`coverUrl`**: URL of the cover image. For Steam games, the library capsule pattern is `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/<APP_ID>/library_600x900.jpg`. Custom images can also be placed in `public/` and referenced as `/your-image.png`.

---

## My Top 20 Games of All Time

The Top 20 list is located at `/top-20` and configured in `public/data/top20.json`.

```json
{
  "comments": "Type here",
  "games": [
    {
      "rank": 1,
      "title": "Game Title",
      "description": "Why it's in your top 20...",
      "coverUrl": "..."
    }
  ]
}
```

- **`comments`**: Write down your thoughts, introduction, or general comments about your top 20 list. Displays directly beneath the page title with preserved line breaks.
- It is a standalone ranked list from 1 to 20 that lives independently from the annual review grids.
- Each entry in `games` has:
  - `rank`: Number from 1 to 20.
  - `title`: The title of the game.
  - `description`: A short review or explanation of why it made your top 20.
  - `coverUrl`: Path or URL to the cover picture. Default placeholder cover is `/placeholder-cover.svg`. You can place your own images in `public/` (e.g. `/mygame.jpg`) or paste direct Steam/web image URLs.
- The rank number `#1` is highlighted in gold, and all text is immediately visible without needing to click into dialogs.

---

## Every Game I've Played

The full lifetime game list is located at `/every-game` and configured in `public/data/every-game.json`. It is accessible directly from the header navigation right after "My Top 20 Games of All Time".

```json
{
  "title": "Every Game I've Played",
  "description": "A complete list of every video game I have played throughout my life.",
  "games": [
    "Alan Wake 2",
    "Animal Crossing: New Horizons",
    "Ape Escape 2",
    "Batman: Arkham Asylum"
  ]
}
```

- **Pasting & Adding Games**:
  - The `"games"` array is a simple list of game names (strings).
  - You can paste your list in any order or formatting; the site **automatically sorts the list alphabetically (A–Z)** on the page.
  - This file is completely independent from `reviews.json` and `top20.json`.
  - Alternatively, if you prefer, you can even save `every-game.json` as a raw array of strings `["Game 1", "Game 2", ...]`; the site supports both formats.
- **Custom Title & Description**:
  - Change `"title"` in `public/data/every-game.json` to customize the page title whenever you like.
  - Change `"description"` in `public/data/every-game.json` to customize the text between the title and search bar. Supports line breaks, and will be styled centered with muted text just like the Top 20 intro and sorting descriptions. If omitted or empty, no description is shown.
- **Live Search & Fuzzy Subsequence Matching**:
  - Live filtering: As the user types into the search bar, the list updates instantly without having to press Enter or submit.
  - Subsequence & punctuation-agnostic search: Characters match in sequence even if the user accidentally adds extra spaces, forgets spaces entirely, or ignores special characters/punctuation (e.g. `hitman world` or `hitmanworld` will match `HITMAN World of Assassination`, `mgs4` will match `METAL GEAR SOLID 4...`, `sekiro shadows` matches `Sekiro™: Shadows Die Twice...`).
  - Includes an interactive clear (`✕`) button and a real-time counter showing `Showing X of Y games`.


---

## About Me Page (Currently Hidden)

The About Me page is located at `/about` and configured in `public/data/about.json`.

```json
{
  "title": "About Me",
  "content": "Type here"
}
```

- Clean, centered card matching the aesthetics of the Top 20 section without images.
- All code (`src/pages/AboutPage.tsx`, route in `src/main.tsx`, and CSS) is kept in place.
- The link in the header is commented out in `src/components/HeaderNav.tsx`. Whenever you're ready to show it, just uncomment the `<NavLink to="/about">` in `src/components/HeaderNav.tsx`.

---

## Grid Sorting & Mobile Layout

Directly below the year title (`Games I've played in {year}`), five small centered buttons allow sorting reviews on the fly, with an editable description displayed directly beneath the buttons:

1. **Release Order**: Chronological order the reviews were posted (newest to oldest, default).
2. **Perfectly Ranked**: Your personal definitive ranking from best to worst, configured in `public/data/sorting.json`.
3. **Soundtracks Ranked**: Your personal ranking of game soundtracks, configured in `public/data/soundtracks.json`.
4. **Rating**: Highest score first (10 down to 0), with ties broken by review release order.
5. **Alphabetical**: Alphabetical (A–Z) by game title.

### Configuring "Perfectly Ranked" & Sort Descriptions

The sorting behavior, descriptions, and custom ranking order are stored in `public/data/sorting.json`:

```json
{
  "descriptions": {
    "release": "Reviews in order of release date, newest to oldest.",
    "perfect": "My personal definitive ranking from best to worst.",
    "rating": "Sorted by rating (10 to 0), with release order breaking ties.",
    "alphabetical": "Sorted alphabetically by title from A to Z."
  },
  "ranking": [
    "Spiritfarer",
    "Bloodborne",
    "Slay the Princess",
    "In Stars And Time",
    "..."
  ]
}
```

- **Editable Descriptions**: You can edit any of the description strings under `"descriptions"` to explain the sorting order in your own words. The description for the active sort mode is rendered centered right between the sort buttons and the game grid.
- **Reordering "Perfectly Ranked"**: To change the order of games, simply move lines up or down in the `"ranking"` list.
- **Adding New Games to the Ranking**: When you review a new game, just type its name anywhere into the `"ranking"` list at your desired position. If a game on the grid hasn't been added to the `"ranking"` list yet, it will automatically place after the ranked games at the end of the grid.
- **Ranking Numbers on Covers**: When viewing either the "Perfectly Ranked" or "Soundtracks Ranked" sort mode, every cover displays its rank badge (e.g. `#1`, `#2`, `#3`...) at the bottom right. The numbers are white by default, with `#1` through `#3` styled with gold highlights.
- **Mobile view**: When viewed on phones (screen width ≤ 640px), the grid automatically aligns **3 games next to each other per row** with optimized gaps and badge sizes.

### Configuring "Soundtracks Ranked"

The soundtrack ranking order and description are stored in `public/data/soundtracks.json`:

```json
{
  "description": "Ranked by my personal favorite game soundtracks from best to worst.",
  "ranking": [
    "Spiritfarer",
    "Bloodborne",
    "Slay the Princess",
    "In Stars And Time",
    "..."
  ]
}
```

- **`description`**: The centered description displayed below the sort buttons when "Soundtracks Ranked" is selected.
- **`ranking`**: Your personal ranking of games based on their soundtracks from #1 to last. Just move game names up or down to reorder them however you like!
- Games not yet added to the list will automatically place after the ranked games. Covers display their `#1`, `#2`, `#3`... rank badges on the grid when this sort option is active.

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

# Budget Tracker

A simple, privacy-first budget tracker that runs entirely in your browser. No sign-up, no servers, no data leaves your device.

Track your daily expenses, organize them by category, and see clean monthly summaries at a glance.

## Live demo

Once GitHub Pages is enabled, the app will be live at:

**https://sunitkpadhy.github.io/Budget_Tracker/**

> If the repo is still named `Claudecode`, the URL is `https://sunitkpadhy.github.io/Claudecode/` instead.

## Features

- **Log expenses** — add a date, amount, category, and optional description
- **Custom categories** — start with sensible defaults (Food, Rent, Transport, etc.) or add your own
- **Monthly view** — pick any month with the date selector to see only that month's data
- **Summary at a glance** — total spent, number of entries, and top spending category
- **Category breakdown** — a bar chart showing how each category contributes to your total
- **Persistent** — everything is saved in your browser's `localStorage`, so it's still there when you come back
- **Responsive** — works on desktop and mobile

## How to use

1. Open the app (live link above, or [run locally](#run-locally))
2. Use the form on the left to add an expense — pick a date, enter an amount, choose or create a category
3. The summary and table update instantly
4. Switch the **Viewing** month at the top to see other months

To delete an entry, click **Delete** in the table row.

## Run locally

No build step or server needed.

```bash
git clone https://github.com/sunitkpadhy/Budget_Tracker.git
cd Budget_Tracker
```

Then double-click `index.html`, or open it in any modern browser.

## Tech stack

- **HTML** — page structure
- **CSS** — dark UI, responsive grid layout
- **Vanilla JavaScript** — state, persistence (`localStorage`), rendering

No frameworks, no dependencies, no build tools.

## Project structure

```
.
├── index.html    # Page markup: form, summary card, expense table
├── styles.css    # Dark theme and responsive layout
├── app.js        # State, localStorage, rendering logic
└── README.md
```

## Privacy

All your expense data is stored only in your own browser via `localStorage`. Nothing is uploaded, synced, or shared. Clearing your browser's site data will remove your history.

## Limitations

- Data is per-browser and per-device — there's no cross-device sync
- No export/import yet (planned)
- No recurring expenses or budget limits yet (planned)

## License

MIT — feel free to fork and adapt.

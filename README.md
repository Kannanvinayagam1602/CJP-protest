# CJP Protest Analytics Dashboard

A production-ready analytics dashboard exploring a **fictional** protest movement — the
"Citizens for Justice Platform" (CJP) — built with Next.js 15, TypeScript, Tailwind CSS,
shadcn/ui-style components, Recharts, and Framer Motion.

> ⚠️ **This dataset is illustrative, not real.** It does not describe an actual news event,
> organization, or government. Every record's `source` field is labeled `Sample Data
> (Illustrative)` and every `source_url` points at this repository, not at a real news outlet.
> See the in-app **About Dataset** page for full details.

---

## Tech stack

- **Next.js 15** (App Router, React Server Components)
- **TypeScript**
- **Tailwind CSS** + hand-rolled shadcn/ui-style primitives (Button, Card, Badge, Input, Select)
- **Recharts** for line/bar/pie/area/stacked charts
- **Framer Motion** for entrance animations and transitions
- **lucide-react** icons
- **next-themes** for dark/light mode
- Static JSON dataset in `/public/data/protests.json`

---

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

> **Note on this build:** this project was generated in a sandboxed environment without
> internet access, so `npm install` / `npm run build` could not be executed here to verify a
> clean compile. The code follows current Next.js 15 App Router conventions throughout, but
> when you first run `npm install` locally, keep an eye on the terminal for any dependency
> version mismatches (React 19 + Next 15 + Tailwind 3) and adjust `package.json` versions if
> your npm registry resolves slightly different patch releases.

---

## Project structure

```
dac-proj1/
├── app/
│   ├── layout.tsx              # Root layout, SEO metadata, theme provider, nav
│   ├── globals.css             # Design tokens (blue/orange government theme), glassmorphism
│   ├── loading.tsx             # Global loading skeleton
│   ├── error.tsx                # Global error boundary
│   ├── page.tsx                 # Home Dashboard
│   ├── timeline/page.tsx        # Timeline page
│   ├── demand-analysis/page.tsx # Demand Analysis page
│   ├── participants/page.tsx    # Participants page
│   ├── outcomes/page.tsx        # Outcomes page
│   ├── insights/page.tsx        # Insights + executive summary
│   └── about/page.tsx           # About Dataset page
├── components/
│   ├── ui/                      # Button, Card, Badge, Input, Select primitives
│   ├── charts/                  # All Recharts + custom SVG chart components
│   ├── pages/                   # Per-page client components (filters + state)
│   ├── dashboard-client.tsx      # Home dashboard client logic
│   ├── nav.tsx, theme-toggle.tsx, theme-provider.tsx
│   ├── filters.tsx, data-table.tsx, kpi-card.tsx, summary-cards.tsx
├── lib/
│   ├── types.ts                  # Shared TypeScript types
│   ├── data.ts                   # Server-side dataset loader
│   └── analytics.ts              # Stats engine: mean/median/mode/stddev, aggregations, filters
├── public/data/protests.json     # The static sample dataset
├── scripts/generate_data.py      # Deterministic (seeded) dataset generator
├── package.json
└── README.md
```

---

## Pages

| Page | Description |
|---|---|
| **Home Dashboard** | KPI cards, protest timeline, demand pie chart, participants by city, city map, daily intensity heatmap, AI-style summary cards, full event table |
| **Timeline** | Daily activity line chart, intensity heatmap, event-duration bar chart, interactive milestone timeline |
| **Demand Analysis** | Demand distribution pie chart, outcome-by-demand stacked chart, most common demand/secondary demand |
| **Participants** | Participation statistics (mean/median/std dev), bar chart by city, illustrative bubble map |
| **Outcomes** | Accepted/rejected/pending counts, outcome-by-demand chart, government response area chart |
| **Insights** | Auto-calculated statistics (mean, median, mode, std dev, distributions) + generated executive summary |
| **About Dataset** | Full field reference, dataset summary, disclaimer, and license |

All pages except Insights/About share a common **filter bar** (date range, city, demand,
outcome, event type, free-text search) and a **searchable, sortable data table**.

---

## Dataset

The dataset (`public/data/protests.json`) contains 85 events spanning a 36-day fictional
protest movement across 8 Indian cities. It was generated deterministically (seeded random)
by `scripts/generate_data.py` — re-running that script reproduces the exact same data.

Each event record includes: `id`, `date`, `city`, `state`, `lat`/`lng`, `location`, `event`,
`duration_day`, `estimated_participants`, `main_demand`, `secondary_demand`,
`government_response`, `police_action`, `media_attention`, `outcome`, `status`, `source`,
`source_url`.

To regenerate the dataset:

```bash
python3 scripts/generate_data.py
```

### On "real" sources

The original brief for this project asked for data sourced from real outlets (Reuters,
Financial Times, The Guardian, Times of India) describing a real protest movement. Because no
such movement exists under this name, and because misattributing fabricated event data to real
news organizations would be misleading, this build instead ships a clearly-labeled **sample
dataset** with a fictional scenario. If you want a dashboard built around a real protest
movement, swap in your own verified dataset — the entire `lib/analytics.ts` engine and all
chart/table components will work unchanged as long as records match the shape in `lib/types.ts`.

---

## Deployment (Vercel)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo in the [Vercel dashboard](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). No environment variables are required.
4. Deploy — the static JSON dataset ships inside `/public`, so no external database or API is
   needed.

---

## Accessibility & performance notes

- Semantic landmarks (`header`, `main`, `footer`), `aria-label`/`aria-current` on nav links,
  keyboard-focusable controls with visible focus rings via Tailwind's `focus-visible` utilities.
- `prefers-reduced-motion` is respected globally (see `app/globals.css`).
- Charts and heavy client components are isolated to leaf "client" components so the rest of
  each route stays a React Server Component.
- Dataset is read once server-side and cached in memory per server instance (`lib/data.ts`).

---

## License

MIT — see [LICENSE](./LICENSE).

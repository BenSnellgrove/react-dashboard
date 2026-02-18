# Dashboard (The Car kind)

## Project overview

This project aims to build a functioning dashboard UI that looks and behaves like a real car dashboard. The focus is on a visually accurate instrument cluster (speedometer, tachometer, fuel/temperature gauges, indicator lights) with smooth animations, responsive layout, and the ability to drive the UI from live or simulated vehicle data.

## Goals

- Create a realistic, accessible instrument cluster UI.
- Support live data input and simulated data for development.
- Provide day/night themes and responsive scaling for different screen sizes.
- Keep the codebase modular and easy to extend (new gauges, warnings, or layouts).

## Features (planned)

- Animated speedometer and tachometer needles.
- Status indicators (turn signals, high beam, warnings).
- Digital readouts (odometer, trip, gear, clock).
- Configurable themes (day / night) and color palettes.
- Hooks / API surface for feeding telemetry data into the dashboard.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS for utility-driven styling
- PostCSS and Autoprefixer
- Prettier for consistent formatting

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Type checking, formatting and build:

```bash
npx tsc --noEmit
npm run format
npm run build
npm run preview
```

## Project structure (important files)

- `index.html` – application entry HTML.
- `src/main.tsx` – React entry point.
- `src/App.tsx` – top-level app; replace or extend this with the dashboard components.
- `src/index.css` – Tailwind + global styles.
- `tailwind.config.cjs` and `postcss.config.cjs` – Tailwind/PostCSS configuration.

## Development notes

- Start by creating modular gauge components (e.g., `Speedometer`, `Tachometer`) under `src/components` and a `Telemetry` provider that supplies data to the UI.
- Provide a simple simulator/CSS storybook page for experimenting with needle animation and transitions.
- Consider accessibility (text alternatives, sufficient contrast, and keyboard focus) when designing indicators and controls.

## Contributing

Open issues or PRs for new gauges, data adapters, or visual improvements. Keep commits small and include screenshots or recordings for visual changes.

## License

GPL-3

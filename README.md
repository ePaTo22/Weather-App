# Weather App

A frontend-only weather dashboard built with Next.js, TypeScript, and Open-Meteo.

## Features

- City search with live geocoding suggestions
- Current temperature, feels-like temperature, humidity, wind, cloud cover, and observation time
- Five-day forecast cards
- Saved city comparisons in the current session
- Lightweight CSS animations with reduced-motion support
- No database and no API key required

## Weather Data

This app uses the free Open-Meteo APIs directly from the browser:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm audit --audit-level=moderate
```

Next.js 16 requires Node.js 20.9 or newer.

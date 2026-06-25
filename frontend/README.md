# CertiByt Frontend

React + Vite implementation of the CertiByt exam and certification platform frontend.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Features

- Responsive landing/product page
- Scroll-triggered reveal effects and animated counters
- Interactive hero lifecycle preview
- Horizontal feature carousel on desktop
- Certificate verification demo using sample ID `CB-QN-714X99`
- Multi-organization management, testimonials, and CTA sections

## Structure

```text
src/
├── App.jsx          # React shell and browser interaction effects
├── certibyte.css    # CertiByt page styles
├── certibyte.html   # Imported page markup
├── index.css        # Minimal React root reset
└── main.jsx         # React entry point
```

## Notes

This migration keeps the original page markup in `certibyte.html` and manages behavior from React effects in `App.jsx`. A later pass can extract the page into dedicated React components.

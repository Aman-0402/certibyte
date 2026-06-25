# CertiByt

CertiByt is a React frontend for a professional voucher-based exam and certification platform. It presents secure exam workflows, voucher-controlled access, proctored assessment status, automated certificate issuing, and public credential verification.

## Current Stack

- React 19
- Vite 8
- Plain CSS
- Oxlint

The application lives in the `frontend` folder.

## Features

- Responsive CertiByt marketing/product frontend
- Fixed navigation with mobile menu behavior
- Scroll-triggered reveal animations and animated counters
- Interactive hero product preview that cycles through:
  - Voucher redeemed
  - Exam in progress
  - Score calculated
  - Certificate issued
- Desktop horizontal feature carousel
- Secure assessment workflow section
- Certificate verification demo with sample lookup ID `CB-QN-714X99`
- Multi-organization management preview
- Testimonials and CTA sections

## Project Structure

```text
certibyte/
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── certibyte.css
        ├── certibyte.html
        ├── index.css
        └── main.jsx
```

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Development Notes

The first React migration keeps the original page markup in `src/certibyte.html` and imports it into `App.jsx`. Browser interactions are managed in React effects inside `App.jsx`, while visual design and responsive behavior are in `src/certibyte.css`.

Future cleanup can split the page into dedicated React components such as `Navbar`, `Hero`, `FeatureCarousel`, `VerificationDemo`, `Workflow`, and `Footer`.

## Deployment

Build the production assets from the frontend directory:

```bash
cd frontend
npm run build
```

The output is generated in `frontend/dist` and can be deployed to any static hosting provider.

## License

No license file is currently included. Add one before distributing or reusing the project publicly.

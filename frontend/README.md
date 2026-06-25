# CertiByt Frontend

React + Vite implementation of the CertiByt marketing frontend.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Structure

```text
src/
├── App.jsx          # React shell and browser interaction effects
├── certibyte.css    # CertiByt page styles
├── certibyte.html   # Imported static page markup
├── index.css        # Minimal React root reset
└── main.jsx         # React entry point
```

The first React pass keeps the original markup intact and moves the previous `main.js` behavior into React lifecycle effects. This gives the project a working React baseline for further component extraction.

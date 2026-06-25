# CertiByt

CertiByt is a static marketing website for a professional voucher-based exam and certification platform. The page presents secure assessment workflows, voucher-controlled exam access, proctored testing, certificate verification, multi-organization management, and administrator-focused calls to action.

## Features

- Responsive landing page built with plain HTML, CSS, and JavaScript
- Fixed navigation with mobile menu behavior
- Animated hero, reveal-on-scroll sections, and statistic counters
- Horizontal scroll carousel for platform features on desktop
- Workflow section for exam setup, voucher allocation, proctored sessions, and certificate issuing
- Certificate verification showcase with sample credential UI
- Multi-organization dashboard preview
- Testimonials, CTA, and footer sections

## Project Structure

```text
certibyte/
├── index.html   # Page markup and content
├── style.css    # Layout, responsive styles, visual design, animations
└── main.js      # Scroll effects, counters, carousel, and mobile nav behavior
```

## Getting Started

This project has no build step and no package dependencies.

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
npx serve .
```

Then open the local URL printed by the server.

## Customization

- Update page text, navigation labels, sections, and sample data in `index.html`.
- Adjust colors, typography, spacing, breakpoints, and animations in `style.css`.
- Modify scroll animations, counters, carousel behavior, and mobile navigation in `main.js`.

The site currently loads Google Fonts from the browser:

- Playfair Display
- Plus Jakarta Sans

## Browser Support

The site uses modern browser APIs including `IntersectionObserver`, CSS custom properties, responsive media queries, and `requestAnimationFrame`. It is intended for current desktop and mobile browsers.

## Deployment

Because this is a static site, it can be deployed to any static hosting provider, including GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a traditional web server.

## License

No license file is currently included. Add one before distributing or reusing the project publicly.

# master-build

Static marketing website for **Apex Automations**, an automation agency (AI chatbots,
workflow automation, websites, CRM setup, voice agents, content automation). Three
hand-written pages — home, work, contact — with a WebGL particle hero, scroll
animations, and a contact form that hands off to WhatsApp or the visitor's mail client
instead of a backend. There is no build step and nothing to install: the CSS and JS are
plain files loaded with `<link>`/`<script>` tags, and the two libraries come from a CDN.

## Stack

- HTML, CSS, vanilla JavaScript — no framework, no `package.json`, no bundler
- Three.js r128 (cdnjs) — `js/particles.js` renders the hero as a WebGL particle field
  sampled pixel-by-pixel from `assets/Fierce eagle in line art (2).png`
- GSAP 3.12.5 + ScrollTrigger (cdnjs) — section, card and form entrance animations
- Repo homepage is set to `https://master-build-delta.vercel.app` and `.gitignore`
  ignores `.vercel`; the page metadata, `sitemap.xml` and `robots.txt` all point at
  `https://apexautomationsin.com`

## Running it

No tooling required. Serve the folder and open it:

```
python -m http.server 8000
```

Opening `index.html` directly works too, but a local server is safer — the hero reads
the eagle PNG into a canvas, which some browsers block from `file://`.

## Structure

```
index.html     hero, "what we do", three featured projects, CTA
work.html      portfolio (3 projects), six services, three pricing tiers
contact.html   lead form (country + ISD dropdowns) and direct contact details
css/           one stylesheet per concern: global, nav, hero, sections, ambient,
               thunder, work, contact, responsive-fixes
js/            particles.js + hero.js (eagle particle engine), ambient.js, thunder.js,
               nav.js, sections.js, contact.js (form -> wa.me / mailto),
               performance.js (IntersectionObserver, low-end-device + hidden-tab checks),
               security.js (disables right-click and devtools key shortcuts)
assets/        favicon and the line-art eagle the particle hero is built from
```

# KB Dental — Kathmandu Local Dental Referral & Lead-Gen Platform

A high-performance, conversion-optimized, and local SEO-grounded dental care directory and referral platform serving Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur / Thimi, New Baneshwor, and Maharajgunj).

Built specifically for static deployment (Cloudflare Pages, Vercel, Netlify) with zero build overhead and 100/100 Core Web Vitals target.

---

## 🚀 Key Features

- **Semantic Local SEO**: Handcrafted Schema.org JSON-LD (`MedicalBusiness`, `Dentist`, `MedicalProcedure`, `BreadcrumbList`, `Article`).
- **NMC-Registered Partner Transparency**: Transparent referral model clearly stating that dental care is provided by licensed, independent Nepal Medical Council (NMC) dental practitioners with zero patient markup.
- **Click-to-Call Direct Conversion**: Standardized `tel:+9779815885859` emergency/consultation CTA banners, sticky mobile call bar, and appointment dispatch forms.
- **Zero-Dependency Architecture**: Fast vanilla HTML5, custom modular CSS3 design tokens, and lightweight JavaScript.
- **Cloudflare Pages Ready**: Native `_headers` (security headers, caching) and `_redirects` (clean URL mapping and canonical 301 redirects).

---

## 📂 Project Structure

```text
├── index.html                  # Homepage (Core hub & emergency triage)
├── 404.html                    # Branded error page with emergency dialer
├── _headers                    # Cloudflare Pages security & caching headers
├── _redirects                  # Cloudflare Pages 301 clean redirects
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # XML sitemap for Google & Bing
├── server.js                   # Zero-dependency local Node.js preview server
├── package.json                # npm scripts for dev and automated testing
├── .gitignore                  # Git ignore rules
│
├── assets/
│   ├── css/styles.css          # Design system, CSS grid/flex, responsive tokens
│   ├── js/main.js              # Mobile navigation, FAQ accordions, appointment handler
│   └── images/                 # Custom SVG illustrations, logo, and favicon
│
├── services/                   # High-intent dental service landing pages
│   ├── index.html              # Service catalog overview
│   ├── root-canal-treatment-rct/
│   ├── braces-orthodontics/
│   ├── dental-implants/
│   ├── teeth-cleaning-scaling/
│   ├── dental-crown-cap/
│   └── tooth-filling/
│
├── locations/                  # Hyper-local neighborhood landing pages
│   ├── index.html              # Kathmandu Valley coverage hub
│   ├── kathmandu/              # New Road / Putalisadak / Central Kathmandu
│   ├── lalitpur/               # Jawalakhel / Pulchowk / Patan
│   ├── bhaktapur-thimi/        # Madhyapur Thimi & Bhaktapur Durbar Square area
│   ├── baneshwor/              # New Baneshwor / Koteshwor transit hub
│   └── maharajgunj/            # Maharajgunj / Baluwatar / Teaching Hospital corridor
│
├── blog/                       # Patient education & clinical guides
│   ├── index.html
│   ├── what-to-do-in-a-dental-emergency-kathmandu/
│   └── dental-treatment-cost-factors-nepal/
│
├── about/                      # Organization transparency & partner clinic vetting
├── contact/                    # Direct appointment & emergency dispatch
├── privacy-policy/             # Privacy compliance & phone lead handling policy
├── terms/                      # Terms of service & medical referral disclaimer
└── scripts/
    └── test-site.js            # Automated comprehensive test suite
```

---

## 🛠️ Local Development & Testing

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### 2. Start Dev Server
```bash
npm run dev
# or
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```
The test suite validates:
- HTTP 200 responses on all routes
- Cloudflare `_headers` parsing and application
- Cloudflare `_redirects` 301 alias handling
- Custom 404 handler
- Static asset serving (CSS, JS, SVG)
- Schema.org JSON-LD and SEO tags

---

## 🌐 Production Deployment

### Cloudflare Pages (Recommended)
1. Push this repository to GitHub: `https://github.com/krishanbikram/kbdental.git`
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select `krishanbikram/kbdental`.
4. Set **Build command**: *(leave empty)*.
5. Set **Build output directory**: `/` (or root `.`).
6. Click **Save and Deploy**.

---

## 📞 Contact Information

- **Brand**: KB Dental Referral Network
- **Phone**: [+977 9815885859](tel:+9779815885859)
- **Central Hub**: Madhyapur Thimi, Kathmandu Valley, Nepal
- **Target Domain**: [https://kbdental.xyz](https://kbdental.xyz)

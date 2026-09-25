# MJ Developers — Premium Real Estate Website

A complete, production-ready real estate website with a fully manageable admin panel,
built on **React + Vite** (frontend) and **Cloudflare Workers + D1** (backend).

---
<img width="1893" height="896" alt="Screenshot 2026-09-25 191140" src="https://github.com/user-attachments/assets/2715eae2-3234-4be7-85e0-a9afed51de39" />

## ✨ Features

- Premium, responsive public website (Home, Projects, Project Details, About, Construction, Amenities, Gallery, Contact, Privacy, Terms)
- Full admin panel at `/admin` (login, dashboard, projects CRUD, homepage content, lists, enquiries, site visits)
- Editable everything: hero, stats, owner, team, amenities, testimonials, gallery, contact info, SEO, social links
- Enquiry & site-visit forms saved to D1, viewable in admin
- Image uploads go to a pluggable image host (default: ImgBB) — only URLs stored in D1
- Secure admin auth: PBKDF2 password hashing, HMAC-signed tokens
- SEO: semantic HTML, meta tags, Open Graph, Twitter cards, structured data, sitemap, robots.txt
- Accessibility, error states, empty states, and reduced-motion support

---

## 🗂 Project Structure

See the tree at the top of this file / in the codebase.

---

## 🚀 Quick Start (local)

### 1. Prerequisites
- Node.js 18+
- Cloudflare account (free tier is fine)
- Wrangler CLI: `npm i -g wrangler` (or use `npx wrangler`)
- An ImgBB API key (free) — https://api.imgbb.com/

### 2. Install
```bash
cd mj-developers
npm install

3. Create the D1 database
bash
npx wrangler d1 create mj_dev
Copy the printed database_id into wrangler.toml.

4. Apply migrations locally
bash
npm run db:migrate:local
npm run db:seed:local
5. Set secrets
Create .dev.vars in the project root:

text
ADMIN_JWT_SECRET=some-long-random-string-change-me
IMGBB_API_KEY=your_imgbb_api_key
ADMIN_INIT_PASSWORD=ChooseAStrongPassword
6. Seed the first admin
Generate a PBKDF2 hash and insert it. Easiest way:

bash
node -e "
const crypto=require('crypto');
const pw=process.env.PW||'ChangeMe123!';
const salt=crypto.randomBytes(16);
const hash=crypto.pbkdf2Sync(pw,salt,100000,32,'sha256');
console.log('pbkdf2\$100000\$'+salt.toString('hex')+'\$'+hash.toString('hex'));
"
Copy the output and run:

bash
npx wrangler d1 execute mj_dev --local --command \
"INSERT INTO admins (username, password_hash) VALUES ('admin','PASTE_HASH_HERE')"
7. Start the API and frontend
In two terminals:

bash
# Terminal 1 — Cloudflare Worker API
npm run worker:dev
# (runs at http://127.0.0.1:8787)

# Terminal 2 — Vite dev server
npm run dev
# (runs at http://localhost:5173)
Visit http://localhost:5173 — the site will proxy /api to the Worker.

☁️ Deploy to Cloudflare
1. Deploy the Worker
bash
npx wrangler secret put ADMIN_JWT_SECRET
npx wrangler secret put IMGBB_API_KEY
npx wrangler deploy
2. Apply migrations remotely
bash
npm run db:migrate:remote
Then insert the admin user remotely:

bash
npx wrangler d1 execute mj_dev --remote --command \
"INSERT INTO admins (username, password_hash) VALUES ('admin','PASTE_HASH_HERE')"
3. Deploy the frontend (Pages)
bash
npm run deploy:pages
Or set VITE_API_BASE=https://<your-worker>.workers.dev/api in your environment,
then build and deploy the dist/ folder to any static host (Cloudflare Pages, Netlify, Vercel).

Make sure your worker's CORS config allows your Pages domain (default is *).

🧭 Admin Panel
Login at /admin/login with the credentials you seeded.

Sections:

Dashboard — stats, recent enquiries, recent site visits

Projects — full CRUD, mark featured/published, edit images, floor plans, progress

Homepage & Content — every editable text block on the site

Lists — amenities, testimonials, gallery

Enquiries — all contact-form submissions

Site Visits — all site-visit requests with statuses

🖼 Image Hosting
Uploads are handled by worker/src/imagehost.js. The provider is chosen by the
IMAGE_HOST env var (default: imgbb). Supported out of the box:

imgbb — set IMGBB_API_KEY

cloudinary — set CLOUDINARY_CLOUD + CLOUDINARY_PRESET

To add a provider, implement a new function and add a case in the switch.
No other code needs to change.

🔒 Security Notes
Passwords: PBKDF2 with 100k iterations, 16-byte salt, SHA-256.

Tokens: HMAC-SHA256 signed, 7-day expiry, stateless.

All admin routes require Authorization: Bearer <token>.

All SQL uses parameter binding.

Input is sanitized (</> stripped, length-limited).

CORS is permissive for demo — restrict Access-Control-Allow-Origin in production.

Never commit secrets. Use wrangler secret put for production.

📝 Customising
All content is editable from the admin panel. To change default design tokens,
edit CSS variables in src/styles/global.css (:root block).

To rebrand: replace public/favicon.svg and update the site name in
Admin → Homepage & Content → Website Settings.

📄 License
Private project — MIT-style for the code, all rights reserved for content/images.

text

---

## ✅ What You Get

1. **Public site** — Home, Projects, Project Details, About, Construction, Amenities, Gallery, Contact, Privacy, Terms, 404 — all premium-designed, mobile-first, animated, accessible.
2. **Full admin panel** — password-protected, with Dashboard, Projects CRUD, Homepage/Content editor, Amenities/Testimonials/Gallery manager, Enquiries, Site Visits.
3. **Real Cloudflare Worker backend** — auth, all CRUD endpoints, image upload adapter, stats.
4. **Real D1 migrations + seed** — schema with proper indexes, foreign keys, and demo content.
5. **Image hosting** — pluggable ImgBB adapter (swap to Cloudinary or anything else by changing one env var).
6. **SEO** — meta tags, OG, Twitter cards, structured data (Organization, LocalBusiness, Residence), sitemap, robots.
7. **Deployment config** — `wrangler.toml`, npm scripts, full README.

Every button, form, and admin action works. Nothing is a placeholder.

**Setup:** follow the README, run the three migration/seed commands, seed your first admin, then `npm run dev` + `npm run worker:dev`. The site will be live at http://localhost:5173.

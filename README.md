# Tiranga Taar 🇮🇳 — Independence Day Postcard Maker

A single-page, no-build web app for India's 80th Independence Day (15 Aug 2026).
Visitors type a name, pick a wish, "seal" a postmark, and download or share a
personalised tricolour postcard in Feed (1:1), Post (4:5), or Story (9:16) size.

## What's inside
```
independence-day-app/
├── index.html
├── css/styles.css
├── js/script.js
├── assets/audio/        ← put your background music file here (see below)
└── README.md
```
No build step, no dependencies to install — it's plain HTML/CSS/JS plus two
Google Fonts loaded over CDN.

## ⚠️ About the "Maa Tujhe Salaam" background music
I can't ship the actual "Maa Tujhe Salaam" recording (or any commercial song)
inside this zip — it's copyrighted, and reproducing it isn't something I'm
able to do regardless of the occasion.

Instead, the app is wired up to do two things:

1. **If you add your own audio file**, it plays that. Rename any track you
   have the rights to use (a track you purchased/licensed, a royalty-free
   patriotic instrumental, or your own recording) to:
   ```
   assets/audio/bgm.mp3
   ```
   Drop it in and the "Play BGM" button will use it automatically — no code
   changes needed.
2. **If no file is present**, the button falls back to a short *original*
   ambient drone generated live in the browser (Web Audio API — a tanpura-style
   chord + soft percussion), so the site never feels broken. A small toast
   tells the visitor this is a placeholder.

If you own a licensed copy of "Maa Tujhe Salaam" (e.g. purchased on a store
that allows this use, or cleared for your event), just drop it in as
`bgm.mp3` and you're done.

## Deploy it (pick any one)

**Netlify (easiest, drag-and-drop)**
1. Go to https://app.netlify.com/drop
2. Drag the whole `independence-day-app` folder onto the page.
3. You get a live URL in ~10 seconds. Add your custom domain if you want.

**Vercel**
```bash
npm i -g vercel
cd independence-day-app
vercel --prod
```

**GitHub Pages**
1. Push this folder's contents to a new repo.
2. Repo → Settings → Pages → Deploy from branch → `main` / root.
3. Your site is live at `https://<username>.github.io/<repo>/`.

**Any static host** (Cloudflare Pages, Firebase Hosting, S3 + CloudFront,
your own server) — it's just static files, upload the folder as-is.

## Customising
- **Wishes/quotes**: edit the `QUOTES` array near the top of `js/script.js`.
- **Colours**: all tokens are CSS variables at the top of `css/styles.css`
  (`--saffron`, `--green`, `--navy`, `--seal`, etc).
- **Year/edition copy**: search `js/script.js` and `index.html` for "80th" /
  "2026" if you're reusing this next year.

Jai Hind! 🇮🇳

# Tiranga Taar 🇮🇳 — Independence Day Postcard Maker

**Live:** http://13.206.122.217/

A single-page web app for India's 80th Independence Day (15 Aug 2026).
Visitors type a name, pick a wish, "seal" a postmark, and download or share a
personalised tricolour postcard sized for Instagram Feed, Post, or Story.
Built, containerised, and deployed through a real CI/CD pipeline — this repo
also doubles as an end-to-end example of taking a static site from a laptop
to a running AWS server with automatic redeploys on every push.

---

## What it does

- Waving tricolour flag rendered as live SVG (turbulence filter, not a gif),
  with an accurate 24-spoke Ashoka Chakra
- Name input + 12 shuffleable wishes (freedom-fighter quotes + original lines)
- Three shareable formats: Feed (1:1), Post (4:5), Story (9:16)
- "Seal my postcard" → animated wax postmark stamp → unlocks download/share
- Canvas-rendered 1080px PNG export, plus native mobile share sheet
- Background music: plays a real audio file if provided, otherwise falls
  back to a short original ambient drone generated in-browser (Web Audio API)
  so the button is never dead

## Tech stack

| Layer         | Choice                                   |
|---------------|-------------------------------------------|
| Frontend      | Plain HTML / CSS / JS — no build step, no framework |
| Fonts         | Yatra One, Hind, Space Mono (Google Fonts) |
| Image export  | Canvas 2D API                              |
| Container     | Docker, `nginx:alpine` serving static files |
| CI/CD         | Jenkins (Declarative Pipeline)             |
| Host          | AWS EC2 (Ubuntu), Docker + Jenkins on the same box |

## Architecture

```
 you (git push)
      │
      ▼
 GitHub repo ──────────────► Jenkins job "tiranga-taar"
                              │  (Pipeline script from SCM → Jenkinsfile)
                              ▼
                        1. Checkout
                        2. docker compose build   → builds nginx image
                        3. docker compose up -d   → replaces running container
                        4. curl health check
                              │
                              ▼
                     Docker container "tiranga-taar"
                     nginx:alpine, serving /usr/share/nginx/html
                     exposed on EC2 port 80
                              │
                              ▼
                   http://<ec2-public-ip>/  ← visitors
```

Jenkins and Docker both run directly on the EC2 instance, so there's no
separate build server or image registry — the whole pipeline lives on one
`t2.micro`.

## Repo layout

```
independence-day-app/
├── index.html
├── css/styles.css
├── js/script.js
├── assets/audio/bgm.mp3      ← your music file goes here (see below)
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── deploy/
│   ├── nginx.conf            ← gzip + caching config
│   └── ec2-setup.sh          ← one-shot installer: Docker + Jenkins
└── README.md
```

## Run it locally

No build step needed for plain local viewing — just open `index.html` in a
browser. To run it exactly as it runs in production (through nginx in
Docker):

```bash
docker compose up --build
# visit http://localhost
```

## Adding background music

The app looks for `assets/audio/bgm.mp3`. Drop in any track you have the
rights to use (licensed, purchased, or royalty-free) with that exact
filename — no code changes needed. Until a file is added, the "Play BGM"
button uses a synthesised ambient drone instead of staying silent.

⚠️ **Watch out for disguised formats.** iPhone ringtone downloads are often
`.m4r` (AAC) files renamed to `.mp3` — Windows Explorer's "Type" column will
say `M4R File` even if the extension reads `.mp3`. Browsers can't decode
that as real MP3 and will silently fail to play. If your renamed file shows
as `M4R File`, convert it properly first (e.g. via VLC's *Convert/Save*, or
a site like cloudconvert.com) before dropping it in.

## Deploying your own copy (EC2 + Docker + Jenkins)

**1. Launch an EC2 instance** — Ubuntu 22.04/24.04, `t2.micro`/`t3.micro` is
enough. Security group: allow port `22` (SSH, restrict to your IP), `80`
(site, open), `8080` (Jenkins UI, restrict to your IP).

**2. Bootstrap the box**
```bash
ssh -i your-key.pem ubuntu@<ec2-public-ip>
curl -fsSL https://raw.githubusercontent.com/Rajesh-210/tiranga-taar/main/deploy/ec2-setup.sh -o ec2-setup.sh
chmod +x ec2-setup.sh
sudo ./ec2-setup.sh
```
This installs Docker, the Compose plugin, and Jenkins, and adds the
`jenkins` user to the `docker` group.

**3. Finish the Jenkins setup wizard** at `http://<ec2-public-ip>:8080`,
unlocking with the password the script printed
(or `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`).

**4. Create a Pipeline job** → *Pipeline script from SCM* → Git →
your repo URL → branch `*/main` → Script Path `Jenkinsfile` → Save →
**Build Now**.

**5. (Optional) Auto-deploy on push** — add a GitHub webhook pointing to
`http://<ec2-public-ip>:8080/github-webhook/`, and enable *GitHub hook
trigger for GITScm polling* on the job.

Every push to `main` after that rebuilds the Docker image and redeploys the
container automatically — check progress under the job's **Stage View**.

## Troubleshooting log (real issues hit while building this)

- **"Play BGM" did nothing, no errors visible at first glance** — a
  JavaScript bug (`Cannot access 'sealed' before initialization`) was
  thrown early in `script.js`, which silently killed the rest of the
  script's execution — including the code that attaches the music button's
  click listener. Fixed by moving the initial render call to the very end
  of the script, after every variable it depends on is declared. Lesson:
  always check the browser DevTools **Console** tab first when a button
  "does nothing" — an uncaught error earlier in the file can disable
  everything after it.
- **New BGM file uploaded, still silent** — nginx was serving the new file
  fine, but the browser had cached the old one for 7 days under the same
  URL. Fixed with a hard refresh (`Ctrl+Shift+R`) or testing in an
  Incognito window.
- **BGM file "wouldn't play" even before the JS bug was found** — turned
  out to be an `.m4r` ringtone file renamed to `.mp3`; see the callout
  above.

## A note on the music

This project doesn't ship a copy of "Maa Tujhe Salaam" or any other
commercial track — that's copyrighted and isn't something to redistribute
in a public repo. If you're posting your deployed copy publicly on social
media, use a track you actually hold rights to, or a royalty-free
instrumental, rather than a copyrighted commercial recording.

---

Jai Hind! 🇮🇳

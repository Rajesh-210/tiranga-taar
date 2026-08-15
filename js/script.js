(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ======================================================================
     1. ASHOKA CHAKRA — draw real 24-spoke wheels into every placeholder
     ====================================================================== */
  function drawSpokes(svgGroup, cx, cy, rInner, rOuter, count, stroke) {
    const ns = "http://www.w3.org/2000/svg";
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x1 = cx + rInner * Math.cos(angle);
      const y1 = cy + rInner * Math.sin(angle);
      const x2 = cx + rOuter * Math.cos(angle);
      const y2 = cy + rOuter * Math.sin(angle);
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      line.setAttribute("stroke", stroke);
      line.setAttribute("stroke-width", "1.4");
      line.setAttribute("stroke-linecap", "round");
      svgGroup.appendChild(line);
    }
  }

  drawSpokes(document.getElementById("mark-spokes"), 20, 20, 3, 14.5, 24, "currentColor");
  drawSpokes(document.getElementById("hero-spokes"), 0, 0, 5, 30, 24, "#12305C");
  drawSpokes(document.getElementById("watermark-spokes"), 100, 100, 10, 78, 24, "#12305C");

  /* ======================================================================
     2. AMBIENT CANVAS — drifting tricolour motes + slow chakra light sweep
     ====================================================================== */
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;
  const COLORS = ["#FF9933", "#F3E9D2", "#0C7C3F", "#12305C"];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }

  function makeParticles() {
    const count = Math.min(70, Math.floor((W * H) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.2 + Math.random() * 2.4,
      speed: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.15 + Math.random() * 0.25,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!prefersReducedMotion) requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener("resize", () => { resize(); makeParticles(); });
  if (!prefersReducedMotion) requestAnimationFrame(tick);
  else tick();

  /* ======================================================================
     3. WISHES — public-domain / historical lines + original telegram wishes
     ====================================================================== */
  const QUOTES = [
    { text: "Freedom is never dear at any price. It is the breath of life. What would a man not pay for living?", by: "Mahatma Gandhi" },
    { text: "Long years ago we made a tryst with destiny, and now the time comes when we shall redeem our pledge.", by: "Jawaharlal Nehru" },
    { text: "Give me blood, and I shall give you freedom!", by: "Netaji Subhas Chandra Bose" },
    { text: "It does not matter who I am. What matters is the idea that I represent.", by: "Bhagat Singh" },
    { text: "Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action.", by: "Dr. A.P.J. Abdul Kalam" },
    { text: "In the light of freedom, everything else finds its true colour.", by: "Sarojini Naidu, adapted" },
    { text: "Where the mind is without fear and the head is held high — let my country awake.", by: "Rabindranath Tagore" },
    { text: "May your tricolour fly higher than every doubt, and your dreams run faster than every border.", by: "Tiranga Taar wish" },
    { text: "Not just a flag on a pole — a promise carried in every heartbeat of this land.", by: "Tiranga Taar wish" },
    { text: "Here's to the soil that raised us, the sacrifice that freed us, and the dream that still calls us.", by: "Tiranga Taar wish" },
    { text: "Saffron for courage, white for peace, green for growth — carry all three with you today.", by: "Tiranga Taar wish" },
    { text: "Eighty years of the flag, a thousand years of the story it flies over.", by: "Tiranga Taar wish" },
  ];

  let quoteIndex = Math.floor(Math.random() * QUOTES.length);

  const quoteTextEl = document.getElementById("quote-text");
  const quoteAttrEl = document.getElementById("quote-attr");
  const pcQuoteEl = document.getElementById("pc-quote");
  const pcAttrEl = document.getElementById("pc-attr");
  const pcNameEl = document.getElementById("pc-name");
  const nameInput = document.getElementById("name-input");

  function renderQuote() {
    const q = QUOTES[quoteIndex];
    quoteTextEl.textContent = q.text;
    quoteAttrEl.textContent = `— ${q.by}`;
    pcQuoteEl.textContent = q.text;
    pcAttrEl.textContent = `— ${q.by}`;
    resetSeal();
  }

  function renderName() {
    const v = nameInput.value.trim();
    pcNameEl.textContent = v ? `Jai Hind, ${v}!` : "Jai Hind, Friend!";
    resetSeal();
  }

  document.getElementById("shuffle-btn").addEventListener("click", () => {
    let next = quoteIndex;
    while (next === quoteIndex) next = Math.floor(Math.random() * QUOTES.length);
    quoteIndex = next;
    renderQuote();
  });
  nameInput.addEventListener("input", renderName);

  /* ======================================================================
     4. FORMAT CHIPS
     ====================================================================== */
  const postcardEl = document.getElementById("postcard");
  const formatRow = document.getElementById("format-row");
  let currentFormat = "post"; // post=1:1  portrait=4:5  story=9:16
  const FORMAT_DIMS = {
    post: { w: 1080, h: 1080, cls: "" },
    portrait: { w: 1080, h: 1350, cls: "postcard--portrait" },
    story: { w: 1080, h: 1920, cls: "postcard--story" },
  };

  formatRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".format-chip");
    if (!btn) return;
    formatRow.querySelectorAll(".format-chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFormat = btn.dataset.format;
    postcardEl.className = "postcard " + (FORMAT_DIMS[currentFormat].cls || "");
    resetSeal();
  });

  /* ======================================================================
     5. SEAL / POSTMARK
     ====================================================================== */
  const sealBtn = document.getElementById("seal-btn");
  const postmarkEl = document.getElementById("postmark");
  const downloadBtn = document.getElementById("download-btn");
  const shareBtn = document.getElementById("share-btn");
  const hintEl = document.getElementById("composer-hint");
  let sealed = false;

  function resetSeal() {
    sealed = false;
    postmarkEl.classList.remove("is-stamped");
    downloadBtn.disabled = true;
    shareBtn.disabled = true;
    hintEl.textContent = "Press seal to stamp the postmark, then download or share it anywhere.";
  }

  function playStampThud() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = ensureAudioCtx();
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain).connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) { /* silent — decorative only */ }
  }

  sealBtn.addEventListener("click", () => {
    sealed = true;
    sealBtn.classList.add("is-stamping");
    setTimeout(() => sealBtn.classList.remove("is-stamping"), 500);
    postmarkEl.classList.add("is-stamped");
    downloadBtn.disabled = false;
    shareBtn.disabled = false;
    hintEl.textContent = "Sealed! Your postcard is ready to travel.";
    playStampThud();
    burstConfetti();
  });

  /* small celebratory burst on seal, independent of ambient loop */
  function burstConfetti() {
    if (prefersReducedMotion) return;
    const rect = postcardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + window.scrollY + 40;
    const bits = Array.from({ length: 36 }, () => ({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 7 - 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 60 + Math.random() * 20,
      size: 3 + Math.random() * 3,
    }));
    function frame() {
      ctx.save();
      bits.forEach((b) => {
        b.vy += 0.18;
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 1;
        ctx.globalAlpha = Math.max(b.life / 80, 0);
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.size, b.size);
      });
      ctx.restore();
      if (bits.some((b) => b.life > 0)) requestAnimationFrame(frame);
    }
    frame();
  }

  /* ======================================================================
     6. CANVAS EXPORT — redraw the postcard at full resolution for download
     ====================================================================== */
  const renderCanvas = document.getElementById("render-canvas");

  function wrapText(c, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    words.forEach((word) => {
      const test = line + word + " ";
      if (c.measureText(test).width > maxWidth && line) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = test;
      }
    });
    lines.push(line.trim());
    lines.forEach((l, i) => c.fillText(l, x, y + i * lineHeight));
    return lines.length * lineHeight;
  }

  function drawSpokesCanvas(c, cx, cy, rInner, rOuter, count, color, width) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      c.beginPath();
      c.moveTo(cx + rInner * Math.cos(a), cy + rInner * Math.sin(a));
      c.lineTo(cx + rOuter * Math.cos(a), cy + rOuter * Math.sin(a));
      c.stroke();
    }
  }

  function drawArcText(c, text, cx, cy, radius, startAngle, clockwise, color, font, letterSpacing) {
    c.save();
    c.fillStyle = color;
    c.font = font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const dir = clockwise ? 1 : -1;
    let angle = startAngle;
    // measure total angular width first
    const widths = [...text].map((ch) => c.measureText(ch).width + letterSpacing);
    const total = widths.reduce((a, b) => a + b, 0) / radius;
    angle -= (dir * total) / 2;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const w = widths[i];
      angle += (dir * (w / radius)) / 2;
      c.save();
      c.translate(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      c.rotate(angle + (clockwise ? Math.PI / 2 : -Math.PI / 2));
      c.fillText(ch, 0, 0);
      c.restore();
      angle += (dir * (w / radius)) / 2;
    }
    c.restore();
  }

  function renderPostcardToCanvas() {
    const { w, h } = FORMAT_DIMS[currentFormat];
    renderCanvas.width = w;
    renderCanvas.height = h;
    const c = renderCanvas.getContext("2d");
    const scale = w / 1080; // base design at 1080 wide

    // paper base
    c.fillStyle = "#F3E9D2";
    c.fillRect(0, 0, w, h);

    // subtle texture lines
    c.strokeStyle = "rgba(42,31,20,0.035)";
    c.lineWidth = 2;
    for (let i = -h; i < w; i += 8) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i + h, h);
      c.stroke();
    }

    // top/bottom stripes
    const stripeH = 22 * scale;
    let g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#FF9933"); g.addColorStop(1, "#E07B1A");
    c.fillStyle = g; c.fillRect(0, 0, w, stripeH);
    g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#0C7C3F"); g.addColorStop(1, "#0A5E30");
    c.fillStyle = g; c.fillRect(0, h - stripeH, w, stripeH);

    // watermark chakra
    c.save();
    c.globalAlpha = 0.06;
    c.translate(w / 2, h / 2);
    c.strokeStyle = "#12305C"; c.lineWidth = 4 * scale;
    c.beginPath(); c.arc(0, 0, 300 * scale, 0, Math.PI * 2); c.stroke();
    c.fillStyle = "#12305C";
    c.beginPath(); c.arc(0, 0, 30 * scale, 0, Math.PI * 2); c.fill();
    drawSpokesCanvas(c, 0, 0, 40 * scale, 290 * scale, 24, "#12305C", 4 * scale);
    c.restore();

    // stamp corner (top right)
    const sx = w - 210 * scale, sy = 50 * scale, sw = 150 * scale, sh = 184 * scale;
    c.save();
    c.strokeStyle = "#2A1F14"; c.lineWidth = 3 * scale; c.setLineDash([6 * scale, 6 * scale]);
    c.fillStyle = "#F3E9D2"; c.fillRect(sx, sy, sw, sh); c.strokeRect(sx, sy, sw, sh);
    c.setLineDash([]);
    c.fillStyle = "#FF9933"; c.fillRect(sx + 14 * scale, sy + 14 * scale, sw - 28 * scale, sh * 0.36);
    c.fillStyle = "#F3E9D2"; c.fillRect(sx + 14 * scale, sy + 14 * scale + sh * 0.36, sw - 28 * scale, sh * 0.14);
    c.fillStyle = "#0C7C3F"; c.fillRect(sx + 14 * scale, sy + 14 * scale + sh * 0.5, sw - 28 * scale, sh * 0.36);
    c.strokeStyle = "#12305C"; c.lineWidth = 2.4 * scale;
    c.beginPath(); c.arc(sx + sw / 2, sy + 14 * scale + sh * 0.36 + sh * 0.07, 13 * scale, 0, Math.PI * 2); c.stroke();
    c.restore();

    // text block
    const padX = 64 * scale;
    let cy = h - 340 * scale;
    if (currentFormat === "post") cy = h - 300 * scale;

    c.fillStyle = "#A6192E";
    c.font = `700 ${20 * scale}px 'Space Mono', monospace`;
    c.textAlign = "left";
    c.fillText("भारत — INDIA", padX, cy);
    cy += 46 * scale;

    c.fillStyle = "#12305C";
    c.font = `400 ${52 * scale}px 'Yatra One', serif`;
    cy += 4 * scale;
    c.fillText("Happy 80th", padX, cy);
    cy += 58 * scale;
    c.fillText("Independence Day", padX, cy);
    cy += 56 * scale;

    c.fillStyle = "#2A1F14";
    c.font = `700 ${30 * scale}px 'Hind', sans-serif`;
    c.fillText(pcNameEl.textContent, padX, cy);
    cy += 46 * scale;

    c.font = `400 ${26 * scale}px 'Hind', sans-serif`;
    const used = wrapText(c, QUOTES[quoteIndex].text, padX, cy, w - padX * 2 - 40 * scale, 34 * scale);
    cy += used + 8 * scale;

    c.fillStyle = "rgba(42,31,20,0.6)";
    c.font = `400 ${22 * scale}px 'Hind', sans-serif`;
    c.fillText(`— ${QUOTES[quoteIndex].by}`, padX, cy);

    // footer
    c.fillStyle = "rgba(42,31,20,0.5)";
    c.font = `400 ${18 * scale}px 'Space Mono', monospace`;
    c.fillText("#HarGharTiranga · India @ 80", padX, h - 34 * scale);

    // postmark seal (bottom right)
    if (sealed) {
      const pcx = w - 150 * scale, pcy = h - 150 * scale, pr = 92 * scale;
      c.save();
      c.translate(pcx, pcy);
      c.rotate(-14 * Math.PI / 180);
      c.strokeStyle = "#A6192E";
      c.lineWidth = 3 * scale;
      c.beginPath(); c.arc(0, 0, pr, 0, Math.PI * 2); c.stroke();
      c.lineWidth = 1.4 * scale;
      c.beginPath(); c.arc(0, 0, pr - 8 * scale, 0, Math.PI * 2); c.stroke();
      drawArcText(c, "TIRANGA TAAR", 0, 0, pr - 22 * scale, -Math.PI / 2, true, "#A6192E", `700 ${13 * scale}px 'Space Mono', monospace`, 3 * scale);
      drawArcText(c, "15 · AUG · 2026", 0, 0, pr - 22 * scale, Math.PI / 2, true, "#A6192E", `700 ${13 * scale}px 'Space Mono', monospace`, 3 * scale);
      c.fillStyle = "#A6192E";
      c.textAlign = "center"; c.textBaseline = "middle";
      c.font = `700 ${22 * scale}px 'Space Mono', monospace`;
      c.fillText("JAI HIND", 0, 8 * scale);
      c.restore();
    }
  }

  async function ensureFontsReady() {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) {}
    }
  }

  downloadBtn.addEventListener("click", async () => {
    await ensureFontsReady();
    renderPostcardToCanvas();
    const link = document.createElement("a");
    link.download = `tiranga-taar-${currentFormat}.png`;
    link.href = renderCanvas.toDataURL("image/png");
    link.click();
  });

  shareBtn.addEventListener("click", async () => {
    await ensureFontsReady();
    renderPostcardToCanvas();
    renderCanvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "tiranga-taar.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Happy 80th Independence Day",
            text: "Made this on Tiranga Taar — Jai Hind! 🇮🇳",
          });
        } catch (e) { /* user cancelled share — fine */ }
      } else {
        const link = document.createElement("a");
        link.download = "tiranga-taar.png";
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    }, "image/png");
  });

  /* ======================================================================
     7. MUSIC — real file if present, graceful synthesised drone fallback
     ====================================================================== */
  const musicBtn = document.getElementById("music-toggle");
  const musicLabel = musicBtn.querySelector(".toolbar__btn-label");
  const audioEl = document.getElementById("bgm");
  const toastEl = document.getElementById("audio-toast");
  let audioCtx = null;
  let synthNodes = null;
  let musicState = "stopped"; // stopped | file | synth
  let toastShown = false;

  function ensureAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    return audioCtx;
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toastEl.hidden = true; }, 6000);
  }

  function startSynthAmbient() {
    const ac = ensureAudioCtx();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);
    master.gain.linearRampToValueAtTime(0.22, ac.currentTime + 1.4);

    // tanpura-style drone: root + fifth, gently detuned
    const freqs = [130.81, 196.0, 261.63]; // C3, G3, C4 — open, neutral drone
    const oscs = freqs.map((f, i) => {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 4;
      const g = ac.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.28;
      o.connect(g).connect(master);
      o.start();
      return o;
    });

    // soft lowpass shimmer noise
    const bufferSize = 2 * ac.sampleRate;
    const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 900;
    const noiseGain = ac.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();

    // gentle tabla-like pulse
    let pulseTimer = setInterval(() => {
      const now = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      o.connect(g).connect(master);
      o.start(now);
      o.stop(now + 0.32);
    }, 2000);

    synthNodes = { master, oscs, noise, pulseTimer };
  }

  function stopSynthAmbient() {
    if (!synthNodes) return;
    const { master, oscs, noise, pulseTimer } = synthNodes;
    clearInterval(pulseTimer);
    const ac = audioCtx;
    master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.6);
    setTimeout(() => {
      oscs.forEach((o) => { try { o.stop(); } catch (e) {} });
      try { noise.stop(); } catch (e) {}
    }, 650);
    synthNodes = null;
  }

  musicBtn.addEventListener("click", async () => {
    if (musicState === "stopped") {
      try {
        await audioEl.play();
        musicState = "file";
      } catch (err) {
        startSynthAmbient();
        musicState = "synth";
        if (!toastShown) {
          showToast("Playing an original ambient drone — drop your own track in assets/audio/bgm.mp3 to use real BGM.");
          toastShown = true;
        }
      }
      musicBtn.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Pause BGM";
    } else if (musicState === "file") {
      audioEl.pause();
      musicState = "stopped";
      musicBtn.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Play BGM";
    } else if (musicState === "synth") {
      stopSynthAmbient();
      musicState = "stopped";
      musicBtn.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Play BGM";
    }
  });

  /* ======================================================================
     8. INITIAL RENDER — run last, once every variable above is declared
     ====================================================================== */
  renderQuote();
  renderName();
})();

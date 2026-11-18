/* =========================================================
   DATANA SOFT — interacciones
   ========================================================= */

/* ---------- CONFIGURACIÓN ----------
   Para recibir los mensajes del formulario en tu correo:
   1) Crea un formulario gratis en https://formspree.io
   2) Pega aquí su URL, p. ej. "https://formspree.io/f/abcdwxyz"
   Si se deja vacío, el formulario abre el cliente de correo del visitante. */
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "contacto@datanasoft.com";

/* ---------- Navegación ---------- */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 20);
}, { passive: true });

navToggle?.addEventListener("click", () => navLinks.classList.toggle("is-open"));
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("is-open")));

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Aparición al hacer scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- Contadores del hero ---------- */
document.querySelectorAll("[data-count]").forEach(el => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  const start = performance.now(), dur = 1600;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

/* ---------- Hero: datos desordenados que se ordenan en una esfera ---------- */
(() => {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, DPR, pts = [], t = 0;
  const N = 520;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function init() {
    pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      pts.push({
        sx: Math.cos(th) * r, sy: y, sz: Math.sin(th) * r,        // posición en la esfera
        rx: (Math.random() - .5) * 2.6, ry: (Math.random() - .5) * 2.2, rz: (Math.random() - .5) * 2, // caos
        hue: Math.random()
      });
    }
  }

  function frame() {
    t += 0.004;
    ctx.clearRect(0, 0, W, H);
    // ciclo: caos -> esfera -> mantener -> caos
    const cyc = (t * 0.6) % 2;
    let m = cyc < 1 ? cyc : 2 - cyc;
    m = Math.min(1, Math.max(0, (m - 0.15) / 0.6));
    m = m * m * (3 - 2 * m);

    const cx = W > 760 ? W * 0.72 : W * 0.5, cy = H * 0.5;
    const R = Math.min(W, H) * (W > 760 ? 0.3 : 0.38);
    const rot = t * 1.2, cr = Math.cos(rot), sr = Math.sin(rot);
    const tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);

    const proj = [];
    for (const p of pts) {
      let x = p.rx + (p.sx - p.rx) * m;
      let y = p.ry + (p.sy - p.ry) * m;
      let z = p.rz + (p.sz - p.rz) * m;
      // rotación Y y X
      let x1 = x * cr - z * sr, z1 = x * sr + z * cr;
      let y1 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const s = 1 / (1.9 - z2 * 0.6);
      proj.push({ x: cx + x1 * R * s, y: cy + y1 * R * s, z: z2, s, hue: p.hue });
    }
    proj.sort((a, b) => a.z - b.z);
    for (const p of proj) {
      const a = 0.25 + (p.z + 1) * 0.35;
      const size = (1.6 + (1 - m) * 2.2) * p.s * 1.6;
      ctx.fillStyle = p.hue < 0.5 ? `rgba(34,211,238,${a})` : `rgba(139,92,246,${a})`;
      if (m < 0.6) ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);   // "cubos"
      else { ctx.beginPath(); ctx.arc(p.x, p.y, size / 2, 0, 6.283); ctx.fill(); }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  resize(); init(); frame();
  window.addEventListener("resize", resize);
})();

/* ---------- Metodología: ciclo animado ---------- */
(() => {
  const steps = [...document.querySelectorAll("#steps li")];
  const nodesG = document.getElementById("cycleNodes");
  const progress = document.getElementById("cycleProgress");
  const num = document.getElementById("cycleNum");
  if (!steps.length || !nodesG) return;
  const C = 2 * Math.PI * 150, n = steps.length;
  const nodes = steps.map((_, i) => {
    const a = -Math.PI / 2 + (i / n) * 2 * Math.PI;
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", 200 + 150 * Math.cos(a));
    c.setAttribute("cy", 200 + 150 * Math.sin(a));
    c.setAttribute("r", 11);
    c.setAttribute("class", "cycle__node");
    nodesG.appendChild(c);
    return c;
  });
  let idx = 0, timer;
  function show(i) {
    idx = i;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    nodes.forEach((c, k) => c.classList.toggle("is-on", k <= i));
    progress.style.strokeDashoffset = C - (C * i) / n;
    num.textContent = String(i + 1).padStart(2, "0");
  }
  function loop() { clearInterval(timer); timer = setInterval(() => show((idx + 1) % n), 2600); }
  steps.forEach((s, i) => s.addEventListener("click", () => { show(i); loop(); }));
  show(0); loop();
})();

/* ---------- Formulario de contacto ---------- */
(() => {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = new FormData(form);
    if (FORM_ENDPOINT) {
      note.textContent = "Enviando…";
      try {
        const r = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error();
        form.reset();
        note.textContent = "¡Gracias! Te responderemos muy pronto.";
      } catch {
        note.textContent = `No se pudo enviar. Escríbenos a ${CONTACT_EMAIL}`;
      }
    } else {
      const body = `Nombre: ${data.get("nombre")}\nEmail: ${data.get("email")}\nEmpresa: ${data.get("empresa")}\n\n${data.get("mensaje")}`;
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contacto web DATANA SOFT")}&body=${encodeURIComponent(body)}`;
      note.textContent = "Abriendo tu cliente de correo…";
    }
  });
})();

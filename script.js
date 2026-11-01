// ---------- Edit your details here ----------
const MY_NAME = "Laurenz";

// type  = label shown on the card (e.g. "HTML Activity")
// link  = where "Open activity" goes (Google Drive link, website, etc.)
// image = OPTIONAL preview picture, e.g. "images/act1.png".
//         Leave it out and the preview is made automatically from a Google Drive link.
const activities = [
  { title: "Activity #01", type: "My Resume",                        desc: "A one-page resume showing my background, education and skills, laid out in a clean format so employers can read it at a glance.", link: "https://drive.google.com/file/d/1yuWspalbuSTPtwQrIbQ1WfdpjLp4VWub/view", image: "" },
  { title: "Activity #02", type: "Letter, Header and Footer",        desc: "A formal letter with the proper parts: heading, date, inside address, salutation, body and closing, written in a professional tone.", link: "https://drive.google.com/file/d/1r9t_m7O5bt_WA_9OVy_FpsVI1Icm3pCL/view?usp=sharing", image: "" },
  { title: "Activity #03", type: "Product Poster",                   desc: "A poster that promotes a product with eye-catching images, a bold headline and short text that shows why people should want it.", link: "https://drive.google.com/file/d/1AdECJXHwx5OQBH8ivzurvxBXpdWvoZSU/view?usp=sharing", image: "" },
  { title: "Activity #04", type: "Gardening Brochure",               desc: "A brochure with beginner-friendly gardening tips, arranged with clear headings and pictures so it is easy to read and follow.", link: "#", image: "" },
  { title: "Activity #05", type: "Recreating Logo",                  desc: "An original logo made to represent a brand, using simple shapes, colors and lettering that are easy to remember and recognize.", link: "https://drive.google.com/file/d/1BUIBOqVyxq0L2bWHf0PmO_e4NehpI58F/view", image: "" },
  { title: "Activity #06", type: "Editing with Adobe Photoshop",     desc: "A photo edited in Adobe Photoshop using layers, selections, color correction and effects to improve and transform the image.", link: "https://drive.google.com/file/d/1Wm2cB5-r4mcUPB-VQZGflfhbMUkDeNKS/view?usp=sharing", image: "" }
];

const icons = ["\uD83C\uDFA8", "\uD83D\uDCBB", "\uD83D\uDCDA", "\uD83C\uDFAE", "\uD83C\uDF1F", "\uD83D\uDE80"];

// ---------- Sparkle burst ----------
function burstAt(x, y) {
  const em = ["\u2B50", "\u2728", "\uD83D\uDC99", "\uD83D\uDC9B"];
  for (let k = 0; k < 14; k++) {
    const s = document.createElement("span");
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 80;
    s.className = "spark";
    s.textContent = em[k % em.length];
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(a) * d + "px");
    s.style.setProperty("--dy", Math.sin(a) * d + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
function burstFrom(el) {
  const r = el.getBoundingClientRect();
  burstAt(r.left + r.width / 2, r.top + r.height / 2);
}

// ---------- Preview image + type label ----------
function driveId(url) {
  const m = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  return url.includes("drive.google.com") && m ? m[1] : null;
}
function previewFor(act) {
  if (act.image) return act.image;                                   // your own picture
  const id = driveId(act.link);
  if (id) return "https://drive.google.com/thumbnail?id=" + id + "&sz=w800";   // Drive file preview
  if (/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(act.link)) return act.link;    // link is an image
  return null;
}
function typeFor(act) {
  return act.type || (driveId(act.link) ? "Google Drive File" : "Activity");
}
function makePreview(act, i) {
  const box = document.createElement("div");
  box.className = "thumb";
  const showIcon = () => { box.replaceChildren(); box.textContent = icons[i]; };
  const src = previewFor(act);
  if (!src) { showIcon(); return box; }
  const img = new Image();
  img.alt = act.title + " preview";
  img.loading = "lazy";
  img.addEventListener("error", showIcon);   // if it can't load, show the emoji instead
  img.src = src;
  box.append(img);
  return box;
}

// ---------- Build flip cards ----------
const grid = document.getElementById("grid");
const mk = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};
activities.forEach((act, i) => {
  const card = mk("article", "card");
  card.tabIndex = 0;
  card.dataset.type = typeFor(act);
  const inner = mk("div", "inner");

  const front = mk("div", "face front");
  front.append(makePreview(act, i), mk("h3", "", act.title), mk("span", "type", typeFor(act)));

  const back = mk("div", "face back");
  back.append(makePreview(act, i), mk("h3", "", act.title), mk("p", "", act.desc));
  if (act.link && act.link !== "#") {
    const open = mk("a", "btn small", "Open activity");
    open.href = act.link; open.target = "_blank"; open.rel = "noopener";
    open.addEventListener("click", e => e.stopPropagation());
    back.append(open);
  }

  inner.append(front, back);
  card.append(inner);
  card.addEventListener("click", () => { card.classList.toggle("flipped"); burstFrom(card); });
  grid.append(card);
});

// ---------- Filter buttons ----------
const filters = document.getElementById("filters");
["All", ...new Set(activities.map(typeFor))].forEach((t, i) => {
  const b = mk("button", "chip" + (i === 0 ? " on" : ""), t);
  b.addEventListener("click", () => {
    filters.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
    grid.querySelectorAll(".card").forEach(c => c.classList.toggle("hide", t !== "All" && c.dataset.type !== t));
  });
  filters.append(b);
});

// ---------- Rotating role text ----------
const roles = ["student", "web learner", "creative", "dreamer"];
const roleEl = document.getElementById("role");
let r = 0;
setInterval(() => {
  roleEl.classList.add("out");
  setTimeout(() => { roleEl.textContent = roles[++r % roles.length]; roleEl.classList.remove("out"); }, 300);
}, 2200);

// ---------- Reveal on scroll ----------
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .15 });
  reveals.forEach(n => io.observe(n));
} else reveals.forEach(n => n.classList.add("in"));

// ---------- Click phone/email to copy ----------
const toast = document.getElementById("toast");
let toastTimer;
document.querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
  const text = btn.dataset.copy;
  try { await navigator.clipboard.writeText(text); toast.textContent = "Copied: " + text; }
  catch (err) { toast.textContent = "Copy failed. Select it manually."; }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}));

// ---------- Typing effect for the name ----------
const typed = document.getElementById("typed");
let idx = 0;
function type() {
  if (idx <= MY_NAME.length) {
    typed.textContent = MY_NAME.slice(0, idx++);
    setTimeout(type, 140);
  }
}
type();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Highlight active nav link while scrolling ----------
const links = document.querySelectorAll(".nav-link");
const sections = ["home", "about", "portfolio"].map(id => document.getElementById(id));
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY + 120;
  let current = "home";
  sections.forEach(s => { if (y >= s.offsetTop) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  toTop.classList.toggle("show", window.scrollY > 400);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("progress").style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll);
onScroll();

// ---------- Back to top ----------
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Night mode ----------
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const dark = theme === "dark";
  themeToggle.textContent = dark ? "\u2600\uFE0F" : "\uD83C\uDF19";   // sun / moon
  themeToggle.setAttribute("aria-pressed", dark);
  themeToggle.setAttribute("aria-label", dark ? "Switch to day mode" : "Switch to night mode");
}

// remembered choice -> otherwise the device's setting
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Cute avatar: click for a message + sparkles ----------
const avatar = document.getElementById("avatar");
const bubble = document.getElementById("bubble");
const messages = ["Hi! I'm Laurenz \uD83D\uDC99", "Thanks for visiting! \u2728", "Check out my work! \uD83D\uDE80", "You're awesome! \u2B50", "Hehe, that tickles! \uD83D\uDE04"];
let msgIdx = 0;
function sayHi() {
  bubble.textContent = messages[msgIdx++ % messages.length];
  avatar.classList.remove("bounce");
  void avatar.offsetWidth;            // restart the animation
  avatar.classList.add("bounce");
  burstFrom(avatar);
}
avatar.addEventListener("click", sayHi);
avatar.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sayHi(); }
});

// ---------- Use your PNGs (falls back to the built-in LP logo / cartoon if a file is missing) ----------
function useImage(img, box) {
  const ok = () => box.classList.add("has-img");
  if (img.complete && img.naturalWidth > 0) ok();
  else img.addEventListener("load", ok);
  img.addEventListener("error", () => img.remove());
}
useImage(document.getElementById("logoImg"), document.getElementById("logo"));

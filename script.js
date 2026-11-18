/* ============================================================
   EDIT YOUR CONTENT HERE — the page renders itself from these arrays
   ============================================================ */
const socials = [
  { label: "GitHub", url: "https://github.com/" },
  { label: "LinkedIn", url: "https://linkedin.com/" },
  { label: "X / Twitter", url: "https://x.com/" },
  { label: "Email", url: "mailto:hello@example.com" }
];

const stats = [
  { value: "8+", label: "Years of experience" },
  { value: "60+", label: "Projects delivered" },
  { value: "35", label: "Happy clients" },
  { value: "12", label: "Open-source repos" }
];

const skills = [
  { group: "Frontend", items: [["HTML / CSS", 95], ["JavaScript", 90], ["React", 80]] },
  { group: "Backend", items: [["Node.js", 85], ["PHP / Laravel", 85], ["C# / .NET", 80]] },
  { group: "Mobile & Tools", items: [["Flutter / Dart", 75], ["Git & CI/CD", 88], ["SQL", 85]] }
];

const projects = [
  { title: "Shop Engine", type: "Web", icon: "\u{1F6D2}", colors: ["#4f6bff", "#7c3aed"], desc: "Headless e-commerce platform with cart, checkout and an admin panel.", tags: ["PHP", "MySQL", "JS"], demo: "#", code: "#" },
  { title: "FitTrack", type: "Mobile", icon: "\u{1F4AA}", colors: ["#14b8a6", "#0ea5e9"], desc: "Cross-platform workout tracker with charts and offline sync.", tags: ["Flutter", "Dart", "SQLite"], demo: "#", code: "#" },
  { title: "Invoice API", type: "API", icon: "\u{1F9FE}", colors: ["#f59e0b", "#ef4444"], desc: "Clean-architecture REST API for invoicing with JWT auth and Swagger docs.", tags: ["C#", ".NET 8", "Docker"], demo: "#", code: "#" },
  { title: "Analytics Dashboard", type: "Web", icon: "\u{1F4CA}", colors: ["#8b5cf6", "#ec4899"], desc: "Real-time dashboard with filters, charts and CSV export.", tags: ["JS", "Charts", "CSS"], demo: "#", code: "#" },
  { title: "Task CLI", type: "API", icon: "✅", colors: ["#22c55e", "#14b8a6"], desc: "Zero-dependency command-line task manager with undo support.", tags: ["Python", "CLI"], demo: "#", code: "#" },
  { title: "Delivery App", type: "Mobile", icon: "\u{1F6F5}", colors: ["#ef4444", "#f97316"], desc: "Android app for local deliveries with live order tracking.", tags: ["Android", "Java", "Maps"], demo: "#", code: "#" }
];

const experience = [
  { when: "2022 — Present", role: "Senior Full-Stack Developer", where: "Acme Software", text: "Lead a team of four building a SaaS platform used by 20k+ people. Cut page load time by 45%." },
  { when: "2018 — 2022", role: "Full-Stack Developer", where: "Brightside Studio", text: "Delivered e-commerce and booking systems for 25+ clients across web and mobile." },
  { when: "2015 — 2018", role: "Junior Developer", where: "Pixel & Code", text: "Built websites and internal tools; introduced code review and automated testing." }
];

/* ============================================================
   Rendering and interactivity (no need to edit below)
   ============================================================ */
const $ = (s) => document.querySelector(s);

$("#socials").innerHTML = socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("");
$("#stats").innerHTML = stats.map(s => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("");

$("#skills-grid").innerHTML = skills.map(g => `
  <div class="skill-card"><h3>${g.group}</h3>
  ${g.items.map(([n, v]) => `<div class="skill"><div class="skill-top"><span>${n}</span><span>${v}%</span></div><div class="bar"><i data-w="${v}"></i></div></div>`).join("")}
  </div>`).join("");

$("#timeline").innerHTML = experience.map(e => `
  <li><span class="when">${e.when}</span><h3>${e.role}</h3><div class="where">${e.where}</div><p>${e.text}</p></li>`).join("");

// Projects with category filter
const types = ["All", ...new Set(projects.map(p => p.type))];
$("#filters").innerHTML = types.map((t, i) => `<button class="filter${i ? "" : " active"}" data-type="${t}">${t}</button>`).join("");
function renderProjects(type) {
  $("#projects-grid").innerHTML = projects.filter(p => type === "All" || p.type === type).map(p => `
    <article class="project">
      <div class="thumb" style="background:linear-gradient(135deg,${p.colors[0]},${p.colors[1]})">${p.icon}</div>
      <div class="project-body">
        <h3>${p.title}</h3><p>${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <div class="links"><a href="${p.demo}">Live demo &rarr;</a><a href="${p.code}">Source</a></div>
      </div>
    </article>`).join("");
}
renderProjects("All");
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".filter"); if (!b) return;
  document.querySelectorAll(".filter").forEach(f => f.classList.toggle("active", f === b));
  renderProjects(b.dataset.type);
});

// Animate skill bars when they scroll into view
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.style.width = en.target.dataset.w + "%"; io.unobserve(en.target); } });
}, { threshold: .4 });
document.querySelectorAll(".bar i").forEach(b => io.observe(b));

// Theme toggle (remembers choice when storage is available)
const root = document.documentElement;
try { const saved = localStorage.getItem("theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
if (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
$("#themeToggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// Mobile menu
const menuBtn = $("#menuToggle"), nav = $("#nav");
menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

// Contact form: opens the visitor's email app (no backend needed)
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = ["name", "email", "message"].map(id => $("#" + id));
  let ok = true;
  f.forEach(el => { const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)); el.classList.toggle("invalid", bad); if (bad) ok = false; });
  const msg = $("#formMsg");
  if (!ok) { msg.style.color = "#ef4444"; msg.textContent = "Please fill in all fields with valid data."; return; }
  const body = encodeURIComponent(`${f[2].value}\n\n— ${f[0].value} (${f[1].value})`);
  window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent("Portfolio contact from " + f[0].value)}&body=${body}`;
  msg.style.color = "";
  msg.textContent = "Thanks! Your email app should open now.";
  e.target.reset();
});

$("#year").textContent = new Date().getFullYear();

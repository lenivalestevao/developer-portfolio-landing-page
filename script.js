/* Developer portfolio: vanilla JavaScript, no dependencies.
   Every page is rendered in the browser and routed with the URL hash
   (#/projects, #/project/2, #/blog/1 ...), so it runs on any static host.
   The theme choice is kept in localStorage. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Storage (falls back to memory if blocked) ---------- */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  /* ---------- Demo data (replace with your own) ---------- */
  const PROJECTS = [
    { id: 1, icon: '🛒', cat: 'Web', hue: 230, year: 2025, role: 'Lead developer', title: 'Shop Engine', desc: 'Headless e-commerce platform with cart, checkout and an admin panel.', tags: ['PHP', 'MySQL', 'JS'], problem: 'A small retailer outgrew its hosted store and needed custom checkout rules without paying per-order fees.', solution: 'I built a headless API with a lightweight storefront and an admin panel for products, orders and discounts.', results: ['Checkout time down 40%', 'Zero per-order platform fees', 'Admin tasks that took an hour now take minutes'] },
    { id: 2, icon: '💪', cat: 'Mobile', hue: 160, year: 2025, role: 'Mobile developer', title: 'FitTrack', desc: 'Cross-platform workout tracker with charts and offline sync.', tags: ['Flutter', 'Dart', 'SQLite'], problem: 'Gym users lose data when the connection drops in the middle of a workout.', solution: 'An offline-first Flutter app that stores every set locally and syncs in the background.', results: ['4.8 average store rating', 'Works fully offline', 'One codebase for iOS and Android'] },
    { id: 3, icon: '🧾', cat: 'API', hue: 25, year: 2024, role: 'Backend developer', title: 'Invoice API', desc: 'Clean-architecture REST API for invoicing with JWT auth and Swagger docs.', tags: ['C#', '.NET 8', 'Docker'], problem: 'Teams needed a reliable invoicing service that other apps could call.', solution: 'A clean-architecture .NET API with JWT auth, validation, background jobs and generated Swagger docs.', results: ['95% test coverage', 'Deployed with one Docker command', 'Used by three internal apps'] },
    { id: 4, icon: '📊', cat: 'Web', hue: 280, year: 2024, role: 'Frontend developer', title: 'Analytics Dashboard', desc: 'Real-time dashboard with filters, charts and CSV export.', tags: ['JS', 'Charts', 'CSS'], problem: 'Managers waited for weekly spreadsheets to see how the business was doing.', solution: 'A live dashboard with filters, drill-down charts and one-click CSV export.', results: ['Reports available in seconds', 'Weekly spreadsheet work removed', 'Accessible keyboard navigation'] },
    { id: 5, icon: '✅', cat: 'API', hue: 190, year: 2023, role: 'Author', title: 'Task CLI', desc: 'Zero-dependency command-line task manager with undo support.', tags: ['Python', 'CLI'], problem: 'Most task tools need an account and a browser tab.', solution: 'A single-file Python CLI that stores tasks locally and supports undo.', results: ['No dependencies', 'Under 300 lines', 'Open source with 200+ stars'] },
    { id: 6, icon: '🛵', cat: 'Mobile', hue: 340, year: 2023, role: 'Mobile developer', title: 'Delivery App', desc: 'Android app for local deliveries with live order tracking.', tags: ['Kotlin', 'Firebase', 'Maps'], problem: 'Local shops had no simple way to follow their own couriers.', solution: 'An Android app with live location, status updates and push notifications.', results: ['Live tracking for 30 couriers', 'Customer calls down 50%', 'Launched in six weeks'] },
    { id: 7, icon: '🔗', cat: 'Web', hue: 210, year: 2022, role: 'Designer and developer', title: 'Link Hub', desc: 'Customizable link-in-bio pages with themes and click analytics.', tags: ['JS', 'Node.js', 'PostgreSQL'], problem: 'Creators wanted a link page that matched their brand.', solution: 'A themeable page builder with a simple editor and privacy-friendly click counts.', results: ['2,000 pages created', 'Loads in under one second', 'No tracking cookies'] },
    { id: 8, icon: '📡', cat: 'API', hue: 45, year: 2022, role: 'Backend developer', title: 'Webhook Relay', desc: 'Reliable webhook delivery with retries, signing and a delivery log.', tags: ['Node.js', 'Redis', 'Docker'], problem: 'Failed webhooks were silently lost during short outages.', solution: 'A queue-based relay that signs, retries with backoff and logs every delivery.', results: ['99.98% delivery rate', 'Replay any event in one click', 'Handles 1M events a day'] }
  ];
  const SKILLS = [
    ['Frontend', [['HTML / CSS', 95], ['JavaScript', 90], ['React', 80], ['Accessibility', 85]]],
    ['Backend', [['Node.js', 85], ['PHP / Laravel', 85], ['C# / .NET', 80], ['SQL', 85]]],
    ['Mobile and Tools', [['Flutter / Dart', 75], ['Git and CI/CD', 88], ['Docker', 78], ['Testing', 82]]]
  ];
  const JOBS = [
    { when: '2023 - Present', role: 'Senior Full-Stack Developer', org: 'Northwind Labs', pts: ['Lead a team of four building a SaaS analytics product', 'Cut page load time by 45% with caching and code splitting', 'Mentor two junior developers'] },
    { when: '2020 - 2023', role: 'Full-Stack Developer', org: 'Orbital Studio', pts: ['Built e-commerce and booking platforms for 15 clients', 'Introduced automated tests and CI/CD', 'Shipped a Flutter app with 20k downloads'] },
    { when: '2018 - 2020', role: 'Backend Developer', org: 'Cascade Software', pts: ['Designed REST APIs in C# and PHP', 'Migrated a legacy monolith to services', 'Reduced infrastructure cost by 30%'] },
    { when: '2016 - 2018', role: 'Junior Web Developer', org: 'Harbor Agency', pts: ['Built responsive websites from design files', 'Learned version control, code review and testing'] }
  ];
  const EDU = [['B.Sc. Computer Science', 'State University', '2012 - 2016'], ['Cloud Architect certificate', 'Cloud Academy', '2021']];
  const SERVICES = [
    ['🌐', 'Web Development', 'Fast, accessible websites and web apps built to last.', 'From $2,500'],
    ['📱', 'Mobile Apps', 'Cross-platform apps for iOS and Android with Flutter.', 'From $4,000'],
    ['🔌', 'APIs and Backends', 'Clean, documented and well-tested services.', 'From $3,000'],
    ['🧭', 'Consulting', 'Architecture reviews, performance audits and mentoring.', '$90 / hour']
  ];
  const REVIEWS = [
    ['Priya Shah', 'Product Lead, Vertex', 'Alex shipped our dashboard two weeks early and the code was a pleasure to maintain.', 5],
    ['Daniel Osei', 'CTO, Cascade', 'Rare mix of strong engineering and good communication. We keep coming back.', 5],
    ['Marie Laurent', 'Founder, Nimbus', 'He turned a vague idea into a clean product and explained every trade-off along the way.', 5],
    ['Tomás Rivera', 'Engineering Manager, Orbital', 'Our API went from fragile to rock solid. Documentation included.', 4],
    ['Aiko Tanaka', 'Owner, Harbor Shop', 'Our store is faster, and checkout finally works the way our customers expect.', 5]
  ];
  const POSTS = [
    { id: 1, icon: '⚡', hue: 230, cat: 'Performance', date: 'Nov 5, 2026', read: 6, title: 'Five quick wins to speed up any web page', ex: 'Images, fonts, caching and a few lines of CSS that make pages feel instant.', body: ['Most slow pages are slow for the same few reasons. Fix these first.', '## Compress and size images', 'Serve modern formats and always set width and height to avoid layout shift.', '## Load fonts carefully', 'Use font-display swap and preload only the weights you really need.', '## Cache what does not change', 'Long cache headers for static files remove most repeat visits from the network.'] },
    { id: 2, icon: '🧱', hue: 160, cat: 'Architecture', date: 'Oct 18, 2026', read: 8, title: 'Clean architecture without the ceremony', ex: 'How I keep .NET APIs simple while staying testable.', body: ['Clean architecture is useful when it removes coupling, not when it adds folders.', '## Start with the use cases', 'Name each thing the app can do and keep that code free of framework details.', '## Keep boundaries small', 'Two or three layers are enough for most services. Add more only when it hurts.'] },
    { id: 3, icon: '♿', hue: 280, cat: 'Accessibility', date: 'Sep 30, 2026', read: 5, title: 'Accessibility is a feature, not a checklist', ex: 'Small habits that make products usable for everyone.', body: ['Accessible products are better products for all users.', '## Use real elements', 'Buttons, links and labels give you keyboard support and screen reader meaning for free.', '## Test with the keyboard', 'Unplug the mouse for ten minutes. You will find most problems quickly.'] },
    { id: 4, icon: '📱', hue: 25, cat: 'Mobile', date: 'Sep 12, 2026', read: 7, title: 'Offline-first apps with Flutter and SQLite', ex: 'Design for the subway tunnel, not the office Wi-Fi.', body: ['Users do not always have a connection, so the app should not depend on one.', '## Write locally first', 'Save every change to SQLite and show it right away.', '## Sync in the background', 'Queue changes, retry with backoff and resolve conflicts with simple, predictable rules.'] }
  ];
  const STACK = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PHP', 'Laravel', 'C#', '.NET', 'Flutter', 'Docker', 'PostgreSQL', 'Git'];

  /* ---------- Helpers ---------- */
  const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const stars = (n) => '<span class="stars" aria-hidden="true">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>';
  const state = { cat: 'All', q: '' };

  const carBtns = '<div class="car-btns"><button data-action="car" data-d="-1" aria-label="Previous">' + ARROW + '</button><button data-action="car" data-d="1" aria-label="Next">' + ARROW + '</button></div>';
  const head = (title, sub, crumbs) => `<div class="page-head"><div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${(crumbs || []).map((c) => ' / ' + c).join('')}</nav><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
  const tags = (l) => `<div class="tags">${l.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`;
  const projectCard = (p) => `<article class="project"><a class="thumb" href="#/project/${p.id}" style="--h:${p.hue}" aria-label="${esc(p.title)}">${p.icon}</a><div class="body"><h3><a href="#/project/${p.id}">${p.title}</a></h3><p>${p.desc}</p>${tags(p.tags)}<div class="links"><a href="#/project/${p.id}">Case study →</a><a href="https://github.com" target="_blank" rel="noopener">Source</a></div></div></article>`;
  const quote = (r) => `<figure class="quote">${stars(r[3])}<blockquote>“${r[2]}”</blockquote><figcaption class="who"><span class="avatar md">${initials(r[0])}</span><span><b>${r[0]}</b><small>${r[1]}</small></span></figcaption></figure>`;
  const postCard = (p) => `<a class="post" href="#/blog/${p.id}"><div class="thumb" style="--h:${p.hue}">${p.icon}</div><div class="body"><span class="tag" style="align-self:flex-start">${p.cat}</span><h3>${p.title}</h3><p class="muted">${p.ex}</p><small>${p.date} · ${p.read} min read</small></div></a>`;
  const bars = (list) => list.map((s) => `<div class="bar-row"><div><span>${s[0]}</span><span class="muted">${s[1]}%</span></div><div class="bar"><i style="--w:${s[1]}%"></i></div></div>`).join('');
  const timeline = (jobs) => `<div class="timeline">${jobs.map((j) => `<div class="t-item"><small>${j.when}</small><h3>${j.role} · ${j.org}</h3><ul class="checks">${j.pts.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
  const cta = (t, p) => `<section class="section tight"><div class="container"><div class="box center"><h2>${t}</h2><p class="muted" style="margin:10px 0 22px">${p}</p><a class="btn btn-primary btn-lg" href="#/contact">Let's talk ${ARROW}</a></div></div></section>`;
  const bodyHTML = (arr) => arr.map((l) => l.startsWith('## ') ? `<h2>${l.slice(3)}</h2>` : `<p>${l}</p>`).join('');
  const projList = () => {
    const q = state.q.trim().toLowerCase();
    const l = PROJECTS.filter((p) => (state.cat === 'All' || p.cat === state.cat) && (!q || (p.title + p.desc + p.tags.join(' ')).toLowerCase().includes(q)));
    return l.length ? `<div class="grid">${l.map(projectCard).join('')}</div>` : '<div class="empty"><span class="emoji-xl">🔎</span><h3>No projects found</h3><p>Try another filter or search.</p></div>';
  };
  const filterChips = (cur) => ['All', 'Web', 'Mobile', 'API'].map((c) => `<button class="chip ${cur === c ? 'on' : ''}" data-action="proj-cat" data-v="${c}">${c}</button>`).join('');

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = () => `
    <section class="hero"><div class="container">
      <div class="hero-grid">
        <div>
          <span class="status"><i></i>Available for freelance work</span>
          <h1>Hi, I'm <span class="grad">Alex Rivera</span>.<br>I build things for the web.</h1>
          <p class="lead">Full-stack developer with 8+ years of experience crafting fast, accessible and maintainable web and mobile products, from first sketch to production.</p>
          <div class="hero-cta"><a class="btn btn-primary" href="#/projects">View my work</a><a class="btn btn-ghost" href="#/contact">Let's talk</a></div>
          <div class="socials"><a href="https://github.com" target="_blank" rel="noopener">GitHub</a><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a><a href="https://x.com" target="_blank" rel="noopener">X / Twitter</a><a href="#/contact">Email</a></div>
        </div>
        <div class="card-hero"><div class="avatar xl">AR</div>
<div class="code"><span class="k">const</span> alex = {<br>&nbsp;&nbsp;role: <span class="s">"Full-Stack Dev"</span>,<br>&nbsp;&nbsp;stack: [<span class="s">"JS"</span>, <span class="s">"PHP"</span>, <span class="s">"C#"</span>],<br>&nbsp;&nbsp;coffee: <span class="s">"always"</span><br>};</div></div>
      </div>
      <div class="stats" id="statsBar">
        <div class="stat"><b data-count="8" data-suffix="+">0</b><span>Years of experience</span></div>
        <div class="stat"><b data-count="60" data-suffix="+">0</b><span>Projects delivered</span></div>
        <div class="stat"><b data-count="35">0</b><span>Happy clients</span></div>
        <div class="stat"><b data-count="12">0</b><span>Open-source repos</span></div>
      </div>
    </div></section>
    <section class="section"><div class="container split">
      <div><span class="eyebrow">About me</span><h2>Clean code, thoughtful design, real results.</h2></div>
      <div><p class="lead">I'm a developer who cares about the whole product: performance, accessibility and the small details that make software pleasant to use. I work with startups and small teams to turn ideas into reliable applications.</p><p class="lead" style="margin-top:14px">When I'm not coding, I'm contributing to open source, learning something new or mentoring other developers.</p><p style="margin-top:20px"><a class="btn btn-ghost" href="#/about">More about me</a></p></div>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Skills</span><h2>Tools I work with every day</h2></div><a class="btn btn-ghost" href="#/skills">All skills</a></div>
      <div class="grid" id="skillGrid">${SKILLS.map((g) => `<div class="card"><h3 style="margin-bottom:16px">${g[0]}</h3><div class="bars">${bars(g[1])}</div></div>`).join('')}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Projects</span><h2>Selected work</h2></div>${carBtns}</div>
      <div class="carousel">${PROJECTS.map(projectCard).join('')}</div>
      <p class="center" style="margin-top:12px"><a class="btn btn-ghost" href="#/projects">See all projects ${ARROW}</a></p>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Experience</span><h2>Where I've worked</h2></div><a class="btn btn-ghost" href="#/experience">Full experience</a></div>
      ${timeline(JOBS.slice(0, 3))}
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Testimonials</span><h2>Kind words from clients</h2></div>${carBtns}</div>
      <div class="carousel">${REVIEWS.map(quote).join('')}</div>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Writing</span><h2>Latest from the blog</h2></div><a class="btn btn-ghost" href="#/blog">All posts</a></div>
      <div class="grid">${POSTS.slice(0, 3).map(postCard).join('')}</div>
    </div></section>
    ${cta("Have a project in mind?", "I take on a few new projects each quarter. Tell me about yours.")}`;

  pages.projects = () => `
    ${head('Projects', 'A selection of web, mobile and API work.', ['Projects'])}
    <section class="section tight"><div class="container">
      <input class="search" type="search" data-filter="q" placeholder="Search projects" aria-label="Search projects" value="${esc(state.q)}">
      <div class="filters">${filterChips(state.cat)}</div>
      <div id="projList">${projList()}</div>
    </div></section>
    ${cta('Like what you see?', 'Let us build something together.')}`;

  pages.project = (id) => {
    const p = PROJECTS.find((x) => x.id === Number(id));
    if (!p) return pages.notfound();
    const i = PROJECTS.indexOf(p), prev = PROJECTS[i - 1], next = PROJECTS[i + 1];
    return `${head(p.title, p.desc, ['<a href="#/projects">Projects</a>', p.title])}
    <section class="section tight"><div class="narrow article">
      <div class="case-hero" style="--h:${p.hue}">${p.icon}</div>
      <div class="facts"><div class="fact"><small>Role</small><b>${p.role}</b></div><div class="fact"><small>Year</small><b>${p.year}</b></div><div class="fact"><small>Category</small><b>${p.cat}</b></div><div class="fact"><small>Stack</small><b>${p.tags[0]}</b></div></div>
      ${tags(p.tags)}
      <h2>The problem</h2><p>${p.problem}</p>
      <h2>The solution</h2><p>${p.solution}</p>
      <h2>Results</h2><ul class="checks">${p.results.map((r) => `<li>${r}</li>`).join('')}</ul>
      <p style="margin-top:22px"><a class="btn btn-primary" href="https://github.com" target="_blank" rel="noopener">View source</a> <a class="btn btn-ghost" href="#/contact">Build something similar</a></p>
      <div class="pager">${prev ? `<a class="btn btn-ghost" href="#/project/${prev.id}">← ${prev.title}</a>` : '<span></span>'}${next ? `<a class="btn btn-ghost" href="#/project/${next.id}">${next.title} →</a>` : ''}</div>
    </div></section>`;
  };

  pages.about = () => `
    ${head('About me', 'Developer, mentor and lifelong learner.', ['About'])}
    <section class="section tight"><div class="container split">
      <div class="card" style="text-align:center"><div class="avatar xl">AR</div><h3>Alex Rivera</h3><p>Full-Stack Developer</p><p>📍 Remote · available worldwide</p></div>
      <div><span class="eyebrow">My story</span><h2>Clean code, thoughtful design, real results.</h2><p class="lead" style="margin-top:14px">I started building websites for friends at 16 and never stopped. Today I help startups and small teams ship reliable web and mobile products.</p><p class="lead" style="margin-top:14px">I care about performance, accessibility and code that the next developer will thank me for. Outside work I contribute to open source, write about what I learn and mentor newcomers.</p></div>
    </div></section>
    <section class="section alt"><div class="container"><div class="section-head"><h2>What I value</h2></div><div class="grid">
      <div class="card"><span class="ico">🎯</span><h3>Focus on outcomes</h3><p>Features are a means. Results for your users are the goal.</p></div>
      <div class="card"><span class="ico">🧼</span><h3>Maintainable code</h3><p>Simple, tested and documented so it keeps working.</p></div>
      <div class="card"><span class="ico">🤝</span><h3>Clear communication</h3><p>Regular updates, honest estimates and no surprises.</p></div></div></div></section>
    <section class="section"><div class="container"><div class="section-head"><h2>Tech I use</h2></div><div class="tags">${STACK.map((s) => `<span class="chip">${s}</span>`).join('')}</div></div></section>
    ${cta('Want to work together?', 'I would love to hear about your project.')}`;

  pages.skills = () => `
    ${head('Skills', 'The tools and technologies I use every day.', ['Skills'])}
    <section class="section tight"><div class="container"><div class="grid" id="skillGrid">${SKILLS.map((g) => `<div class="card"><h3 style="margin-bottom:16px">${g[0]}</h3><div class="bars">${bars(g[1])}</div></div>`).join('')}</div></div></section>
    <section class="section"><div class="container"><div class="section-head"><h2>Also comfortable with</h2></div><div class="tags">${STACK.map((s) => `<span class="chip">${s}</span>`).join('')}</div></div></section>`;

  pages.experience = () => `
    ${head('Experience', 'Ten years of building for the web.', ['Experience'])}
    <section class="section tight"><div class="narrow">${timeline(JOBS)}
      <h2 style="margin:20px 0 16px">Education</h2>
      <div class="grid two">${EDU.map((e) => `<div class="card"><h3>${e[0]}</h3><p>${e[1]} · ${e[2]}</p></div>`).join('')}</div>
      <p style="margin-top:28px"><a class="btn btn-primary" href="#/resume">View résumé</a></p>
    </div></section>`;

  pages.services = () => `
    ${head('Services', 'How I can help your team or business.', ['Services'])}
    <section class="section tight"><div class="container"><div class="grid four">${SERVICES.map((s) => `<div class="card"><span class="ico">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p><div class="price"><small>${s[3]}</small></div><a class="btn btn-ghost btn-block" href="#/contact">Get a quote</a></div>`).join('')}</div></div></section>
    <section class="section alt"><div class="container narrow"><div class="section-head"><h2>How we work together</h2></div><div class="timeline">
      <div class="t-item"><small>Step 1</small><h3>Discovery call</h3><p class="muted">We talk goals, users and budget. Free and without obligation.</p></div>
      <div class="t-item"><small>Step 2</small><h3>Proposal</h3><p class="muted">You get a clear scope, timeline and price.</p></div>
      <div class="t-item"><small>Step 3</small><h3>Build in weeks</h3><p class="muted">Short iterations with a demo every week.</p></div>
      <div class="t-item"><small>Step 4</small><h3>Launch and support</h3><p class="muted">Deployment, documentation and 30 days of support.</p></div></div></div></section>
    ${cta('Not sure what you need?', 'Book a free 30-minute call and we will figure it out.')}`;

  pages.testimonials = () => `
    ${head('Testimonials', 'What clients and teammates say.', ['Testimonials'])}
    <section class="section tight"><div class="container"><div class="grid">${REVIEWS.map(quote).join('')}</div></div></section>
    ${cta('Join them', 'Tell me about your next project.')}`;

  pages.blog = (id) => {
    if (id) return postPage(id);
    return `${head('Blog', 'Notes on engineering, design and building products.', ['Blog'])}
    <section class="section tight"><div class="container"><div class="grid">${POSTS.map(postCard).join('')}</div>
      <form class="box center stack" data-form="newsletter" style="margin-top:40px"><h3>Get new posts by email</h3><p class="muted">One short email a month. No spam.</p><div style="display:flex;gap:10px;max-width:440px;margin:0 auto;flex-wrap:wrap"><input type="email" required placeholder="you@example.com" aria-label="Email" style="flex:1;min-width:200px"><button class="btn btn-primary">Subscribe</button></div></form>
    </div></section>`;
  };
  function postPage(id) {
    const p = POSTS.find((x) => x.id === Number(id));
    if (!p) return pages.notfound();
    const more = POSTS.filter((x) => x.id !== p.id).slice(0, 3);
    return `${head(p.title, p.date + ' · ' + p.read + ' min read', ['<a href="#/blog">Blog</a>', p.cat])}
    <section class="section tight"><div class="narrow article"><div class="case-hero" style="--h:${p.hue};height:200px">${p.icon}</div>${bodyHTML(p.body)}<p style="margin-top:26px"><a class="btn btn-ghost" href="#/blog">← All posts</a></p></div></section>
    <section class="section alt"><div class="container"><div class="section-head"><h2>Keep reading</h2></div><div class="grid">${more.map(postCard).join('')}</div></div></section>`;
  }

  pages.contact = () => `
    ${head('Contact', "Have a project, a question or just want to say hi? I reply within two days.", ['Contact'])}
    <section class="section tight"><div class="container two-col">
      <form class="box stack" data-form="contact"><h3>Send a message</h3>
        <div class="form-grid"><div class="field"><label>Name</label><input required placeholder="Jane Doe"></div><div class="field"><label>Email</label><input type="email" required placeholder="you@example.com"></div></div>
        <div class="form-grid"><div class="field"><label>Project type</label><select><option>Website</option><option>Mobile app</option><option>API or backend</option><option>Consulting</option></select></div><div class="field"><label>Budget</label><select><option>Under $3k</option><option>$3k to $10k</option><option>$10k+</option><option>Not sure yet</option></select></div></div>
        <div class="field"><label>Message</label><textarea rows="5" required placeholder="Tell me about your project"></textarea></div>
        <button class="btn btn-primary btn-lg">Send message</button></form>
      <aside class="box"><h3>Other ways to reach me</h3>
        <div class="contact-row"><span>📧</span><div><b>Email</b><small>hello@alex.dev</small></div></div>
        <div class="contact-row"><span>💼</span><div><b>LinkedIn</b><small>linkedin.com/in/alexrivera</small></div></div>
        <div class="contact-row"><span>🐙</span><div><b>GitHub</b><small>github.com/alexrivera</small></div></div>
        <div class="contact-row"><span>🕘</span><div><b>Availability</b><small>Taking new projects from next month</small></div></div>
        <p class="muted" style="margin-top:12px">Sample details. Replace them with your own.</p></aside>
    </div></section>`;

  pages.resume = () => `
    ${head('Résumé', 'Print it or save it as a PDF.', ['Résumé'])}
    <section class="section tight"><div class="narrow">
      <p class="no-print" style="margin-bottom:18px"><button class="btn btn-primary" data-action="print">Print or save as PDF</button></p>
      <div class="resume">
        <h1>Alex Rivera</h1><p>Full-Stack Developer · hello@alex.dev · Remote</p>
        <h2>Summary</h2><p>Full-stack developer with 8+ years of experience building fast, accessible and maintainable web and mobile products.</p>
        <h2>Experience</h2>${JOBS.map((j) => `<div class="row"><span>${j.role}, ${j.org}</span><span>${j.when}</span></div><ul>${j.pts.map((x) => `<li>${x}</li>`).join('')}</ul>`).join('')}
        <h2>Skills</h2><p>${STACK.join(' · ')}</p>
        <h2>Education</h2>${EDU.map((e) => `<div class="row"><span>${e[0]}, ${e[1]}</span><span>${e[2]}</span></div>`).join('')}
      </div></div></section>`;

  pages.privacy = () => `${head('Privacy', 'Sample text. Replace it with your own policy before going live.', ['Privacy'])}<section class="section tight"><div class="narrow box article"><h2>What this site stores</h2><p>This template stores only your light or dark theme choice, in your own browser. Nothing is sent to a server.</p><h2>Forms</h2><p>The contact and newsletter forms are demos. Connect them to your own service and describe it here.</p></div></section>`;
  pages.notfound = () => '<section class="section"><div class="narrow center"><div class="empty"><span class="emoji-xl">🧭</span><h1>Page not found</h1><p class="lead" style="margin:10px 0 20px">The page you are looking for does not exist.</p><a class="btn btn-primary btn-lg" href="#/">Back to home</a></div></div></section>';

  /* ---------- Router ---------- */
  const TITLES = { projects: 'Projects', project: 'Project', about: 'About', skills: 'Skills', experience: 'Experience', services: 'Services', testimonials: 'Testimonials', blog: 'Blog', contact: 'Contact', resume: 'Résumé', privacy: 'Privacy' };
  const ROUTE_GROUP = { project: 'projects' };
  function render() {
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    let key = parts[0] || 'home';
    if (!pages[key]) key = 'notfound';
    $('#view').innerHTML = pages[key](parts[1]);
    document.title = (TITLES[key] ? TITLES[key] + ' | ' : '') + 'Alex Rivera';
    const group = ROUTE_GROUP[key] || key;
    $$('.nav a[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === group));
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
    observe();
  }

  /* Animated counters and skill bars start when they scroll into view */
  function observe() {
    const bar = $('#statsBar'), sk = $('#skillGrid');
    const countUp = () => $$('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1300);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const fill = () => $$('.bar').forEach((b) => b.classList.add('go'));
    if (!('IntersectionObserver' in window)) { countUp(); fill(); return; }
    const watch = (el, fn) => { if (!el) return; const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { fn(); io.disconnect(); } }, { threshold: 0.3 }); io.observe(el); };
    watch(bar, countUp);
    watch(sk, fill);
  }

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
  }
  applyTheme(store.get('dev-theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  /* ---------- Events ---------- */
  const actions = {
    'nav-toggle': () => document.body.classList.toggle('nav-open'),
    'ui-close': () => document.body.classList.remove('nav-open'),
    theme: () => { const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('dev-theme', t); },
    car: (el) => { const c = el.closest('.section').querySelector('.carousel'); c.scrollBy({ left: Number(el.dataset.d) * (c.firstElementChild.offsetWidth + 22) * 2, behavior: 'smooth' }); },
    'proj-cat': (el) => { state.cat = el.dataset.v; $$('[data-action="proj-cat"]').forEach((b) => b.classList.toggle('on', b === el)); $('#projList').innerHTML = projList(); },
    print: () => window.print()
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) { e.preventDefault(); actions[el.dataset.action](el, e); return; }
    if (e.target.closest('.nav a')) document.body.classList.remove('nav-open');
  });
  document.addEventListener('input', (e) => {
    if (e.target.dataset && e.target.dataset.filter === 'q') { state.q = e.target.value; $('#projList').innerHTML = projList(); }
  });
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    toast(form.dataset.form === 'newsletter' ? 'Subscribed. Thanks!' : 'Message sent. I will reply soon.');
    form.reset();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });

  window.addEventListener('hashchange', render);
  render();
})();

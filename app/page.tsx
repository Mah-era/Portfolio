'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness, Check, ChevronRight, CircleDot, Database, GitBranch, GraduationCap, MapPin, Network, Orbit, Presentation, Radar, Sparkles, Trophy, Workflow, Zap } from 'lucide-react';

const projects = [
  {
    code: '01', title: 'SCM Analytics Studio', label: 'Decision intelligence', image: '/assets/scm-studio.png', alt: 'SCM Analytics Studio executive control tower dashboard',
    statement: 'One control tower for the decisions that keep supply chains moving.',
    summary: 'Transforms raw operational files into clean data, forecasts, risk signals, KPI views, and management-ready exports across the supply-chain cycle.',
    metrics: [['07', 'operational modules'], ['05', 'decision workflows'], ['Offline', 'deployment mode']],
    highlights: ['Demand, inventory, procurement, logistics, warehouse, production, and cost views', 'Forecasting, supplier scorecards, scenarios, and exportable management reports'],
    stack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'SQLite'], repo: 'https://github.com/Mah-era/scm-analytics-studio', demo: 'https://scm-analytics-studio.onrender.com/',
  },
  {
    code: '02', title: 'ForecastSync', label: 'Demand planning', image: '/assets/forecastsync.png', alt: 'ForecastSync demand planning interface',
    statement: 'From business data to a forecast people can actually act on.',
    summary: 'A guided file-to-forecast workflow for validating data, comparing methods, and translating demand signals into inventory recommendations.',
    metrics: [['03', 'file formats'], ['Live', 'quality scoring'], ['Map', 'risk visibility']],
    highlights: ['CSV, Excel, and JSON ingestion with validation and data-quality scoring', 'Forecast error, safety stock, reorder point, stockout risk, and KPI views'],
    stack: ['Next.js', 'TypeScript', 'Recharts', 'Leaflet'], repo: 'https://github.com/Mah-era/ForecastSync', demo: 'https://forecastsync.onrender.com/',
  },
  {
    code: '03', title: 'Distributor Management', label: 'Operations visibility', image: '/assets/distributor-management.png', alt: 'Distribution Management Tracker dashboard',
    statement: 'ERP-style visibility across distributor operations and service.',
    summary: 'Connects distributor, inventory, order, delivery, return, transport, and cost information in one operational interface.',
    metrics: [['15', 'business modules'], ['03', 'export formats'], ['360°', 'operations view']],
    highlights: ['Fifteen modules spanning distribution, warehouse, transport, orders, and returns', 'Operational KPI dashboards with Excel import and PDF, CSV, and JSON export'],
    stack: ['React', 'Vite', 'ECharts', 'SheetJS'], repo: 'https://github.com/Mah-era/scm-distributor-management', demo: 'https://scm-distributor-management-prototype.netlify.app/',
  },
  {
    code: '04', title: 'InsightBI', label: 'Business intelligence', image: '/assets/insightbi.png', alt: 'InsightBI business intelligence platform',
    statement: 'A collaborative BI workspace from raw dataset to shared insight.',
    summary: 'A full-stack platform for uploading data, modelling relationships, building interactive reports, and sharing insights through role-based workspaces.',
    metrics: [['24', 'visualisation types'], ['Role', 'based access'], ['PDF', 'dashboard export']],
    highlights: ['Dataset ingestion, transformation, schema detection, and relationship modelling', 'Interactive reporting, workspace sharing, permissions, and dashboard export'],
    stack: ['React', 'Express', 'Prisma', 'ECharts'], repo: 'https://github.com/Mah-era/insightbi', demo: 'https://insightbi.vercel.app/',
  },
  {
    code: '05', title: 'FruTea', label: 'Product × operations', image: '/assets/frutea-site.webp', alt: 'FruTea product website',
    statement: 'A consumer concept designed from brand promise to operating model.',
    summary: 'Connects product positioning and digital storytelling with demand planning, sourcing logic, inventory policy, and executive reporting.',
    metrics: [['4D', 'brand experience'], ['SCM', 'planning model'], ['Game', 'interactive layer']],
    highlights: ['Customer-facing brand decisions connected to behind-the-scenes operating logic', 'Interactive product site, AI guide, arcade game, and supply-chain model'],
    stack: ['SCM planning', 'Three.js', 'GSAP', 'Phaser'], repo: 'https://github.com/Mah-era/frutea', demo: 'https://mah-era.github.io/frutea/',
  },
  {
    code: '06', title: 'Purrfect Supply Chain', label: 'Learning simulation', image: '/assets/purrfect-supply-chain.webp', alt: 'Purrfect Supply Chain bullwhip simulation',
    statement: 'Complex supply-chain trade-offs made playable and memorable.',
    summary: 'A working simulation of the bullwhip effect, demand variance, service levels, inventory trade-offs, and operating decisions.',
    metrics: [['Weekly', 'decision loop'], ['KPI', 'live feedback'], ['Multi', 'scenario mode']],
    highlights: ['Forecasting and ordering loop with clear cause-and-effect explanations', 'Scenario events, difficulty levels, KPI dashboard, and exportable results'],
    stack: ['React', 'Simulation logic', 'SVG charts', 'Web Audio'], repo: 'https://github.com/Mah-era/cozy-cat-scm-bull-game', demo: 'https://mah-era.github.io/cozy-cat-scm-bull-game/',
  },
];

const experience = [
  { period: '2023—2025', role: 'Junior Executive', focus: 'Planning & Project Management', company: 'Mindscape Communication', proof: '30+ initiatives planned and coordinated', detail: 'Turned briefs into content plans, presentations, timelines, deliverables, and structured client follow-ups.' },
  { period: '2022—2023', role: 'Office Assistant', focus: 'Administration & Records', company: 'Albeliz.com', proof: 'Accurate records and web-content operations', detail: 'Maintained routine financial documentation, administrative records, and precise digital content updates.' },
  { period: '2020—2021', role: 'Communication Head', focus: 'Client & Meeting Coordination', company: 'Project Finance Solution', proof: '250+ clients · 30+ meetings', detail: 'Managed client communication, follow-up, and meeting logistics at meaningful operating scale.' },
  { period: '2020—2021', role: 'Office Administrator', focus: 'Operations Support', company: 'CrossRoads Initiative', proof: 'Daily operational continuity', detail: 'Supported internal documentation, coordination, and reliable day-to-day administrative execution.' },
];

const skillGroups = [
  { title: 'Analyse', icon: BarChart3, skills: ['Excel', 'Power BI', 'Data cleaning', 'Forecasting', 'KPI reporting'] },
  { title: 'Operate', icon: Workflow, skills: ['Demand planning', 'Process mapping', 'Project coordination', 'Notion'] },
  { title: 'Communicate', icon: Presentation, skills: ['Stakeholders', 'Presentations', 'Client follow-up', 'Documentation'] },
  { title: 'Build', icon: Database, skills: ['React', 'Next.js', 'TypeScript', 'Python', 'SQL / SQLite'] },
];

const githubProjects = [
  ['frutea', 'Product experience · SCM concept', 'HTML'],
  ['save-farzu', 'Mini-game collection', 'HTML'],
  ['cozy-cat-scm-bull-game', 'Supply-chain learning simulation', 'JavaScript'],
  ['PawPaw-World-3D-v1', '3D interactive world', 'JavaScript'],
  ['pawpaw-world', 'Canvas exploration game', 'HTML'],
  ['pawpaw-power-retro-game', 'Retro browser game', 'JavaScript'],
  ['scm-distributor-management-frontenddesign', 'Distribution interface concept', 'JavaScript'],
  ['insightbi', 'Business intelligence platform', 'TypeScript'],
  ['finance-tracker', 'Personal finance tool', 'JavaScript'],
  ['cse-coursework', 'Programming coursework archive', 'Python'],
  ['scm-analytics-studio', 'Supply-chain analytics control tower', 'Python'],
  ['ForecastSync', 'Demand planning application', 'TypeScript'],
  ['moodtracker', 'Personal wellbeing tracker', 'JavaScript'],
  ['scm-distributor-management', 'Distributor operations system', 'JavaScript'],
  ['focusflow-planner', 'Productivity planning tool', 'JavaScript'],
];

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const selected = projects[activeProject];

  useEffect(() => {
    const root = document.documentElement;
    const motionTargets = document.querySelectorAll<HTMLElement>(
      '.manifesto-label, .manifesto-copy, .capability-stack article, .project-lab-head > *, .project-console, .archive-heading > *, .archive-card, .experience-heading > *, .experience-table article, .profile-card, .skills-heading, .skill-grid article, .footer-copy, .footer-cta',
    );
    motionTargets.forEach((element, index) => {
      element.classList.add('motion-target');
      element.style.setProperty('--delay', `${(index % 4) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    motionTargets.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty('--scroll-y', String(window.scrollY));
        root.style.setProperty('--scroll-progress', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
      });
    };
    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return (
    <main id="top">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="hero-world">
        <div className="motion-banner" aria-hidden="true">
          <div><span>AVAILABLE FOR MTO & GRADUATE ROLES</span><i /> <span>SUPPLY CHAIN × ANALYTICS × EXECUTION</span><i /> <span>AVAILABLE FOR MTO & GRADUATE ROLES</span><i /> <span>SUPPLY CHAIN × ANALYTICS × EXECUTION</span></div>
        </div>
        <div className="grid-plane" aria-hidden="true" />
        <div className="aurora aurora-one" aria-hidden="true" />
        <div className="aurora aurora-two" aria-hidden="true" />

        <header className="site-header">
          <a className="brand" href="#top" aria-label="Mahera Tasfee — home">
            <span className="brand-symbol">M</span>
            <span className="brand-copy">Mahera Tasfee <small>Portfolio · 2026</small></span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#capabilities">Capabilities</a><a href="#work">Selected work</a><a href="#experience">Experience</a>
          </nav>
          <a className="contact-chip" href="https://www.linkedin.com/in/mahera-tasfee/" target="_blank" rel="noreferrer">Let&apos;s connect <ArrowUpRight size={15} /></a>
        </header>

        <section className="hero">
          <div className="hero-eyebrow">
            <span><i /> Open to graduate & MTO opportunities</span>
            <span><MapPin size={13} /> Dhaka, Bangladesh</span>
          </div>
          <div className="hero-title-wrap">
            <p className="vertical-note">SUPPLY CHAIN · OPERATIONS · ANALYTICS</p>
            <h1>I turn moving parts<span>into forward motion.</span></h1>
            <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>06</span></div>
          </div>
          <div className="hero-bottom">
            <div className="hero-intro">
              <p>Mahera Tasfee is a business graduate in the making—combining supply-chain thinking, commercial awareness, and hands-on digital execution to make operations easier to understand and act on.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">Enter project lab <ArrowDown size={17} /></a>
                <a className="button button-ghost" href="https://github.com/Mah-era" target="_blank" rel="noreferrer"><GitBranch size={17} /> GitHub</a>
              </div>
            </div>
            <div className="hero-stage" aria-label="Featured supply-chain projects">
              <div className="orbit-ring orbit-ring-one"><Orbit size={20} /></div><div className="orbit-ring orbit-ring-two" />
              <div className="stage-window stage-window-back"><div className="browser-bar"><span /><span /><span /><small>forecastsync.app</small></div><img src="/assets/forecastsync.png" alt="ForecastSync project preview" /></div>
              <div className="stage-window stage-window-front"><div className="browser-bar"><span /><span /><span /><small>SCM Analytics Studio</small></div><img src="/assets/scm-studio.png" alt="SCM Analytics Studio dashboard preview" /></div>
              <div className="stage-signal"><Radar size={18} /><span>Building at the intersection of<br /><strong>business + systems</strong></span></div>
              <div className="stage-badge"><Sparkles size={14} /> 15 public builds</div>
            </div>
          </div>
        </section>

        <section className="proof-rail" aria-label="Candidate evidence">
          <div><strong>30+</strong><span>initiatives<br />coordinated</span></div><div><strong>250+</strong><span>client<br />interactions</span></div><div><strong>15</strong><span>public GitHub<br />projects</span></div><div><strong>04</strong><span>professional<br />roles</span></div><div className="proof-rail-note"><CircleDot size={15} /> Expected graduation · 2026</div>
        </section>
      </div>

      <section className="manifesto section-shell" id="capabilities">
        <div className="manifesto-label"><span>01</span><p>What I bring</p></div>
        <div className="manifesto-copy"><p className="overline">Qualities recruiters can count on</p><h2>Curious enough to question.<br /><em>Disciplined enough to deliver.</em></h2><p className="manifesto-lead">My advantage is not one tool. It is how I approach unfamiliar problems: understand the system, communicate clearly, take ownership, and keep moving until the work becomes usable.</p></div>
        <div className="capability-stack">
          <article><div><Workflow size={22} /><span>01</span></div><h3>Systems-minded</h3><p>I look for the relationship between demand, information, people, and process—not just the task directly in front of me.</p></article>
          <article><div><BarChart3 size={22} /><span>02</span></div><h3>Analytically curious</h3><p>I ask better questions, test assumptions, and turn messy information into a clear signal people can use.</p></article>
          <article><div><Presentation size={22} /><span>03</span></div><h3>Clear communicator</h3><p>I translate details into structured updates, client-ready documents, and presentations that move decisions forward.</p></article>
          <article><div><Zap size={22} /><span>04</span></div><h3>Bias for execution</h3><p>I learn by building—taking ownership, iterating quickly, and turning concepts into practical working systems.</p></article>
        </div>
      </section>

      <section className="project-lab" id="work">
        <div className="project-lab-head section-shell"><div><p className="overline overline-light">Selected work · interactive archive</p><h2>Proof you can<br /><span>open and explore.</span></h2></div><p>Six working projects connecting supply-chain concepts, analytics, product thinking, and modern digital execution.</p></div>
        <div className="project-console section-shell">
          <div className="project-selector" role="tablist" aria-label="Select a portfolio project">
            {projects.map((project, index) => <button key={project.title} type="button" role="tab" aria-selected={activeProject === index} className={activeProject === index ? 'active' : ''} onClick={() => setActiveProject(index)}><span>{project.code}</span><div><strong>{project.title}</strong><small>{project.label}</small></div><ChevronRight size={17} /></button>)}
          </div>
          <article className="project-focus" key={selected.title}>
            <div className="project-screen"><div className="browser-bar browser-bar-large"><span /><span /><span /><small>LIVE SYSTEM · {selected.code}/06</small></div><img src={selected.image} alt={selected.alt} /><a className="screen-launch" href={selected.demo} target="_blank" rel="noreferrer" aria-label={`Open ${selected.title} live demo`}><ArrowUpRight size={20} /></a></div>
            <div className="project-detail">
              <div className="project-detail-heading"><div><span>{selected.label}</span><h3>{selected.title}</h3></div><p>{selected.statement}</p></div>
              <p className="project-description">{selected.summary}</p>
              <div className="project-metrics">{selected.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
              <div className="project-highlights">{selected.highlights.map((item) => <p key={item}><Check size={14} />{item}</p>)}</div>
              <div className="project-meta"><div className="project-stack">{selected.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-actions"><a href={selected.repo} target="_blank" rel="noreferrer">Source <GitBranch size={14} /></a><a href={selected.demo} target="_blank" rel="noreferrer">Launch project <ArrowUpRight size={14} /></a></div></div>
            </div>
          </article>
        </div>
      </section>

      <section className="github-archive" id="archive">
        <div className="archive-heading section-shell">
          <div><p className="overline">Complete GitHub archive · 15 projects</p><h2>Every build gets<br /><em>a place in the story.</em></h2></div>
          <p>The structure is ready for you to add final case-study copy, screenshots, and screen recordings later. Every public source project is already represented.</p>
        </div>
        <div className="archive-grid section-shell">
          {githubProjects.map(([name, category, language], index) => (
            <article className="archive-card" key={name}>
              <div className="archive-media-placeholder">
                <div className="placeholder-motion"><span /><span /><span /></div>
                <p>MEDIA SLOT</p>
                <div><span>+ SCREENSHOT</span><span>+ SCREEN RECORD</span></div>
              </div>
              <div className="archive-card-head"><span>{String(index + 1).padStart(2, '0')} / 15</span><span>{language}</span></div>
              <h3>{name}</h3>
              <p>{category}</p>
              <div className="archive-copy-slot">Project story and impact copy to be added.</div>
              <a href={`https://github.com/Mah-era/${name}`} target="_blank" rel="noreferrer">Open repository <ArrowUpRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="experience section-shell" id="experience">
        <div className="experience-heading"><div className="manifesto-label"><span>02</span><p>Experience</p></div><div><p className="overline">Five years of moving work forward</p><h2>Execution is a<br /><em>people system.</em></h2></div></div>
        <div className="experience-table">{experience.map((item, index) => <article key={`${item.company}-${item.role}`}><div className="experience-number">0{index + 1}</div><div className="experience-date">{item.period}</div><div className="experience-title"><h3>{item.role}</h3><p>{item.focus}</p></div><div className="experience-company"><BriefcaseBusiness size={16} />{item.company}</div><div className="experience-proof"><strong>{item.proof}</strong><p>{item.detail}</p></div></article>)}</div>
      </section>

      <section className="profile-grid section-shell">
        <article className="profile-card profile-card-education"><div className="profile-card-icon"><GraduationCap size={25} /></div><span className="card-index">01 / EDUCATION</span><h2>North South<br />University</h2><p>Bachelor of Business Administration</p><strong>Supply Chain Management & Marketing</strong><small>Expected graduation · 2026</small></article>
        <article className="profile-card profile-card-leadership"><div className="profile-card-icon"><Trophy size={25} /></div><span className="card-index">02 / LEADERSHIP</span><h2>Vice President</h2><p>North South University Debate Club</p><blockquote>Competitive communication turned into team direction, tournament leadership, and confidence under pressure.</blockquote><small>2025—present</small></article>
        <article className="profile-card profile-card-research"><div className="research-orbit" aria-hidden="true"><span /><span /><span /></div><span className="card-index">03 / RESEARCH EXPOSURE</span><h2>Curious about the<br />systems behind growth.</h2><p>Independent academic exposure across FMCG, AIoT, RMG, operations, and supply-chain management.</p><div className="research-tags"><span>FMCG</span><span>AIoT</span><span>RMG</span><span>Operations</span></div></article>
      </section>

      <section className="skills-section"><div className="section-shell"><div className="skills-heading"><p className="overline overline-light">A cross-functional toolkit</p><h2>Think clearly.<br /><span>Build practically.</span></h2></div><div className="skill-grid">{skillGroups.map(({ title, icon: Icon, skills }, index) => <article key={title}><div className="skill-card-head"><Icon size={21} /><span>0{index + 1}</span></div><h3>{title}</h3><div>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div></div><div className="moving-line" aria-hidden="true"><span>SUPPLY CHAIN</span><i /><span>ANALYTICS</span><i /><span>OPERATIONS</span><i /><span>EXECUTION</span><i /><span>SUPPLY CHAIN</span></div></section>

      <footer><div className="footer-orbit" aria-hidden="true" /><div className="footer-inner section-shell"><div className="footer-copy"><p className="overline overline-light">Graduate talent · Available 2026</p><h2>Let&apos;s move something<br /><span>important forward.</span></h2><p>For management trainee, supply-chain, operations, planning, and business-analytics opportunities.</p></div><div className="footer-cta"><a href="https://www.linkedin.com/in/mahera-tasfee/" target="_blank" rel="noreferrer"><span><Network size={21} /> Connect on LinkedIn</span><ArrowUpRight size={22} /></a><a href="https://github.com/Mah-era" target="_blank" rel="noreferrer"><span><GitBranch size={21} /> Explore GitHub</span><ArrowUpRight size={22} /></a></div></div><div className="footer-base section-shell"><div><span className="brand-symbol">M</span><p>Mahera Tasfee<br /><small>Supply chain · operations · analytics</small></p></div><p><MapPin size={14} /> Dhaka, Bangladesh</p><a href="#top">Back to top <ArrowRight size={14} /></a></div></footer>
    </main>
  );
}

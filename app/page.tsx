import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  GitBranch,
  GraduationCap,
  Lightbulb,
  MapPin,
  Network,
  Search,
  Sparkles,
  Trophy,
  Users,
  Workflow,
} from 'lucide-react';

const competencies = [
  {
    icon: Workflow,
    title: 'Supply chain & operations',
    text: 'Demand planning, process mapping, inventory and order-flow logic, logistics coordination, KPI tracking',
  },
  {
    icon: BarChart3,
    title: 'Analytics & reporting',
    text: 'Excel, Power BI, dashboards, data cleaning, forecasting, scenario analysis, management reporting',
  },
  {
    icon: Users,
    title: 'Project coordination',
    text: 'Planning, timeline follow-up, stakeholder communication, client-ready documentation, Notion workflows',
  },
  {
    icon: Lightbulb,
    title: 'Digital prototyping',
    text: 'Business tools built with React, Next.js, TypeScript, Python, Streamlit, SQLite, and modern web platforms',
  },
];

const projects = [
  {
    title: 'SCM Analytics Studio',
    type: 'Supply-chain analytics & decision support',
    image: '/assets/scm-studio.png',
    alt: 'SCM Analytics Studio executive control tower dashboard',
    summary:
      'An offline-capable analytics prototype that converts raw supply-chain files into cleaned datasets, KPI views, forecasts, risk signals, and exportable management reports.',
    outcomes: [
      'Demand, inventory, procurement, logistics, warehouse, production, and cost modules',
      'Forecasting, supplier scorecards, scenario planning, and broad export workflows',
    ],
    stack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'SQLite'],
    repo: 'https://github.com/Mah-era/scm-analytics-studio',
    demo: 'https://scm-analytics-studio.onrender.com/',
  },
  {
    title: 'ForecastSync',
    type: 'Demand planning application',
    image: '/assets/forecastsync.png',
    alt: 'ForecastSync demand planning application home screen',
    summary:
      'A structured file-to-forecast workflow for cleaning business data, selecting demand factors, comparing methods, and producing practical inventory recommendations.',
    outcomes: [
      'CSV, Excel, and JSON ingestion with validation and quality scoring',
      'Forecast error, safety stock, reorder point, stockout risk, KPI views, and maps',
    ],
    stack: ['Next.js', 'TypeScript', 'Recharts', 'Leaflet'],
    repo: 'https://github.com/Mah-era/ForecastSync',
    demo: 'https://forecastsync.onrender.com/',
  },
  {
    title: 'SCM Distributor Management',
    type: 'Distribution visibility prototype',
    image: '/assets/distributor-management.png',
    alt: 'Distribution Management Tracker operational dashboard',
    summary:
      'An ERP-style interface designed around distributor operations, inventory and order tracking, delivery visibility, service performance, and management reporting.',
    outcomes: [
      'Fifteen modules across distribution, warehouse, transport, orders, returns, and cost',
      'KPI dashboards with Excel import and PDF, CSV, and JSON export',
    ],
    stack: ['React', 'Vite', 'ECharts', 'SheetJS'],
    repo: 'https://github.com/Mah-era/scm-distributor-management',
    demo: 'https://scm-distributor-management-prototype.netlify.app/',
  },
  {
    title: 'InsightBI',
    type: 'Full-stack business intelligence platform',
    image: '/assets/insightbi.png',
    alt: 'InsightBI business intelligence platform home screen',
    summary:
      'A browser-based BI platform for uploading datasets, modelling relationships, building interactive reports, and sharing insights across role-based workspaces.',
    outcomes: [
      'Dataset ingestion, transformation, schema detection, and relationship modelling',
      'Twenty-four visualisation types, sharing, role access, and dashboard PDF export',
    ],
    stack: ['React', 'Express', 'Prisma', 'ECharts'],
    repo: 'https://github.com/Mah-era/insightbi',
    demo: 'https://insightbi.vercel.app/',
  },
  {
    title: 'FruTea',
    type: 'Integrated product & operations concept',
    image: '/assets/frutea-site.webp',
    alt: 'FruTea product website and interactive digital experience',
    summary:
      'A fruit-tea concept developed across positioning, product storytelling, digital experience, demand planning, sourcing logic, inventory policy, and executive reporting.',
    outcomes: [
      'Connected customer-facing brand decisions with behind-the-scenes operating logic',
      'Interactive product site, AI guide, arcade game, and supply-chain planning model',
    ],
    stack: ['SCM planning', 'Three.js', 'GSAP', 'Phaser'],
    repo: 'https://github.com/Mah-era/frutea',
    demo: 'https://mah-era.github.io/frutea/',
  },
  {
    title: 'Purrfect Supply Chain',
    type: 'SCM learning simulation',
    image: '/assets/purrfect-supply-chain.webp',
    alt: 'Purrfect Supply Chain Bullwhip Village simulation',
    summary:
      'A playable learning experience that turns the bullwhip effect, demand variance, service levels, inventory trade-offs, and operating decisions into a working simulation.',
    outcomes: [
      'Weekly forecasting and ordering loop with cause-and-effect explanations',
      'KPI dashboard, scenario events, difficulty levels, and exportable results',
    ],
    stack: ['React', 'Simulation logic', 'SVG charts', 'Web Audio'],
    repo: 'https://github.com/Mah-era/cozy-cat-scm-bull-game',
    demo: 'https://mah-era.github.io/cozy-cat-scm-bull-game/',
  },
];

const experience = [
  {
    period: '2023—2025',
    role: 'Junior Executive, Planning & Project Management',
    organisation: 'Mindscape Communication',
    points: [
      'Planned and coordinated 30+ digital marketing and content initiatives for corporate and development-sector clients.',
      'Translated briefs into content plans, timelines, deliverables, client-facing presentations, and structured follow-ups.',
      'Maintained cross-functional workflows in Notion and regular communication with client points of contact.',
    ],
  },
  {
    period: '2022—2023',
    role: 'Office Assistant, Admin',
    organisation: 'Albeliz.com',
    points: [
      'Maintained routine financial documentation, administrative records, and accurate web-content updates.',
    ],
  },
  {
    period: '2020—2021',
    role: 'Communication Head, Admin',
    organisation: 'Project Finance Solution',
    points: [
      'Managed communication and follow-up with 250+ clients and coordinated logistics for 30+ meetings.',
    ],
  },
  {
    period: '2020—2021',
    role: 'Office Administrator',
    organisation: 'CrossRoads Initiative',
    points: [
      'Supported operational activities, internal documentation, and day-to-day administrative coordination.',
    ],
  },
];

const skills = [
  'Microsoft Excel',
  'Power BI',
  'Microsoft Office 365',
  'Notion',
  'Demand planning',
  'Data cleaning',
  'Forecasting',
  'KPI reporting',
  'Dashboard design',
  'Process mapping',
  'Project coordination',
  'Stakeholder communication',
  'Presentation design',
  'React',
  'Next.js',
  'TypeScript',
  'Python',
  'Streamlit',
  'Pandas',
  'SQL / SQLite',
];

export default function Home() {
  return (
    <main id="top">
      <div className="dark-shell">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Mahera Tasfee — home">
            <span className="brand-mark">MT</span>
            <span>Mahera Tasfee</span>
          </a>

          <nav aria-label="Primary navigation">
            <a href="#profile">Profile</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
          </nav>

          <a
            className="header-cta"
            href="https://www.linkedin.com/in/mahera-tasfee/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </header>

        <section className="hero-section">
          <div className="hero-copy">
            <div className="status-row">
              <span className="status-pill">
                <i aria-hidden="true" /> Open to graduate & MTO opportunities
              </span>
              <span>
                <MapPin aria-hidden="true" size={13} /> Dhaka, Bangladesh
              </span>
            </div>
            <p className="kicker kicker-light">Supply chain · operations · analytics</p>
            <h1>
              Turning operational complexity into{' '}
              <em>decision-ready clarity.</em>
            </h1>
            <p className="hero-summary">
              I&apos;m Mahera Tasfee—a Supply Chain Management and Marketing BBA
              candidate with experience in project coordination, client
              communication, reporting, and a growing portfolio of practical
              analytics tools.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                Review selected work <ArrowRight aria-hidden="true" size={17} />
              </a>
              <a
                className="secondary-button"
                href="https://github.com/Mah-era"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch aria-hidden="true" size={17} /> GitHub portfolio
              </a>
            </div>
          </div>

          <div className="hero-showcase" aria-label="Selected project previews">
            <div className="showcase-glow" aria-hidden="true" />
            <div className="showcase-window showcase-window-main">
              <div className="window-bar">
                <div aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p>SCM Analytics Studio</p>
                <small>Executive control tower</small>
              </div>
              <img
                src="/assets/scm-studio.png"
                alt="SCM Analytics Studio executive control tower dashboard"
                width="1280"
                height="720"
              />
            </div>
            <div className="showcase-window showcase-window-mini">
              <div className="window-bar">
                <div aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p>ForecastSync</p>
              </div>
              <img
                src="/assets/forecastsync.png"
                alt="ForecastSync demand planning interface"
                width="1280"
                height="720"
              />
            </div>
            <div className="floating-proof">
              <strong>13</strong>
              <span>public builds</span>
            </div>
            <div className="floating-label">SCM × analytics × execution</div>
          </div>
        </section>

        <section className="evidence-strip" aria-label="Candidate highlights">
          <div>
            <strong>30+</strong>
            <span>initiatives planned</span>
          </div>
          <div>
            <strong>250+</strong>
            <span>client interactions</span>
          </div>
          <div>
            <strong>13</strong>
            <span>public GitHub projects</span>
          </div>
          <div>
            <strong>2026</strong>
            <span>expected graduation</span>
          </div>
        </section>
      </div>

      <section className="profile-section section-shell" id="profile">
        <div className="section-intro">
          <p className="kicker">Professional profile</p>
          <h2>Commercially aware. Analytically curious. Ready to execute.</h2>
        </div>
        <div className="profile-copy">
          <p>
            I am a Supply Chain Management and Marketing BBA candidate at North
            South University, interested in how organisations turn demand,
            information, and resources into reliable execution.
          </p>
          <p>
            My professional experience has developed the coordination side of
            that work: understanding briefs, structuring deliverables, creating
            management-ready documents, communicating with stakeholders, and
            keeping teams aligned to deadlines. My project portfolio adds an
            analytical layer through forecasting, dashboards, data workflows,
            and decision-support prototypes.
          </p>
          <div className="role-fit">
            <span>Role alignment</span>
            <p>
              Management trainee · Supply chain · Operations · Planning ·
              Business analytics
            </p>
          </div>
        </div>
        <div className="competency-grid">
          {competencies.map(({ icon: Icon, title, text }, index) => (
            <article className="competency-card" key={title}>
              <div>
                <Icon aria-hidden="true" size={22} strokeWidth={1.6} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section section-shell" id="experience">
        <div className="section-intro experience-intro">
          <p className="kicker">Professional experience</p>
          <h2>Planning, people, and moving work forward.</h2>
          <div className="experience-note">
            <BriefcaseBusiness aria-hidden="true" size={20} />
            <span>Five years across planning, communication, and admin roles</span>
          </div>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-row" key={`${item.role}-${item.organisation}`}>
              <p className="experience-period">{item.period}</p>
              <div className="experience-role">
                <h3>{item.role}</h3>
                <p>{item.organisation}</p>
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-shell">
          <div className="projects-heading">
            <div>
              <p className="kicker kicker-light">Selected portfolio</p>
              <h2>Business ideas, made inspectable.</h2>
            </div>
            <p>
              Each project demonstrates a practical mix of business analysis,
              process thinking, data communication, and hands-on execution.
            </p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card ${index === 0 ? 'project-card-featured' : ''}`}
                key={project.title}
              >
                <div className="project-media">
                  <div className="window-bar">
                    <div aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>{project.title}</p>
                    <small>0{index + 1}</small>
                  </div>
                  <img src={project.image} alt={project.alt} width="1280" height="720" />
                </div>
                <div className="project-body">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <ul>
                    {project.outcomes.map((outcome) => (
                      <li key={outcome}>
                        <CheckCircle2 aria-hidden="true" size={15} /> {outcome}
                      </li>
                    ))}
                  </ul>
                  <div className="project-footer">
                    <div className="stack-list" aria-label={`${project.title} technology`}>
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      <a href={project.repo} target="_blank" rel="noreferrer">
                        Source <GitBranch aria-hidden="true" size={14} />
                      </a>
                      <a href={project.demo} target="_blank" rel="noreferrer">
                        Live <ArrowUpRight aria-hidden="true" size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="credentials-section" id="education">
        <div className="section-shell credentials-grid">
          <article className="credential-card credential-primary">
            <GraduationCap aria-hidden="true" size={28} />
            <p className="kicker">Education</p>
            <h2>North South University</h2>
            <h3>Bachelor of Business Administration</h3>
            <p>Major in Supply Chain Management & Marketing</p>
            <span>Expected graduation · 2026</span>
          </article>

          <article className="credential-card">
            <Trophy aria-hidden="true" size={28} />
            <p className="kicker">Leadership</p>
            <h2>Vice President</h2>
            <h3>North South University Debate Club</h3>
            <p>
              Debate leadership, tournament direction, and years of
              competitive communication experience.
            </p>
            <span>2025—present</span>
          </article>

          <article className="credential-card">
            <Search aria-hidden="true" size={28} />
            <p className="kicker">Research exposure</p>
            <h2>SCM industry questions</h2>
            <h3>Independent academic exposure</h3>
            <p>
              Literature review and problem framing across FMCG, AIoT, RMG,
              operations, and supply-chain management.
            </p>
            <span>2025—present</span>
          </article>
        </div>
      </section>

      <section className="skills-section section-shell">
        <div className="skills-title">
          <div>
            <p className="kicker">Tools & methods</p>
            <h2>Ready to work across analysis and execution.</h2>
          </div>
          <div className="skills-icon-row" aria-hidden="true">
            <FileSpreadsheet size={22} />
            <Database size={22} />
            <Sparkles size={22} />
          </div>
        </div>
        <div className="skill-tags">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-glow" aria-hidden="true" />
        <div className="footer-main section-shell">
          <div>
            <p className="kicker kicker-light">Professional links</p>
            <h2>Thank you for reviewing my work.</h2>
            <p>
              For graduate, management trainee, supply-chain, operations,
              planning, or business-analytics opportunities, please connect
              with me through LinkedIn.
            </p>
          </div>
          <div className="footer-links">
            <a
              href="https://www.linkedin.com/in/mahera-tasfee/"
              target="_blank"
              rel="noreferrer"
            >
              <Network aria-hidden="true" size={18} /> LinkedIn profile
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a
              href="https://github.com/Mah-era"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch aria-hidden="true" size={18} /> GitHub portfolio
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        </div>
        <div className="footer-base section-shell">
          <p>
            <MapPin aria-hidden="true" size={14} /> Mahera Tasfee · Dhaka,
            Bangladesh
          </p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}

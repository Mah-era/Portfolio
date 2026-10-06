export type RoomId =
  | 'hub'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'contact';
export type WorldItem = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
  language?: string;
  link?: string;
  linkLabel?: string;
};
export const roomOrder: RoomId[] = [
  'hub',
  'education',
  'experience',
  'projects',
  'skills',
  'achievements',
  'contact',
];
export const roomData: Record<
  RoomId,
  {
    label: string;
    category: string;
    title: string;
    subtitle: string;
    color: string;
    accent: string;
    ink: string;
  }
> = {
  hub: {
    label: 'The Reception',
    category: 'Profile',
    title: 'Systems thinking.\nConsidered execution.',
    subtitle:
      'I connect supply-chain thinking, analytical curiosity, and clear communication to turn complex ideas into practical systems.',
    color: '#ded9cd',
    accent: '#756047',
    ink: '#282b27',
  },
  education: {
    label: 'The Library',
    category: 'Education',
    title: 'A foundation\nfor better questions.',
    subtitle:
      'A foundation in business, a curiosity for research, and a habit of asking the next question.',
    color: '#c2c6ba',
    accent: '#5c6959',
    ink: '#2c332c',
  },
  experience: {
    label: 'The Study',
    category: 'Experience',
    title: 'Ideas, brought\ninto practice.',
    subtitle:
      'Client communication, project planning, documentation, and the everyday discipline that makes work move.',
    color: '#c1cacb',
    accent: '#526568',
    ink: '#293435',
  },
  projects: {
    label: 'The Project Gallery',
    category: 'Projects',
    title: 'Thinking made\ntangible.',
    subtitle:
      'Supply-chain systems, forecasting tools, interactive simulations, and experiments. Each project is a chance to learn by building.',
    color: '#ddd5c9',
    accent: '#77604e',
    ink: '#342e29',
  },
  skills: {
    label: 'The Workshop',
    category: 'Capabilities',
    title: 'Analytical depth.\nPractical range.',
    subtitle:
      'Understand the system. Find the useful signal. Make it clear. Then build something that helps.',
    color: '#c7ccbd',
    accent: '#626a53',
    ink: '#30372b',
  },
  achievements: {
    label: 'The Milestone Gallery',
    category: 'Milestones',
    title: 'Experience that\nshapes perspective.',
    subtitle:
      'Leadership, communication, and the moments that taught me to take responsibility for the outcome.',
    color: '#d3c8b6',
    accent: '#806b4d',
    ink: '#3d362b',
  },
  contact: {
    label: 'The Lounge',
    category: 'Contact',
    title: 'Let’s start\na conversation.',
    subtitle:
      'Interested in graduate and management trainee opportunities in supply chain, planning, operations, and analytics.',
    color: '#cec9c4',
    accent: '#746660',
    ink: '#35302e',
  },
};
export const experiences: WorldItem[] = [
  {
    eyebrow: '2023—2025 · PLANNING & PROJECT MANAGEMENT',
    title: 'Mindscape Communication',
    body: 'Junior Executive, Planning & Project Management. Structured briefs, timelines, content plans, presentations, deliverables, and client follow-up across more than 30 initiatives.',
  },
  {
    eyebrow: '2022—2023 · ADMINISTRATION',
    title: 'Albeliz.com',
    body: 'Office Assistant, Admin. Maintained financial documentation, administrative records, and accurate web-content operations.',
  },
  {
    eyebrow: '2020—2021 · COMMUNICATION',
    title: 'Project Finance Solution',
    body: 'Communication Head, Admin. Managed client communication with 250+ clients and logistics for more than 30 meetings.',
  },
  {
    eyebrow: '2020—2021 · OPERATIONS',
    title: 'CrossRoads Initiative',
    body: 'Office Administrator. Supported operational activities, internal documentation, and daily coordination.',
  },
];
export const projects: WorldItem[] = [
  {
    eyebrow: 'SUPPLY CHAIN ANALYTICS',
    title: 'SCM Analytics Studio',
    body: 'A control tower for forecasting, inventory, procurement, logistics, risk, and management reporting.',
    language: 'Python',
    image: './assets/scm-studio.png',
    link: 'https://github.com/Mah-era/scm-analytics-studio',
    linkLabel: 'Open repository',
  },
  {
    eyebrow: 'DEMAND PLANNING',
    title: 'ForecastSync',
    body: 'A guided file-to-forecast workflow with data validation, quality scoring, inventory recommendations, and risk maps.',
    language: 'TypeScript',
    image: './assets/forecastsync.png',
    link: 'https://github.com/Mah-era/ForecastSync',
    linkLabel: 'Open repository',
  },
  {
    eyebrow: 'DISTRIBUTION OPERATIONS',
    title: 'SCM Distributor Management',
    body: 'An ERP-style operational interface spanning orders, inventory, transport, delivery, returns, and cost.',
    language: 'JavaScript',
    image: './assets/distributor-management.png',
    link: 'https://github.com/Mah-era/scm-distributor-management',
    linkLabel: 'Open repository',
  },
  {
    eyebrow: 'BUSINESS INTELLIGENCE',
    title: 'InsightBI',
    body: 'A collaborative BI workspace for ingesting data, modelling relationships, building reports, and sharing insights.',
    language: 'TypeScript',
    image: './assets/insightbi.png',
    link: 'https://github.com/Mah-era/insightbi',
    linkLabel: 'Open repository',
  },
  {
    eyebrow: 'PRODUCT × OPERATIONS',
    title: 'FruTea',
    body: 'A consumer concept connecting brand storytelling with demand, sourcing, inventory, and digital experience.',
    language: 'HTML',
    image: './assets/frutea-site.webp',
    link: 'https://github.com/Mah-era/frutea',
    linkLabel: 'Open repository',
  },
  {
    eyebrow: 'LEARNING SIMULATION',
    title: 'Purrfect Supply Chain',
    body: 'A playable simulation of the bullwhip effect, demand variance, service level, and inventory decisions.',
    language: 'JavaScript',
    image: './assets/purrfect-supply-chain.webp',
    link: 'https://github.com/Mah-era/cozy-cat-scm-bull-game',
    linkLabel: 'Open repository',
  },
  ...[
    ['save-farzu', 'Mini-game collection', 'HTML'],
    ['PawPaw-World-3D-v1', 'Archived 3D interactive world', 'JavaScript'],
    ['pawpaw-world', 'Canvas exploration game', 'HTML'],
    ['pawpaw-power-retro-game', 'Retro browser game', 'JavaScript'],
    [
      'scm-distributor-management-frontenddesign',
      'Distribution interface concept',
      'JavaScript',
    ],
    ['finance-tracker', 'Personal finance tool', 'JavaScript'],
    ['cse-coursework', 'Programming coursework archive', 'Python'],
    ['moodtracker', 'Personal wellbeing tracker', 'JavaScript'],
    ['focusflow-planner', 'Productivity planning tool', 'JavaScript'],
  ].map(([title, body, language]) => ({
    eyebrow: 'THE EXPERIMENT ARCHIVE',
    title,
    body,
    language,
    link: `https://github.com/Mah-era/${title}`,
    linkLabel: 'Open repository',
  })),
];

export const roomItems: Record<RoomId, WorldItem[]> = {
  hub: [
    {
      eyebrow: 'SUPPLY CHAIN · OPERATIONS · ANALYTICS',
      title: 'Mahera Tasfee',
      body: 'A BBA candidate at North South University, connecting supply chain management and marketing with practical digital systems. My work brings together analytical curiosity, structured coordination, and clear communication.',
    },
    {
      eyebrow: 'HOW I THINK',
      title: 'Connect the dots',
      body: 'I look at how demand, information, people, and resources fit together. That systems perspective informs my approach to planning, analysis, and everyday operations.',
    },
    {
      eyebrow: 'HOW I WORK',
      title: 'Make it useful',
      body: 'I like turning a question into something tangible: a clear brief, a practical dashboard, a working prototype, or a more understandable process.',
    },
  ],
  education: [
    {
      eyebrow: 'BBA · EXPECTED 2026',
      title: 'North South University',
      body: 'Bachelor of Business Administration. Major in Supply Chain Management and Marketing.',
    },
    {
      eyebrow: '2025—PRESENT',
      title: 'Independent Research Exposure',
      body: 'Literature review and problem framing across FMCG, AIoT, RMG, operations, and supply-chain management.',
    },
    {
      eyebrow: 'FOUNDATION',
      title: 'Commercial + Operational Thinking',
      body: 'An interdisciplinary foundation connecting demand, marketing, information, resources, and execution.',
    },
  ],
  experience: experiences,
  projects,
  skills: [
    {
      eyebrow: 'ANALYSE',
      title: 'Decision Intelligence',
      body: 'Excel, Power BI, data cleaning, forecasting, KPI reporting, and dashboard design. Turning data into a clearer basis for decisions.',
    },
    {
      eyebrow: 'OPERATE',
      title: 'Supply-Chain Thinking',
      body: 'Demand planning, process mapping, inventory logic, project coordination, and Notion workflows. Understanding the connections between decisions and outcomes.',
    },
    {
      eyebrow: 'COMMUNICATE',
      title: 'Stakeholder Clarity',
      body: 'Client follow-up, presentations, structured documentation, debate, and team communication. Making the next step easier to understand.',
    },
    {
      eyebrow: 'BUILD',
      title: 'Digital Prototyping',
      body: 'React, Next.js, TypeScript, Python, Streamlit, Pandas, SQL, and SQLite. Exploring practical tools through hands-on projects.',
    },
  ],
  achievements: [
    {
      eyebrow: 'LEADERSHIP · 2025—PRESENT',
      title: 'Vice President',
      body: 'North South University Debate Club. Tournament direction, team leadership, and competitive communication under pressure.',
    },
    {
      eyebrow: 'EXECUTION',
      title: '30+ Initiatives',
      body: 'Planned and coordinated digital marketing and content initiatives across corporate and development-sector clients.',
    },
    {
      eyebrow: 'COMMUNICATION',
      title: '250+ Client Interactions',
      body: 'Professional communication, structured follow-up, and meeting coordination at meaningful scale.',
    },
  ],
  contact: [
    {
      eyebrow: 'PROFESSIONAL NETWORK',
      title: 'Let’s connect on LinkedIn',
      body: 'Connect for graduate, management trainee, supply-chain, planning, operations, and analytics opportunities.',
      link: 'https://www.linkedin.com/in/mahera-tasfee/',
      linkLabel: 'Open LinkedIn',
    },
    {
      eyebrow: 'THE SOURCE OF THE IDEAS',
      title: 'Explore my GitHub',
      body: 'Public projects, prototypes, simulations, and experiments. A closer look at how I learn by building.',
      link: 'https://github.com/Mah-era',
      linkLabel: 'Open GitHub',
    },
    {
      eyebrow: 'BASED IN',
      title: 'Dhaka, Bangladesh',
      body: 'Available for graduate and management trainee opportunities in 2026.',
    },
  ],
};

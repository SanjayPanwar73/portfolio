export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  repository: string;
  contribution: string;
  features: string[];
  decision: string;
  scope: string;
  source: string;
}

export const profile = {
  name: 'Sanjay Panwar',
  siteUrl: 'https://portfolio-ten-omega-73.vercel.app/',
  email: 'panwarsanjay710@gmail.com',
  resume: '/sanjay_panwar_resume.pdf',
  github: 'https://github.com/SanjayPanwar73',
  socials: [
    { name: 'GitHub', url: 'https://github.com/SanjayPanwar73' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sanjaypanwar73/' },
    { name: 'LeetCode', url: 'https://leetcode.com/u/sanjay736/' },
  ],
};

export const projects: Project[] = [
  {
    id: 'searchnest', name: 'SearchNest', category: 'DEVELOPER API',
    description: 'A provider-backed search platform with a developer dashboard, hashed API keys, persistent quotas, pagination, and request activity.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Jinja2'],
    repository: `${profile.github}/SearchNest`,
    contribution: 'Built the search interface, account dashboard, and API workflow that connects developer credentials to provider-backed search.',
    features: ['Replaceable Tavily and Google search adapters with a common response format.', 'API key creation, regeneration, activation, and revocation; raw keys shown once.', 'Persistent minute, day, and month quotas, request logs, pagination, and explicit error states.'],
    decision: 'Normalize search providers behind an adapter and keep both upstream credentials and hashed developer keys on the server. The frontend can use one response contract as providers change.',
    scope: 'Implemented in source. Search requires configured provider credentials; no public deployment is linked.',
    source: 'search.py',
  },
  {
    id: 'samadhan', name: 'Samadhan-Setu', category: 'APPLIED AI',
    description: 'An AI-assisted grievance platform with category classification, explainable priority scoring, similar-case retrieval, and department and staff workflows.',
    stack: ['React', 'FastAPI', 'Transformers', 'FAISS'],
    repository: `${profile.github}/Samadhan-Setu`,
    contribution: 'Built an institutional grievance workflow spanning complaint intake, AI-assisted triage, department assignment, and role-specific workspaces.',
    features: ['Zero-shot category classification, sentiment analysis, and similar-complaint retrieval.', 'Weighted priority scoring with visible component contributions and least-loaded staff routing.', 'Status history, SLA escalation, low-rating reopening, and retrieval of similar resolved cases.'],
    decision: 'Make urgency an explainable weighted formula rather than an opaque model output. Similar-case retrieval also works independently of optional local Ollama text generation.',
    scope: 'Implemented in source; model accuracy and operational outcomes have not been measured here. Local AI model setup is required.',
    source: 'backend/app/ai/priority.py',
  },
  {
    id: 'diettracker', name: 'DietTracker', category: 'FULL STACK',
    description: 'A full stack nutrition dashboard with authenticated food logging, calorie and macro charts, preference-based AI meal plans, and PDF recipes.',
    stack: ['React', 'Express', 'MongoDB', 'Chart.js'],
    repository: `${profile.github}/DietTracker`,
    contribution: 'Built a React nutrition dashboard with authenticated food logging, profile-based calorie targets, charts, and AI-assisted meal planning.',
    features: ['JWT-scoped profiles and food records, macro charts, and meal history.', 'CalorieNinjas nutrition lookup and preference-based meal plans through OpenRouter.', 'Weekly insights and downloadable PDF recipes.'],
    decision: 'Separate the dashboard from protected Express API routes and cache historical fitness responses so past dates can be retrieved without another upstream request.',
    scope: 'Implemented in source; external services require configuration. Image recognition is not claimed: the current estimator uses food-name text.',
    source: 'backend/controllers/foodController.js',
  },
  {
    id: 'snaptrip', name: 'SnapTrip', category: 'SERVER RENDERED',
    description: 'Server-rendered accommodation discovery and listing management with search, favorites, reviews, and session-based authentication.',
    stack: ['EJS', 'Express', 'MongoDB', 'Passport'],
    repository: `${profile.github}/SnapTrip`,
    contribution: 'Built an accommodation discovery and listing management application using server-rendered EJS templates and session authentication.',
    features: ['Listing creation and editing, category and keyword search, price filters, and sorting.', 'Favorites, reviews, ratings, and Leaflet map presentation.', 'Passport login sessions stored in MongoDB and local listing-image uploads through Multer.'],
    decision: 'Render listing queries and EJS views on the server, with MongoDB-backed sessions. This keeps the browsing experience within one Express application.',
    scope: 'Listing discovery and management are implemented. The bookings page is a placeholder; reservations and payments are not presented as working features.',
    source: 'routes/listing.js',
  },
];

export const skillGroups = [
  { label: 'Languages', items: ['Java', 'Python', 'JavaScript'] },
  { label: 'Frontend', items: ['HTML & CSS', 'React', 'Tailwind CSS', 'Bootstrap', 'EJS'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'REST APIs', 'JWT authentication'] },
  { label: 'Data & AI', items: ['MongoDB', 'MySQL', 'SQLAlchemy', 'Transformers', 'FAISS'] },
  { label: 'Tools', items: ['Git & GitHub', 'Postman', 'VS Code', 'npm'] },
];

export const experience = [
  {
    date: 'JUN — JUL 2026', title: 'AI Automation & Intelligent Solutions Intern',
    organization: 'BharatCares (CSRBOX Group)', location: 'Remote',
    description: 'Completed a six-week program with technical masterclasses and practical exercises in agentic and generative AI, multi-step automation workflows, prompt engineering, and LLM agent design. Studied AI agents and intelligent automation through IBM SkillsBuild modules.',
  },
  {
    date: 'AUG — SEP 2025', title: 'Web Development Intern',
    organization: 'Elevate Labs', location: 'Remote',
    description: 'Built responsive interfaces with HTML, CSS, JavaScript, and React. Practiced component structuring, debugging, Git branching and commits, and implementation, testing, and review workflows.',
  },
];

export const education = {
  date: '2023 – 2027', title: 'B.Tech in Computer Science & Engineering',
  organization: 'Mandsaur University', description: 'Artificial Intelligence · Final year',
};

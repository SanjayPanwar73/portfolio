import { Atom, Braces, BrainCircuit, Code2, Database, GitBranch, Layers, Network, Send, Terminal } from 'lucide-react';
import { Github } from './SocialIcons';
import { skillGroups } from './content';

const toolkit = ['Java', 'JavaScript', 'Python', 'Node.js', 'Express', 'React', 'MongoDB', 'MySQL', 'FastAPI', 'SQLAlchemy', 'Git', 'GitHub', 'Tailwind CSS', 'Bootstrap', 'HTML & CSS', 'Postman', 'Transformers', 'FAISS'];

export function TechBadge({ name }: { name: string }) {
  const key = name.toLowerCase();
  const Glyph = /mongo|mysql|sql|database/.test(key) ? Database : /react/.test(key) ? Atom : /git hub|github/.test(key) ? Github : /git/.test(key) ? GitBranch : /\bai\b|transform|faiss/.test(key) ? BrainCircuit : /postman/.test(key) ? Send : /express|api/.test(key) ? Network : /tailwind|bootstrap|css/.test(key) ? Layers : /node|python/.test(key) ? Terminal : /java/.test(key) ? Braces : Code2;
  return <span className="tech-badge" data-tech={key.replace(/[^a-z]/g, '')}><Glyph size={13} strokeWidth={1.6} aria-hidden="true" /><span>{name}</span></span>;
}

export default function Toolkit({ expanded = false, embedded = false }: { expanded?: boolean; embedded?: boolean }) {
  const GroupHeading = embedded ? 'h3' : 'h2';
  return <section id="skills" className="content-section toolkit">
    {expanded ? <>{embedded ? <h2 className="section-title">Core Toolkit</h2> : <h1 className="page-title">Core Toolkit</h1>}<p className="page-intro">Languages, frameworks, and tools I use in projects and continue to learn through practice.</p><div className="toolkit-groups">{skillGroups.map((group) => <div className="toolkit-group" key={group.label}><GroupHeading>{group.label}</GroupHeading><div className="toolkit-badges">{group.items.map((name) => <TechBadge name={name} key={name} />)}</div></div>)}</div></> : <><h2 className="section-title">Core Toolkit</h2><div className="toolkit-badges">{toolkit.map((name) => <TechBadge key={name} name={name} />)}</div></>}
  </section>;
}

export function CurrentFocus() {
  return <section className="content-section focus-section"><h2 className="section-title">Current Focus</h2><div className="focus-grid">
    <p><span>01.</span> Building full stack interfaces and reliable APIs</p>
    <p><span>02.</span> Exploring practical AI applications with Python</p>
    <p><span>03.</span> Strengthening DSA and computer science fundamentals</p>
  </div></section>;
}

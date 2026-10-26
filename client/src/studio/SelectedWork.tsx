import { ArrowUpRight, Plus } from 'lucide-react';
import { Github } from './SocialIcons';
import { motion, useReducedMotion } from 'motion/react';
import { projects } from './content';
import { TechBadge } from './Toolkit';
import { Link } from './routing';

export default function SelectedWork({ detailed = false }: { detailed?: boolean }) {
  const reduced = useReducedMotion();
  const ordered = ['samadhan','searchnest','diettracker','snaptrip'].map((id) => projects.find((project) => project.id === id)!);
  const shown = detailed ? ordered : ordered.slice(0, 3);
  const ProjectHeading = detailed ? 'h2' : 'h3';
  const DetailHeading = detailed ? 'h3' : 'h4';
  return <section id="work" className={'work-section content-section' + (detailed ? ' page-section' : '')}>
    {detailed ? <><h1 className="page-title">Selected Work</h1><p className="page-intro">A selection of web and AI applications I’ve built while learning to connect interfaces, APIs, databases, and practical product workflows.</p></> : <div className="section-title-row"><h2 className="section-title">Selected Projects</h2><Link className="icon-button" href="/work" aria-label="View all projects"><ArrowUpRight /></Link></div>}
    <div className="project-list">{shown.map((project) => <motion.article whileHover={reduced ? undefined : { y: -2 }} transition={{duration:.18}} className="project-card" key={project.id}>
      <div className="project-card-heading"><ProjectHeading>{project.name}</ProjectHeading><span className={`project-category category-${project.id}`}>{project.category}</span><a className="project-repo icon-button" href={project.repository} target="_blank" rel="noreferrer" aria-label={`View ${project.name} repository on GitHub`}><ArrowUpRight /></a></div>
      <p className="project-description">{project.description}</p>
      <div className="project-stack">{project.stack.map((name) => <TechBadge name={name} key={name} />)}</div>
      <details className="project-details"><summary>Explore the build <Plus size={13} aria-hidden="true" /></summary><div className="case-study"><DetailHeading>My contribution</DetailHeading><p>{project.contribution}</p><DetailHeading>Implemented features</DetailHeading><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><DetailHeading>An engineering decision</DetailHeading><p>{project.decision}</p><p className="scope-note">{project.scope}</p><a className="text-link" href={`${project.repository}/blob/main/${project.source}`} target="_blank" rel="noreferrer">Read the implementation <ArrowUpRight size={13} /></a></div></details>
      {detailed && <div className="project-actions"><a className="button button-outline" href={project.repository} target="_blank" rel="noreferrer"><Github size={14} /> Source Code</a></div>}
    </motion.article>)}</div>
  </section>;
}

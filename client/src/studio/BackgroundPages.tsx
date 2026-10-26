import { education, experience, profile } from './content';
import Toolkit from './Toolkit';
import { GraduationCap } from 'lucide-react';

export function EducationCard() {
  return <article className="education-card"><GraduationCap size={20} strokeWidth={1.5} aria-hidden="true" /><div><h3>{education.title}</h3><p>{education.organization}</p><p className="mono">{education.date} · {education.description}</p></div></article>;
}

export function AboutPage() {
  return <div className="page-section">
    <section id="about" className="content-section about-section"><h1 className="page-title about-name">{profile.name}</h1><p className="role-caption">FINAL-YEAR CSE (AI) STUDENT & FULL STACK DEVELOPER</p><div className="prose">
      <p>I’m a final-year B.Tech student in Computer Science & Engineering, specializing in Artificial Intelligence at Mandsaur University. I enjoy turning practical ideas into web applications and understanding how each part of a system works.</p>
      <p>My projects connect React interfaces with APIs, databases, and Python services. Recent work includes a developer search platform, an AI-assisted grievance workflow, and a nutrition dashboard.</p>
      <p>I’m interested in thoughtful interfaces, clear backend logic, and useful AI tools. I’m looking for internships and entry-level opportunities where I can contribute, learn from a team, and keep improving through real engineering work.</p>
    </div><h2 className="section-title subsection-heading">Education</h2><EducationCard /></section>
    <Toolkit expanded embedded />
  </div>;
}

export function ExperiencePage() {
  return <section id="experience" className="page-section content-section"><h1 className="page-title">Experience & education</h1><p className="page-intro">Practical programs, internships, and the computer science foundation behind my work.</p><div className="experience-list">{experience.map((item) => <article className="experience-card" key={item.organization}><div className="experience-card-heading"><h2>{item.organization}</h2><span className="mono">{item.date}</span></div><p className="experience-role">{item.title}</p><span className="location-label">{item.location}</span><p>{item.description}</p></article>)}</div><h2 className="section-title subsection-heading">Education</h2><EducationCard /></section>;
}

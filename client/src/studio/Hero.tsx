import { Mail, Code2 } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import { profile } from './content';
import { Link } from './routing';

export default function Hero() {
  return <section id="home" className="hero-section">
    <div className="hero-identity"><img className="profile-photo" src="/assets/sanjay-panwar.webp" width="128" height="128" alt="Sanjay Panwar, full stack developer" fetchPriority="high" /><div><h1>Sanjay Panwar</h1><p className="identity-location mono">BASED IN INDIA</p></div></div>
    <div className="hero-copy"><h2>FULL STACK DEVELOPER & AI STUDENT</h2><p>I’m a final-year B.Tech CSE (AI) student at Mandsaur University. I build full stack applications with React, Node.js, and Python, and explore practical AI through hands-on projects. I’m open to internships and entry-level opportunities where I can contribute and keep learning.</p>
      <div className="hero-actions"><div className="icon-links" aria-label="Social profiles"><a href={profile.socials[0].url} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href={profile.socials[1].url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href={profile.socials[2].url} target="_blank" rel="noreferrer" aria-label="LeetCode"><Code2 /></a><a href={`mailto:${profile.email}`} aria-label="Email Sanjay"><Mail /></a></div><div className="hero-buttons"><a className="button button-outline" href={profile.resume} download>Resume</a><Link className="button button-primary" href="/#contact">Get in touch</Link></div></div>
    </div>
  </section>;
}

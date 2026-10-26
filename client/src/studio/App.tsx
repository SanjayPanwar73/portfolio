import { useEffect, useRef } from 'react';
import { ArrowUpRight, Code2, Mail, GitBranch } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import Navigation from './Navigation';
import Hero from './Hero';
import SelectedWork from './SelectedWork';
import Toolkit, { CurrentFocus, TechBadge } from './Toolkit';
import { AboutPage, ExperiencePage } from './BackgroundPages';
import { profile } from './content';
import Contact from './Contact';
import { Link } from './routing';
import { useLocation } from './route';

export default function App() {
  const location = useLocation();
  const path = location.split('#')[0];
  const previousLocation = useRef(location);
  useEffect(() => {
    const locationChanged = previousLocation.current !== location;
    previousLocation.current = location;
    const labels: Record<string,string> = {'/':'Home','/about':'About','/work':'Projects','/skills':'Toolkit','/experience':'Experience'};
    document.title = `Sanjay Panwar | ${labels[path] ?? 'Page not found'}`;
    const pageUrl = new URL(path, profile.siteUrl).href;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', pageUrl);
    const frame = requestAnimationFrame(() => {
      let target: HTMLElement | null;
      if (location.includes('#')) {
        const fragment = location.slice(location.indexOf('#') + 1);
        let id = fragment;
        try { id = decodeURIComponent(fragment); } catch { /* Invalid escapes remain literal anchor IDs. */ }
        target = document.getElementById(id);
        target?.scrollIntoView({behavior:'auto'});
      } else {
        window.scrollTo({top:0,behavior:'auto'});
        target = document.querySelector<HTMLElement>('#main h1');
      }
      if (locationChanged && target) {
        target.tabIndex = -1;
        target.focus({preventScroll:true});
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location,path]);

  const isHome = path === '/';
  return <><a href="#main" className="skip-link">Skip to content</a><Navigation /><main id="main" className="page-shell" tabIndex={-1}>
    {isHome ? <><Hero /><Toolkit /><div className="activity-strip mono"><GitBranch size={12} aria-hidden="true" /><span>Learning through projects, APIs, and practical AI.</span></div><CurrentFocus />
      <section className="content-section public-work"><div className="section-title-row"><h2 className="section-title">Building in Public</h2><a className="icon-button" href={profile.github} target="_blank" rel="noreferrer" aria-label="View Sanjay's GitHub"><ArrowUpRight /></a></div><p>Sharing project code, exploring implementation ideas, and improving through hands-on development.</p><div className="public-tools">{['React','FastAPI','Python','Node.js','Git','GitHub'].map((name) => <TechBadge name={name} key={name} />)}</div></section>
      <SelectedWork /><Contact />
    </> : path === '/work' ? <SelectedWork detailed /> : path === '/about' ? <AboutPage /> : path === '/experience' ? <ExperiencePage /> : path === '/skills' ? <div className="page-section"><Toolkit expanded /><CurrentFocus /></div> : <section className="page-section"><h1 className="page-title">Page not found</h1><p className="page-intro">The page you’re looking for isn’t here.</p><Link className="text-link" href="/">Back to home <ArrowUpRight size={14} /></Link></section>}
  </main><footer className="site-footer"><div className="footer-inner"><div className="footer-profile"><Link className="footer-identity" href="/" aria-label="Sanjay Panwar, home"><img src="/assets/sanjay-panwar.webp" width="38" height="38" alt="" /><span><strong>{profile.name}</strong><small>Full Stack Developer · CSE (AI) Student</small></span></Link><p>© {new Date().getFullYear()} Sanjay Panwar. All rights reserved.</p><p className="footer-note">Learning, building, and improving through practical work.</p></div><div className="footer-right"><div className="footer-caption mono">NAVIGATE</div><nav className="footer-navigation" aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/work">Projects</Link><Link href="/experience">Experience</Link></nav><div className="footer-caption mono">CONNECT</div><div className="icon-links footer-socials"><a href={profile.socials[0].url} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href={profile.socials[1].url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href={profile.socials[2].url} target="_blank" rel="noreferrer" aria-label="LeetCode"><Code2 /></a><a href={`mailto:${profile.email}`} aria-label="Email Sanjay"><Mail /></a></div></div></div></footer></>;
}

import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Code2, FolderKanban, House, Moon, Sun, UserRound } from 'lucide-react';
import { Link } from './routing';
import { useLocation } from './route';

const links = [
  {href:'/',label:'Home',Icon:House},
  {href:'/skills',label:'Skills',Icon:Code2},
  {href:'/work',label:'Projects',Icon:FolderKanban},
  {href:'/experience',label:'Experience',Icon:BriefcaseBusiness},
  {href:'/about',label:'About',Icon:UserRound},
];

export default function Navigation() {
  const [light,setLight] = useState(() => document.documentElement.dataset.theme === 'light');
  const [time,setTime] = useState(() => new Date());
  const location = useLocation();
  const path = location.split('#')[0];
  useEffect(() => { const timer = window.setInterval(() => setTime(new Date()),60000); return () => clearInterval(timer); },[]);
  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next ? '#fafafa' : '#100f0f');
    try { localStorage.setItem('portfolio-theme',next ? 'light' : 'dark'); } catch { /* The toggle also works without local storage. */ }
  };
  const clock = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kolkata'}).format(time).replace(':','h ')+'m';
  return <>
    <header className="site-header"><div className="header-inner"><Link className="mobile-brand" href="/">Sanjay Panwar<span>.</span></Link><nav className="navigation" aria-label="Main navigation">{links.map(({href,label}) => <Link className={'nav-link'+(path===href?' active':'')} aria-current={path===href?'page':undefined} href={href} key={href}>{label}</Link>)}</nav><div className="nav-tools"><time className="local-clock mono" aria-label={`Time in Mandsaur: ${clock}`}>{clock}</time><span className="nav-divider" /><button className="theme-toggle icon-button" onClick={toggleTheme} aria-label={light?'Switch to dark theme':'Switch to light theme'}>{light?<Moon />:<Sun />}</button></div></div></header>
    <nav className="mobile-dock" aria-label="Mobile navigation">{links.map(({href,label,Icon}) => <Link className={'dock-link'+(path===href?' active':'')} aria-current={path===href?'page':undefined} href={href} key={href}><Icon size={20} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></Link>)}</nav>
  </>;
}

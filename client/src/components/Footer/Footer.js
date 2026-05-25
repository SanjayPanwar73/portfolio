import { FiArrowUp, FiGithub, FiLinkedin } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { PROFILE } from "../../content/portfolio";
import "./Footer.css";

const SOCIALS = [
  { label: "GitHub", icon: <FiGithub />, href: PROFILE.socials.github },
  { label: "LinkedIn", icon: <FiLinkedin />, href: PROFILE.socials.linkedin },
  { label: "LeetCode", icon: <SiLeetcode />, href: PROFILE.socials.leetcode },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__logo">
            SP<span className="footer__logo-dot">.</span>
          </span>
          <p className="footer__tagline">{PROFILE.footerTagline}</p>
        </div>

        <div className="footer__socials">
          {SOCIALS.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label={label}
              title={label}
            >
              {icon}
            </a>
          ))}
        </div>

        <div className="footer__right">
          <p className="footer__copy">Copyright {year} {PROFILE.name}</p>
          <button
            className="footer__top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <FiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

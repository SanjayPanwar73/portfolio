/**
 * Footer.js — Site footer with social links and copyright
 */

import { FiGithub, FiLinkedin, FiArrowUp } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import "./Footer.css";

const SOCIALS = [
  { label: "GitHub",   icon: <FiGithub />,   href: "https://github.com/SanjayPanwar73"        },
  { label: "LinkedIn", icon: <FiLinkedin />,  href: "https://www.linkedin.com/in/sanjaypanwar73"   },
  { label: "LeetCode", icon: <SiLeetcode />, href: "https://leetcode.com/u/sanjay736/" },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Left: logo + tagline */}
        <div className="footer__left">
          <span className="footer__logo">
            SP<span className="footer__logo-dot">.</span>
          </span>
          <p className="footer__tagline">Building things for the web.</p>
        </div>

        {/* Center: social links */}
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

        {/* Right: copyright + back to top */}
        <div className="footer__right">
          <p className="footer__copy">© {year} Sanjay Panwar</p>
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

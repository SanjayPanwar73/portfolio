/**
 * Hero.js — Landing / hero section
 *
 * Shows name, role tagline, a short intro, and two CTA buttons.
 * The animated background uses CSS-only radial gradients that pulse.
 */

import { FiArrowDown, FiGithub, FiLinkedin } from "react-icons/fi";
import "./Hero.css";

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero">
      {/* Decorative background blobs */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          {/* Availability badge */}
          <div className="hero__badge animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <span className="hero__badge-dot" />
            Available for opportunities
          </div>

          {/* Name */}
          <h1 className="hero__name animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Hi, I'm <span className="hero__name-highlight">Sanjay Panwar</span>
          </h1>

          {/* Role */}
          <p className="hero__role animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            Full-Stack Developer,Python Developer
          </p>

          {/* Tagline */}
          <p className="hero__tagline animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            I build fast, accessible, and beautiful web applications — from
            pixel-perfect UIs to robust APIs. Passionate about clean code and
            meaningful user experiences.
          </p>

          {/* CTAs */}
          <div className="hero__ctas animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
            <button
              className="btn-primary"
              onClick={() => scrollTo("projects")}
            >
              View My Work
              <FiArrowDown size={16} />
            </button>
            <button
              className="btn-outline"
              onClick={() => scrollTo("contact")}
            >
              Get in Touch
            </button>
          </div>

          {/* Social links */}
          <div className="hero__socials animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
            <a
              href="https://github.com/SanjayPanwar73"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/sanjaypanwar73/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
          <div className="hero__scroll-line" />
          <span>scroll</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;

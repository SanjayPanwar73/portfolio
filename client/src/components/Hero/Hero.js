import { FiArrowDown, FiGithub, FiLinkedin } from "react-icons/fi";
import { PROFILE } from "../../content/portfolio";
import "./Hero.css";

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero">
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <div
            className="hero__badge animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="hero__badge-dot" />
            {PROFILE.availability}
          </div>

          <h1
            className="hero__name animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            Hi, I'm <span className="hero__name-highlight">{PROFILE.name}</span>
          </h1>

          <p
            className="hero__role animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            {PROFILE.roleLabel}
          </p>

          <p
            className="hero__tagline animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            {PROFILE.heroTagline}
          </p>

          <div
            className="hero__ctas animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            <button className="btn-primary" onClick={() => scrollTo("projects")}>
              View My Work
              <FiArrowDown size={16} />
            </button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>
              Get in Touch
            </button>
          </div>

          <div
            className="hero__socials animate-fade-in-up"
            style={{ animationDelay: "0.55s" }}
          >
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        <div
          className="hero__scroll-hint animate-fade-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="hero__scroll-line" />
          <span>scroll</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;

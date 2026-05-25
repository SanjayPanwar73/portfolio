/**
 * About.js — About me section
 *
 * Photo placeholder on the left, bio + quick stats on the right.
 * Swap the placeholder with your actual photo by updating the img src.
 */

import { FiDownload, FiMapPin, FiMail } from "react-icons/fi";
import aboutPhoto from "./about-photo.jpeg";
import "./About.css";

const STATS = [
  { number: "3+",  label: "Years Experience" },
  { number: "20+", label: "Projects Shipped"  },
  { number: "15+", label: "Happy Clients"      },
];

const RESUME_URL = `${process.env.PUBLIC_URL}/sanjay_panwar_resume.pdf`;

const About = () => {
  return (
    <div className="about section">
      <div className="container about__inner">
        {/* Photo */}
        <div className="about__photo-wrap">
          <div className="about__photo-frame">
            <img
              src={aboutPhoto}
              alt="Sanjay Panwar"
              className="about__photo"
            />
          </div>
          {/* Floating badge */}
          <div className="about__photo-badge">
            <FiMapPin size={13} />
            Mandsaur, India
          </div>
        </div>

        {/* Content */}
        <div className="about__content">
          <p className="section-tag">About Me</p>
          <h2 className="section-title">
            Crafting digital<br />experiences that matter
          </h2>

          <p className="about__bio">
            I'm a full-stack developer with a love for building things that live
            on the internet. I specialize in JavaScript ecosystems — React on the
            frontend, Node.js on the backend — and I care deeply about performance,
            accessibility, and clean, maintainable code.
          </p>
          <p className="about__bio">
            When I'm not pushing commits, you'll find me contributing to open
            source, writing about web development, or exploring hiking trails with
            a camera in hand. I'm always open to interesting problems and the
            people who want to solve them.
          </p>

          {/* Quick stats */}
          <div className="about__stats">
            {STATS.map(({ number, label }) => (
              <div key={label} className="about__stat">
                <span className="about__stat-number">{number}</span>
                <span className="about__stat-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="about__actions">
            <a
              href={RESUME_URL}
              className="btn-primary"
              download="Sanjay_Panwar_Resume.pdf"
            >
              <FiDownload size={16} />
              Download Resume
            </a>
            <a
              href="mailto:panwarsanjay710@gmail.com"
              className="btn-outline"
            >
              <FiMail size={16} />
              Say Hello
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

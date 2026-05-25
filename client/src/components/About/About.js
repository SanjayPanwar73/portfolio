import { FiDownload, FiMail, FiMapPin } from "react-icons/fi";
import {
  ABOUT_PARAGRAPHS,
  ABOUT_STATS,
  PROFILE,
} from "../../content/portfolio";
import aboutPhoto from "./about-photo.jpeg";
import "./About.css";

const RESUME_URL = `${process.env.PUBLIC_URL}/sanjay_panwar_resume.pdf`;

const About = () => {
  return (
    <div className="about section">
      <div className="container about__inner">
        <div className="about__photo-wrap">
          <div className="about__photo-frame">
            <img
              src={aboutPhoto}
              alt={PROFILE.name}
              className="about__photo"
            />
          </div>
          <div className="about__photo-badge">
            <FiMapPin size={13} />
            {PROFILE.shortLocation}
          </div>
        </div>

        <div className="about__content">
          <p className="section-tag">About Me</p>
          <h2 className="section-title">
            Building practical products
            <br />
            while learning fast
          </h2>

          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="about__bio">
              {paragraph}
            </p>
          ))}

          <div className="about__stats">
            {ABOUT_STATS.map(({ number, label }) => (
              <div key={label} className="about__stat">
                <span className="about__stat-number">{number}</span>
                <span className="about__stat-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="about__actions">
            <a
              href={RESUME_URL}
              className="btn-primary"
              download="Sanjay_Panwar_Resume.pdf"
            >
              <FiDownload size={16} />
              Download Resume
            </a>
            <a href={`mailto:${PROFILE.email}`} className="btn-outline">
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

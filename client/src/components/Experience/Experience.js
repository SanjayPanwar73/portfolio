import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE_ITEMS,
} from "../../content/portfolio";
import "./Experience.css";

const Experience = () => {
  return (
    <div className="experience section">
      <div className="container">
        <div className="experience__header">
          <p className="section-tag">Experience</p>
          <h2 className="section-title">Work, learning, and credentials</h2>
          <p className="section-subtitle">
            Internships, academic progress, and certifications that support the
            projects on this portfolio.
          </p>
        </div>

        <div className="experience__layout">
          <aside className="experience__sidebar">
            <article className="experience-panel">
              <div className="experience-panel__icon">
                <FiBookOpen size={18} />
              </div>
              <p className="experience-panel__label">Education</p>
              <h3 className="experience-panel__title">{EDUCATION.degree}</h3>
              <p className="experience-panel__headline">{EDUCATION.school}</p>

              <div className="experience-panel__meta">
                <span>
                  <FiMapPin size={14} />
                  {EDUCATION.location}
                </span>
                <span>
                  <FiCalendar size={14} />
                  {EDUCATION.graduation}
                </span>
              </div>

              <p className="experience-panel__summary">{EDUCATION.summary}</p>
            </article>

            <article className="experience-panel">
              <div className="experience-panel__icon">
                <FiAward size={18} />
              </div>
              <p className="experience-panel__label">Certifications</p>
              <ul className="experience-panel__list">
                {CERTIFICATIONS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </aside>

          <div className="experience__timeline">
            {EXPERIENCE_ITEMS.map((item) => (
              <article key={`${item.company}-${item.period}`} className="experience-card">
                <div className="experience-card__badge">
                  <FiBriefcase size={14} />
                  Experience
                </div>

                <div className="experience-card__top">
                  <div>
                    <p className="experience-card__company">{item.company}</p>
                    <h3 className="experience-card__title">{item.title}</h3>
                  </div>

                  <div className="experience-card__meta">
                    <span>
                      <FiMapPin size={14} />
                      {item.location}
                    </span>
                    <span>
                      <FiCalendar size={14} />
                      {item.period}
                    </span>
                  </div>
                </div>

                <ul className="experience-card__highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

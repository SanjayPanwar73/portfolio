import { useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiStar } from "react-icons/fi";
import { fetchProjects } from "../../utils/api";
import "./Projects.css";

import zerodhaPreview from "../../assets/projects/zerodha-preview.jpeg";
import snaptripPreview from "../../assets/projects/snaptrip-preview.jpeg";
import axiomPreview from "../../assets/projects/axiom-preview.jpeg";

const PROJECT_ACCENTS = ["#c9a96e", "#d88968", "#6d9f8b", "#7b94d1"];

const FALLBACK_PROJECTS = [
  {
    _id: "zerodha-clone",
    title: "Zerodha Trading Clone",
    description:
      "A full-stack replica of Zerodha's trading platform with authentication, a dashboard-style interface, and simulated order placement workflows.",
    techStack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Passport.js",
      "Cloudinary",
      "Bootstrap",
    ],
    githubUrl: "https://github.com/SanjayPanwar73/Zerodha_Clone",
    liveUrl: "https://zerodha-clone-frontend-clmm.onrender.com/",
    imageUrl: zerodhaPreview,
    category: "Dashboard Build",
    status: "Live Demo",
  },
  {
    _id: "snaptrip",
    title: "SnapTrip",
    description:
      "An Airbnb-inspired travel booking platform with location-based listings, dynamic search, secure authentication, responsive UI, and integrated backend APIs.",
    techStack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Passport.js",
      "Cloudinary",
      "Bootstrap",
    ],
    githubUrl: "https://github.com/SanjayPanwar73/SnapTrip",
    liveUrl: "https://snaptrip-1.onrender.com/listings",
    imageUrl: snaptripPreview,
    category: "Booking Platform",
    status: "Live Demo",
  },
  {
    _id: "AXIOM-AI-Stock-Analyzer",
    title: "AXIOM AI Stock Analyzer",
    description:
      "A stock intelligence platform with a Bloomberg-inspired Streamlit dashboard, live FastAPI WebSocket streaming, and an AutoML engine for 30-day forecasting.",
    techStack: [
      "Python",
      "FastAPI",
      "WebSockets",
      "Streamlit",
      "Scikit-learn",
      "TensorFlow",
      "PostgreSQL",
    ],
    githubUrl: "https://github.com/SanjayPanwar73/AXIOM-AI-Stock-Analyzer",
    liveUrl: "",
    imageUrl: axiomPreview,
    category: "AI + Data Product",
    status: "Case Study",
  },
];

const getProjectInitials = (title = "Project") =>
  title
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const inferProjectCategory = ({ category, techStack = [], liveUrl }) => {
  if (category) {
    return category;
  }

  const stack = techStack.join(" ").toLowerCase();

  if (
    stack.includes("python") ||
    stack.includes("fastapi") ||
    stack.includes("tensorflow")
  ) {
    return "AI + Data Product";
  }

  if (stack.includes("react") && stack.includes("mongodb")) {
    return "Full-Stack Web App";
  }

  return liveUrl ? "Interactive Build" : "Product Case Study";
};

const inferProjectStatus = ({ status, liveUrl, githubUrl }) => {
  if (status) {
    return status;
  }

  if (liveUrl && githubUrl) {
    return "Code + Demo";
  }

  if (liveUrl) {
    return "Live Demo";
  }

  if (githubUrl) {
    return "Repository";
  }

  return "In Progress";
};

const normalizeProjects = (items) =>
  items
    .map((project, index) => {
      const techStack = Array.isArray(project.techStack)
        ? project.techStack.filter(Boolean)
        : [];

      return {
        ...project,
        techStack,
        accent: project.accent || PROJECT_ACCENTS[index % PROJECT_ACCENTS.length],
        category: inferProjectCategory({ ...project, techStack }),
        status: inferProjectStatus(project),
      };
    })
    .sort((left, right) => Number(right.featured) - Number(left.featured));

const buildProjectFacts = ({ techStack, liveUrl, githubUrl }) => [
  `${techStack.length} ${techStack.length === 1 ? "technology" : "technologies"}`,
  liveUrl ? "Live preview available" : "Presentation-ready case study",
  githubUrl ? "Source code included" : "Private build",
];

const ProjectCard = ({ project, index, variant = "default" }) => {
  const {
    title,
    description,
    techStack = [],
    githubUrl,
    liveUrl,
    imageUrl,
    featured,
    category,
    status,
    accent,
  } = project;
  const isSpotlight = variant === "spotlight";
  const visibleTech = isSpotlight ? techStack : techStack.slice(0, 6);
  const hiddenTechCount = techStack.length - visibleTech.length;
  const projectFacts = buildProjectFacts({ techStack, liveUrl, githubUrl });
  const projectLabel = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`project-card ${isSpotlight ? "project-card--spotlight" : ""}`}
      style={{ "--project-accent": accent }}
    >
      <div className="project-card__image-wrap">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="project-card__image"
            loading="lazy"
          />
        ) : (
          <div className="project-card__image-placeholder">
            <div className="project-card__placeholder-meta">
              <span className="project-card__placeholder-index">
                {projectLabel}
              </span>
              <span className="project-card__placeholder-category">
                {category}
              </span>
            </div>
            <span className="project-card__placeholder-initials">
              {getProjectInitials(title)}
            </span>
          </div>
        )}

        <div className="project-card__badge-row">
          <span className="project-card__status-pill">{status}</span>
          {featured && (
            <div className="project-card__featured">
              <FiStar size={11} /> Featured
            </div>
          )}
        </div>
      </div>

      <div className="project-card__body">
        <div className="project-card__eyebrow">
          <span className="project-card__category">{category}</span>
          <span className="project-card__number">{projectLabel}</span>
        </div>

        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__desc">{description}</p>

        <div className="project-card__facts">
          {projectFacts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>

        <div className="project-card__tech">
          {visibleTech.map((tech) => (
            <span key={tech} className="project-card__chip">
              {tech}
            </span>
          ))}
          {hiddenTechCount > 0 && (
            <span className="project-card__chip project-card__chip--muted">
              +{hiddenTechCount} more
            </span>
          )}
        </div>

        {(githubUrl || liveUrl) && (
          <div className="project-card__links">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link"
                aria-label={`${title} GitHub repo`}
              >
                <FiGithub size={15} /> Code
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link project-card__link--primary"
                aria-label={`${title} live demo`}
              >
                <FiExternalLink size={15} /> Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setStatusMessage("");

      try {
        const data = await fetchProjects();

        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(FALLBACK_PROJECTS);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects(FALLBACK_PROJECTS);
        setStatusMessage(
          err.response?.data?.error ||
            "Project API is unavailable right now. Showing selected projects from resume."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const visibleProjects = normalizeProjects(projects);
  const spotlightProject = visibleProjects[0] || null;
  const secondaryProjects = visibleProjects.slice(1);
  const liveDemoCount = visibleProjects.filter((project) => project.liveUrl).length;
  const githubCount = visibleProjects.filter(
    (project) => project.githubUrl
  ).length;
  const technologyCount = new Set(
    visibleProjects.flatMap((project) => project.techStack)
  ).size;

  return (
    <div className="projects section">
      <div className="container">
        <div className="projects__hero">
          <div className="projects__header">
            <p className="section-tag">What I've Built</p>
            <h2 className="section-title">Projects with product thinking</h2>
            <p className="section-subtitle">
              A tighter view of the work I want to keep doing: full-stack web
              apps, dashboard-style interfaces, and data-heavy tools shaped by
              real API and deployment constraints.
            </p>
          </div>

          {!loading && visibleProjects.length > 0 && (
            <div className="projects__overview">
              <div className="projects__metric">
                <span className="projects__metric-value">
                  {visibleProjects.length}
                </span>
                <span className="projects__metric-label">Selected builds</span>
              </div>
              <div className="projects__metric">
                <span className="projects__metric-value">{liveDemoCount}</span>
                <span className="projects__metric-label">Live demos</span>
              </div>
              <div className="projects__metric">
                <span className="projects__metric-value">
                  {technologyCount || githubCount}
                </span>
                <span className="projects__metric-label">
                  Core technologies
                </span>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="spinner-container">
            <div className="spinner" />
            <p className="spinner-text">Loading Projects</p>
          </div>
        )}

        {!loading && statusMessage && (
          <p className="projects__notice">{statusMessage}</p>
        )}

        {!loading && (
          <>
            {visibleProjects.length > 0 ? (
              <div className="projects__showcase">
                {spotlightProject && (
                  <ProjectCard
                    key={spotlightProject._id || spotlightProject.title}
                    project={spotlightProject}
                    index={0}
                    variant="spotlight"
                  />
                )}

                {secondaryProjects.length > 0 && (
                  <div className="projects__grid">
                    {secondaryProjects.map((project, index) => (
                      <ProjectCard
                        key={project._id || project.title}
                        project={project}
                        index={index + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="projects__empty">Projects will appear here soon.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;

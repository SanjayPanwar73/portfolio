/**
 * Projects.js - Projects section
 *
 * Tries to load projects from the API first.
 * Falls back to selected portfolio projects when the API is empty or offline.
 */

import { useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiStar } from "react-icons/fi";
import { fetchProjects } from "../../utils/api";
import "./Projects.css";

const FALLBACK_PROJECTS = [
  {
    _id: "zerodha-clone",
    title: "Zerodha Clone",
    description:
      "A full-stack replica of Zerodha's trading platform with user authentication, a dashboard-style interface, and simulated order placement flows.",
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
    imageUrl: "",
    featured: true,
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
    imageUrl: "",
    featured: true,
  },
];

const ProjectCard = ({ project }) => {
  const {
    title,
    description,
    techStack = [],
    githubUrl,
    liveUrl,
    imageUrl,
    featured,
  } = project;

  return (
    <article className="project-card">
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
            <span>{title[0]}</span>
          </div>
        )}
        {featured && (
          <div className="project-card__featured">
            <FiStar size={11} /> Featured
          </div>
        )}
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__desc">{description}</p>

        <div className="project-card__tech">
          {techStack.map((tech) => (
            <span key={tech} className="project-card__chip">
              {tech}
            </span>
          ))}
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
          setStatusMessage("Showing selected projects from resume.");
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects(FALLBACK_PROJECTS);
        setStatusMessage(
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="projects section">
      <div className="container">
        <div className="projects__header">
          <p className="section-tag">What I've Built</p>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            A selection of things I've built - from side projects to production
            applications. Each one taught me something new.
          </p>
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
            {projects.length > 0 ? (
              <div className="projects__grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id || project.title}
                    project={project}
                  />
                ))}
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

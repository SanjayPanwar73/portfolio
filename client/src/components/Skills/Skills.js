/**
 * Skills.js - Tech stack / skills section
 *
 * Grouped into Frontend, Backend, Data & Core, and Tools.
 * Uses react-icons for the logos and a hover-lift card effect.
 */

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaNpm,
  FaJava,
  FaProjectDiagram,
  FaChartLine,
  FaBrain,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiPostman,
  SiFigma,
  SiVercel,
  SiPython,
  SiNumpy,
  SiPandas,
} from "react-icons/si";
import "./Skills.css";

const SKILL_GROUPS = [
  {
    label: "Frontend",
    skills: [
      { name: "HTML5", icon: <FaHtml5 />, color: "#e34f26" },
      { name: "CSS3", icon: <FaCss3Alt />, color: "#264de4" },
      { name: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
      { name: "TypeScript", icon: <SiTypescript />, color: "#3178c6" },
      { name: "React", icon: <FaReact />, color: "#61dafb" },
      { name: "Redux", icon: <SiRedux />, color: "#764abc" },
      { name: "Tailwind", icon: <SiTailwindcss />, color: "#38bdf8" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node.js", icon: <FaNodeJs />, color: "#68a063" },
      { name: "Express", icon: <SiExpress />, color: "var(--text-secondary)" },
      { name: "MongoDB", icon: <SiMongodb />, color: "#47a248" },
      { name: "Python", icon: <SiPython />, color: "#3776ab" },
      { name: "Java", icon: <FaJava />, color: "#f89820" },
    ],
  },
  {
    label: "Data & Core",
    skills: [
      { name: "NumPy", icon: <SiNumpy />, color: "#4dabcf" },
      { name: "Pandas", icon: <SiPandas />, color: "#150458" },
      { name: "Matplotlib", icon: <FaChartLine />, color: "#11557c" },
      { name: "OOPs", icon: <FaBrain />, color: "#8b5cf6" },
      { name: "DSA", icon: <FaProjectDiagram />, color: "#14b8a6" },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Git", icon: <FaGitAlt />, color: "#f05032" },
      { name: "GitHub", icon: <FaGithub />, color: "var(--text-secondary)" },
      { name: "Docker", icon: <FaDocker />, color: "#2496ed" },
      { name: "npm", icon: <FaNpm />, color: "#cb3837" },
      { name: "Postman", icon: <SiPostman />, color: "#ff6c37" },
      { name: "Figma", icon: <SiFigma />, color: "#f24e1e" },
      { name: "Vercel", icon: <SiVercel />, color: "var(--text-secondary)" },
    ],
  },
];

const Skills = () => {
  return (
    <div className="skills section">
      <div className="container">
        <div className="skills__header">
          <p className="section-tag">What I Work With</p>
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-subtitle">
            The languages, libraries, and tools I reach for when building
            production-ready applications.
          </p>
        </div>

        <div className="skills__groups">
          {SKILL_GROUPS.map(({ label, skills }) => (
            <div key={label} className="skills__group">
              <h3 className="skills__group-label">{label}</h3>
              <div className="skills__grid">
                {skills.map(({ name, icon, color }) => (
                  <div key={name} className="skill-card">
                    <span className="skill-card__icon" style={{ color }}>
                      {icon}
                    </span>
                    <span className="skill-card__name">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;

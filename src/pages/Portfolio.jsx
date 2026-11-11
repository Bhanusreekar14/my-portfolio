import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Contact from "../components/Contact";
import ResumeModal from "../components/ResumeModal";
import { database } from "../firebase/config";
import NavGradientMenu from "../components/ui/NavGradientMenu";
import PerspectiveTunnelHero from "../components/ui/PerspectiveTunnelHero";
import AnimatedBorderButton from "../components/ui/AnimatedBorderButton";
const profilePhoto = "/images/profile-photo.jpg";

import "../styles/portfolio.css";

function Portfolio() {
  const [about, setAbout] = useState(null);
  const [hasPlayedTunnel, setHasPlayedTunnel] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("portfolioTheme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("portfolio-dark", darkMode);
    localStorage.setItem("portfolioTheme", darkMode ? "dark" : "light");

    return () => {
      document.body.classList.remove("portfolio-dark");
    };
  }, [darkMode]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Load about data seamlessly in the background while tunnel animates
  useEffect(() => {
    const aboutRef = ref(database, "portfolio/about");

    const unsubscribe = onValue(aboutRef, (snapshot) => {
      if (snapshot.exists()) {
        setAbout(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  // Load resume data seamlessly in the background while tunnel animates
  useEffect(() => {
    const resumeRef = ref(database, "portfolio/resume");

    const unsubscribe = onValue(resumeRef, (snapshot) => {
      if (snapshot.exists()) {
        setResumeData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  // Step 2 in sequence: Perspective Tunnel starts immediately after the old intro finishes
  if (!hasPlayedTunnel) {
    return (
      <PerspectiveTunnelHero
        onComplete={() => {
          setHasPlayedTunnel(true);
        }}
      />
    );
  }

  return (
    <main className="portfolio">
      <nav className="portfolio-nav" aria-label="Main Navigation">
        <a href="/" className="portfolio-logo" aria-label="Bhanu Sreekar Portfolio Home">
          BHANU<span>.</span>
        </a>

        {/* Mobile menu backdrop */}
        {menuOpen && (
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`portfolio-links ${menuOpen ? "mobile-menu-open" : ""}`}
          role="navigation"
        >
          <NavGradientMenu onItemClick={() => setMenuOpen(false)} />
        </div>

        <div className="portfolio-nav-controls">
          <button
            className="resume-btn"
            onClick={() => setResumeModalOpen(true)}
            aria-label="Open resume dialog"
          >
            📄 Resume
          </button>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title="Toggle theme"
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-icon">
                {darkMode ? "☀" : "☾"}
              </span>
            </span>
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <section className="portfolio-hero">
        <div className="hero-header-row">
          <p className="hero-kicker">
            AI • SOFTWARE • CREATIVE TECHNOLOGY
          </p>

          <span className="hero-year">
            PORTFOLIO / 2026
          </span>
        </div>

        <h1>
          BHANU
          <br />
          <span>SREEKAR</span>
        </h1>

        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-description">
              {about?.shortIntro ||
                "Information Technology student crafting intelligent, high-impact systems with artificial intelligence, machine learning, and full-stack software development."}
            </p>

            <div className="hero-tags">
              <span>AI & MACHINE LEARNING</span>
              <span>FULL-STACK</span>
              <span>PYTHON & FASTAPI</span>
              <span>SALESFORCE AI</span>
            </div>

            <div className="hero-cta-group">
              <AnimatedBorderButton href="#projects">
                VIEW WORK ↓
              </AnimatedBorderButton>
              <a href="#contact" className="hero-cta-secondary">
                GET IN TOUCH ✉
              </a>
            </div>
          </div>

          <div className="hero-photo-area">
            <div className="photo-note">
              that's me!
              <span>↙</span>
            </div>

            <div className="hero-polaroid">
              <img
                src={about?.profileImageUrl || profilePhoto}
                alt="Perumalla Bhanu Sreekar"
              />

              <p>PERUMALLA BHANU SREEKAR</p>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <a href="#about" className="hero-scroll-link">
            SCROLL TO EXPLORE ↓
          </a>

          <span>{about?.location || "HYDERABAD · INDIA"}</span>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-number">
          01 / ABOUT
        </div>

        <div className="about-grid">
          <div>
            <p className="about-small">
              A LITTLE ABOUT
            </p>

            <h2>
              I BUILD
              <br />
              <span>IDEAS</span>
              <br />
              INTO REALITY.
            </h2>
          </div>

          <div className="about-copy">
            <p className="about-lead">
              {about?.professionalTitle ||
                "Information Technology Student · AI/ML Engineer · Full-Stack Developer"}
            </p>

            <p>
              {about?.aboutParagraph1 ||
                "I am an Information Technology student with a strong focus on artificial intelligence, machine learning, and full-stack software engineering. I enjoy developing intelligent, dependable solutions that bridge modern research with practical user needs."}
            </p>

            <p>
              {about?.aboutParagraph2 ||
                "My work spans predictive AI supply chain platforms, computer vision road defect inspection, real-time tracking systems, and interactive browser applications. I emphasize clean architecture, robust APIs, and thoughtful user experiences."}
            </p>

            <div className="about-meta">
              <div>
                <small>LOCATION</small>
                <strong>{about?.location || "Hyderabad, India"}</strong>
              </div>

              <div>
                <small>STATUS</small>
                <strong>{about?.availability || "Open to Opportunities"}</strong>
              </div>
            </div>

            <button
              className="resume-button"
              onClick={() => setResumeModalOpen(true)}
            >
              VIEW RESUME ↗
            </button>
          </div>
        </div>
      </section>

      <Projects />

      <Skills />

      <Certifications />

      <Education />

      <Contact />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title={resumeData?.title || "Bhanu Sreekar Resume"}
        resumeUrl={resumeData?.url || about?.resumeUrl || "/resume/PerumallaBhanuSreekar.pdf"}
      />
    </main>
  );
}

export default Portfolio;
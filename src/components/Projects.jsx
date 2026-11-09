import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { database } from "../firebase/config";

gsap.registerPlugin(ScrollTrigger);

// Verified baseline projects adhering strictly to verified details and repositories
const VERIFIED_PROJECTS = [
  {
    id: "verified-chainiq-ai",
    title: "ChainIQ AI",
    tagline: "AI-Powered Supply Chain Intelligence",
    category: "AI PLATFORM",
    description: "An AI-powered supply chain decision intelligence platform that predicts shipment delays, explains operational risk levels, and recommends mitigation actions through an intelligent copilot and analytics dashboard.",
    technologies: "Python, FastAPI, CatBoost, Scikit-learn, React, Vite, Recharts",
    imageUrl: "/projects/chainiq-ai.png",
    github: "https://github.com/Bhanusreekar14/ChainIQ-AI",
    featured: true,
    order: 1,
    createdAt: 1785500000000,
  },
  {
    id: "verified-nagarseva",
    title: "NagarSeva AI",
    tagline: "Automated Civic Infrastructure & Road Damage Detection",
    category: "COMPUTER VISION",
    description: "An AI-powered civic grievance and urban infrastructure monitoring system using YOLO computer vision to detect road damage, track civic complaints in real-time, and route work orders to field teams.",
    technologies: "Python, FastAPI, YOLOv11, PyTorch, React, Supabase, Tailwind CSS",
    imageUrl: "/projects/nagarseva-ai.png",
    github: "https://github.com/Bhanusreekar14/NagarSeva-AI",
    featured: true,
    order: 2,
    createdAt: 1785400000000,
  },
  {
    id: "verified-fliptrack",
    title: "FlipTrack",
    tagline: "Real-Time Order & Delivery Tracking System",
    category: "ENTERPRISE SOFTWARE",
    description: "A comprehensive delivery tracking and order fulfillment management platform featuring live status progression, route tracking, and automated fulfillment workflows.",
    technologies: "React, Node.js, REST APIs, Salesforce DX, Leaflet",
    imageUrl: "/projects/fliptrack.png",
    github: "https://github.com/Bhanusreekar14/RealTimeOrderDeliveryTracking",
    featured: true,
    order: 3,
    createdAt: 1785300000000,
  },
  {
    id: "verified-decisionverse",
    title: "DecisionVerse AI",
    tagline: "AI-Powered Decision Analysis",
    category: "AI PLATFORM",
    description: "An intelligent platform that helps users make complex choices using multi-criteria decision analysis and generative AI recommendations.",
    technologies: "React, TailwindCSS, Firebase, OpenAI API",
    imageUrl: "/projects/decisionverse.png",
    github: "https://github.com/Bhanusreekar14/DecisionVerse-AI-",
    featured: false,
    order: 4,
    createdAt: 1784266333116,
  },
  {
    id: "verified-fingerninja",
    title: "Finger Ninja",
    tagline: "Computer Vision Gesture Game",
    category: "INTERACTIVE GAME",
    description: "A fast-paced interactive web game powered by computer vision hand-tracking, allowing players to slice targets in real-time with natural hand gestures.",
    technologies: "HTML5 Canvas, Javascript, MediaPipe",
    imageUrl: "/projects/finger-ninja.png",
    github: "https://github.com/Bhanusreekar14",
    featured: false,
    order: 5,
    createdAt: 1784266338116,
  },
];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const showcaseWrapperRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // Sync projects from Firebase and merge with verified catalog
  useEffect(() => {
    const projectsRef = ref(database, "portfolio/projects");

    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const normalizeTitle = (t) => (t || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      const projectsMap = new Map();
      VERIFIED_PROJECTS.forEach((p) => {
        projectsMap.set(normalizeTitle(p.title), { ...p });
      });

      if (snapshot.exists()) {
        const firebaseData = Object.entries(snapshot.val()).map(([id, project]) => ({
          id,
          ...project,
        }));

        for (const item of firebaseData) {
          const key = normalizeTitle(item.title);
          if (!key) continue;

          let cleanImageUrl = item.imageUrl || "";
          if (cleanImageUrl.includes("/src/assets/projects/decisionverse.png")) {
            cleanImageUrl = "/projects/decisionverse.png";
          } else if (cleanImageUrl.includes("/src/assets/projects/fingerninja.png")) {
            cleanImageUrl = "/projects/finger-ninja.png";
          }

          let cleanGithub = (item.github || "").replace("bhanubhanu14", "Bhanusreekar14");
          if (cleanGithub.includes("/decisionverse") && !cleanGithub.includes("DecisionVerse-AI-")) {
            cleanGithub = "https://github.com/Bhanusreekar14/DecisionVerse-AI-";
          }

          const existing = projectsMap.get(key);
          if (existing) {
            projectsMap.set(key, {
              ...existing,
              ...item,
              imageUrl: cleanImageUrl || existing.imageUrl,
              github: cleanGithub || existing.github,
            });
          } else {
            projectsMap.set(key, {
              ...item,
              imageUrl: cleanImageUrl,
              github: cleanGithub,
            });
          }
        }
      }

      const projectList = Array.from(projectsMap.values()).sort((a, b) => {
        const orderA = Number(a.order) || 999;
        const orderB = Number(b.order) || 999;
        if (orderA !== orderB) return orderA - orderB;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      setProjects(projectList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // GSAP ScrollTrigger Horizontal Animation
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isDesktopOrTablet = window.innerWidth >= 768;

    if (prefersReducedMotion || !isDesktopOrTablet) {
      // In reduced motion or mobile, let native layout and touch scrolling handle the showcase
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;
    const wrapper = showcaseWrapperRef.current;

    if (!section || !track || !wrapper) return;

    const ctx = gsap.context(() => {
      // Calculate total horizontal scroll distance
      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 140);
      };

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          id: "projects-timeline-trigger",
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
            }

            const currentIdx = Math.min(
              projects.length - 1,
              Math.max(0, Math.round(self.progress * (projects.length - 1)))
            );
            setActiveIndex(currentIdx);
          },
        },
      });

      scrollTriggerRef.current = horizontalTween.scrollTrigger;

      // Animate card entries and timeline stems as they scroll horizontally into view
      const cards = gsap.utils.toArray(".timeline-project-card");
      cards.forEach((card, index) => {
        const stem = card.querySelector(".timeline-stem");
        const dot = card.querySelector(".timeline-node-dot");

        if (index > 0) {
          gsap.fromTo(
            card,
            { opacity: 0.55, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 85%",
                end: "left 50%",
                scrub: true,
              },
            }
          );
        }

        if (stem) {
          gsap.fromTo(
            stem,
            { scaleY: 0.2, transformOrigin: "top top" },
            {
              scaleY: 1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 85%",
                end: "left 48%",
                scrub: true,
              },
            }
          );
        }

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.85 },
            {
              scale: 1.25,
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 85%",
                end: "left 48%",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [loading, projects]);

  const handleImageError = (e, projectTitle) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%"><rect width="100%" height="100%" fill="#ece6d5"/><rect x="15" y="15" width="570" height="370" fill="none" stroke="#171512" stroke-width="2" stroke-dasharray="6,6" opacity="0.35"/><text x="50%" y="48%" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#171512" text-anchor="middle">${projectTitle || "PROJECT"}</text><text x="50%" y="58%" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ed432f" text-anchor="middle" letter-spacing="2">PROJECT SHOWCASE</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const goToProject = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const isDesktopOrTablet = window.innerWidth >= 768;
    const st = scrollTriggerRef.current;

    if (isDesktopOrTablet && st && typeof st.start === "number" && typeof st.end === "number") {
      const progress = targetIndex / Math.max(1, projects.length - 1);
      const targetScroll = st.start + (st.end - st.start) * progress;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else if (trackRef.current) {
      // Mobile touch-scroll track
      const card = trackRef.current.children[targetIndex];
      if (card) {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
      setActiveIndex(targetIndex);
    }
  };

  return (
    <section className="creative-projects timeline-showcase-section" id="projects" ref={sectionRef}>
      {/* Title & Editorial Summary Header */}
      <div className="projects-title-area">
        <div>
          <p className="section-label">02 / SELECTED WORK</p>
          <h2>
            THINGS I'VE
            <br />
            <span>BUILT.</span>
          </h2>
        </div>

        <div className="projects-header-right">
          <p className="projects-summary">
            A curated collection of verified projects spanning artificial
            intelligence, machine learning, computer vision, and full-stack software.
          </p>

          {/* Interactive Navigation Controls */}
          {projects.length > 0 && (
            <div className="timeline-nav-controls" aria-label="Project showcase navigation">
              <div className="timeline-active-counter" aria-live="polite">
                <span className="counter-current">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="counter-divider">/</span>
                <span className="counter-total">
                  {String(projects.length).padStart(2, "0")}
                </span>
                <span className="counter-title">
                  {projects[activeIndex]?.title}
                </span>
              </div>

              <div className="timeline-nav-buttons">
                <button
                  type="button"
                  className="timeline-arrow-btn"
                  onClick={() => goToProject(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous project"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  className="timeline-arrow-btn"
                  onClick={() => goToProject(activeIndex + 1)}
                  disabled={activeIndex >= projects.length - 1}
                  aria-label="Next project"
                >
                  NEXT →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Jump Pills for Quick Exploration */}
      {projects.length > 0 && (
        <nav className="timeline-jump-bar" aria-label="Project quick jump list">
          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              className={`timeline-jump-pill ${activeIndex === idx ? "pill-active" : ""}`}
              onClick={() => goToProject(idx)}
              aria-label={`Jump to project ${idx + 1}: ${proj.title}`}
            >
              <span className="pill-num">{String(idx + 1).padStart(2, "0")}</span>
              <span className="pill-name">{proj.title}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Main GSAP Horizontal Pinning Stage */}
      <div className="timeline-pin-wrapper" ref={showcaseWrapperRef}>
        {/* Horizontal Timeline Connector Bar */}
        <div className="timeline-track-rail" aria-hidden="true">
          <div className="timeline-rail-line">
            <div className="timeline-rail-progress" ref={progressBarRef} />
          </div>
        </div>

        {loading ? (
          <div className="projects-loading-state">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty-state">
            Projects will appear here.
          </div>
        ) : (
          <div className="timeline-horizontal-track" ref={trackRef}>
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  className={`timeline-project-card ${isEven ? "card-layout-normal" : "card-layout-alternate"} ${activeIndex === index ? "card-focused" : ""}`}
                  key={project.id}
                  id={`project-card-${index}`}
                >
                  {/* Timeline Milestone Header & Stem */}
                  <div className="timeline-node-header" aria-hidden="true">
                    <div className="timeline-node-dot" />
                    <div className="timeline-stem" />
                    <span className="timeline-milestone-number">
                      PHASE {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card Container */}
                  <div className="timeline-card-body">
                    {/* Left/Content Column */}
                    <div className="creative-project-content">
                      <div className="project-heading-row">
                        <span className="creative-project-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <span className="creative-category">
                            {project.category || "PROJECT"}
                          </span>

                          <h3>{project.title}</h3>

                          {project.tagline && <h4>{project.tagline}</h4>}
                        </div>
                      </div>

                      <p className="creative-description">{project.description}</p>

                      {project.technologies && (
                        <div className="creative-tech">
                          {project.technologies.split(",").map((tech) => (
                            <span key={tech.trim()}>{tech.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="creative-project-links">
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            LIVE PROJECT ↗
                          </a>
                        )}

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                          >
                            VIEW CODE ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right/Image Column */}
                    <div className="project-image-frame">
                      {project.featured && (
                        <span className="creative-featured">
                          ✦ FEATURED
                        </span>
                      )}

                      <div className="project-showcase">
                        <div className="photo-card photo-1">
                          <img
                            src={project.imageUrl || "/projects/chainiq-ai.png"}
                            alt={`${project.title} preview`}
                            loading="lazy"
                            onError={(e) => handleImageError(e, project.title)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Helpful Hint on Desktop */}
      <div className="timeline-scroll-hint" aria-hidden="true">
        <span>↓ SCROLL VERTICALLY TO EXPLORE PROJECTS HORIZONTALLY →</span>
      </div>
    </section>
  );
}

export default Projects;
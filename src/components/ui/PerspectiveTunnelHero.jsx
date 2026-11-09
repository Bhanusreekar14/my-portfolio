import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";

/**
 * Authentic portfolio project catalog for Stage 1 of the Perspective Tunnel.
 * Uses real project images and verified titles from public/projects/.
 */
const TUNNEL_PROJECTS = [
  {
    id: "chainiq-ai",
    type: "project",
    title: "ChainIQ AI",
    category: "AI PLATFORM",
    tagline: "Supply Chain Intelligence & Delay Prediction",
    image: "/projects/chainiq-ai.png",
    alt: "ChainIQ AI Supply Chain Analytics Dashboard",
  },
  {
    id: "nagarseva-ai",
    type: "project",
    title: "NagarSeva AI",
    category: "COMPUTER VISION",
    tagline: "Civic Infrastructure & Road Damage Detection",
    image: "/projects/nagarseva-ai.png",
    alt: "NagarSeva AI Computer Vision Defect Detection",
  },
  {
    id: "fliptrack",
    type: "project",
    title: "FlipTrack",
    category: "ENTERPRISE",
    tagline: "Real-Time Order & Delivery Tracking",
    image: "/projects/fliptrack.png",
    alt: "FlipTrack Live Order Progression Tracking",
  },
  {
    id: "decisionverse",
    type: "project",
    title: "DecisionVerse AI",
    category: "DECISION INTELLIGENCE",
    tagline: "Multi-Criteria Decision Modeling Platform",
    image: "/projects/decisionverse.png",
    alt: "DecisionVerse AI Analysis Platform",
  },
  {
    id: "finger-ninja",
    type: "project",
    title: "Finger Ninja",
    category: "INTERACTIVE VISION",
    tagline: "Computer Vision Hand-Tracking Browser Game",
    image: "/projects/finger-ninja.png",
    alt: "Finger Ninja Computer Vision Hand Tracking Game",
  },
  {
    id: "traffic-ai",
    type: "project",
    title: "Traffic AI",
    category: "COMPUTER VISION",
    tagline: "Intelligent Urban Traffic Surveillance & Analytics",
    image: "/projects/traffic-ai.png",
    alt: "Traffic AI Intelligent Video Analytics",
  },
  {
    id: "washfind",
    type: "project",
    title: "WashFind",
    category: "WEB APP",
    tagline: "Smart Facility Discovery & Location Navigator",
    image: "/projects/washfind.png",
    alt: "WashFind Smart Facility Finder",
  },
];

/**
 * Authentic certifications catalog for Stage 2 of the Perspective Tunnel.
 * Synced with Firebase portfolio data: Salesforce, Oracle, Cisco, etc.
 */
const TUNNEL_CERTIFICATIONS = [
  {
    id: "cert-agentforce",
    type: "certification",
    title: "Agentforce Specialist",
    issuer: "Salesforce",
    category: "SALESFORCE AI",
    credentialId: "7278072",
    issueDate: "Dec 2025",
    tagline: "Autonomous AI Agents & Enterprise Orchestration",
  },
  {
    id: "cert-oracle-foundations",
    type: "certification",
    title: "Certified Foundations Associate",
    issuer: "Oracle University",
    category: "ORACLE CLOUD",
    credentialId: "OCI-FA-2026",
    issueDate: "July 2026",
    tagline: "Cloud Infrastructure Architecture & Core Services",
  },
  {
    id: "cert-cisco-ccna",
    type: "certification",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    category: "CISCO NETWORKING",
    credentialId: "CCNA-ITN-2026",
    issueDate: "March 2026",
    tagline: "Network Protocols, IP Routing & Infrastructure",
  },
  {
    id: "cert-salesforce-pdi",
    type: "certification",
    title: "Platform Developer I",
    issuer: "Salesforce",
    category: "SALESFORCE DEV",
    credentialId: "8190260",
    issueDate: "October 2026",
    tagline: "Apex, Lightning Web Components & Data Modeling",
  },
  {
    id: "cert-ai-agent-masterclass",
    type: "certification",
    title: "5-Day AI Agent Masterclass",
    issuer: "Coding Merijaan",
    category: "AI AGENTS",
    credentialId: "CMJ2026A133364",
    issueDate: "2026",
    tagline: "LLM Agentic Workflows & Multi-Agent Architecture",
  },
];

// Unified tunnel catalog: 7 Projects followed by 5 Certifications
const ALL_TUNNEL_ITEMS = [
  ...TUNNEL_PROJECTS,
  ...TUNNEL_CERTIFICATIONS,
];

/**
 * Tunnel Card component supporting both Projects and Certifications.
 */
function TunnelItemCard({ item, index, total, animProgress, isMobile }) {
  // Golden angle phyllotaxis spiral distribution (~137.5 degrees)
  const goldenAngle = 137.507764 * (Math.PI / 180);
  const angle = index * goldenAngle;

  // Responsive radial spread from center so center text remains legible
  const radiusX = isMobile ? 135 : 380;
  const radiusY = isMobile ? 180 : 260;

  const xOffset = Math.cos(angle) * radiusX;
  const yOffset = Math.sin(angle) * radiusY;

  // Card orientation / rotation angles facing inward
  const rotateZ = ((angle * 180) / Math.PI) * 0.12;
  const rotateX = isMobile ? 0 : Math.sin(angle) * 12;
  const rotateY = isMobile ? 0 : -Math.cos(angle) * 14;

  // Stage 1 (Projects: index 0-6) starts closer
  // Stage 2 (Certifications: index 7-11) follows cleanly behind
  const baseZ = -300 - index * 360;
  const totalTravel = 5100;

  // Map automatic animation progress to card Z position, scale, and opacity
  const z = useTransform(animProgress, (p) => baseZ + p * totalTravel);

  const scale = useTransform(z, (currentZ) => {
    if (currentZ < -2400) return 0.22;
    if (currentZ < -800) return 0.35 + ((currentZ + 2400) / 1600) * 0.45;
    if (currentZ < 150) return 0.8 + ((currentZ + 800) / 950) * 0.25;
    return 1.05 + ((currentZ - 150) / 450) * 0.28;
  });

  const opacity = useTransform(z, (currentZ) => {
    if (currentZ < -2600) return 0;
    if (currentZ < -1700) return (currentZ + 2600) / 900;
    if (currentZ < 220) return 1;
    if (currentZ < 620) return 1 - (currentZ - 220) / 400;
    return 0;
  });

  const isProject = item.type === "project";

  return (
    <motion.div
      style={{
        x: xOffset,
        y: yOffset,
        z,
        scale,
        opacity,
        rotateX,
        rotateY,
        rotateZ,
      }}
      className={`tunnel-3d-card ${isProject ? "tunnel-project-card" : "tunnel-cert-card"}`}
    >
      <div className="tunnel-card-inner">
        {isProject ? (
          /* Project Image Visual */
          <div className="tunnel-card-img-wrap">
            <img
              src={item.image}
              alt={item.alt}
              loading="eager"
              className="tunnel-card-img"
            />
            <div className="tunnel-card-overlay" />
            <span className="tunnel-card-badge">{item.category}</span>
          </div>
        ) : (
          /* Certification Official Seal Visual */
          <div className="tunnel-cert-seal-wrap">
            <div className="tunnel-cert-seal-disc">
              <span className="tunnel-cert-star">★</span>
              <span className="tunnel-cert-org">{item.issuer}</span>
              <span className="tunnel-cert-sub">VERIFIED CREDENTIAL</span>
            </div>
            <span className="tunnel-card-badge tunnel-cert-badge">{item.category}</span>
          </div>
        )}

        {/* Card Details */}
        <div className="tunnel-card-details">
          <div className="tunnel-card-header-line">
            <span className="tunnel-card-type-tag">
              {isProject ? "PROJECT // WORK" : "ACCREDITATION"}
            </span>
            {!isProject && item.issueDate && (
              <span className="tunnel-card-date-tag">{item.issueDate}</span>
            )}
          </div>

          <h4 className="tunnel-card-title">{item.title}</h4>
          <p className="tunnel-card-tagline">{item.tagline}</p>

          {!isProject && item.credentialId && (
            <div className="tunnel-card-id-badge">
              ID: <strong>{item.credentialId}</strong>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * PerspectiveTunnelHero
 * Full-Screen Opening Intro Animation showcasing Projects AND Certifications in 3D.
 * Duration: ~5.4 seconds total, with smooth transition into the portfolio Hero.
 */
export default function PerspectiveTunnelHero({ onComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentStage, setCurrentStage] = useState(1); // Stage 1: Projects, Stage 2: Certifications
  const completedRef = useRef(false);

  // Automatic timeline progress motion value (0 to 1)
  const animProgress = useMotionValue(0);

  // Safe exit handler to trigger exit animation then invoke onComplete
  const handleExit = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);

    if (prefersReducedMotion) {
      if (typeof onComplete === "function") {
        onComplete();
      }
      return;
    }

    // Smooth exit transition before unmounting
    setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 500);
  };

  // Check mobile viewport breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard shortcut support (Escape, Space, Enter to skip immediately)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update central stage display based on progress
  useEffect(() => {
    const unsubscribe = animProgress.on("change", (latest) => {
      if (latest >= 0.46 && currentStage !== 2) {
        setCurrentStage(2);
      } else if (latest < 0.46 && currentStage !== 1) {
        setCurrentStage(1);
      }
    });
    return () => unsubscribe();
  }, [currentStage]);

  // Run the automatic timeline animation (faster, energetic 5.4s duration)
  useEffect(() => {
    if (prefersReducedMotion) {
      handleExit();
      return;
    }

    // Fallback timer ensures intro completes even if rAF is throttled in background tabs
    const fallbackTimer = setTimeout(() => {
      handleExit();
    }, 5700);

    // Automatically animate tunnel progress from 0 to 1 over 5.4 seconds
    const controls = animate(animProgress, 1, {
      duration: 5.4,
      ease: [0.22, 0.08, 0.25, 1],
      onComplete: () => {
        clearTimeout(fallbackTimer);
        handleExit();
      },
    });

    return () => {
      clearTimeout(fallbackTimer);
      controls.stop();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`tunnel-intro-overlay ${isExiting ? "tunnel-intro-exiting" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Opening 3D Perspective Tunnel Intro"
    >
      {/* Background vignette & ambient backdrop */}
      <div className="tunnel-radial-vignette" aria-hidden="true" />

      {/* Top Navigation Bar in Intro with Skip Button */}
      <header className="tunnel-intro-header">
        <div className="tunnel-intro-brand">
          BHANU<span>.</span>
        </div>

        <button
          type="button"
          className="tunnel-skip-btn"
          onClick={handleExit}
          aria-label="Skip introductory animation"
        >
          <span>SKIP INTRO</span>
          <span className="tunnel-skip-arrow">→</span>
        </button>
      </header>

      {/* Central Editorial Title & Subtitle */}
      <div className="tunnel-intro-center">
        <div className="tunnel-intro-kicker">
          <span className="tunnel-intro-dot" />
          <span>
            {currentStage === 1
              ? "STAGE 01 // SELECTED PROJECTS"
              : "STAGE 02 // ACCREDITED CERTIFICATIONS"}
          </span>
        </div>

        <h1 className="tunnel-intro-title">
          <span>BHANU</span> <span className="tunnel-accent-text">SREEKAR</span>
        </h1>

        <p className="tunnel-intro-subtitle">
          {currentStage === 1
            ? "AI • SOFTWARE • CREATIVE TECHNOLOGY"
            : "SALESFORCE • ORACLE • CISCO CERTIFIED"}
        </p>

        {/* Ambient progress line indicating intro progress */}
        <div className="tunnel-progress-track">
          <motion.div
            className="tunnel-progress-bar"
            style={{ scaleX: animProgress }}
          />
        </div>
      </div>

      {/* 3D Perspective Tunnel World Stage */}
      <div className="tunnel-3d-stage">
        <div className="tunnel-3d-world">
          {ALL_TUNNEL_ITEMS.map((item, index) => (
            <TunnelItemCard
              key={item.id}
              item={item}
              index={index}
              total={ALL_TUNNEL_ITEMS.length}
              animProgress={animProgress}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

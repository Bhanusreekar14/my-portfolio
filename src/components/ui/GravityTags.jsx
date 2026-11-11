import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Calculates readable text color (black or white) based on background hex luminance.
 */
function readableInk(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return "#171512";
  const cleanHex = hexColor.replace("#", "").trim();
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  if (fullHex.length !== 6) return "#171512";

  const r = parseInt(fullHex.substring(0, 2), 16) || 0;
  const g = parseInt(fullHex.substring(2, 4), 16) || 0;
  const b = parseInt(fullHex.substring(4, 6), 16) || 0;

  // Perceptual luminance calculation
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#171512" : "#ffffff";
}

// Curated verified portfolio skills palette matching light and dark themes
const DEFAULT_PORTFOLIO_SKILL_TAGS = [
  { id: "python", label: "Python", color: "#e8c468" },
  { id: "react", label: "React 19", color: "#38bdf8" },
  { id: "fastapi", label: "FastAPI", color: "#2dd4bf" },
  { id: "pytorch", label: "PyTorch", color: "#f87171" },
  { id: "yolo", label: "YOLOv11", color: "#ed432f" },
  { id: "opencv", label: "OpenCV", color: "#818cf8" },
  { id: "docker", label: "Docker", color: "#60a5fa" },
  { id: "firebase", label: "Firebase", color: "#fbbf24" },
  { id: "supabase", label: "Supabase", color: "#34d399" },
  { id: "postgres", label: "PostgreSQL", color: "#94a3b8" },
  { id: "cpp", label: "C++", color: "#60a5fa" },
  { id: "java", label: "Java", color: "#fb923c" },
  { id: "javascript", label: "JavaScript", color: "#facc15" },
  { id: "git", label: "Git", color: "#f43f5e" },
  { id: "catboost", label: "CatBoost", color: "#a3e635" },
  { id: "salesforce", label: "Salesforce AI", color: "#38bdf8" },
  { id: "ml", label: "Machine Learning", color: "#c084fc" },
  { id: "tailwind", label: "Tailwind CSS", color: "#38bdf8" },
];

export default function GravityTags({
  skills = [],
  label = "Technologies and Skills",
  gravity = 0.42,
  bounce = 0.28,
  interactive = true,
  className = "",
}) {
  const rootRef = useRef(null);
  const bodiesRef = useRef([]);
  const animFrameRef = useRef(0);
  const prefersReduced = useReducedMotion();
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [containerHeight, setContainerHeight] = useState(420);

  // Harmonize Firebase skills with verified portfolio colors
  const tags = useMemo(() => {
    if (skills && skills.length > 0) {
      const colorMap = {
        python: "#e8c468",
        react: "#38bdf8",
        fastapi: "#2dd4bf",
        pytorch: "#f87171",
        yolo: "#ed432f",
        opencv: "#818cf8",
        docker: "#60a5fa",
        firebase: "#fbbf24",
        supabase: "#34d399",
        git: "#f43f5e",
        java: "#fb923c",
        javascript: "#facc15",
        postgres: "#94a3b8",
        postgresql: "#94a3b8",
        sql: "#94a3b8",
        catboost: "#a3e635",
        salesforce: "#38bdf8",
        ml: "#c084fc",
        "machine learning": "#c084fc",
        tailwind: "#38bdf8",
        html: "#f97316",
        css: "#38bdf8",
        node: "#34d399",
        express: "#94a3b8",
        next: "#171512",
        generative: "#c084fc",
        llm: "#f43f5e",
        rag: "#2dd4bf",
        prompt: "#fbbf24",
      };

      return skills.map((s) => {
        const key = (s.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        let color = "#e5dccb";
        for (const [techKey, hex] of Object.entries(colorMap)) {
          if (key.includes(techKey)) {
            color = hex;
            break;
          }
        }
        return {
          id: s.id || s.name,
          label: s.name,
          color,
        };
      });
    }
    return DEFAULT_PORTFOLIO_SKILL_TAGS;
  }, [skills]);

  // Responsive height tailored for 31 skills:
  // Desktop: 420px (comfortably accommodates 4-5 layers with drop space)
  // Tablet: 520px
  // Mobile: 600px (allows ~12-14 stacked layers in narrow 340px-390px viewport without clipping)
  const updateResponsiveHeight = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 480) {
      setContainerHeight(600);
    } else if (w < 768) {
      setContainerHeight(520);
    } else {
      setContainerHeight(420);
    }
  }, []);

  useEffect(() => {
    updateResponsiveHeight();
    window.addEventListener("resize", updateResponsiveHeight);
    return () => window.removeEventListener("resize", updateResponsiveHeight);
  }, [updateResponsiveHeight]);

  // Viewport Intersection Observer: Trigger falling animation once scrolled into view
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // 2D Rigid Body Physics Engine
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !hasEnteredView || prefersReduced) return;

    const elements = [...root.querySelectorAll("[data-gravity]")];
    if (elements.length === 0) return;

    let width = root.clientWidth || root.getBoundingClientRect().width;
    if (!width || width < 100) {
      width = typeof window !== "undefined" ? Math.min(window.innerWidth - 80, 1100) : 800;
    }

    const boxHeight = containerHeight;

    // Distribute tags across columns evenly across the entire container width
    const minColWidth = width < 480 ? 95 : width < 768 ? 110 : 135;
    const numCols = Math.max(2, Math.floor((width - 24) / minColWidth));
    const colWidth = (width - 24) / numCols;

    bodiesRef.current = elements.map((el, index) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || el.offsetWidth || 95;
      const h = rect.height || el.offsetHeight || 30;

      const col = index % numCols;
      const row = Math.floor(index / numCols);

      // Center within assigned column with slight organic jitter
      const colCenter = 12 + col * colWidth + colWidth / 2;
      const jitterX = (Math.random() - 0.5) * (colWidth * 0.3);
      const targetX = colCenter - w / 2 + jitterX;
      const x = Math.max(12, Math.min(width - w - 12, targetX));

      // Spawn tags in staggered formation within the upper region of the container
      const y = 14 + (row * 22) + (index % 3) * 6;

      return {
        el,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.0,
        vy: 0.4 + Math.random() * 0.6,
        w,
        h,
        angle: (Math.random() - 0.5) * 10,
        spin: (Math.random() - 0.5) * 0.3,
        isResting: false,
      };
    });

    // Apply immediate transform positions
    for (const body of bodiesRef.current) {
      body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
    }

    let idleCount = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const step = () => {
      const bodies = bodiesRef.current;
      let isMoving = false;

      for (const body of bodies) {
        if (!body.isResting) {
          body.vy += gravity;
        }

        body.x += body.vx;
        body.y += body.vy;
        body.angle += body.spin;
        body.spin *= 0.96;

        // Pointer Interactive Repulsion on hover / touch
        if (interactive && pointer.active) {
          const centerX = body.x + body.w / 2;
          const centerY = body.y + body.h / 2;
          const dx = centerX - pointer.x;
          const dy = centerY - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 100 && dist > 1) {
            body.isResting = false;
            const push = (1 - dist / 100) * 3.2;
            body.vx += (dx / dist) * push;
            body.vy += (dy / dist) * push;
            body.spin += (dx / dist) * 0.5;
          }
        }

        // Left and Right Wall Boundaries with safety margin
        const padX = 12;
        if (body.x < padX) {
          body.x = padX;
          body.vx = -body.vx * bounce;
        } else if (body.x + body.w > width - padX) {
          body.x = width - body.w - padX;
          body.vx = -body.vx * bounce;
        }

        // Floor and Ceiling Boundaries with Angle Padding & exact pill height subtraction
        const rad = (Math.abs(body.angle) * Math.PI) / 180;
        const cornerOvershoot = (body.w * Math.sin(rad) + body.h * Math.cos(rad) - body.h) / 2;
        const padY = 12;
        const ceilLimit = padY + Math.max(0, cornerOvershoot);
        const floorLimit = boxHeight - body.h - padY - Math.max(0, cornerOvershoot);

        if (body.y < ceilLimit) {
          body.y = ceilLimit;
          if (body.vy < 0) {
            body.vy = -body.vy * bounce;
          }
        }

        if (body.y >= floorLimit) {
          body.y = floorLimit;
          if (Math.abs(body.vy) < 0.8) {
            body.vy = 0;
            body.isResting = true;
          } else {
            body.vy = -body.vy * bounce;
            body.isResting = false;
          }
          body.vx *= 0.82;
          body.spin *= 0.65;
          body.angle *= 0.90; // Align towards tabletop flat
        }

        // Clamp rotation angles so badges stay legible
        if (body.angle > 16) body.angle = 16;
        if (body.angle < -16) body.angle = -16;

        // Stop tiny micro-jitter when near zero velocity
        if (Math.abs(body.vx) < 0.08) body.vx = 0;
        if (Math.abs(body.spin) < 0.02) body.spin = 0;
      }

      // Pairwise Rigid-Body Collision Resolution
      const len = bodies.length;
      for (let i = 0; i < len; i += 1) {
        for (let j = i + 1; j < len; j += 1) {
          const a = bodies[i];
          const b = bodies[j];

          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);

          if (overlapX <= 0 || overlapY <= 0) continue;

          // If overlapping horizontally more than vertically
          if (overlapX < overlapY) {
            const shift = (overlapX / 2) * (a.x < b.x ? -1 : 1);
            a.x += shift;
            b.x -= shift;
            const tempVx = a.vx;
            a.vx = b.vx * bounce * 0.8;
            b.vx = tempVx * bounce * 0.8;
          } else {
            // Overlapping vertically
            // If b is resting against the floor, push a UP rather than b DOWN
            if (b.isResting && !a.isResting) {
              a.y -= overlapY;
              a.vy = -Math.abs(a.vy) * bounce * 0.6;
              if (Math.abs(a.vy) < 0.8) {
                a.vy = 0;
                a.isResting = true;
              }
            } else if (a.isResting && !b.isResting) {
              b.y -= overlapY;
              b.vy = -Math.abs(b.vy) * bounce * 0.6;
              if (Math.abs(b.vy) < 0.8) {
                b.vy = 0;
                b.isResting = true;
              }
            } else {
              const shift = (overlapY / 2) * (a.y < b.y ? -1 : 1);
              a.y += shift;
              b.y -= shift;
              const tempVy = a.vy;
              a.vy = b.vy * bounce * 0.6;
              b.vy = tempVy * bounce * 0.6;
            }
            a.spin *= 0.82;
            b.spin *= 0.82;
          }
        }
      }

      // Commit transformed positions to DOM
      for (const body of bodies) {
        body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
        if (Math.abs(body.vx) > 0.08 || Math.abs(body.vy) > 0.08) {
          isMoving = true;
        }
      }

      // Sleep physics loop when tags have settled to preserve battery and CPU
      idleCount = isMoving || pointer.active ? 0 : idleCount + 1;
      if (idleCount > 40) {
        animFrameRef.current = 0;
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!animFrameRef.current) {
        idleCount = 0;
        for (const b of bodiesRef.current) {
          b.isResting = false;
        }
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    const onPointerMove = (e) => {
      if (!interactive) return;
      const rect = root.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      wake();
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    // ResizeObserver: Dynamically re-adjust bounds without re-dropping tags
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 100) {
          width = newWidth;
          const padX = 12;
          const padY = 12;
          for (const b of bodiesRef.current) {
            if (b.x + b.w > width - padX) {
              b.x = Math.max(padX, width - b.w - padX);
              b.vx *= -0.4;
            }
            if (b.x < padX) {
              b.x = padX;
            }
            if (newHeight > 100) {
              const floorLimit = newHeight - b.h - padY;
              if (b.y > floorLimit) {
                b.y = floorLimit;
                b.isResting = true;
              }
            }
          }
          wake();
        }
      }
    });

    resizeObserver.observe(root);
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });

    wake();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [bounce, gravity, containerHeight, interactive, tags, hasEnteredView, prefersReduced]);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={label}
      className={`gravity-tags-viewport ${className}`}
      style={{ height: containerHeight }}
    >
      {prefersReduced ? (
        // Accessible, static fallback for prefers-reduced-motion inside the same box
        <div className="gravity-tags-reduced-fallback">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="gravity-tag-pill"
              style={{
                backgroundColor: tag.color,
                color: readableInk(tag.color),
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : (
        // Physical rigid-body tags dropping from top & settling naturally
        tags.map((tag) => (
          <span
            key={tag.id}
            data-gravity=""
            className="gravity-tag-pill gravity-tag-animated"
            style={{
              backgroundColor: tag.color,
              color: readableInk(tag.color),
            }}
          >
            {tag.label}
          </span>
        ))
      )}

      {/* Screen reader accessibility list */}
      <div className="sr-only">
        <p>{label}</p>
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>{tag.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

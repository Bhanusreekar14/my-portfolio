import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor
 * Smooth animated custom cursor with:
 * - Central precision dot
 * - Fluid trailing circular ring with smooth lerp physics
 * - Subtle enlargement and magnetic feel over interactive elements
 * - Zero lag on dot positioning
 * - Automatic disable on touch devices, mobile screens, or prefers-reduced-motion
 * - Strict pointer-events: none
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const animFrameRef = useRef(0);

  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  // 1. Device and accessibility qualification
  useEffect(() => {
    const checkEligibility = () => {
      if (typeof window === "undefined") return false;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const hasTouch = "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isDesktopWidth = window.innerWidth >= 768;

      return isFinePointer && !hasTouch && !prefersReduced && isDesktopWidth;
    };

    const eligible = checkEligibility();
    setIsActive(eligible);

    const handleResize = () => {
      setIsActive(checkEligibility());
    };

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedChange = () => {
      setIsActive(checkEligibility());
    };

    window.addEventListener("resize", handleResize);
    reducedQuery.addEventListener("change", handleReducedChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      reducedQuery.removeEventListener("change", handleReducedChange);
    };
  }, []);

  // 2. Hide default system cursor only when custom cursor is actively enabled
  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    document.body.classList.add("has-custom-cursor");

    return () => {
      document.body.classList.remove("has-custom-cursor");
    };
  }, [isActive]);

  // 3. Mouse listeners and smooth trailing animation loop
  useEffect(() => {
    if (!isActive) return;

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        // Snap initial ring position so it doesn't fly in from off-screen
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }

      // Check if hovering over interactive elements
      const target = e.target;
      const interactiveEl = target?.closest?.(
        "a, button, [role='button'], input, textarea, select, label, .gravity-tag-pill, .creative-project-card, .cert-card, .btn, .portfolio-logo, [data-cursor-hover]"
      );
      setIsHovered(Boolean(interactiveEl));
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = (e) => {
      if (e.relatedTarget === null) {
        setIsVisible(false);
      }
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth 60fps / 120fps trailing loop
    const render = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // Trailing ring with smooth linear interpolation
      ringPos.current.x += (targetX - ringPos.current.x) * 0.18;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        // Dot tracks mouse instantly with 0 lag
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, isVisible]);

  if (!isActive) return null;

  return (
    <div
      className="custom-cursor-root"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* Central precision dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? "cursor-hover" : ""} ${isClicked ? "cursor-clicked" : ""}`}
      />

      {/* Fluid trailing ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? "cursor-hover" : ""} ${isClicked ? "cursor-clicked" : ""}`}
      />
    </div>
  );
}


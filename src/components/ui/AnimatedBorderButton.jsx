import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";
import { cn } from "../../lib/utils";

/**
 * AnimatedBorderButton
 * A high-performance, accessible button with a smoothly travelling gradient border beam
 * utilizing CSS offset-path and offsetDistance.
 *
 * - Moving gradient beam around the border path
 * - Terracotta brand accent (#ed432f) with radiant highlight
 * - Native prefers-reduced-motion support (pauses/disables animation)
 * - Light and dark mode support
 * - Accessible keyboard navigation & focus-visible styles
 * - Strict pointer-events: none on all animation layers
 */
export default function AnimatedBorderButton({
  as: Component,
  href,
  onClick,
  children,
  className = "",
  containerClassName = "",
  duration = 4,
  borderRadius = "40px",
  borderWidth = 1.5,
  color = "#ed432f",
  accentColor = "#ffffff",
  beamSize = 75,
  ...props
}) {
  const prefersReduced = useReducedMotion();

  // Determine element type: 'a' if href provided, otherwise 'button'
  const Tag = Component || (href ? "a" : "button");

  return (
    <div
      className={cn("animated-border-btn-container", containerClassName)}
      style={{
        borderRadius,
        padding: `${borderWidth}px`,
      }}
    >
      {/* 1. Moving Gradient Border Beam Layer */}
      {!prefersReduced && (
        <div
          className="animated-border-beam-track"
          aria-hidden="true"
          style={{
            borderRadius,
          }}
        >
          <motion.div
            className="animated-border-beam-mover"
            style={{
              offsetPath: `rect(0 auto auto 0 round ${borderRadius})`,
            }}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration,
            }}
          >
            <div
              className="animated-border-beam-glow"
              style={{
                width: `${beamSize}px`,
                height: `${Math.round(beamSize * 0.55)}px`,
                background: `radial-gradient(ellipse at center, ${accentColor} 0%, ${color} 45%, rgba(237, 67, 47, 0) 75%)`,
              }}
            />
          </motion.div>
        </div>
      )}

      {/* 2. Core Interactive Button / Link Element */}
      <Tag
        href={href}
        onClick={onClick}
        className={cn("animated-border-btn-inner", className)}
        style={{
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
        }}
        {...props}
      >
        {children}
      </Tag>
    </div>
  );
}


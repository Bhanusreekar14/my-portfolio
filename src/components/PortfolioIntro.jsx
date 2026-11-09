import { useEffect } from "react";

function PortfolioIntro({ onComplete }) {
  useEffect(() => {
    // Respect user's reduced-motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 3600);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div className="portfolio-intro" role="region" aria-label="Portfolio Introduction">
      <header className="intro-top-header">
        <span className="intro-year">
          PORTFOLIO / 2026
        </span>

        <button
          type="button"
          className="intro-skip-button"
          onClick={onComplete}
          aria-label="Skip introductory animation"
        >
          SKIP INTRO →
        </button>
      </header>

      <div className="intro-line intro-line-top" />

      <div className="intro-center">
        <p className="intro-hello">HELLO, I'M</p>

        <h1 className="intro-name">
          <span>
            <b>BHANU</b>
          </span>

          <span className="intro-sreekar">
            <b>SREEKAR</b>
          </span>
        </h1>

        <p className="intro-role">
          AI · SOFTWARE · CREATIVE TECHNOLOGY
        </p>
      </div>

      <span className="intro-star" aria-hidden="true">✦</span>

      <div className="intro-line intro-line-bottom" />
    </div>
  );
}

export default PortfolioIntro;

import { Outlet } from "react-router-dom";
import TweenlyHeroBackground from "../components/ui/TweenlyHeroBackground";
import CustomCursor from "../components/ui/CustomCursor";

/**
 * PublicLayout
 * Shared root layout component for all public portfolio routes.
 * Hosts a single, persistent, global Tweenly animated background instance
 * and a smooth custom animated cursor across the portfolio.
 */
export default function PublicLayout() {
  return (
    <div className="portfolio-app-shell">
      {/* Global persistent animated background across the entire portfolio */}
      <TweenlyHeroBackground
        isGlobal={true}
        variant="dots"
        color="currentColor"
        accent="#ed432f"
        background="transparent"
        density={0.8}
        size={1.5}
        speed={0.85}
        interaction="repel"
        radius={170}
        strength={0.8}
        opacity={0.35}
        mask="none"
        clickRipple={true}
        interactive={true}
        className="portfolio-global-bg"
      />

      {/* Global custom animated cursor */}
      <CustomCursor />

      <div className="portfolio-content-layer">
        <Outlet />
      </div>
    </div>
  );
}


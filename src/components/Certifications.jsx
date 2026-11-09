import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { database } from "../firebase/config";

gsap.registerPlugin(ScrollTrigger);

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewCert, setPreviewCert] = useState(null);

  const sectionRef = useRef(null);
  const showcaseWrapperRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // Sync certifications from Firebase
  useEffect(() => {
    const certificationsRef = ref(database, "portfolio/certifications");

    const unsubscribe = onValue(certificationsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setCertifications([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const certificationList = Object.entries(data)
        .map(([id, certification]) => ({
          id,
          ...certification,
        }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setCertifications(certificationList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // GSAP ScrollTrigger Pinned Horizontal Showcase Animation
  useEffect(() => {
    if (loading || certifications.length === 0) return;

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
      // Calculate total horizontal scroll distance needed
      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 140);
      };

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          id: "certifications-timeline-trigger",
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(
                100,
                Math.max(0, self.progress * 100)
              )}%`;
            }

            const currentIdx = Math.min(
              certifications.length - 1,
              Math.max(
                0,
                Math.round(self.progress * (certifications.length - 1))
              )
            );
            setActiveIndex(currentIdx);
          },
        },
      });

      scrollTriggerRef.current = horizontalTween.scrollTrigger;

      // Container animations for cards as they glide horizontally into view
      const cards = gsap.utils.toArray(".timeline-cert-card", sectionRef.current);
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

    // Refresh ScrollTrigger to ensure accurate positions with pin-spacers
    ScrollTrigger.refresh();

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [loading, certifications]);

  // Lock body scroll when certificate preview modal is open
  useEffect(() => {
    if (previewCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewCert]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Format valid external credential verification URL safely
  const getValidUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  // Navigate to specific certification card
  const goToCert = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= certifications.length) return;

    const isDesktopOrTablet = window.innerWidth >= 768;
    const st = scrollTriggerRef.current;

    if (isDesktopOrTablet && st && typeof st.start === "number" && typeof st.end === "number") {
      const progress = targetIndex / Math.max(1, certifications.length - 1);
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
    <section
      className="certifications-section timeline-showcase-section"
      id="certifications"
      ref={sectionRef}
    >
      {/* Title & Editorial Summary Header */}
      <div className="certifications-title-area">
        <div>
          <p className="section-label">04 / CERTIFICATIONS</p>
          <h2>
            THINGS I'VE
            <br />
            <span>EARNED.</span>
          </h2>
        </div>

        <div className="certifications-header-right">
          <p className="certifications-summary">
            Verified professional credentials, industry certifications, and learning milestones
            representing continuous mastery across AI platforms, cloud architectures, and systems engineering.
          </p>

          {/* Interactive Navigation Controls */}
          {certifications.length > 0 && (
            <div className="timeline-nav-controls" aria-label="Certifications showcase navigation">
              <div className="timeline-active-counter" aria-live="polite">
                <span className="counter-current">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="counter-divider">/</span>
                <span className="counter-total">
                  {String(certifications.length).padStart(2, "0")}
                </span>
                <span className="counter-title">
                  {certifications[activeIndex]?.title}
                </span>
              </div>

              <div className="timeline-nav-buttons">
                <button
                  type="button"
                  className="timeline-arrow-btn"
                  onClick={() => goToCert(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous certification"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  className="timeline-arrow-btn"
                  onClick={() => goToCert(activeIndex + 1)}
                  disabled={activeIndex >= certifications.length - 1}
                  aria-label="Next certification"
                >
                  NEXT →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certification Jump Pills for Quick Exploration */}
      {certifications.length > 0 && (
        <nav className="timeline-jump-bar cert-jump-bar" aria-label="Certifications quick jump list">
          {certifications.map((cert, idx) => (
            <button
              key={cert.id}
              type="button"
              className={`timeline-jump-pill ${activeIndex === idx ? "pill-active" : ""}`}
              onClick={() => goToCert(idx)}
              aria-label={`Jump to certification ${idx + 1}: ${cert.title}`}
            >
              <span className="pill-num">{String(idx + 1).padStart(2, "0")}</span>
              <span className="pill-name">{cert.issuer ? `${cert.issuer} — ` : ""}{cert.title}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Main GSAP Horizontal Pinning Stage */}
      <div className="timeline-pin-wrapper cert-pin-wrapper" ref={showcaseWrapperRef}>
        {/* Horizontal Timeline Connector Bar */}
        <div className="timeline-track-rail cert-track-rail" aria-hidden="true">
          <div className="timeline-rail-line">
            <div className="timeline-rail-progress cert-rail-progress" ref={progressBarRef} />
          </div>
        </div>

        {loading ? (
          <div className="certifications-loading-state">
            Loading certifications...
          </div>
        ) : certifications.length === 0 ? (
          <div className="certifications-empty-state">
            Certifications will appear here.
          </div>
        ) : (
          <div className="timeline-horizontal-track cert-horizontal-track" ref={trackRef}>
            {certifications.map((certificate, index) => {
              const isEven = index % 2 === 0;
              const validVerificationUrl = getValidUrl(certificate.credentialUrl);
              const hasImage = Boolean(certificate.imageUrl && certificate.imageUrl.trim());

              return (
                <article
                  className={`timeline-cert-card ${isEven ? "card-layout-normal" : "card-layout-alternate"} ${activeIndex === index ? "card-focused" : ""}`}
                  key={certificate.id}
                  id={`cert-card-${index}`}
                >
                  {/* Timeline Milestone Header & Stem */}
                  <div className="timeline-node-header" aria-hidden="true">
                    <div className="timeline-node-dot" />
                    <div className="timeline-stem" />
                    <span className="timeline-milestone-number">
                      CREDENTIAL {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card Container */}
                  <div className="timeline-card-body cert-card-body">
                    {/* Content Column */}
                    <div className="creative-project-content cert-card-content">
                      <div className="project-heading-row cert-heading-row">
                        <span className="creative-project-number cert-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <span className="creative-category cert-category">
                            {certificate.issuer || "OFFICIAL CREDENTIAL"}
                          </span>

                          <h3 className="cert-card-title">{certificate.title}</h3>

                          {certificate.issueDate && (
                            <p className="cert-card-date">
                              ISSUED / {certificate.issueDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {certificate.credentialId && (
                        <div className="cert-meta-wrap">
                          <span
                            className="cert-id-pill"
                            title={`Credential ID: ${certificate.credentialId}`}
                          >
                            CREDENTIAL ID: <strong>{certificate.credentialId}</strong>
                          </span>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="creative-project-links cert-card-actions">
                        {hasImage && (
                          <button
                            type="button"
                            className="cert-action-btn-primary"
                            onClick={() => setPreviewCert(certificate)}
                            aria-label={`View certificate for ${certificate.title}`}
                          >
                            VIEW CERTIFICATE ↗
                          </button>
                        )}

                        {validVerificationUrl && (
                          <a
                            href={validVerificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="cert-action-btn-verify"
                            aria-label={`Verify credential for ${certificate.title}`}
                          >
                            VERIFY CREDENTIAL ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Visual Column: Image or Editorial Seal */}
                    <div className="cert-card-visual">
                      {hasImage ? (
                        <div className="cert-image-frame">
                          <img
                            src={certificate.imageUrl}
                            alt={certificate.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <button
                            type="button"
                            className="cert-zoom-badge"
                            onClick={() => setPreviewCert(certificate)}
                            aria-label={`Preview certificate for ${certificate.title}`}
                          >
                            ENLARGE ↗
                          </button>
                        </div>
                      ) : (
                        <div className="cert-seal-showcase" aria-hidden="true">
                          <div className="cert-seal-outer-ring">
                            <div className="cert-seal-inner-disc">
                              <span className="cert-seal-star">★</span>
                              <span className="cert-seal-org">
                                {certificate.issuer || "VERIFIED"}
                              </span>
                              <span className="cert-seal-sub">
                                OFFICIAL CREDENTIAL
                              </span>
                            </div>
                          </div>
                          <div className="cert-seal-watermark">
                            <span>ACCREDITED RECORD</span>
                            <small>
                              NO. {String(index + 1).padStart(2, "0")} • {certificate.issueDate || "VERIFIED"}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Preview Modal / Lightbox */}
      {previewCert && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setPreviewCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate preview: ${previewCert.title}`}
        >
          <div
            className="cert-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-header">
              <div>
                <span className="cert-modal-issuer">
                  {previewCert.issuer || "OFFICIAL CREDENTIAL"}
                </span>
                <h3 className="cert-modal-title">{previewCert.title}</h3>
                {previewCert.issueDate && (
                  <p className="cert-modal-date">
                    Issued: {previewCert.issueDate}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="cert-modal-close"
                onClick={() => setPreviewCert(null)}
                aria-label="Close certificate preview"
              >
                ✕
              </button>
            </div>

            {previewCert.imageUrl && (
              <div className="cert-modal-body">
                <img
                  src={previewCert.imageUrl}
                  alt={previewCert.title}
                  className="cert-modal-img"
                />
              </div>
            )}

            <div className="cert-modal-footer">
              {previewCert.credentialId && (
                <span className="cert-modal-id">
                  Credential ID: <strong>{previewCert.credentialId}</strong>
                </span>
              )}

              <div className="cert-modal-actions">
                {getValidUrl(previewCert.credentialUrl) && (
                  <a
                    href={getValidUrl(previewCert.credentialUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-modal-verify-link"
                  >
                    VERIFY CREDENTIAL ↗
                  </a>
                )}
                <button
                  type="button"
                  className="cert-modal-done-btn"
                  onClick={() => setPreviewCert(null)}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Certifications;
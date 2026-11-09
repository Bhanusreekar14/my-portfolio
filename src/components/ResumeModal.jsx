import { useEffect, useRef } from "react";

function ResumeModal({
  isOpen,
  onClose,
  title = "Bhanu Sreekar Resume",
  resumeUrl = "/resume/PerumallaBhanuSreekar.pdf",
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolved URL: prioritize provided prop or default to local authentic PDF
  const activeUrl = resumeUrl || "/resume/PerumallaBhanuSreekar.pdf";
  const isExternal =
    activeUrl.startsWith("http://") || activeUrl.startsWith("https://");

  // Determine appropriate filename for download
  let downloadFilename = "PerumallaBhanuSreekar.pdf";
  if (!isExternal) {
    const candidate = activeUrl.split("/").pop()?.split("?")[0];
    if (candidate && candidate.toLowerCase().endsWith(".pdf")) {
      downloadFilename = candidate;
    }
  }

  const handleDownloadClick = async (e) => {
    // If it's a local file path, standard <a download> handles download natively
    if (!isExternal) {
      return;
    }

    // For external URLs:
    // If it is a direct PDF URL with CORS support, fetch as blob so browser saves it with downloadFilename
    e.preventDefault();
    try {
      const response = await fetch(activeUrl, { mode: "cors" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // If cross-origin restrictions block fetch (e.g. Google Drive view link),
      // cleanly download the verified local authentic PDF so the user gets the genuine .pdf document
      const a = document.createElement("a");
      a.href = "/resume/PerumallaBhanuSreekar.pdf";
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      className="resume-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="resume-modal-close"
          onClick={onClose}
          aria-label="Close resume modal"
        >
          ✕
        </button>

        <div className="resume-modal-icon" aria-hidden="true">📄</div>
        <h3 id="resume-modal-title" className="resume-modal-title">{title}</h3>
        <p className="resume-modal-subtitle">
          View or download my verified resume and credentials.
        </p>

        <div className="resume-modal-actions">
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-modal-btn resume-view-btn"
          >
            View Document ↗
          </a>

          <a
            href={activeUrl}
            download={downloadFilename}
            onClick={handleDownloadClick}
            className="resume-modal-btn resume-download-btn"
          >
            Download PDF 📥
          </a>
        </div>

        <p className="resume-modal-format-note">
          Verified PDF · Information Technology & AI
        </p>
      </div>
    </div>
  );
}

export default ResumeModal;

import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase/config";

export default function ManageResume() {
  const navigate = useNavigate();

  const [resume, setResume] = useState({
    title: "Bhanu Sreekar Resume",
    filename: "PerumallaBhanuSreekar.pdf",
    url: "/resume/PerumallaBhanuSreekar.pdf",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchResume() {
      try {
        const snapshot = await get(ref(database, "portfolio/resume"));

        if (snapshot.exists() && isMounted) {
          const data = snapshot.val();
          const url = data.url || "/resume/PerumallaBhanuSreekar.pdf";
          const filename =
            data.filename ||
            (url.startsWith("/") ? url.split("/").pop() : "PerumallaBhanuSreekar.pdf");

          setResume({
            title: data.title || "Bhanu Sreekar Resume",
            filename: filename,
            url: url,
          });
        }
      } catch (error) {
        console.error("Error loading resume:", error);
      }
    }

    fetchResume();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleTitleChange(e) {
    setResume((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  }

  function handleFilenameChange(e) {
    const rawVal = e.target.value.trim();
    const cleanFilename = rawVal.replace(/^\/resume\//, "");

    setResume((prev) => {
      // If URL is currently a local resume path, update both
      const isLocal = !prev.url || prev.url.startsWith("/resume/");
      return {
        ...prev,
        filename: cleanFilename,
        url: isLocal && cleanFilename ? `/resume/${cleanFilename}` : prev.url,
      };
    });
  }

  function handleUrlChange(e) {
    const newUrl = e.target.value;
    setResume((prev) => {
      let inferredFilename = prev.filename;
      if (newUrl.startsWith("/resume/")) {
        inferredFilename = newUrl.replace(/^\/resume\//, "");
      }
      return {
        ...prev,
        url: newUrl,
        filename: inferredFilename,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: resume.title.trim() || "Bhanu Sreekar Resume",
      filename: resume.filename.trim() || "PerumallaBhanuSreekar.pdf",
      url: resume.url.trim() || "/resume/PerumallaBhanuSreekar.pdf",
      updatedAt: new Date().toISOString(),
    };

    try {
      await set(ref(database, "portfolio/resume"), payload);

      alert("Resume Updated Successfully!");
    } catch (error) {
      console.error("Error updating resume:", error);
      alert("Failed to update resume.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3eedf",
        color: "#171512",
        padding: "50px",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "50px",
        }}
      >
        <div>
          <p
            style={{
              color: "#ed432f",
              fontWeight: "800",
              letterSpacing: "3px",
              margin: "0 0 10px 0",
            }}
          >
            PORTFOLIO / RESUME
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              margin: 0,
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            Resume
          </h1>

          <p style={{ marginTop: "10px", color: "rgba(23, 21, 18, 0.7)" }}>
            Update your resume title and document link.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "13px 20px",
            border: "2px solid #171512",
            background: "transparent",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          BACK TO DASHBOARD
        </button>
      </header>

      <div
        className="admin-container"
        style={{
          background: "#fff",
          border: "2px solid #171512",
          padding: "40px",
          maxWidth: "650px",
          margin: "0 auto",
          boxShadow: "8px 10px 0 #ed432f",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "700",
                fontSize: "14px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Resume Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Bhanu Sreekar Resume"
              value={resume.title}
              onChange={handleTitleChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #171512",
                background: "#f9f6ec",
                fontSize: "15px",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "700",
                fontSize: "14px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Filename
            </label>
            <input
              type="text"
              name="filename"
              placeholder="e.g. PerumallaBhanuSreekar.pdf"
              value={resume.filename}
              onChange={handleFilenameChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #171512",
                background: "#f9f6ec",
                fontSize: "15px",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "700",
                fontSize: "12px",
                marginBottom: "6px",
                color: "rgba(23, 21, 18, 0.6)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Resume Path / Document URL
            </label>
            <input
              type="text"
              name="url"
              placeholder="e.g. /resume/PerumallaBhanuSreekar.pdf or https://..."
              value={resume.url}
              onChange={handleUrlChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #171512",
                background: "#f9f6ec",
                fontSize: "15px",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "rgba(23, 21, 18, 0.6)",
                margin: "6px 0 0 0",
              }}
            >
              For direct browser download, place your verified PDF in <code>public/resume/</code> and use <code>/resume/&lt;filename&gt;.pdf</code>.
            </p>
          </div>

          {resume.url && (
            <div>
              <a
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-preview-btn"
              >
                📄 Open Resume ↗
              </a>
            </div>
          )}

          <hr style={{ border: "0", borderTop: "1.5px solid #171512", margin: "8px 0" }} />

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "14px 28px",
              background: "#ed432f",
              color: "#fff",
              border: "2px solid #171512",
              fontSize: "15px",
              fontWeight: "800",
              cursor: "pointer",
              transition: "0.25s ease",
              borderRadius: "40px",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}

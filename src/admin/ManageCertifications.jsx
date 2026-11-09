import { useEffect, useState } from "react";
import {
  ref,
  push,
  set,
  update,
  onValue,
  remove,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/config";

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
};

function ManageCertifications() {
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const certificationsRef = ref(
      database,
      "portfolio/certifications"
    );

    const unsubscribe = onValue(
      certificationsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setCertifications([]);
          return;
        }

        const certificationList = Object.entries(data)
          .map(([id, certification]) => ({
            id,
            ...certification,
          }))
          .sort(
            (a, b) =>
              (b.createdAt || 0) - (a.createdAt || 0)
          );

        setCertifications(certificationList);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await update(
          ref(
            database,
            `portfolio/certifications/${editingId}`
          ),
          {
            ...form,
            updatedAt: Date.now(),
          }
        );

        alert("Certification updated successfully.");
      } else {
        const certificationsRef = ref(
          database,
          "portfolio/certifications"
        );

        const newCertificationRef = push(
          certificationsRef
        );

        await set(newCertificationRef, {
          ...form,
          createdAt: Date.now(),
        });

        alert("Certification added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const editCertification = (certification) => {
    setEditingId(certification.id);

    setForm({
      title: certification.title || "",
      issuer: certification.issuer || "",
      issueDate: certification.issueDate || "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      imageUrl: certification.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteCertification = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) return;

    await remove(
      ref(database, `portfolio/certifications/${id}`)
    );
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PORTFOLIO / CERTIFICATIONS</p>

          <h1 style={styles.title}>Manage Certifications</h1>

          <p style={styles.subtitle}>
            Add and update certifications displayed on your portfolio.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin/dashboard")}
        >
          ← DASHBOARD
        </button>
      </header>

      <section style={styles.layout}>
        <div style={styles.formCard}>
          <span style={styles.number}>
            {editingId ? "EDIT" : "NEW"}
          </span>

          <h2>
            {editingId ? "Edit Certification" : "Add Certification"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              name="title"
              placeholder="Certificate Name"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="issuer"
              placeholder="Issuing Organization"
              value={form.issuer}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="issueDate"
              placeholder="Issue Date"
              value={form.issueDate}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="credentialId"
              placeholder="Credential ID"
              value={form.credentialId}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="credentialUrl"
              placeholder="Credential / Verification URL"
              value={form.credentialUrl}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="imageUrl"
              placeholder="Certificate Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />

            {form.imageUrl && (
              <div>
                <p style={{ fontWeight: "700" }}>Image Preview</p>

                <img
                  src={form.imageUrl}
                  alt="Certificate preview"
                  style={styles.preview}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "SAVING..."
                : editingId
                ? "EDIT CERTIFICATION"
                : "ADD CERTIFICATION"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={styles.cancelButton}
              >
                CANCEL EDIT
              </button>
            )}
          </form>
        </div>

        <div>
          <div style={styles.listHeading}>
            <div>
              <span style={styles.number}>CERTIFICATIONS</span>

              <h2 style={{ marginBottom: 0 }}>Existing Certifications</h2>
            </div>

            <strong>{certifications.length} TOTAL</strong>
          </div>

          {certifications.length === 0 && (
            <div style={styles.empty}>No certifications added yet.</div>
          )}

          <div style={styles.projectGrid}>
            {certifications.map((certification, index) => (
              <article key={certification.id} style={styles.projectCard}>
                {certification.imageUrl && (
                  <img
                    src={certification.imageUrl}
                    alt={certification.title}
                    style={styles.projectImage}
                  />
                )}

                <div style={styles.projectContent}>
                  <div style={styles.projectTop}>
                    <span style={styles.number}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span style={styles.featured}>CERTIFICATE</span>
                  </div>

                  <p style={styles.category}>{certification.issuer || "CERTIFICATION"}</p>

                  <h2>{certification.title}</h2>

                  {certification.issueDate && (
                    <strong>{certification.issueDate}</strong>
                  )}

                  {certification.credentialId && (
                    <p style={styles.credentialId}>
                      ID: {certification.credentialId}
                    </p>
                  )}

                  {certification.credentialUrl && (
                    <p style={styles.linkWrap}>
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View credential
                      </a>
                    </p>
                  )}

                  <div style={styles.actions}>
                    <button
                      style={styles.editButton}
                      onClick={() => editCertification(certification)}
                    >
                      EDIT
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteCertification(certification.id)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3eedf",
    color: "#171512",
    padding: "50px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "50px",
    gap: "30px",
  },

  eyebrow: {
    color: "#ed432f",
    fontWeight: "800",
    letterSpacing: "3px",
    marginBottom: "10px",
  },

  title: {
    fontSize: "clamp(42px, 6vw, 75px)",
    margin: 0,
    lineHeight: 1,
  },

  subtitle: {
    fontSize: "18px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 420px) 1fr",
    gap: "40px",
    alignItems: "start",
  },

  formCard: {
    background: "#fff",
    border: "2px solid #171512",
    padding: "30px",
  },

  form: {
    display: "grid",
    gap: "14px",
  },

  input: {
    width: "100%",
    padding: "15px",
    border: "1.5px solid #171512",
    background: "#f9f6ec",
    fontSize: "15px",
    fontFamily: "inherit",
  },

  primaryButton: {
    padding: "16px",
    background: "#ed432f",
    color: "#fff",
    border: "2px solid #ed432f",
    fontWeight: "800",
    cursor: "pointer",
  },

  cancelButton: {
    padding: "14px",
    background: "transparent",
    border: "2px solid #171512",
    fontWeight: "800",
    cursor: "pointer",
  },

  backButton: {
    padding: "13px 20px",
    background: "transparent",
    border: "2px solid #171512",
    fontWeight: "800",
    cursor: "pointer",
  },

  listHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  projectCard: {
    background: "#fff",
    border: "2px solid #171512",
    overflow: "hidden",
  },

  projectImage: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
    borderBottom: "2px solid #171512",
  },

  projectContent: {
    padding: "25px",
  },

  projectTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  number: {
    color: "#ed432f",
    fontWeight: "800",
  },

  featured: {
    background: "#ed432f",
    color: "#fff",
    padding: "5px 8px",
    fontSize: "11px",
    fontWeight: "800",
  },

  category: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginTop: "20px",
  },

  credentialId: {
    color: "#171512",
    fontWeight: "700",
  },

  linkWrap: {
    marginTop: "12px",
    fontWeight: "700",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  editButton: {
    flex: 1,
    padding: "11px",
    background: "#171512",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    padding: "11px",
    background: "transparent",
    color: "#ed432f",
    border: "1.5px solid #ed432f",
    cursor: "pointer",
    fontWeight: "700",
  },

  preview: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    border: "2px solid #171512",
  },

  empty: {
    background: "#fff",
    border: "2px dashed #171512",
    padding: "40px",
    textAlign: "center",
  },
};

export default ManageCertifications;
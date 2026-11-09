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
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  description: "",
  order: "",
};

function ManageEducation() {
  const navigate = useNavigate();

  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const educationRef = ref(database, "portfolio/education");

    const unsubscribe = onValue(educationRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setEducation([]);
        return;
      }

      const educationList = Object.entries(data)
        .map(([id, entry]) => ({
          id,
          ...entry,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setEducation(educationList);
    });

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
        await update(ref(database, `portfolio/education/${editingId}`), {
          ...form,
          updatedAt: Date.now(),
        });

        alert("Education entry updated successfully.");
      } else {
        const educationRef = ref(database, "portfolio/education");
        const newEducationRef = push(educationRef);

        await set(newEducationRef, {
          ...form,
          createdAt: Date.now(),
        });

        alert("Education entry added successfully.");
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

  const editEducation = (entry) => {
    setEditingId(entry.id);

    setForm({
      institution: entry.institution || "",
      degree: entry.degree || "",
      field: entry.field || "",
      startYear: entry.startYear || "",
      endYear: entry.endYear || "",
      description: entry.description || "",
      order: entry.order || "",
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

  const deleteEducation = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?"
    );

    if (!confirmed) return;

    await remove(ref(database, `portfolio/education/${id}`));
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PORTFOLIO / EDUCATION</p>

          <h1 style={styles.title}>Manage Education</h1>

          <p style={styles.subtitle}>
            Add and update your education details.
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

          <h2>{editingId ? "Edit Education" : "Add Education"}</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              name="institution"
              placeholder="Institution Name"
              value={form.institution}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="degree"
              placeholder="Degree (e.g. B.Tech, B.S., M.Tech)"
              value={form.degree}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="field"
              placeholder="Field of Study"
              value={form.field}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="startYear"
              placeholder="Start Year"
              value={form.startYear}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="endYear"
              placeholder="End Year"
              value={form.endYear}
              onChange={handleChange}
              required
            />

            <textarea
              style={styles.input}
              name="description"
              placeholder="Description (achievements, relevant coursework, etc.)"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />

            <input
              style={styles.input}
              name="order"
              placeholder="Display Order (1, 2, 3...)"
              type="number"
              value={form.order}
              onChange={handleChange}
            />

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "SAVING..."
                : editingId
                ? "EDIT EDUCATION"
                : "ADD EDUCATION"}
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
              <span style={styles.number}>EDUCATION</span>

              <h2 style={{ marginBottom: 0 }}>Existing Entries</h2>
            </div>

            <strong>{education.length} TOTAL</strong>
          </div>

          {education.length === 0 && (
            <div style={styles.empty}>No education entries added yet.</div>
          )}

          <div style={styles.educationGrid}>
            {education.map((entry, index) => (
              <article key={entry.id} style={styles.educationCard}>
                <div style={styles.educationTop}>
                  <span style={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span style={styles.yearTag}>
                    {entry.startYear} - {entry.endYear}
                  </span>
                </div>

                <p style={styles.degree}>{entry.degree}</p>

                <h2>{entry.institution}</h2>

                <p style={styles.field}>{entry.field}</p>

                {entry.description && (
                  <p style={styles.description}>{entry.description}</p>
                )}

                <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => editEducation(entry)}
                  >
                    EDIT
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteEducation(entry.id)}
                  >
                    DELETE
                  </button>
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
    boxSizing: "border-box",
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

  educationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  educationCard: {
    background: "#fff",
    border: "2px solid #171512",
    padding: "25px",
  },

  educationTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  number: {
    color: "#ed432f",
    fontWeight: "800",
  },

  yearTag: {
    background: "#ed432f",
    color: "#fff",
    padding: "5px 8px",
    fontSize: "11px",
    fontWeight: "800",
  },

  degree: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginTop: "20px",
    marginBottom: "5px",
  },

  field: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
    margin: "5px 0",
  },

  description: {
    fontSize: "14px",
    color: "#555",
    marginTop: "15px",
    lineHeight: 1.5,
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

  empty: {
    background: "#fff",
    border: "2px dashed #171512",
    padding: "40px",
    textAlign: "center",
  },
};

export default ManageEducation;

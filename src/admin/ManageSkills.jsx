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
  name: "",
  category: "",
};

function ManageSkills() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const skillsRef = ref(database, "portfolio/skills");

    const unsubscribe = onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setSkills([]);
        return;
      }

      const skillList = Object.entries(data)
        .map(([id, skill]) => ({
          id,
          ...skill,
        }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setSkills(skillList);
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
        await update(ref(database, `portfolio/skills/${editingId}`), {
          ...form,
          updatedAt: Date.now(),
        });

        alert("Skill updated successfully.");
      } else {
        const skillsRef = ref(database, "portfolio/skills");
        const newSkillRef = push(skillsRef);

        await set(newSkillRef, {
          ...form,
          createdAt: Date.now(),
        });

        alert("Skill added successfully.");
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

  const editSkill = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
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

  const deleteSkill = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    await remove(ref(database, `portfolio/skills/${id}`));
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PORTFOLIO / SKILLS</p>

          <h1 style={styles.title}>Manage Skills</h1>

          <p style={styles.subtitle}>
            Add and update the skills shown on your portfolio.
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

          <h2>{editingId ? "Edit Skill" : "Add Skill"}</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              name="name"
              placeholder="Skill Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="category"
              placeholder="Category - Programming, AI/ML, Web, Database, Tools, Salesforce..."
              value={form.category}
              onChange={handleChange}
              required
            />



            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "SAVING..."
                : editingId
                ? "EDIT SKILL"
                : "ADD SKILL"}
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
              <span style={styles.number}>SKILLS</span>

              <h2 style={{ marginBottom: 0 }}>Existing Skills</h2>
            </div>

            <strong>{skills.length} TOTAL</strong>
          </div>

          {skills.length === 0 && (
            <div style={styles.empty}>No skills added yet.</div>
          )}

          <div style={styles.skillGrid}>
            {skills.map((skill, index) => (
              <article key={skill.id} style={styles.skillCard}>
                <div style={styles.skillTop}>
                  <span style={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>


                </div>

                <p style={styles.category}>{skill.category || "SKILL"}</p>

                <h2>{skill.name}</h2>

                <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => editSkill(skill)}
                  >
                    EDIT
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteSkill(skill.id)}
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

  skillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  skillCard: {
    background: "#fff",
    border: "2px solid #171512",
    padding: "25px",
  },

  skillTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  number: {
    color: "#ed432f",
    fontWeight: "800",
  },

  levelTag: {
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

export default ManageSkills;
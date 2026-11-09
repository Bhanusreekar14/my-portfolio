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
  tagline: "",
  description: "",
  technologies: "",
  category: "",
  imageUrl: "",
  images: "",
  github: "",
  liveDemo: "",
  featured: false,
  order: "",
};

function ManageProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const projectsRef = ref(database, "portfolio/projects");

    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setProjects([]);
        return;
      }

      const projectList = Object.entries(data)
        .map(([id, project]) => ({
          id,
          ...project,
        }))
        .sort((a, b) => {
          const orderA = Number(a.order) || 999;
          const orderB = Number(b.order) || 999;

          if (orderA !== orderB) {
            return orderA - orderB;
          }

          return (b.createdAt || 0) - (a.createdAt || 0);
        });

      setProjects(projectList);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const projectData = {
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        technologies: form.technologies.trim(),
        imageUrl: form.imageUrl.trim(),
        images: form.images.trim(),
        liveDemo: form.liveDemo.trim(),
        github: form.github.trim(),
        featured: form.featured,
        order: Number(form.order) || 999,
        updatedAt: Date.now(),
      };

      if (editingId) {
        await update(
          ref(database, `portfolio/projects/${editingId}`),
          projectData
        );

        alert("Project updated successfully.");
      } else {
        const projectsRef = ref(
          database,
          "portfolio/projects"
        );

        const newProjectRef = push(projectsRef);

        await set(newProjectRef, {
          ...projectData,
          createdAt: Date.now(),
        });

        alert("Project added successfully.");
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

  const editProject = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      tagline: project.tagline || "",
      description: project.description || "",
      technologies: project.technologies || "",
      category: project.category || "",
      imageUrl: project.imageUrl || "",
      images: Array.isArray(project.images)
        ? project.images.join(", ")
        : project.images || "",
      github: project.github || "",
      liveDemo: project.liveDemo || "",
      featured: project.featured || false,
      order: project.order !== undefined && project.order !== null ? String(project.order) : "",
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

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    await remove(
      ref(database, `portfolio/projects/${id}`)
    );
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            PORTFOLIO / PROJECTS
          </p>

          <h1 style={styles.title}>
            Manage Projects
          </h1>

          <p style={styles.subtitle}>
            Add and update projects displayed on your portfolio.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← DASHBOARD
        </button>
      </header>

      <section style={styles.layout}>
        {/* FORM */}

        <div style={styles.formCard}>
          <span style={styles.number}>
            {editingId ? "EDIT" : "NEW"}
          </span>

          <h2>
            {editingId
              ? "Edit Project"
              : "Add Project"}
          </h2>

          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >
            <input
              style={styles.input}
              name="title"
              placeholder="Project name"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="tagline"
              placeholder="Short tagline"
              value={form.tagline}
              onChange={handleChange}
            />

            <textarea
              style={{
                ...styles.input,
                minHeight: "130px",
                resize: "vertical",
              }}
              name="description"
              placeholder="Project description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              name="category"
              placeholder="Category — AI, Web, Game..."
              value={form.category}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="technologies"
              placeholder="Technologies — React, Python, Firebase..."
              value={form.technologies}
              onChange={handleChange}
            />

            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#171512" }}>
                Project Screenshot
              </label>
              <input
                style={styles.input}
                type="text"
                name="imageUrl"
                placeholder="/projects/project-name.png"
                value={form.imageUrl}
                onChange={handleChange}
              />
              {form.imageUrl && (
                <div className="admin-project-preview">
                  <img
                    src={form.imageUrl}
                    alt="Project preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <small style={{ fontSize: "11px", color: "#ed432f", fontWeight: "700" }}>
                Add the image inside public/projects/ and enter its path here, for example /projects/finger-ninja.png
              </small>
            </div>

            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#171512" }}>
                Project Screenshots (Gallery)
              </label>
              <textarea
                style={{ ...styles.input, minHeight: "65px" }}
                name="images"
                placeholder="Comma-separated screenshot URLs (e.g. /projects/chainiq/1.png, /projects/chainiq/2.png)"
                value={form.images}
                onChange={handleChange}
              />
              <small style={{ fontSize: "11px", color: "#ed432f", fontWeight: "700" }}>
                Enter multiple screenshot URLs separated by commas for the horizontal Project Gallery.
              </small>
            </div>

            <input
              style={styles.input}
              name="github"
              placeholder="GitHub repository URL"
              value={form.github}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="liveDemo"
              placeholder="Live project URL"
              value={form.liveDemo}
              onChange={handleChange}
            />

            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#171512" }}>
                Display Order
              </label>

              <input
                style={styles.input}
                type="number"
                name="order"
                min="1"
                value={form.order}
                onChange={handleChange}
                placeholder="Example: 1"
              />

              <small style={{ fontSize: "11px", color: "#ed432f", fontWeight: "700" }}>
                Projects 1–3 appear on the first view, 4–6 on the next, and so on.
              </small>
            </div>

            <label style={styles.checkbox}>
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              Show as Featured Project
            </label>



            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "SAVING..."
                : editingId
                ? "UPDATE PROJECT"
                : "ADD PROJECT"}
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

        {/* PROJECT LIST */}

        <div>
          <div style={styles.listHeading}>
            <div>
              <span style={styles.number}>
                PROJECTS
              </span>

              <h2 style={{ marginBottom: 0 }}>
                Existing Projects
              </h2>
            </div>

            <strong>
              {projects.length} TOTAL
            </strong>
          </div>

          {projects.length === 0 && (
            <div style={styles.empty}>
              No projects added yet.
            </div>
          )}

          <div style={styles.projectGrid}>
            {projects.map((project, index) => (
              <article
                key={project.id}
                style={styles.projectCard}
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={styles.projectImage}
                  />
                )}

                <div style={styles.projectContent}>
                  <div style={styles.projectTop}>
                    <span style={styles.number}>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {project.featured && (
                      <span
                        style={styles.featured}
                      >
                        FEATURED
                      </span>
                    )}
                  </div>

                  <p style={styles.category}>
                    {project.category ||
                      "PROJECT"}
                  </p>

                  <h2>{project.title}</h2>

                  {project.tagline && (
                    <strong>
                      {project.tagline}
                    </strong>
                  )}

                  <p>
                    {project.description}
                  </p>

                  <p style={styles.tech}>
                    {project.technologies}
                  </p>

                  <div style={styles.actions}>
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        editProject(project)
                      }
                    >
                      EDIT
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        deleteProject(project.id)
                      }
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
    gridTemplateColumns:
      "minmax(300px, 420px) 1fr",
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

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    padding: "10px 0",
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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
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

  tech: {
    color: "#ed432f",
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

export default ManageProjects;
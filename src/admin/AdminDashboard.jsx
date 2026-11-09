import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

function AdminDashboard() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Messages",
      description: "View, manage, and respond to incoming contact form enquiries.",
      path: "/admin/messages",
    },
    {
      title: "Contact Details",
      description: "Update your contact email, phone number, and location.",
      path: "/admin/contact",
    },
    {
      title: "Projects",
      description: "Add, edit and manage portfolio projects.",
      path: "/admin/projects",
    },
    {
      title: "Certifications",
      description: "Manage certificates and achievements.",
      path: "/admin/certifications",
    },
    {
      title: "Skills",
      description: "Update technologies and technical skills.",
      path: "/admin/skills",
    },
    {
      title: "About Me",
      description: "Update your introduction and profile information.",
      path: "/admin/about",
    },
    {
      title: "Education",
      description: "Manage your academic information.",
      path: "/admin/education",
    },
    {
      title: "Social Links",
      description: "Manage GitHub, LinkedIn and coding profiles.",
      path: "/admin/socials",
    },
    {
      title: "Resume",
      description: "Manage resume title and public document link.",
      path: "/admin/resume",
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

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
          alignItems: "center",
          marginBottom: "60px",
        }}
      >
        <div>
          <p
            style={{
              color: "#ed432f",
              fontWeight: "bold",
              letterSpacing: "3px",
            }}
          >
            PORTFOLIO / ADMIN
          </p>

          <h1 style={{ fontSize: "48px", margin: 0 }}>
            Content Dashboard
          </h1>

          <p>
            Manage your portfolio without editing the source code.
          </p>
        </div>

        <button onClick={handleLogout}>LOGOUT</button>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {sections.map((section, index) => (
          <article
            key={section.title}
            onClick={() => navigate(section.path)}
            style={{
              background: "#fff",
              border: "2px solid #171512",
              padding: "30px",
              cursor: "pointer",
              minHeight: "190px",
            }}
          >
            <span
              style={{
                color: "#ed432f",
                fontWeight: "bold",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <h2>{section.title}</h2>

            <p>{section.description}</p>

            <strong>MANAGE →</strong>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminDashboard;
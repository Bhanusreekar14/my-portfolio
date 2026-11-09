import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/config";

const emptyForm = {
  primaryEmail: "",
  secondaryEmail: "",
  linkedin: "",
  github: "",
  leetcode: "",
  codechef: "",
  instagram: "",
};

function ManageSocials() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const socialsRef = ref(database, "portfolio/socials");

    const unsubscribe = onValue(socialsRef, (snapshot) => {
      if (snapshot.exists()) {
        setForm({
          ...emptyForm,
          ...snapshot.val(),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await set(ref(database, "portfolio/socials"), {
        ...form,
        updatedAt: Date.now(),
      });

      alert("Social links updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to update social links.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    border: "1.5px solid #171512",
    background: "#f9f6ec",
    fontSize: "15px",
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
            }}
          >
            PORTFOLIO / SOCIALS
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 70px)",
              margin: 0,
            }}
          >
            Social Links
          </h1>

          <p>
            Manage the links displayed across your portfolio.
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
          ← DASHBOARD
        </button>
      </header>

      <section
        style={{
          maxWidth: "750px",
          background: "#fff",
          border: "2px solid #171512",
          padding: "35px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <label>Primary Email</label>
            <input
              style={inputStyle}
              type="email"
              name="primaryEmail"
              value={form.primaryEmail}
              onChange={handleChange}
              placeholder="bhanusreekar14@gmail.com"
            />
          </div>

          <div>
            <label>Secondary Email</label>
            <input
              style={inputStyle}
              type="email"
              name="secondaryEmail"
              value={form.secondaryEmail}
              onChange={handleChange}
              placeholder="sreekarbhanu14@gmail.com"
            />
          </div>

          <div>
            <label>LinkedIn</label>
            <input
              style={inputStyle}
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn profile URL"
            />
          </div>

          <div>
            <label>GitHub</label>
            <input
              style={inputStyle}
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="GitHub profile URL"
            />
          </div>

          <div>
            <label>LeetCode</label>
            <input
              style={inputStyle}
              name="leetcode"
              value={form.leetcode}
              onChange={handleChange}
              placeholder="LeetCode profile URL"
            />
          </div>

          <div>
            <label>CodeChef</label>
            <input
              style={inputStyle}
              name="codechef"
              value={form.codechef}
              onChange={handleChange}
              placeholder="CodeChef profile URL"
            />
          </div>

          <div>
            <label>Instagram</label>
            <input
              style={inputStyle}
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram profile URL"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "16px",
              background: "#ed432f",
              color: "#fff",
              border: "none",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            {saving ? "SAVING..." : "SAVE SOCIAL LINKS"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ManageSocials;

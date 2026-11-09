import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/config";

const emptyForm = {
  email: "",
  phone: "",
  location: "",
};

function ManageContact() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const contactRef = ref(database, "portfolio/contact");

    const unsubscribe = onValue(contactRef, (snapshot) => {
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await set(ref(database, "portfolio/contact"), {
        ...form,
        updatedAt: Date.now(),
      });
      alert("Contact information updated successfully.");
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert("Unable to update contact information.");
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
    borderRadius: "6px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3eedf",
        color: "#171512",
        padding: "50px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
        }}
      >
        <div>
          <p
            style={{
              color: "#ed432f",
              fontWeight: "800",
              letterSpacing: "3px",
              margin: "0 0 5px 0",
            }}
          >
            PORTFOLIO / CONTACT INFO
          </p>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontFamily: "'DM Serif Display', serif",
              margin: 0,
            }}
          >
            Contact Details
          </h1>
          <p style={{ color: "rgba(23,21,18,0.7)", marginTop: "5px" }}>
            Update the email, phone number, and location shown in your contact section.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "12px 20px",
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
          maxWidth: "650px",
          background: "#fff",
          border: "2px solid #171512",
          padding: "35px",
          borderRadius: "8px",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>
              📧 Email Address
            </label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="bhanusreekar14@gmail.com"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>
              📱 Phone Number
            </label>
            <input
              style={inputStyle}
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 99999 99999"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "700" }}>
              📍 Location
            </label>
            <input
              style={inputStyle}
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Hyderabad, Telangana, India"
              required
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
              borderRadius: "40px",
              marginTop: "10px",
            }}
          >
            {saving ? "SAVING..." : "SAVE CONTACT INFO"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ManageContact;

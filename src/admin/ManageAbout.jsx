import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase/config";

const emptyForm = {
  fullName: "",
  professionalTitle: "",
  shortIntro: "",
  aboutParagraph1: "",
  aboutParagraph2: "",
  location: "",
  availability: "",
  profileImageUrl: "",
  resumeUrl: "",
};

function ManageAbout() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const aboutRef = ref(database, "portfolio/about");

    return onValue(aboutRef, (snapshot) => {
      if (snapshot.exists()) {
        setForm({
          ...emptyForm,
          ...snapshot.val(),
        });
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await set(ref(database, "portfolio/about"), {
        ...form,
        updatedAt: Date.now(),
      });

      alert("About information updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to update information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ padding: "50px", background: "#f3eedf", minHeight: "100vh" }}>
      <p style={{ color: "#ed432f", fontWeight: "bold" }}>
        PORTFOLIO / ABOUT
      </p>

      <h1>Manage About Me</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "15px",
          maxWidth: "700px",
        }}
      >
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />

        <input name="professionalTitle" value={form.professionalTitle} onChange={handleChange} placeholder="Professional Title" />

        <textarea name="shortIntro" value={form.shortIntro} onChange={handleChange} placeholder="Short introduction" />

        <textarea name="aboutParagraph1" value={form.aboutParagraph1} onChange={handleChange} placeholder="About paragraph 1" />

        <textarea name="aboutParagraph2" value={form.aboutParagraph2} onChange={handleChange} placeholder="About paragraph 2" />

        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />

        <input name="availability" value={form.availability} onChange={handleChange} placeholder="Availability" />

        <input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} placeholder="Profile Image URL" />

        <input name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="Resume URL" />

        <button type="submit">
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>
    </main>
  );
}

export default ManageAbout;

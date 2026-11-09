import { useState, useEffect, useRef } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "../firebase/config";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef } from "react-icons/si";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [contactInfo, setContactInfo] = useState({});
  const [socials, setSocials] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load Contact Information dynamically from Firebase (portfolio/contact)
    const contactRef = ref(database, "portfolio/contact");
    const unsubscribeContact = onValue(contactRef, (snapshot) => {
      if (snapshot.exists()) {
        setContactInfo(snapshot.val());
      }
    });

    // Load Social Links dynamically from Firebase (portfolio/socials)
    const socialsRef = ref(database, "portfolio/socials");
    const unsubscribeSocials = onValue(socialsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSocials(snapshot.val());
      }
    });

    // Fallback: Also load from portfolio/about if contact info is empty
    const aboutRef = ref(database, "portfolio/about");
    const unsubscribeAbout = onValue(aboutRef, (snapshot) => {
      if (snapshot.exists()) {
        const aboutData = snapshot.val();
        setContactInfo((prev) => ({
          email: prev.email || aboutData.primaryEmail || "bhanusreekar14@gmail.com",
          phone: prev.phone || aboutData.phone || "",
          location: prev.location || aboutData.location || "Hyderabad, Telangana, India",
        }));
      }
    });

    return () => {
      unsubscribeContact();
      unsubscribeSocials();
      unsubscribeAbout();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const messageRef = ref(database, "messages");
      await push(messageRef, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    } catch (error) {
      console.error("Error sending message to Firebase:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayEmail = contactInfo.email || socials.primaryEmail || "bhanusreekar14@gmail.com";
  const rawPhone = contactInfo.phone || socials.phone || "";
  const displayPhone = rawPhone.includes("99999") ? "" : rawPhone;
  const displayLocation = contactInfo.location || "Hyderabad, Telangana, India";

  const socialLinksList = [
    { name: "GitHub", url: socials.github || "https://github.com/Bhanusreekar14", icon: <FaGithub /> },
    { name: "LinkedIn", url: socials.linkedin || "https://www.linkedin.com/in/bhanu-sreekar-jaya", icon: <FaLinkedin /> },
    { name: "LeetCode", url: socials.leetcode, icon: <SiLeetcode /> },
    { name: "CodeChef", url: socials.codechef, icon: <SiCodechef /> },
    { name: "Instagram", url: socials.instagram, icon: <FaInstagram /> },
    { name: "Email", url: `mailto:${displayEmail}`, icon: <FaEnvelope /> },
  ].filter((item) => item.url);

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      {/* Toast Popup Notification */}
      {showSuccessMessage && (
        <div className="success-toast" role="alert">
          <FaCheckCircle className="toast-icon" />
          <span>✓ Thank you! Message Sent Successfully</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="contact-container">
        {/* LEFT COLUMN */}
        <div className={`contact-left ${isVisible ? "animate-in" : ""}`}>
          <p className="section-number">06 / LET'S CONNECT</p>

          <h2 className="contact-heading">
            LET'S BUILD
            <br />
            <span>SOMETHING TOGETHER.</span>
          </h2>

          {/* Short Introduction Paragraph */}
          <p className="contact-description">
            Whether you have an AI project, an opportunity,
            or just want to connect, I'd love to hear from you.
            Let's build something meaningful together.
          </p>

          {/* Contact Details with High Readability */}
          <div className="contact-details">
            <div className="contact-info-item">
              <span className="contact-info-emoji">📧</span>
              <div>
                <small className="contact-info-label">Email</small>
                <a href={`mailto:${displayEmail}`} className="contact-info-val">
                  {displayEmail}
                </a>
              </div>
            </div>

            {displayPhone && (
              <div className="contact-info-item">
                <span className="contact-info-emoji">📱</span>
                <div>
                  <small className="contact-info-label">Phone</small>
                  <a href={`tel:${displayPhone.replace(/\s+/g, "")}`} className="contact-info-val">
                    {displayPhone}
                  </a>
                </div>
              </div>
            )}

            <div className="contact-info-item">
              <span className="contact-info-emoji">📍</span>
              <div>
                <small className="contact-info-label">Location</small>
                <p className="contact-info-val">{displayLocation}</p>
              </div>
            </div>
          </div>

          {/* Clickable Social Icon Buttons */}
          <div className="social-icons-wrapper">
            <small className="social-label">CONNECT WITH ME</small>
            <div className="social-links-grid">
              {socialLinksList.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill-btn"
                  title={item.name}
                  aria-label={item.name}
                >
                  <span className="social-pill-icon">{item.icon}</span>
                  <span className="social-pill-name">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={`contact-right ${isVisible ? "animate-in" : ""}`}>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h3 className="form-title">Send a Message</h3>

            {/* Inline Success Banner */}
            {showSuccessMessage && (
              <div className="form-success-banner">
                <div className="banner-check">✓</div>
                <div>
                  <strong>Thank you!</strong>
                  <p>Your message has been sent successfully.</p>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Subject Input */}
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
                className={errors.subject ? "input-error" : ""}
              />
              {errors.subject && <span className="field-error">{errors.subject}</span>}
            </div>

            {/* Message Textarea */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className={errors.message ? "input-error" : ""}
              ></textarea>
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="send-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message <FaPaperPlane style={{ marginLeft: "8px" }} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="portfolio-footer">
        <div>
          <strong>BHANU SREEKAR</strong>
          <p>AI · SOFTWARE · CREATIVE TECHNOLOGY</p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          BACK TO TOP ↑
        </button>

        <p>PORTFOLIO / 2026</p>
      </div>
    </section>
  );
}

export default Contact;
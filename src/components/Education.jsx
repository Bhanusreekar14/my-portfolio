import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/config";
import { motion } from "framer-motion";

const DEFAULT_EDUCATION = [
  {
    id: "btech-cmr",
    institution: "CMR Technical Campus",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Information Technology",
    location: "Hyderabad, Telangana",
    startYear: "2023",
    endYear: "2027",
    status: "CURRENT",
    isCurrent: true,
    cgpa: "CGPA: 8.5 / 10",
    highlights: [
      "Data Structures & Algorithms",
      "Soft Computing & AI",
      "Operating Systems & DBMS",
      "Systems Programming"
    ],
    description:
      "Pursuing B.Tech in Information Technology with strong foundational focus on software engineering, algorithmic design, machine learning models, and modern full-stack development."
  },
  {
    id: "inter-chaitanya",
    institution: "Sri Chaitanya Junior College",
    degree: "Intermediate (10+2)",
    field: "M.P.C (Mathematics, Physics, Chemistry)",
    location: "Vijayawada, Andhra Pradesh",
    startYear: "2021",
    endYear: "2023",
    status: "COMPLETED",
    isCurrent: false,
    highlights: ["Advanced Mathematics", "Physical Sciences", "Analytical Problem Solving"],
    description:
      "Completed higher secondary education under Board of Intermediate Education with rigorous preparation in advanced mathematics, physics, and problem solving."
  },
  {
    id: "school-chaitanya",
    institution: "Sri Chaitanya High School",
    degree: "Secondary School Certificate (SSC)",
    field: "General Studies & STEM Foundation",
    location: "Guntur, Andhra Pradesh",
    startYear: "2020",
    endYear: "2021",
    status: "COMPLETED",
    isCurrent: false,
    highlights: ["Mathematics", "General Science", "Early Computer Foundations"],
    description:
      "Completed secondary education with top honors, establishing early interests in mathematics, science, and computing technology."
  }
];

function Education() {
  const [education, setEducation] = useState(DEFAULT_EDUCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const educationRef = ref(database, "portfolio/education");

    const unsubscribe = onValue(educationRef, (snapshot) => {
      if (!snapshot.exists()) {
        setEducation(DEFAULT_EDUCATION);
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const list = Object.entries(data)
        .map(([id, item]) => ({
          id,
          ...item,
        }))
        .sort((a, b) => Number(a.order || 999) - Number(b.order || 999));

      if (list.length > 0) {
        setEducation(list);
      } else {
        setEducation(DEFAULT_EDUCATION);
      }
      setLoading(false);
    }, () => {
      setEducation(DEFAULT_EDUCATION);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="education-section" id="education">
      <div className="education-heading">
        <div>
          <p className="section-number">05 / EDUCATION</p>
          <h2>
            WHERE I'VE
            <br />
            <span>LEARNED.</span>
          </h2>
        </div>

        <p className="education-intro">
          My academic journey and the foundational milestones that shaped my
          approach to software engineering, systems design, and artificial
          intelligence.
        </p>
      </div>

      <div className="education-timeline-container">
        <div className="education-timeline-spine" aria-hidden="true" />

        <div className="education-timeline-list">
          {education.map((item, index) => {
            const isCurrent =
              item.isCurrent ||
              item.status === "CURRENT" ||
              item.endYear === "PRESENT" ||
              item.endYear === "2027";

            const yearLabel = `${item.startYear || "—"} — ${item.endYear || "PRESENT"}`;

            return (
              <motion.article
                key={item.id || index}
                className={`education-timeline-card ${isCurrent ? "card-prominent" : ""}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Timeline node marker */}
                <div className="education-node" aria-hidden="true">
                  <div className="node-outer">
                    <div className="node-core" />
                  </div>
                </div>

                {/* Card Inner Content */}
                <div className="education-card-body">
                  <div className="education-card-top">
                    <div className="education-card-meta">
                      <span className="education-badge-year">{yearLabel}</span>
                      {isCurrent && (
                        <span className="education-badge-current">
                          <span className="pulse-dot" />
                          IN PROGRESS
                        </span>
                      )}
                      {item.cgpa && (
                        <span className="education-badge-grade">{item.cgpa}</span>
                      )}
                    </div>
                    <span className="education-order-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="education-card-main">
                    {item.field && (
                      <p className="education-card-field">{item.field}</p>
                    )}
                    <h3 className="education-card-institution">
                      {item.institution}
                    </h3>
                    {item.degree && (
                      <h4 className="education-card-degree">{item.degree}</h4>
                    )}
                    {item.location && (
                      <p className="education-card-location">
                        <span className="location-pin">📍</span> {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="education-card-desc">{item.description}</p>
                    )}
                  </div>

                  {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                    <div className="education-card-tags">
                      {item.highlights.map((tag, tIdx) => (
                        <span key={tIdx} className="education-tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Education;

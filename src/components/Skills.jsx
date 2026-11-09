import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/config";
import KeycapOrb from "./ui/keycap-orb";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skillsRef = ref(database, "portfolio/skills");

    return onValue(skillsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSkills([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();

      setSkills(
        Object.entries(data).map(([id, skill]) => ({
          id,
          ...skill,
        }))
      );
      setLoading(false);
    });
  }, []);

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      const category = skill.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    }, {});
  }, [skills]);

  return (
    <section className="skills-section" id="skills">
      <div className="skills-heading">
        <div>
          <p className="section-number">
            03 / SKILLS
          </p>

          <h2>
            THINGS I
            <br />
            <span>WORK WITH.</span>
          </h2>
        </div>

        <p className="skills-intro">
          Technologies, tools and platforms I use to turn
          ideas into real-world software and intelligent
          experiences.
        </p>
      </div>

      {/* Interactive 3D Keycap Tech Orb */}
      <div className="skills-orb-card" aria-label="Interactive 3D Technology Sphere">
        <div className="skills-orb-header">
          <div className="skills-orb-indicator">
            <span className="orb-indicator-dot" />
            <span className="orb-header-title">INTERACTIVE TECH ORB // 3D SPHERE</span>
          </div>
          <div className="skills-orb-hint">
            <span>DRAG TO ROTATE</span>
            <span className="hint-sep">//</span>
            <span>TYPE OR HOVER</span>
          </div>
        </div>

        <div className="skills-orb-viewport">
          <KeycapOrb height="390px" scale={0.62} speed={0.7} />
        </div>
      </div>

      {loading ? (
        <div className="no-skills">
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="no-skills">
          Skills will appear here.
        </div>
      ) : (
        <div className="simple-skills-grid">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills], index) => (
              <div className="simple-skill-group" key={category}>
                <div className="skill-group-heading">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{category}</h3>
                </div>

                <div className="simple-skill-list">
                  {categorySkills.map((skill) => (
                    <span
                      className="simple-skill"
                      key={skill.id}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default Skills;

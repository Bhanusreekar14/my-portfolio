import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/config";
import GravityTags from "./ui/GravityTags";

function Skills() {
  const [skills, setSkills] = useState([]);
  const sectionRef = useRef(null);

  // Sync skills dynamically from Firebase Realtime Database
  useEffect(() => {
    const skillsRef = ref(database, "portfolio/skills");

    return onValue(skillsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSkills([]);
        return;
      }

      const data = snapshot.val();
      setSkills(
        Object.entries(data).map(([id, skill]) => ({
          id,
          ...skill,
        }))
      );
    });
  }, []);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      {/* 1. Skills Section Editorial Header */}
      <div className="skills-heading">
        <div>
          <p className="section-number">03 / SKILLS</p>

          <h2>
            THINGS I
            <br />
            <span>WORK WITH.</span>
          </h2>
        </div>

        <p className="skills-intro">
          A dynamic collection of languages, frameworks, AI libraries, and developer tools powering intelligent, scalable software.
        </p>
      </div>

      {/* 2. One Clean Rectangular Box Enclosing All GravityTags */}
      <div className="gravity-tags-box">
        <GravityTags skills={skills} />
      </div>
    </section>
  );
}

export default Skills;

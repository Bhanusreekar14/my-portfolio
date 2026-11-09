import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/config";
import ResumeModal from "./ResumeModal";

const links = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CERTIFICATIONS', href: '#certifications' },
  { label: 'EDUCATION', href: '#education' },
  { label: 'CONTACT', href: '#contact' },
];

function Navbar({ title: propTitle, resumeUrl: propResumeUrl }) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (propResumeUrl) return;

    const resumeRef = ref(database, "portfolio/resume");

    const unsubscribe = onValue(resumeRef, (snapshot) => {
      if (snapshot.exists()) {
        setResumeData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [propResumeUrl]);

  const activeTitle = propTitle || resumeData?.title || "Resume";
  const activeUrl = propResumeUrl || resumeData?.url || "/resume/Bhanu_Sreekar_Resume.pdf";

  console.log("resumeData:", resumeData);
  console.log("activeUrl:", activeUrl);

  return (
    <>
      <header className="portfolio-nav">
        <a href="/" className="portfolio-logo">
          BHANU<span>.</span>
        </a>

        <div className="portfolio-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="portfolio-nav-controls">
          <button
            className="resume-btn"
            onClick={() => setResumeModalOpen(true)}
          >
            📄 Resume
          </button>
        </div>
      </header>

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title={activeTitle}
        resumeUrl={activeUrl}
      />
    </>
  );
}

export default Navbar;
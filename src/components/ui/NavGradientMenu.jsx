import {
  IoPersonOutline,
  IoBriefcaseOutline,
  IoCodeSlashOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoMailOutline,
} from 'react-icons/io5';

const navItems = [
  { title: 'About',          href: '#about',          icon: <IoPersonOutline />,     from: '#ed432f', to: '#ff8a65' },
  { title: 'Work',           href: '#projects',       icon: <IoBriefcaseOutline />,   from: '#171512', to: '#3d3a35' },
  { title: 'Skills',         href: '#skills',         icon: <IoCodeSlashOutline />,   from: '#c49a2a', to: '#e8c54a' },
  { title: 'Certifications', href: '#certifications', icon: <IoRibbonOutline />,      from: '#b8402c', to: '#e06d52' },
  { title: 'Education',      href: '#education',      icon: <IoSchoolOutline />,      from: '#8b6f4a', to: '#b8956b' },
  { title: 'Contact',        href: '#contact',        icon: <IoMailOutline />,        from: '#c85c2e', to: '#e88d52' },
];

export default function NavGradientMenu({ onItemClick }) {
  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    if (onItemClick) onItemClick();
  };

  return (
    <ul className="nav-gm" role="menubar" aria-label="Main navigation">
      {navItems.map(({ title, href, icon, from, to }, idx) => (
        <li
          key={idx}
          style={{ '--gm-from': from, '--gm-to': to }}
          role="none"
        >
          <a
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="nav-gm-link"
            role="menuitem"
            aria-label={`Navigate to ${title}`}
          >
            <span className="nav-gm-bg" aria-hidden="true" />
            <span className="nav-gm-glow" aria-hidden="true" />
            <span className="nav-gm-icon" aria-hidden="true">{icon}</span>
            <span className="nav-gm-label">{title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}


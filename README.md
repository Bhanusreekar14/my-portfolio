# Perumalla Bhanu Sreekar — Portfolio Website

A modern, high-performance editorial personal portfolio website engineered with **React 19**, **Vite**, **Tailwind CSS v4**, **GSAP**, **Framer Motion**, **WebGL2**, and **Firebase**.

![Portfolio Preview](public/meta-preview.png)

---

## ✨ Features

- **Cinematic Intro & 3D Perspective Tunnel**: Fast, immersive GSAP & WebGL-powered 3D tunnel transition showcasing featured work and credentials.
- **Interactive 3D Keycap Tech Orb**: Custom WebGL2 keycap sphere in the Skills section supporting momentum drag-spinning, hover illumination, keyboard input, and radiating ripple physics.
- **Editorial Design Language**: Refined beige, charcoal, and terracotta aesthetic inspired by modern magazine layouts with full Light & Dark mode support.
- **Dynamic Content & Admin CMS**: Powered by Firebase Realtime Database and Firebase Authentication for live management of projects, certifications, skills, messages, and education.
- **Editorial Education Timeline**: Vertical timeline featuring academic milestones at CMR Technical Campus (B.Tech IT), Sri Chaitanya Junior College, and Sri Chaitanya High School with scroll-triggered animations.
- **Projects & Certifications Showcase**: Filterable showcase with credential verification modals and live deployment links.
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with strict `prefers-reduced-motion` compliance.

---

## 🛠️ Tech Stack

### Frontend & UI
- **React 19** (`react`, `react-dom`)
- **Vite 8** — Next-generation frontend tooling and bundler
- **Tailwind CSS v4** — Utility-first styling with `@tailwindcss/vite`
- **React Router DOM v7** — Client-side SPA routing
- **Framer Motion** — Physics-based fluid interactions and viewport animations
- **GSAP (GreenSock)** — High-performance timelines and scroll-triggered animations
- **WebGL2** — Custom procedural 3D keycap orb rendering with shaders and lighting
- **Lucide React & React Icons** — Minimal iconography

### Backend & Cloud Services
- **Firebase Authentication** — Secure administrator dashboard access
- **Firebase Realtime Database** — Dynamic real-time data persistence
- **Firebase Storage** — Asset and media hosting

### Deployment & DevOps
- **Vercel** — Global Edge network hosting with SPA rewrites (`vercel.json`)
- **Git & GitHub** — Version control and CI/CD automation

---

## 📁 Project Structure

```
bhanu-portfolio/
├── public/                 # Static assets, fonts, icons, resume PDF
│   ├── resume/
│   │   └── PerumallaBhanuSreekar.pdf
│   └── favicon.svg
├── src/
│   ├── admin/              # Firebase-authenticated Admin CMS
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── ManageProjects.jsx
│   │   ├── ManageSkills.jsx
│   │   ├── ManageEducation.jsx
│   │   ├── ManageCertifications.jsx
│   │   └── ManageMessages.jsx
│   ├── components/         # Core portfolio sections
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Certifications.jsx
│   │   ├── Education.jsx
│   │   ├── Contact.jsx
│   │   └── ui/             # Reusable UI & WebGL components
│   │       ├── keycap-orb.jsx
│   │       └── PerspectiveTunnel.jsx
│   ├── firebase/           # Firebase initialization & configuration
│   │   └── config.js
│   ├── hooks/              # Custom React hooks (motion, auth)
│   ├── styles/             # Global styling & Tailwind directives
│   ├── App.jsx             # Root application router
│   └── main.jsx            # Application entry point
├── vercel.json             # Vercel SPA routing rules
├── vite.config.js          # Vite build configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/my-portfolio.git
cd my-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Preview production build locally
```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recommended)
This repository is configured for 1-click deployment on Vercel:
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (or `vite build`).
4. Output Directory: `dist`.
5. The included [`vercel.json`](vercel.json) ensures all client-side routes redirect seamlessly to `index.html`.

---

## 👤 Author

**Perumalla Bhanu Sreekar**
- **LinkedIn**: [linkedin.com/in/bhanu-sreekar-jaya](https://www.linkedin.com/in/bhanu-sreekar-jaya)
- **GitHub**: [github.com/Bhanu14](https://github.com/Bhanu14)
- **Portfolio**: [bhanu-portfolio.vercel.app](https://bhanu-portfolio.vercel.app)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

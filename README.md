# JobFoodie 🍔💼

A modern, responsive job-search frontend website built strictly with vanilla **HTML5**, **CSS3**, and **JavaScript** (no third-party frameworks like React, Angular, Tailwind, or Bootstrap).

## ✨ Features

- **Navbar**: Clean header featuring the JobFoodie brand, navigation links, **Themes Dropdown Selector** (5 themes), **Candidate Login & Fresher Profile** widget, and "Post a Job" action.
- **Multiple Themes Options**: Choose between:
  1. ☀️ **Light Slate** (Crisp clean white & slate)
  2. 🌙 **Dark Navy** (Deep midnight slate)
  3. 🌊 **Ocean Blue** (Cyan and cobalt blue)
  4. 🌲 **Emerald Mint** (Forest and mint green)
  5. 🔮 **Cyber Violet** (Electric indigo and purple)
- **Tokenized Smart Search**: Multi-word search queries like `"java backend developer for fresher"` break into individual keywords, matching across job titles, tech stacks, experience levels, and tags.
- **🎓 Fresher Career Mode**:
  - Sign in as a **Fresher / Graduate** (0-1 yrs exp) or Experienced Pro.
  - Activates the **Fresher Career Accelerator** banner and auto-filters entry-level & fresher-friendly roles.
  - Dedicated **"🎓 Fresher (0-1 yrs)"** filter pill.
  - Includes realistic entry-level roles such as **Java Backend Developer (Fresher)**, **Junior Java Software Engineer**, and **Associate Cloud Developer**.
- **Popular Job Categories**:
  - Interactive cards for:
    1. Software Development
    2. Data Science
    3. UI/UX Design
    4. Marketing
    5. Finance
    6. Cybersecurity
  - Click any category card to dynamically filter the featured jobs below!
- **Featured Jobs (6 sample cards)**:
  - Senior Full Stack Engineer (CloudScale Technologies)
  - Lead UI/UX Product Designer (FinPulse Studio)
  - Senior Data Scientist (NeuralSphere AI)
  - Growth Marketing Manager (FreshBite Global)
  - Cyber Threat Intelligence Analyst (Aegis Security Labs)
  - Quantitative Financial Analyst (Apex Capital Partners)
  - Each card includes: Job title, Company name, Location, Job type, Experience level, Salary benchmarks, **"Apply Now"** button (with modal application dialog), and an interactive **Bookmark** toggle button (persists to `localStorage`).
- **Clean Aesthetic**:
  - White and light backgrounds (`#f8fafc`) with deep navy (`#0f172a`) and vibrant blue (`#2563eb`) accents.
  - Rounded cards, subtle shadows, smooth micro-interactions and transitions.
  - Modern typography using Google Fonts (Plus Jakarta Sans / Inter).
  - Fully responsive layout for desktop, tablet, and mobile devices.

## 📁 Folder Structure

All project files are neatly contained in this directory:

```text
jobfoodie/
├── index.html            # Main website markup & interactive modals
├── styles.css            # Complete design system & all 5 theme styles
├── app.js                # Core JS logic: search, fresher mode, themes, location
├── hero-bg-art.svg       # Custom vector artwork for the hero section
├── JobFoodie.url         # One-click browser shortcut
├── Launch-JobFoodie.bat  # Windows launcher batch script
├── Open-Folder.bat       # One-click script to open this folder in File Explorer
└── README.md             # Project documentation & run guide
```

## 🚀 How to Run & Test

1. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Or serve it using any local web server, for example:
   ```bash
   # Using Python:
   python -m http.server 8000

   # Or using VS Code Live Server extension:
   # Right click index.html -> "Open with Live Server"
   ```

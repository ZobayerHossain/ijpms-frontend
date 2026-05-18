# IJPMS Frontend — Internship & Job Placement Management System

A modern, responsive full-stack frontend built with Next.js and React for the IJPMS platform.

---

## 📌 Project Overview

The **IJPMS Frontend** provides role-based dashboards for users interacting with the backend API. Applicants can browse and apply for internships, Recruiters can post positions and evaluate candidates, and Admins maintain platform configuration control.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (Turbopack) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Authentication | JWT (localStorage) |
| Icons | Lucide React |
| State Management | React Hooks |

---

## 📄 Pages & Features

| Route | Role | Features |
|---|---|---|
| `/login` | Public | Email + password authorization |
| `/register` | Public | Multi-role account selection (Applicant / Recruiter) |
| `/applicant` | Applicant | Browse listings, attach attachments modal, monitor status arrays |
| `/recruiter` | Recruiter | Post open position rules, review incoming attachments, evaluate results |
| `/admin` | Admin | Overall profile management dashboard |
| `/triage` | Admin/Recruiter | Integrated candidate filtering workspace |

---

## 🆕 Key Features

### 📝 Application Form Modal
- Secure attachment capture inputs for **Resume URL**, **GitHub/Portfolio Link**, and a custom **Cover Letter/Pitch** window.
- Fluid dialog transition states fully responsive on dark theme background layers.

### 👔 Recruiter Evaluation Panel
- View all live incoming job applications sorted dynamically by position criteria.
- Direct inline trigger links (**"View Submitted Resume"** and **"Open Developer Link"**) next to candidate meta metrics.
- Form inputs for assigning numerical assessment grades ($0 \text{ to } 100$) and explicit application status updates.

### 🏥 Triage Priority Categorization
- Application cards dynamically filtered into color-coded priority bands according to evaluation tiers:
  - 🟢 **High Priority** — Scores $80 \text{ to } 100$
  - 🟡 **Medium Priority** — Scores $50 \text{ to } 79$
  - 🔴 **Low Priority** — Scores $0 \text{ to } 49$

### 🔐 Route Isolation & Protection
- Local state authentication tracking synchronized across specialized client route blocks.
- Higher-Order `RouteGuard` wrapper validation prevents unauthenticated page switching.

---

## ⚙️ Local Setup & Setup Execution

### Prerequisites
- Node.js v18+
- Active running instance of **IJPMS Backend** listening on `http://localhost:3000`

### Installation Steps

```bash
# Clone the repository
git clone [https://github.com/ZobayerHossain/ijpms-frontend.git](https://github.com/ZobayerHossain/ijpms-frontend.git)
cd ijpms-frontend

# Install node module bundles
npm install

# Run the development compilation engine
npm run dev
```

Frontend runs on: **http://localhost:3001**

---

## 🔗 API Connection

All API calls go through `src/lib/api.ts` using Axios.

Base URL: `http://localhost:3000`

JWT token is automatically attached to every request via Axios interceptor.

---

## 📁 Project Structure
...
src/
├── app/
│   ├── login/                      → Authentication landing screen
│   ├── register/                   → Multi-role registration template
│   └── (dashboard)/
│       └── {applicant,recruiter,admin,triage}/
│           ├── applicant/          → Applicant viewports and forms
│           ├── recruiter/          → Recruiter workspace evaluation panel
│           ├── admin/              → Global administrative controllers
│           └── triage/             → Priority assessment list interface
├── components/
│   ├── layout/                     → Navbar, RouteGuard route controllers
│   └── ui/                         → Reusable Inputs, Buttons, Badges, Modals
├── hooks/                          → Custom authentication hook collections
├── lib/                            → Interceptor setups (api.ts, auth.ts)
└── types/                          → Strict global TypeScript data contract interfaces
...

---

## 🔗 Backend Repository
https://github.com/ZobayerHossain/ijpms-backend


---

## 👨‍💻 Author

**(Zobayer Hossain Piash)**
American International University – Bangladesh (AIUB)
CSC 4161 – Advanced Programming in Web Technologies
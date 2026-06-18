# 🎓 VERITY — Smart Campus Management System

> Year 3 Semester 1 | IT Project Management (ITPM) | SLIIT

---

## 📌 Project Overview

**VERITY** is a full-stack Smart Campus Management System designed to streamline academic and administrative workflows for students, lecturers, and managers within the SLIIT ecosystem.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Cache / Queue** | Redis (Upstash), BullMQ |
| **Auth** | JWT, bcryptjs |
| **Real-time** | Socket.IO |
| **AI** | Google Gemini API |
| **Storage** | Supabase |

---

## 🏗️ Project Structure

```
Verity-Project/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── index.js
│   ├── prisma/       # Database schema & migrations
│   └── scripts/      # Utility scripts
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.tsx
└── verity_db.sql     # Database schema
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v18+** (v20 recommended)
- PostgreSQL **v14+**
- Redis **v6+** (or Upstash cloud Redis)

> 📖 See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full system design.
> 📡 See [docs/API.md](./docs/API.md) for endpoint reference.

### 1. Clone the Repository
```bash
git clone https://github.com/SSMShehan/Verity-Project.git
cd Verity-Project
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env   # Fill in your environment variables
npm install
npx prisma generate
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 👥 Team Members

| Name | Role | GitHub |
|---|---|---|
| Shehan | Backend Developer| [@SSMShehan](https://github.com/SSMShehan) |
| Shakya | Frontend Developer | [@Shakya202](https://github.com/Shakya202) |
| Sachini | Frontend Developer | [@Sachini-N](https://github.com/Sachini-N) |
| Kavindra | Module Developer | [@kavi419](https://github.com/kavi419) |

---

## 📋 Modules

- ✅ Authentication & Role-based Access Control
- ✅ Student Dashboard & Calendar
- ✅ Project Management (Kanban Board)
- ✅ Announcements with File Attachments
- ✅ Manager Profile & Administration
- ✅ Lecturer Dashboard
- ✅ Real-time Notifications (Socket.IO)
- ✅ AI-powered Features (Gemini API)

---

## 📄 License

This project is developed for academic purposes — SLIIT ITPM Module.

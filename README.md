<div align="center">

# 🏥 Meditrack

### Modern Healthcare Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)

**A unified platform for patients, doctors, and administrators to manage healthcare — appointments, medical records, and care — all in one place.**

[Live Demo](#) · [Backend API Docs](#) · [Report Bug](https://github.com/aklilumengesha/meditrack/issues)

</div>

---

## ✨ Overview

Meditrack is a full-stack healthcare management system built with modern technologies. It provides three distinct portals — **Patient**, **Doctor**, and **Admin** — each with role-specific features and a clean, responsive UI.

---

## 🚀 Features

### 👤 Patient Portal
- Book appointments with verified doctors (filter by specialty)
- View upcoming and past appointments with status tracking
- Access full medical records with vitals
- Rate doctors after completed appointments
- Receive real-time notifications
- Forgot password flow via admin

### 🩺 Doctor Portal
- Accept, confirm, complete or cancel appointments
- View and manage assigned patients
- Add medical records with vitals
- View patient medical history
- Profile management with photo and bio
- Real-time notification bell

### 🛡️ Admin Panel
- Full CRUD on users, doctors, patients, appointments, medical records
- System-wide statistics dashboard with charts
- Suspend/activate users, change roles, reset passwords
- Password reset request management
- CSV export for users and appointments
- Recent registrations activity feed

### 🌐 Landing Page
- Modern animated hero section
- Features, how-it-works, testimonials, CTA sections
- Fully responsive

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, DaisyUI |
| Backend | NestJS 10, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, Passport, bcrypt |
| UI | Inter font, Recharts, MUI, React Icons |
| Security | Rate limiting, CORS, role-based guards |

---

## 📁 Project Structure

```
meditrack/
├── backend/          # NestJS REST API
│   ├── src/
│   │   ├── auth/         # JWT authentication
│   │   ├── admin/        # Admin management
│   │   ├── doctor/       # Doctor portal API
│   │   ├── patient/      # Patient management
│   │   ├── patient-portal/  # Patient portal API
│   │   ├── appointment/  # Appointment scheduling
│   │   ├── medical-record/  # Medical records
│   │   ├── notification/ # Notification system
│   │   └── rating/       # Doctor ratings
│   └── prisma/       # Database schema & migrations
└── frontend/         # Next.js application
    └── app/
        ├── landing/      # Public landing page
        ├── login/        # Authentication pages
        ├── doctor/       # Doctor portal
        ├── patient/      # Patient portal
        └── admin/        # Admin panel
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/aklilumengesha/meditrack.git
cd meditrack
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate deploy
npm run start:dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### 4. Create admin account
```bash
cd backend
npx ts-node src/seed-admin.ts
```

---

## 🔐 Environment Variables

See [`backend/.env.example`](./backend/.env.example) and [`frontend/.env.local.example`](./frontend/.env.local.example)

---

## 🚢 Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full deployment instructions.

- **Frontend** → Vercel
- **Backend** → Railway / Render / Fly.io (Docker supported)
- **Database** → Supabase / Neon / Railway PostgreSQL

---

## 👨‍💻 Author

**Aklilu Mengesha**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=flat-square)](https://aklilu-mengesha-portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-aklilumengesha-black?style=flat-square&logo=github)](https://github.com/aklilumengesha)

---

<div align="center">
  <sub>Built with ❤️ by Aklilu Mengesha</sub>
</div>

<div align="center">

# 🎨 Meditrack — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/JavaScript-ES2022-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Modern, responsive frontend for the Meditrack healthcare management platform.**

</div>

---

## 📋 Overview

The Meditrack frontend is a Next.js 14 App Router application with three role-based portals — Patient, Doctor, and Admin — plus a public landing page. Built with Tailwind CSS and DaisyUI for a clean, professional design.

---

## 🗂️ Application Structure

```
app/
├── landing/           # Public landing page (hero, features, testimonials)
├── login/             # Sign in page
├── register/          # Sign up page (role selector)
├── forgot-password/   # Password reset request
├── change-password/   # Forced password change
│
├── doctor/            # 🩺 Doctor Portal (JWT protected)
│   ├── dashboard/     # Stats, upcoming appointments
│   ├── patients/      # Patient list with search
│   ├── appointments/  # Accept/decline/complete appointments
│   └── profile/       # Edit profile, photo, bio
│
├── patient/           # 👤 Patient Portal (JWT protected)
│   ├── dashboard/     # Summary, next appointment
│   ├── doctors/       # Browse doctors, view profiles, ratings
│   ├── appointments/  # Book, view, cancel, rate
│   ├── records/       # Medical records with vitals
│   └── profile/       # Edit personal info
│
├── admin/             # 🛡️ Admin Panel (JWT protected)
│   ├── dashboard/     # Charts, stats, activity feed
│   ├── users/         # User management (suspend, role, password)
│   ├── doctors/       # Doctor CRUD
│   ├── patients/      # Patient management
│   ├── appointments/  # Appointment oversight
│   ├── medical-records/ # Records management
│   └── reset-requests/  # Password reset queue
│
├── components/
│   └── shared/
│       ├── NotificationBell.jsx   # Real-time notifications
│       ├── DashboardMockup.jsx    # Login page visual
│       └── Pagination.jsx         # Reusable pagination
│
├── context/
│   └── AuthContext.jsx    # JWT auth state management
│
├── utils/
│   ├── api.js             # Core API functions
│   ├── doctorApi.js       # Doctor portal API
│   ├── patientApi.js      # Patient portal API
│   ├── adminApi.js        # Admin panel API
│   └── notificationApi.js # Notification API
│
└── middleware.js          # Route protection by role
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Font | Inter, Poppins |
| Primary | Blue 600 (`#2563eb`) |
| Doctor accent | Blue 600 |
| Patient accent | Teal 600 |
| Admin accent | Violet 600 |
| Border radius | `rounded-2xl` (1rem) |
| Shadow | `shadow-sm` with hover `shadow-md` |

### CSS Utility Classes
```css
.card-modern        /* White card with border and shadow */
.page-title         /* 3xl extrabold heading */
.input-modern       /* Styled input with focus ring */
.btn-modern-primary /* Blue primary button */
.btn-modern-outline /* Outlined secondary button */
.gradient-text      /* Blue-to-cyan gradient text */
.animate-fade-in    /* Fade in + slide up animation */
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## 🔐 Authentication Flow

```
User visits / → AuthContext checks localStorage
  ├── No token → redirect to /landing
  ├── DOCTOR → redirect to /doctor/dashboard
  ├── PATIENT → redirect to /patient/dashboard
  └── ADMIN → redirect to /admin/dashboard

Login → JWT stored in localStorage + cookie
  └── mustChangePassword=true → redirect to /change-password

Middleware protects:
  /doctor/* → DOCTOR role only
  /patient/* → PATIENT role only
  /admin/* → ADMIN role only
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | App Router, SSR, metadata |
| `tailwindcss` + `daisyui` | Styling |
| `@mui/x-date-pickers` | Date/time picker |
| `recharts` | Dashboard charts |
| `react-toastify` | Toast notifications |
| `formik` + `yup` | Form validation |
| `dayjs` | Date formatting |
| `axios` | HTTP client |
| `react-loading-skeleton` | Loading states |
| `react-icons` | Icon library |

---

## 🚀 Build & Deploy

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

### Deploy to Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
4. Deploy

---

## 🔒 Security

- All API calls use `NEXT_PUBLIC_API_URL` env variable
- JWT stored in both localStorage (for API calls) and cookies (for middleware)
- Route protection via Next.js middleware
- No sensitive data in client-side code

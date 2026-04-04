<div align="center">

# 🔧 Meditrack — Backend API

[![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat-square)](https://jwt.io)

**RESTful API for the Meditrack healthcare management platform.**

</div>

---

## 📋 Overview

The Meditrack backend is a NestJS application providing a secure, role-based REST API for managing patients, doctors, appointments, medical records, and notifications.

---

## 🏗️ Architecture

```
src/
├── auth/              # JWT authentication, guards, strategies
├── admin/             # Admin CRUD operations and statistics
├── doctor/            # Doctor profile and portal endpoints
├── patient/           # Patient management (legacy + admin)
├── patient-portal/    # Patient-facing portal endpoints
├── appointment/       # Appointment scheduling and status
├── medical-record/    # Medical records with PDF generation
├── notification/      # Real-time notification system
├── rating/            # Doctor rating and review system
├── core/              # Shared services (PrismaService)
└── main.ts            # Application entry point
```

---

## 🔑 Authentication & Authorization

- **JWT Bearer tokens** — 7-day expiration
- **Role-based guards** — `ADMIN`, `DOCTOR`, `PATIENT`
- **Rate limiting** — Global 20 req/min, auth routes stricter
- **Password hashing** — bcrypt with salt rounds 10
- **Suspended account check** — on every login

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register (Doctor/Patient) |
| POST | `/auth/login` | Login — returns JWT |
| POST | `/auth/forgot-password` | Submit reset request |
| POST | `/auth/change-password` | Change password (JWT required) |

### Doctor Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors/me` | Get own profile |
| PUT | `/doctors/me` | Update profile |
| GET | `/doctors/me/stats` | Dashboard stats |
| GET | `/doctors/me/appointments` | Own appointments |
| GET | `/doctors/me/patients` | Assigned patients |
| GET | `/doctors` | List all doctors (with ratings) |

### Patient Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient-portal/dashboard` | Dashboard summary |
| GET | `/patient-portal/appointments` | Own appointments |
| POST | `/patient-portal/appointments` | Book appointment |
| DELETE | `/patient-portal/appointments/:id` | Cancel appointment |
| GET | `/patient-portal/medical-records` | Own records |
| GET | `/patient-portal/profile` | Own profile |
| PUT | `/patient-portal/profile` | Update profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/appointments/:id/status` | Update status (PENDING/CONFIRMED/COMPLETED/CANCELLED) |
| PUT | `/appointments/:id/reschedule` | Reschedule |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ratings/appointments/:id` | Rate a completed appointment |
| GET | `/ratings/doctors/:id` | Get doctor ratings |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | System statistics |
| GET/DELETE | `/admin/users` | Manage users |
| PATCH | `/admin/users/:id/toggle-active` | Suspend/activate |
| PATCH | `/admin/users/:id/role` | Change role |
| PATCH | `/admin/users/:id/reset-password` | Generate temp password |
| GET/POST/PUT/DELETE | `/admin/doctors` | Doctor CRUD |
| GET/PUT | `/admin/patients` | Patient management |
| GET/POST/PUT/DELETE | `/admin/appointments` | Appointment management |
| GET/DELETE | `/admin/medical-records` | Records oversight |
| GET | `/admin/password-reset-requests` | View reset requests |
| PATCH | `/admin/password-reset-requests/:id/resolve` | Resolve request |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs` | Swagger UI (dev only) |

---

## 🗄️ Database Schema

```
User ──── Doctor ──── Appointment ──── DoctorRating
     └─── Patient ───┘              └── MedicalRecord
     └─── Notification
     └─── PasswordResetRequest
```

**Enums:** `Role`, `AppointmentStatus`, `Diagnosis`, `Treatment`, `Medication`, `VisitType`, `ResetRequestStatus`

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/meditrack"
JWT_SECRET="your-strong-secret-min-32-chars"
NODE_ENV="development"
PORT=3000
ALLOWED_ORIGINS="http://localhost:3001"
```

### 3. Run migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start development server
```bash
npm run start:dev
```

### 5. API Documentation
Visit `http://localhost:3000/api/docs`

---

## 🐳 Docker

```bash
docker build -t meditrack-backend .
docker run -p 3000:3000 --env-file .env meditrack-backend
```

---

## 🧪 Testing

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

---

## 🔒 Security Features

- JWT secret from environment variable only (no fallback)
- Rate limiting: 20 req/min global, 10 login, 5 register, 3 forgot-password
- CORS restricted to `ALLOWED_ORIGINS`
- Role-based access control on all protected routes
- bcrypt password hashing
- Suspended account blocking
- Swagger disabled in production

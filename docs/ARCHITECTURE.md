# VERITY — Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                    │
│              React + Vite (Port 5173)               │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / WebSocket
┌─────────────────────▼───────────────────────────────┐
│               EXPRESS.JS BACKEND (Port 5000)         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Routes  │  │  Middle  │  │   Socket.IO Server │ │
│  │  /api/*  │  │  -ware   │  │   (Real-time)      │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│              │                                       │
│  ┌───────────▼────────────────────────────────────┐ │
│  │              Prisma ORM                         │ │
│  └───────────┬────────────────────────────────────┘ │
└──────────────┼──────────────────────────────────────┘
               │
   ┌───────────▼──────────┐    ┌──────────────────────┐
   │     PostgreSQL        │    │     Redis (Upstash)  │
   │     (Primary DB)      │    │   BullMQ Job Queue   │
   └──────────────────────┘    └──────────────────────┘
                                         │
                               ┌─────────▼────────────┐
                               │   Supabase Storage   │
                               │   (File Uploads)     │
                               └──────────────────────┘
```

## Role-Based Access Control

| Role | Permissions |
|---|---|
| **Student** | View announcements, manage own calendar, view projects |
| **Lecturer** | Create announcements, manage assignments, view student progress |
| **Manager** | Full admin access, manage users, view all modules |

## Authentication Flow

1. User submits credentials → `POST /api/auth/login`
2. Server validates password via `bcryptjs`
3. Server issues signed **JWT** (stored in `localStorage`)
4. All subsequent requests carry `Authorization: Bearer <token>`
5. `authMiddleware.js` validates token on every protected route

## Module Structure

```
Module 1 — Student Portal
  ├── Calendar & Scheduling
  ├── Project List & Kanban Board
  └── Announcement Feed

Module 2 — Lecturer Portal
  ├── Assignment Management
  ├── Announcement Creation
  └── Student Progress View

Module 3 — Manager / Admin
  ├── User Management
  ├── System Announcements
  └── Profile Administration
```

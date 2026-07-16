# JobPortal Pro - Full Stack Decoupled Application

JobPortal Pro is a modern, decoupled full-stack web application designed to connect job seekers (Candidates) with employers (Recruiters) while offering comprehensive oversight for platform administrators.

## 🏗️ Architecture

The application is built using a modern decoupled architecture:
- **Frontend**: Next.js 15 (React), styled with Tailwind CSS and Shadcn UI components. Runs on `http://localhost:3000`.
- **Backend**: Express.js (Node.js) RESTful API. Runs on `http://localhost:5000`.
- **Database**: SQLite (via `sqlite3` driver) for lightweight, zero-configuration local data storage.

This separation of concerns allows the frontend to be statically optimized and deployed via Vercel/CDN, while the backend API independently handles business logic, security, and database interactions.

## ✨ Core Features

### Role-Based Access Control (RBAC)
The application handles three distinct user roles, each with custom dashboards and permissions:
1. **Candidates**: Can browse jobs, create a professional profile, upload PDF resumes, and apply for open positions.
2. **Recruiters**: Can post jobs, manage active listings, review candidate applications, schedule interviews, and view a pipeline metrics dashboard.
3. **Admins**: Can oversee the entire platform, view system-wide analytics (total users, active jobs), and securely delete inappropriate jobs or users.

### Advanced Capabilities
- **File Uploads**: Native support for PDF resume uploads via Multer middleware on the Express backend, integrated with Next.js Server Actions on the frontend.
- **RESTful API**: A clean, scalable API layer that handles Authentication (JWT), Profiles, Jobs, Applications, and Interviews.
- **Modern UI/UX**: Dark mode support, responsive layouts, accessible Radix-based UI components, and toast/alert notifications for seamless user feedback.

## 🚀 Getting Started

To run this project locally, you will need to start both the backend server and the frontend application.

### 1. Start the Backend API (Express.js)
```bash
cd backend
npm install
npm run dev
```
*The backend server will automatically seed the SQLite database and start listening on `http://localhost:5000`.*

### 2. Start the Frontend (Next.js)
Open a new terminal window in the root directory of the project:
```bash
npm install
npm run dev
```
*The Next.js application will start on `http://localhost:3000`.*

## 📂 Project Structure

```text
job-portal-fullstack/
├── backend/                   # Express.js REST API
│   ├── src/
│   │   ├── config/            # SQLite Connection & Auto Seed Data
│   │   ├── controllers/       # API Business Logic (Auth, Jobs, Users, Applications)
│   │   ├── middleware/        # JWT Auth & Multer File Uploads
│   │   ├── routes/            # Express Route Definitions
│   │   └── app.js             # Express Server Entry Point
│   ├── uploads/               # Local storage for PDF resumes
│   └── database.sqlite        # Auto-generated database file
├── src/                       # Next.js Frontend
│   ├── app/                   # App Router (Pages & Server Actions)
│   │   ├── actions/           # Server Actions fetching data from Express API
│   │   ├── admin/             # Admin Dashboard Routes
│   │   ├── candidate/         # Candidate Profile & Dashboard
│   │   ├── recruiter/         # Recruiter Dashboard & Job Management
│   │   ├── jobs/              # Public Job Listings
│   │   └── ...
│   ├── components/            # Reusable UI Components (Navbar, Shadcn UI)
│   └── lib/                   # Utility functions
└── tailwind.config.ts         # Tailwind styling configuration
```

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Multer, bcryptjs.
- **Database**: SQLite (built-in driver).

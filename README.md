# Habitify — Habit Tracker

A full-stack habit tracking application built with **Next.js**, **Node.js**, **Express**, and **MongoDB**.

Habitify lets authenticated users create habits, check them in once per local calendar day, track current and longest streaks, and review their weekly progress.

The most important rule of the application is:

> **A streak is based on the user's local calendar days, not elapsed hours.**

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- HTTP-only authentication cookie
- Protected backend routes
- Authentication status check
- Logout
- User-specific timezone stored at signup
- Personalized greeting using the authenticated user's real name

### Habit Management

- Create habits
- View authenticated user's habits
- Delete habits
- Optional habit descriptions
- Habit categories
- Habit icons
- Habit creation date
- Owner-based access control

### Daily Check-ins

- One-click check-in for today
- One check-in per habit per local calendar day
- Duplicate check-ins rejected at the database level
- Future local dates rejected
- Dates before habit creation rejected
- Users cannot access or modify another user's habits

### Streaks

Each habit displays:

- Current streak
- Longest streak

Streaks are calculated on the server using the user's configured IANA timezone.

The frontend does not decide whether a streak is alive.

### Dashboard

The daily dashboard includes:

- Personalized greeting
- Current streak summary
- Best streak summary
- Today's progress
- Habit category filters
- Responsive habit cards
- Check-in status
- Delete habit action
- Live clock
- Daily quote

---

# Tech Stack

## Client

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Lucide React
- React Toastify
- next/font

## Server

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

---

# Environment Variables

## Backend

Create a `.env` file inside the `server` directory:

```env
PORT=4000
CLIENT_URI=http://localhost:3000
DB_URI=mongodb://localhost:27017/habitify
JWT_PWD=admin
```
## Frontend Environment

Create a `.env.local` file inside the `client` directory:

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
```
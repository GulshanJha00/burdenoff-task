# Habit Tracker with Streaks

A simple full-stack habit tracker where users create habits, check them off once per **local calendar day**, backfill missed days, and see their current and longest streaks.

The central design rule is:

> **Streaks are based on the user's local calendar days, never on elapsed hours.**

For example, two check-ins 20 hours apart can represent two consecutive days—or the same day—depending on the user's timezone.

## Features

* User signup/login with an IANA timezone such as `Asia/Kolkata`
* Habit CRUD
* Optional habit descriptions
* One check-in per habit per local calendar day
* Check in for today with one click
* Backfill previous dates
* Server-side current and longest streak calculation
* Detailed check-in history
* Clear validation/error messages
* UTC timestamps plus the local calendar day represented by each check-in
* Protection against checking into another user's habit
* Recalculation of streaks after backfills
* Timezone-aware handling of local dates
* Testable, isolated local-day/streak logic

## Core Domain Model

### User

```text
User
----
id
email
passwordHash
timezone       // IANA timezone, e.g. "Asia/Kolkata"
createdAt
```

The timezone is part of the user's account because the meaning of "today" depends on it.

### Habit

```text
Habit
-----
id
ownerId
name
description?
createdAt
```

`createdAt` is stored as an instant in UTC.

A check-in cannot be created for a local date before the habit existed.

### CheckIn

```text
CheckIn
-------
id
habitId
checkedAtUtc
localDate
createdAt
```

`checkedAtUtc` records the actual instant at which the check-in was created.

`localDate` records the calendar day that the check-in counts toward for the habit owner's timezone.

For example:

```text
checkedAtUtc = 2026-03-10T14:30:00Z
timezone     = Asia/Kolkata

localDate    = 2026-03-10
```

The two fields intentionally serve different purposes:

* `checkedAtUtc` answers **when did this happen?**
* `localDate` answers **which calendar day does it count for?**

## Why Local Dates Are Stored

A streak should not be calculated from timestamp differences.

Consider a user in `Asia/Kolkata`:

```text
A = 2026-03-10T14:30Z
  = 2026-03-10 20:00 local

B = 2026-03-11T10:30Z
  = 2026-03-11 16:00 local
```

Only 20 hours elapsed, but the check-ins belong to:

```text
2026-03-10
2026-03-11
```

Therefore the streak is `2`.

Conversely:

```text
C = 2026-03-11T21:30Z
  = 2026-03-12 03:00 local

D = 2026-03-12T17:30Z
  = 2026-03-12 23:00 local
```

Both belong to `2026-03-12`, so `D` is a duplicate and does not extend the streak.

The application therefore treats `localDate` as the unit of streak calculation.

## Local-Day Conversion

The backend should be the single authority for converting instants into local calendar days.

Conceptually:

```text
localDate = instant
  → user's IANA timezone
  → local calendar date
```

Use a timezone-aware date/time library rather than manually adding a fixed offset.

This is important because IANA timezones can have daylight-saving transitions and historical offset changes.

### Never use elapsed hours for streaks

Avoid logic such as:

```text
differenceInHours(checkInA, checkInB) <= 24
```

Instead, compare local calendar dates:

```text
2026-03-10
2026-03-11
```

Two dates are consecutive when:

```text
dateB = dateA + 1 calendar day
```

## Check-In Rules

A check-in request should contain a requested local date.

For example:

```http
POST /habits/:habitId/check-ins
Content-Type: application/json

{
  "localDate": "2026-03-11"
}
```

The server validates all of the following:

1. The caller is authenticated.
2. The habit exists.
3. The habit belongs to the caller.
4. `localDate` is a valid calendar date.
5. `localDate` is not in the user's local future.
6. `localDate` is not before the habit's creation date in the user's local timezone.
7. No check-in already exists for that habit and local date.

The server then creates the check-in with:

```text
checkedAtUtc = current UTC instant
localDate    = requested local date
```

### Why the client cannot be trusted

The frontend may display "today", but it must not determine whether a date is valid.

The backend owns:

* authentication
* timezone
* current local date
* habit ownership
* habit creation boundary
* duplicate enforcement
* streak calculation

This prevents clients with incorrect clocks or manipulated requests from corrupting streaks.

## One Check-In Per Local Day

The strongest implementation is a database-level unique constraint:

```text
UNIQUE (habitId, localDate)
```

This protects against race conditions where two requests arrive simultaneously.

Application-level checking alone is insufficient:

```text
request A → check whether date exists → no
request B → check whether date exists → no
request A → insert
request B → insert
```

A database constraint makes the invariant atomic.

The backend should still perform a friendly existence check so normal duplicate attempts receive a useful error, while the database constraint remains the final safeguard.

## Future-Date Validation

"Today" is determined in the user's configured timezone.

For a user in:

```text
Asia/Kolkata
```

the server calculates:

```text
today = currentInstant converted to Asia/Kolkata → local date
```

A requested date is valid only when:

```text
requestedDate <= today
```

This means a UTC date that appears to be "tomorrow" may still belong to today's local calendar day.

## Habit Creation Boundary

A check-in cannot precede the habit's creation date.

The comparison should also happen in the user's local timezone.

Conceptually:

```text
habitCreatedLocalDate =
    habit.createdAt converted to user.timezone → local date
```

Then:

```text
requestedDate >= habitCreatedLocalDate
```

This prevents creating historical check-ins for days before the habit existed.

## Streak Calculation

Streaks are calculated on the server from the set of unique local dates.

Given:

```text
2026-03-08
2026-03-09
2026-03-10
2026-03-12
```

the streaks are:

```text
currentStreak = 1
longestStreak = 3
```

because March 11 is missing.

### Current streak

The current streak is the consecutive run ending:

* today, if today is checked in; otherwise
* yesterday, if yesterday is checked in.

If neither today nor yesterday is checked in:

```text
currentStreak = 0
```

For example, if today is March 12:

```text
March 12 ✓
March 11 ✓
March 10 ✓
March 9  ✗
```

then:

```text
currentStreak = 3
```

If today is not checked:

```text
March 12 ✗
March 11 ✓
March 10 ✓
March 9  ✓
```

then:

```text
currentStreak = 3
```

If the most recent check-in was two or more local days ago, the current streak is zero.

### Longest streak

Sort the unique local dates and scan them in ascending order.

For every pair of adjacent dates:

```text
nextDate = previousDate + 1 calendar day
```

If true, extend the current run.

Otherwise, start a new run.

The maximum run length is `longestStreak`.

### Example

```text
2026-03-01 ✓
2026-03-02 ✓
2026-03-03 ✓
2026-03-05 ✓
2026-03-06 ✓
```

Results:

```json
{
  "currentStreak": 2,
  "longestStreak": 3
}
```

## Backfilling

Backfilling uses exactly the same check-in endpoint.

For example:

```http
POST /habits/abc/check-ins

{
  "localDate": "2026-03-04"
}
```

If March 4 is inserted into the previous example:

```text
March 1 ✓
March 2 ✓
March 3 ✓
March 4 ✓
March 5 ✓
March 6 ✓
```

the server recalculates:

```text
currentStreak = 6
longestStreak = 6
```

The frontend never patches streak values locally.

After every successful check-in, the frontend should use the streak values returned by the server.

## API Overview

### Authentication

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Signup example:

```json
{
  "email": "user@example.com",
  "password": "example-password",
  "timezone": "Asia/Kolkata"
}
```

### Habits

```text
GET    /habits
POST   /habits
GET    /habits/:habitId
PATCH  /habits/:habitId
DELETE /habits/:habitId
```

A habit response should include server-calculated streak information:

```json
{
  "id": "habit-id",
  "name": "Read",
  "description": "Read for 20 minutes",
  "createdAt": "2026-03-01T10:00:00Z",
  "currentStreak": 4,
  "longestStreak": 12,
  "completedToday": true
}
```

`completedToday` is also determined by the server using the user's timezone.

### Check-ins

```text
POST   /habits/:habitId/check-ins
GET    /habits/:habitId/check-ins
DELETE /habits/:habitId/check-ins/:localDate
```

Example:

```json
{
  "localDate": "2026-03-11"
}
```

Successful response:

```json
{
  "checkIn": {
    "id": "check-in-id",
    "habitId": "habit-id",
    "checkedAtUtc": "2026-03-11T10:30:00Z",
    "localDate": "2026-03-11"
  },
  "currentStreak": 2,
  "longestStreak": 2
}
```

## Error Handling

Use consistent HTTP status codes and machine-readable error codes.

Example duplicate:

```json
{
  "error": {
    "code": "CHECK_IN_ALREADY_EXISTS",
    "message": "This habit is already checked in for 2026-03-11."
  }
}
```

Suggested validation errors:

```text
AUTH_REQUIRED
INVALID_CREDENTIALS
HABIT_NOT_FOUND
HABIT_NOT_OWNED
INVALID_LOCAL_DATE
DATE_IN_LOCAL_FUTURE
DATE_BEFORE_HABIT_CREATION
CHECK_IN_ALREADY_EXISTS
INVALID_TIMEZONE
```

The frontend should display the server's user-facing message rather than attempting to infer the cause from the HTTP status alone.

## Frontend

The main dashboard should show each habit with:

* habit name
* description
* current streak
* longest streak
* today's completion state
* one-click "Check in for today" action
* link/button for history
* backfill action

Example conceptual layout:

```text
┌──────────────────────────────────────────────┐
│ My Habits                                    │
├──────────────────────────────────────────────┤
│ Drink Water                                  │
│ Current: 5 days     Longest: 12 days         │
│                                              │
│ [✓ Checked in today]       [History]         │
├──────────────────────────────────────────────┤
│ Read                                         │
│ Current: 3 days     Longest: 8 days          │
│                                              │
│ [Check in today]            [History]         │
└──────────────────────────────────────────────┘
```

### History

The history view should make local dates explicit:

```text
March 2026

Sun Mon Tue Wed Thu Fri Sat
 1   2   3   4   5   6   7
 ✓   ✓   ✓   ·   ✓   ✓   ✓
```

The history is based on the server's `localDate` values, not browser UTC conversion.

### Backfill

A date picker can allow the user to select a previous date.

The frontend may disable obviously invalid dates for usability, but the server remains authoritative and must validate the request again.

## Timezone Changes

If timezone changes are supported, historical check-ins should not silently change which calendar days they represent.

Recommended approach:

* Store the original `localDate` on every check-in.
* Keep `checkedAtUtc` for auditability.
* Recalculate `today` using the user's current timezone.
* Do not rewrite historical `localDate` values when a timezone changes.

This preserves the historical meaning of an existing check-in.

An alternative design is to make timezone immutable after signup. This is simpler and avoids ambiguity.

## Daylight Saving Time

Never implement timezone conversion with a manually stored offset such as:

```text
UTC+05:30
```

Use the IANA timezone:

```text
Asia/Kolkata
America/New_York
Europe/London
```

An IANA timezone lets the date/time library correctly handle daylight-saving transitions.

The streak algorithm still operates on calendar dates, so a 23-hour or 25-hour local day does not affect whether two check-ins are consecutive.

## Security

Secrets must never be committed to source control.

Use environment variables for:

```text
DATABASE_URL
JWT_SECRET
SESSION_SECRET
COOKIE_SECRET
```

Passwords must be stored as secure password hashes, never plaintext.

Every habit and check-in endpoint must authorize the authenticated user before accessing the requested habit.

Do not rely on an ID being hard to guess as an authorization mechanism.

## Environment Variables

Create a local `.env` file based on `.env.example`.

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/habits
JWT_SECRET=replace-me
NODE_ENV=development
PORT=3000
```

Do not commit `.env`.

## Local Development

### Prerequisites

* Node.js
* npm/pnpm/yarn
* PostgreSQL
* A modern browser

### Install

```bash
git clone <repository-url>
cd habit-tracker
npm install
```

### Configure

```bash
cp .env.example .env
```

Set the required environment variables.

### Database

Run migrations:

```bash
npm run db:migrate
```

If the project provides seed data:

```bash
npm run db:seed
```

### Start development servers

```bash
npm run dev
```

Then open the URL printed by the development server.

## Docker Compose

If Docker support is enabled:

```bash
docker compose up --build
```

This can provide the application and PostgreSQL database with a consistent local environment.

## Testing

The most important tests should target timezone and calendar-day behavior.

Recommended cases:

### Same-day duplicate

```text
A: 2026-03-11T10:30Z
B: 2026-03-11T21:30Z

Asia/Kolkata:
A → 2026-03-11
B → 2026-03-12
```

These are actually different local days and must both count.

### True duplicate

```text
A: 2026-03-11T10:30Z
B: 2026-03-11T18:30Z

Asia/Kolkata:
A → 2026-03-11
B → 2026-03-12
```

Again, these are different local days.

A better duplicate test should use two UTC instants that map to the same local date, for example:

```text
A: 2026-03-11T10:30Z → 2026-03-11
B: 2026-03-11T15:30Z → 2026-03-11
```

The second request must be rejected.

### Consecutive local dates

```text
2026-03-10
2026-03-11
2026-03-12
```

Expected:

```text
currentStreak = 3
longestStreak = 3
```

### Gap

```text
2026-03-10
2026-03-12
```

Expected:

```text
currentStreak = 1
longestStreak = 1
```

### Backfill

Start with:

```text
March 10 ✓
March 12 ✓
```

Then backfill:

```text
March 11 ✓
```

Expected:

```text
currentStreak = 3
longestStreak = 3
```

### Future date

Attempt:

```text
localDate = tomorrow
```

Expected:

```text
DATE_IN_LOCAL_FUTURE
```

### Before habit creation

Attempt a check-in for a date before the habit was created.

Expected:

```text
DATE_BEFORE_HABIT_CREATION
```

### Ownership

User A must not be able to check into User B's habit.

Expected:

```text
HABIT_NOT_OWNED
```

### Timezone boundary

Test an instant near midnight in several timezones to ensure the calculated local date is correct.

### DST

For timezones with daylight saving time, test dates around both the spring-forward and fall-back transitions.

The expected result should depend on local calendar dates, not on whether exactly 24 elapsed hours separate two check-ins.

## Architecture Principle

The most important separation is:

```text
UTC instant
    ↓
User's IANA timezone
    ↓
Local calendar date
    ↓
Unique check-in
    ↓
Server-side streak calculation
    ↓
Frontend display
```

The frontend should never contain the authoritative logic for:

```text
"Is this streak still alive?"
```

Instead:

```text
Frontend
   │
   │ request
   ▼
Backend
   │
   ├── authenticate
   ├── authorize habit
   ├── validate local date
   ├── enforce uniqueness
   ├── save check-in
   └── calculate streaks
           │
           ▼
      JSON response
           │
           ▼
       Frontend UI
```

This keeps the business rules consistent regardless of client device, browser timezone, clock settings, or API consumer.

## Recommended Project Structure

A possible structure is:

```text
habit-tracker/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── habits/
│   │   │   ├── check-ins/
│   │   │   ├── streaks/
│   │   │   └── time/
│   │   └── tests/
│   │
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── api/
│       │   └── hooks/
│       └── tests/
│
├── migrations/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

The local-date and streak functions should be isolated from HTTP handlers and UI components so they can be unit tested independently.

## Definition of Done

The implementation is complete when:

* [ ] Users can sign up with an IANA timezone.
* [ ] Users can authenticate securely.
* [ ] Users can create, edit, view, and delete their own habits.
* [ ] Users can check in for today.
* [ ] Users can backfill a previous local date.
* [ ] A habit can have at most one check-in per local date.
* [ ] Duplicate enforcement is protected by the database where possible.
* [ ] Future local dates are rejected.
* [ ] Dates before habit creation are rejected.
* [ ] Users cannot modify another user's habits/check-ins.
* [ ] Current streak is calculated on the server.
* [ ] Longest streak is calculated on the server.
* [ ] Backfills correctly update streaks.
* [ ] The frontend never determines whether a streak is alive.
* [ ] History is displayed using local calendar dates.
* [ ] UTC instants are retained for auditability.
* [ ] Timezone logic is covered by automated tests.
* [ ] Secrets are supplied through environment variables.
* [ ] README/setup instructions are complete.

## Summary

The key invariant is simple:

> **One habit can have at most one check-in for each local calendar date in the user's timezone.**

Everything else follows from that invariant.

Store the actual check-in instant in UTC for reliable auditing, store the local calendar date for streak semantics, enforce uniqueness at the database level, and calculate all streaks on the server.

That design makes the habit tracker correct across timezone boundaries, short/long elapsed intervals, backfills, and daylight-saving transitions.

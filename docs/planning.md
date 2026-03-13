# harufit — Product Planning Document

> Living specification for the harufit daily health management web app.
> Last updated: 2026-03-13

---

## 1. Overview

**harufit** is a mobile-first daily health management web app that lets users:

- Track workout routines (template-based check-off)
- Log daily meals by category
- Review past activity via a calendar/list history view
- (Phase 2) Receive AI-generated feedback on diet and workout via Claude API

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, `src/` directory) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| AI | Anthropic Claude API |
| Deployment | Vercel |

---

## 2. Phase Split

| Phase | Scope |
|-------|-------|
| **Phase 1 — MVP** | Email/password auth, Workout Routine CRUD + daily check-off + completion log, Diet Log (4 meal categories), History (calendar/list toggle + day detail view) |
| **Phase 2** | AI Comment generation via Claude API (diet + workout combined feedback, one per day limit) |

Phase 2 work begins only after Phase 1 is fully functional and deployed.

---

## 3. Page / Route Structure

```
/                          → redirect → /dashboard
/login                     → Login page
/signup                    → Sign-up page

/dashboard                 → Today's overview (routine check-off + diet summary)
/routine                   → Routine template list
/routine/new               → Create new routine template
/routine/[id]              → View / edit routine template
/diet                      → Today's diet log (4 meal categories)
/history                   → Calendar / list history view
/history/[date]            → Day detail (workout log + diet log + AI comment slot)

/api/ai-comment            → POST — generate AI comment (Phase 2, server-side only)
```

All routes under `/dashboard`, `/routine`, `/diet`, `/history` require authentication.
Unauthenticated requests are redirected to `/login` by `src/middleware.ts`.

---

## 4. Feature Specifications

### 4.1 Auth (`/login`, `/signup`)

**What's shown:**
- Email + password form
- Toggle link between login and sign-up

**Actions:**
- `signUp(email, password)` → Supabase Auth → creates `profiles` row via trigger
- `signInWithPassword(email, password)` → Supabase Auth → sets session cookie
- `signOut()` → clears session, redirects to `/login`

**Data sources:** Supabase Auth only (no custom tables queried on these pages)

---

### 4.2 Dashboard (`/dashboard`)

**What's shown:**
- Today's active routine with exercise checklist
- Diet summary for today (how many meals logged)
- Quick-add button for diet

**Actions:**
- Check/uncheck individual exercises → updates local state
- "Complete Routine" button → inserts row into `routine_logs`
- Navigate to `/diet` or `/routine`

**Data sources:**
- `routines` + `routine_exercises` — active routine template
- `routine_logs` — whether today's routine is already completed
- `diet_logs` — count of today's meals

---

### 4.3 Workout Routine (`/routine`, `/routine/new`, `/routine/[id]`)

**`/routine` — Template List**

- Lists all routine templates belonging to the user
- Each card shows routine name + exercise count
- "New Routine" button → `/routine/new`
- Tap card → `/routine/[id]`

**`/routine/new` — Create Template**

- Form: routine name + ordered list of exercises (name, sets, reps/duration)
- "Add Exercise" adds a row; rows can be reordered or deleted
- Save → inserts into `routines` + `routine_exercises`

**`/routine/[id]` — View / Edit Template**

- Displays routine name and exercise list
- Edit mode: same form as creation
- Delete routine → removes template (cascade deletes `routine_exercises`)
- "Set as Active" → marks this routine as the one shown on dashboard

**Actions summary:**
- Create, read, update, delete routine templates
- Set active routine

**Data sources:** `routines`, `routine_exercises`

---

### 4.4 Diet Log (`/diet`)

**What's shown:**
- Four sections: Breakfast, Lunch, Dinner, Snack
- Each section lists logged items for today
- Input field per section to add a meal item

**Actions:**
- Add meal item → inserts row into `diet_logs` with `meal_category` + `content` + today's date
- Delete meal item → removes row

**Data sources:** `diet_logs` filtered by `user_id` + today's date

---

### 4.5 History (`/history`, `/history/[date]`)

**`/history` — Calendar / List View**

- Toggle between **calendar** view and **list** view
- Calendar: month grid, days with activity are visually marked
- List: chronological list of days with a brief summary (routine completed ✓, meal count)
- Tap a day → `/history/[date]`

**`/history/[date]` — Day Detail**

- Shows: routine completed (name + exercises), diet entries by category, AI comment (Phase 2 slot — placeholder in Phase 1)
- Read-only view

**Data sources:**
- `routine_logs` joined with `routines` + `routine_exercises`
- `diet_logs` filtered by date
- `ai_comments` filtered by date (Phase 2)

---

### 4.6 AI Comment — Phase 2 (`/api/ai-comment`)

**Trigger:** User taps "Get AI Feedback" button on `/history/[date]` or `/dashboard`

**Constraints:**
- One comment per user per day (enforced by unique constraint on `ai_comments(user_id, date)`)
- All Claude API calls happen server-side only — `ANTHROPIC_API_KEY` never sent to client

**Flow:**
1. Client POSTs to `/api/ai-comment` with `{ date }`
2. Route handler fetches that day's `diet_logs` + `routine_logs` from Supabase
3. Calls Claude API with a prompt combining diet + workout data
4. Inserts response into `ai_comments`
5. Returns comment to client

---

## 5. Database Schema

### Tables

```sql
-- Mirrors Supabase Auth users; created via trigger on auth.users insert
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz default now()
);

-- Workout routine templates
create table routines (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  is_active  boolean not null default false,
  created_at timestamptz default now()
);

-- Exercises belonging to a routine template
create table routine_exercises (
  id         uuid primary key default gen_random_uuid(),
  routine_id uuid not null references routines(id) on delete cascade,
  name       text not null,
  sets       int,
  reps       int,
  duration   text,          -- e.g. "30s", "1min" (alternative to sets/reps)
  sort_order int not null default 0
);

-- Daily routine completion records
create table routine_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  routine_id  uuid references routines(id) on delete set null,
  date        date not null,
  completed_exercises jsonb,  -- snapshot of checked exercises at completion time
  created_at  timestamptz default now(),
  unique(user_id, date)
);

-- Daily diet entries (one row per meal item)
create table diet_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  date          date not null,
  meal_category text not null check (meal_category in ('breakfast','lunch','dinner','snack')),
  content       text not null,
  created_at    timestamptz default now()
);

-- AI-generated daily feedback (one per user per day)
create table ai_comments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  date       date not null,
  comment    text not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);
```

### Row Level Security (RLS)

Enable RLS on all tables. Each table should have a policy allowing users to `SELECT`, `INSERT`, `UPDATE`, `DELETE` only rows where `user_id = auth.uid()`.

Example policy pattern:
```sql
alter table diet_logs enable row level security;

create policy "Users can manage their own diet logs"
  on diet_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

Apply equivalent policies to `routines`, `routine_exercises` (via routine ownership), `routine_logs`, and `ai_comments`.

---

## 6. User Flows

### 6.1 Sign Up

1. User visits `/signup`
2. Enters email + password → submits form
3. Supabase Auth creates user → trigger inserts row into `profiles`
4. Redirect to `/dashboard`

### 6.2 Log In

1. User visits `/login`
2. Enters email + password → submits form
3. Supabase sets session cookie
4. Redirect to `/dashboard`

### 6.3 Create Routine Template

1. From `/routine`, tap "New Routine"
2. Enter routine name
3. Add exercises (name, sets, reps or duration)
4. Reorder or delete exercises as needed
5. Tap "Save" → inserts `routines` + `routine_exercises` rows
6. Redirect to `/routine/[id]`

### 6.4 Log Routine Completion (Daily Check-off)

1. Dashboard shows today's active routine with exercise checklist
2. User checks off completed exercises
3. Taps "Complete Routine"
4. App inserts row into `routine_logs` with date + snapshot of checked exercises
5. Dashboard updates to show routine as completed

### 6.5 Log Meals

1. User navigates to `/diet`
2. Taps the input for a meal category (e.g., Breakfast)
3. Types meal description → taps "Add"
4. Row inserted into `diet_logs` with `meal_category`, `content`, today's date
5. Item appears in the category list immediately

### 6.6 View History

1. User navigates to `/history`
2. Default view: calendar with marked days
3. Toggle to list view if preferred
4. Taps a date → navigates to `/history/[date]`
5. Day detail shows routine log (exercises checked), diet entries by category, AI comment slot

### 6.7 Generate AI Comment (Phase 2)

1. On `/history/[date]` or `/dashboard`, user taps "Get AI Feedback"
2. Button is disabled if comment already exists for that day
3. Client POSTs to `/api/ai-comment` with `{ date }`
4. Server fetches diet + routine data, calls Claude API, saves result
5. Comment is displayed in the AI slot on the page

---

## 7. Component Breakdown

### Layout & Shell

| Component | Path | Notes |
|-----------|------|-------|
| `RootLayout` | `src/app/layout.tsx` | Font, global styles |
| `AuthLayout` | `src/app/(auth)/layout.tsx` | Centered card layout |
| `DashboardLayout` | `src/app/(dashboard)/layout.tsx` | Bottom nav + header |
| `BottomNav` | `src/components/BottomNav.tsx` | Mobile nav: Dashboard, Routine, Diet, History |
| `Header` | `src/components/Header.tsx` | Page title + optional back button |

### Auth Components

| Component | Path |
|-----------|------|
| `LoginForm` | `src/components/auth/LoginForm.tsx` |
| `SignupForm` | `src/components/auth/SignupForm.tsx` |

### Routine Components

| Component | Path |
|-----------|------|
| `RoutineCard` | `src/components/routine/RoutineCard.tsx` |
| `RoutineForm` | `src/components/routine/RoutineForm.tsx` |
| `ExerciseItem` | `src/components/routine/ExerciseItem.tsx` |
| `ExerciseChecklist` | `src/components/routine/ExerciseChecklist.tsx` |

### Diet Components

| Component | Path |
|-----------|------|
| `MealSection` | `src/components/diet/MealSection.tsx` |
| `MealItem` | `src/components/diet/MealItem.tsx` |
| `MealInput` | `src/components/diet/MealInput.tsx` |

### History Components

| Component | Path |
|-----------|------|
| `CalendarView` | `src/components/history/CalendarView.tsx` |
| `ListView` | `src/components/history/ListView.tsx` |
| `DayDetail` | `src/components/history/DayDetail.tsx` |
| `AiCommentSlot` | `src/components/history/AiCommentSlot.tsx` |

### UI Primitives

| Component | Path |
|-----------|------|
| `Button` | `src/components/ui/Button.tsx` |
| `Input` | `src/components/ui/Input.tsx` |
| `Card` | `src/components/ui/Card.tsx` |

---

## 8. File / Directory Map

Intended `src/` structure after Phase 1 (Phase 2 additions noted):

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # → redirect to /dashboard
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── routine/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── diet/
│   │   │   └── page.tsx
│   │   └── history/
│   │       ├── page.tsx
│   │       └── [date]/
│   │           └── page.tsx
│   └── api/
│       └── ai-comment/
│           └── route.ts                  # Phase 2
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── routine/
│   │   ├── RoutineCard.tsx
│   │   ├── RoutineForm.tsx
│   │   ├── ExerciseItem.tsx
│   │   └── ExerciseChecklist.tsx
│   ├── diet/
│   │   ├── MealSection.tsx
│   │   ├── MealItem.tsx
│   │   └── MealInput.tsx
│   ├── history/
│   │   ├── CalendarView.tsx
│   │   ├── ListView.tsx
│   │   ├── DayDetail.tsx
│   │   └── AiCommentSlot.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── BottomNav.tsx
│   └── Header.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser client (Client Components)
│   │   ├── server.ts                     # Server client (Server Components, Route Handlers)
│   │   ├── middleware.ts                 # Middleware client only
│   │   ├── routines.ts                   # Supabase query helpers — routines
│   │   ├── diet.ts                       # Supabase query helpers — diet
│   │   ├── history.ts                    # Supabase query helpers — history
│   │   └── ai-comments.ts               # Phase 2
│   └── anthropic/
│       └── generateComment.ts           # Phase 2 — Claude API call
├── middleware.ts                         # Session refresh (do not remove)
└── types/
    ├── routine.ts
    ├── diet.ts
    └── history.ts
```

### Shared TypeScript Types (`src/types/`)

```ts
// routine.ts
export type Routine = {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  exercises?: RoutineExercise[]
}

export type RoutineExercise = {
  id: string
  routine_id: string
  name: string
  sets: number | null
  reps: number | null
  duration: string | null
  sort_order: number
}

export type RoutineLog = {
  id: string
  user_id: string
  routine_id: string | null
  date: string
  completed_exercises: CompletedExercise[] | null
  created_at: string
}

export type CompletedExercise = {
  name: string
  checked: boolean
}

// diet.ts
export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type DietLog = {
  id: string
  user_id: string
  date: string
  meal_category: MealCategory
  content: string
  created_at: string
}

// history.ts
export type DaySummary = {
  date: string
  routineCompleted: boolean
  mealCount: number
  hasAiComment: boolean
}

export type DayDetail = {
  date: string
  routineLog: RoutineLog | null
  dietLogs: DietLog[]
  aiComment: string | null  // Phase 2
}
```

# EduTech Frontend (Client)

React + Tailwind CSS frontend for the EduTech course listing experience.

## Features

- **Hero stats (dynamic)**: shows Total Courses, Instructors, Students, Avg Rating by calling a single endpoint: `GET /api/courses/stats`.
- **Course listing**: responsive card grid with category glow styles and level badges.
- **Filtering + search**:
  - Search by course name / instructor / category
  - Filter by Category, Instructor, Level
  - Sort (Default, Rating high/low, Name A–Z / Z–A)
- **Pagination**: **8 courses per page** (`PER_PAGE = 8`).
- **Skeleton loading on initial load**: shows skeleton cards until the first API request finishes (prevents “No courses found” flash).
- **Instructor dropdown (scrollable)**:
  - Max height dropdown with **thin scrollbar** (theme matched)
  - Smooth scrolling for long instructor lists
- **Smooth scroll navigation**: both “Explore Courses” buttons (Navbar + Hero) scroll to the “All Courses” section.

## Tech Stack

- **React** (Create React App)
- **Tailwind CSS**
- Fetch API for HTTP requests

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Backend running (default expected at `http://localhost:8080`)

### Install & Run

```bash
cd client
npm install
npm start
```

Frontend will run at `http://localhost:3000` by default.

## API Endpoints Used

- **Courses list**: `GET http://localhost:8080/api/courses`
  - Query params used: `page`, `limit`, `category`, `instructor`, `level`, `search`, `sortBy`, `order`
- **Stats**: `GET http://localhost:8080/api/courses/stats`

## Project Structure (Frontend)

- `src/App.js`: page composition, filters state, fetching, pagination, skeleton/empty state logic, smooth scroll target (`courses-section`)
- `src/components/HeroSection.js`: hero UI + stats display + “Explore Courses” CTA
- `src/components/Navbar.js`: top nav + “Explore Courses” CTA
- `src/components/FilterBar.js`: search + filters (including scrollable instructor dropdown)
- `src/services/courseApi.js`: API calls (`fetchCourses`, `fetchCourseStats`)
- `src/constants/courseStyles.js`: Tailwind style maps + `PER_PAGE`
- `src/App.css`: animations + thin scrollbar styles (`.thin-scrollbar`)

## Notes / Configuration

- **API base URL** is currently set in `src/services/courseApi.js`:
  - `const API_BASE_URL = "http://localhost:8080";`
  - If you deploy, update this value (or convert to an environment variable).

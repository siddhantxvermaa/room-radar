# RoomRadar — Campus Empty Classroom & Student Helpdesk Hub

> **Full-Stack Development Final Practical Project (MERN Stack)**  
> **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Bcrypt  
> **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons  

---

## 📌 Problem Statement & Solution

**The Campus Struggle:**  
Whenever college students have a free lecture slot or an unscheduled gap between classes, they spend 15–30 minutes roaming around academic blocks looking for an empty classroom where they can sit, study, charge their laptop, or chill with teammates. Additionally, when students face issues (attendance shortage, backlog exam registration, bonafide requests, project approvals), they have no idea which professor or coordinator sits in which cabin or what documents to carry.

**The Solution — RoomRadar:**  
An interactive campus web application where students simply pick their current location (e.g., *Block B, 2nd Floor*) and the platform instantly ranks and displays the **nearest currently vacant classrooms** based on live weekly schedules and walking proximity. It also includes an **Official Faculty Cabin Directory** and a **Smart Issue Resolver Wizard** that guides students step-by-step to the exact cabin and designated authority for any grievance.

---

## 🚀 Key Features

### 1. Nearest Vacant Classroom Finder
- **Proximity Ranking Engine:** Ranks classrooms by walking proximity based on student's current Building and Floor (`Same floor (0 walking penalty) > Adjacent floor > Adjacent block`).
- **Live Vacancy Computation:** Compares current system day and time against each classroom's weekly master timetable.
- **Crowdsourced Status Check-in:** Students can mark a room as "Occupied" or "Empty" on the fly with a temporary override timer.
- **Minimalist Room Cards:** Highlights Room Number, Building, Floor, and Current Vacancy badge.

### 2. Faculty Cabin & Office Directory
- Searchable directory of professors, HODs, coordinators, and mentors.
- Lists exact cabin numbers, building, floor, official consultation/visiting hours, email, phone, and subjects taught.
- Filterable by academic department and building.

### 3. Student Helpdesk Wizard ("Where Should I Go?")
- Problem-to-person guidance for common college issues:
  - Attendance Shortage & Medical Exemption (Academic Coordinator)
  - Bonafide & Character Certificates (Student Welfare Cell)
  - Backlog Exam Registration & Hall Tickets (Controller of Examinations)
  - Summer Internship NOC & Project Guide Allocation (HOD & Coordinator)
  - Wi-Fi & College Portal Credentials Reset (IT Helpdesk)
  - Fee Installment & Scholarship Forms (Accounts Section)
- Displays exact office cabin, designated officer, visiting hours, step-by-step action plan, and checklist of documents to carry.

### 4. Admin & Class Representative (CR) Portal
- **JWT-Protected Dashboard:** Secure login for CRs and administrators.
- **Classroom & Timetable Management:** Add new rooms, edit weekly timetable slots (Day of week, Start time, End time, Course, Faculty), and remove rooms.
- **Faculty Directory Management:** Add and update faculty cabins and visiting hours.
- **One-Click Demo Data Seed:** Pre-populates the database with realistic campus data across 5 buildings for seamless practical exam evaluation.

---

## 🛠️ Project Structure

```
room-radar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & diagnostics
│   │   ├── models/
│   │   │   ├── Room.js               # Room & timetable schema + vacancy logic
│   │   │   ├── Faculty.js            # Faculty cabin schema
│   │   │   ├── IssueRule.js          # Student grievance routing schema
│   │   │   └── User.js               # Admin/CR user schema with bcrypt
│   │   ├── routes/
│   │   │   ├── roomRoutes.js         # /api/rooms & /api/rooms/nearest
│   │   │   ├── facultyRoutes.js      # /api/faculty
│   │   │   ├── issueRoutes.js        # /api/issues
│   │   │   ├── authRoutes.js         # /api/auth (JWT login & register)
│   │   │   └── seedRoutes.js         # /api/seed (instant demo dataset)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT token verification
│   │   ├── utils/
│   │   │   └── proximity.js          # Campus walking proximity algorithm
│   │   └── server.js                 # Express server & auto-seed bootstrapper
│   ├── .env                          # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navigation & demo seed button
│   │   │   ├── LocationSelector.jsx  # Building and floor picker
│   │   │   ├── RoomCard.jsx          # Vacant room card
│   │   │   ├── FacultyCard.jsx       # Faculty cabin card
│   │   │   └── IssueWizard.jsx       # Step-by-step problem solver
│   │   ├── pages/
│   │   │   ├── RoomFinderPage.jsx    # Live nearest room finder
│   │   │   ├── FacultyDirectoryPage.jsx # Searchable faculty directory
│   │   │   ├── HelpdeskPage.jsx      # Student issue resolver
│   │   │   └── AdminDashboardPage.jsx# Admin management portal
│   │   ├── services/
│   │   │   └── api.js                # Axios API client & interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── run-backend.bat                   # One-click Windows backend runner
├── run-frontend.bat                  # One-click Windows frontend runner
└── README.md
```

---

## ⚡ Quick Start Guide

### Step 1: Configure MongoDB Atlas
1. Open `backend/.env`
2. Update the `MONGO_URI` with your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/room_radar?retryWrites=true&w=majority
   JWT_SECRET=room_radar_super_secret_jwt_key_2026
   ```
   *(Note: You can also use a local MongoDB instance `mongodb://127.0.0.1:27017/room_radar` if installed).*

### Step 2: Start the Backend Server
In a terminal:
```bash
cd backend
npm.cmd run dev
```
*The server starts on `http://localhost:5000` and will automatically seed the initial campus dataset if the database is empty!*

### Step 3: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm.cmd run dev
```
*Open your browser at `http://localhost:3000` (or `http://localhost:5173`).*

---

## 🔑 Default Admin Credentials for Viva Evaluation

When demonstrating the Admin Portal to your examiner:
- **Email:** `admin@college.edu`
- **Password:** `admin123`
- **Role:** Administrator / CR

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & server status | Public |
| `GET` | `/api/rooms/nearest?building=Block+B&floor=2` | Nearest rooms ranked by proximity & vacancy | Public |
| `GET` | `/api/rooms` | All classrooms | Public |
| `POST` | `/api/rooms/:id/toggle-status` | Student crowdsourced status toggle | Public |
| `POST` | `/api/rooms` | Create new classroom | Private (Admin) |
| `PUT` | `/api/rooms/:id` | Update room or timetable slots | Private (Admin) |
| `DELETE` | `/api/rooms/:id` | Delete classroom | Private (Admin) |
| `GET` | `/api/faculty` | Get faculty list (with search, department filters) | Public |
| `POST` | `/api/faculty` | Add faculty cabin entry | Private (Admin) |
| `DELETE` | `/api/faculty/:id` | Remove faculty | Private (Admin) |
| `GET` | `/api/issues` | Get all student issue guides | Public |
| `POST` | `/api/issues` | Create guidance rule | Private (Admin) |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `POST` | `/api/seed` | Reset & re-seed realistic demo data | Public (Demo) |

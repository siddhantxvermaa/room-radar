# RoomRadar — Campus Empty Classroom & Student Helpdesk Hub
### Chandigarh University &bull; Apex Institute of Technology (AIT-CSE &bull; D-Blocks)

> **Full-Stack Development Final Practical Project (MERN Stack)**  
> **Backend:** Node.js, Express.js, Zero-Setup Embedded JSON DB + MongoDB Mongoose Ready, JWT, Bcrypt  
> **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Cyber-Dark UI  

---

## 📌 Problem Statement & Solution

**The Campus Struggle:**  
Whenever students in AIT-CSE (D-Blocks) have an empty gap in their schedule or a cancelled lecture, they wander around blocks D1, D2, D3, and D4 looking for a vacant classroom to study, work on laptops, or chill. Furthermore, when students face attendance shortages on CUIMS, need medical exemptions, want Mac lab permissions, or need capstone internship NOCs, they have no idea which cabin or coordinator to approach.

**The Solution — RoomRadar:**  
An interactive campus web app tailored for **Chandigarh University AIT-CSE D-Blocks**:
1. Students select their current block (`Block D1`, `Block D2`, `Block D3`, `Block D4`) and floor.
2. The platform instantly ranks and displays the **nearest currently vacant classrooms** based on live weekly schedules and walking proximity.
3. Includes an **Always-Visible Master Campus Clock** with live college period tracking (`Period 1`, `Period 2`, `Lunch Recess`, `Period 3`, `Period 4`).
4. Houses the **Official AIT-CSE Faculty Cabin Directory** and **Student Care Helpdesk Router**.

---

## 🚀 Key Features

* **Live Master Campus Clock ([`CampusLiveClock.jsx`](frontend/src/components/CampusLiveClock.jsx)):** Real-time ticking clock (`HH:mm:ss`), calendar date, active academic period indicator, and expandable college bell schedule.
* **Proximity Vacancy Engine ([`proximity.js`](backend/src/utils/proximity.js)):** Ranks classrooms by walking proximity across the D-Block quadrangle (`Same Floor > 1 Floor Up/Down > Adjacent D-Block`).
* **Zero-Setup Database ([`embeddedStore.js`](backend/src/config/embeddedStore.js)):** Automatically pre-loads all 16 AIT-CSE rooms, 8 faculty cabins, and 6 CUIMS guidance workflows into a local JSON database. No external database or cloud setup is required.
* **Admin / CR Dashboard ([`AdminDashboardPage.jsx`](frontend/src/pages/AdminDashboardPage.jsx)):** JWT-authenticated control center to manage rooms, timetable lecture slots, and faculty cabins. Default credentials: `admin@college.edu` / `admin123`.

---

## ⚡ Quick Start Guide (Local)

### 1. Run the Backend
Double-click `run-backend.bat` or run:
```powershell
cd backend
npm.cmd run dev
```
*Starts on `http://localhost:5000` with the embedded database active and auto-seeded.*

### 2. Run the Frontend
Double-click `run-frontend.bat` or run:
```powershell
cd frontend
npm.cmd run dev
```
*Opens on `http://localhost:3000`.*

---

## 🌐 How to Host This Live on the Internet

### Method 1: 100% Free Cloud Deployment on Render.com (Recommended)
You can deploy both frontend and backend together as a single unified service on Render for free:

1. **Push your code to GitHub:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/room-radar.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[Render.com](https://render.com)** and sign in with GitHub.
3. Click **New +** &rarr; **Web Service**.
4. Select your `room-radar` repository.
5. Set the following build settings:
   * **Name:** `roomradar-ait`
   * **Region:** Singapore or Frankfurt
   * **Branch:** `main`
   * **Runtime:** `Node`
   * **Build Command:** `npm run build`
   * **Start Command:** `npm run start`
6. Click **Deploy Web Service**.
7. In ~2 minutes, Render gives you a public HTTPS URL (e.g., `https://roomradar-ait.onrender.com`) that anyone can open from their phone or laptop!

---

### Method 2: Instant 15-Second Public Tunnel (Perfect for Viva Evaluation in Lab)
If you want to demo your running project directly on your phone or your examiner's tablet right now:

1. Start both backend and frontend locally.
2. In a new PowerShell window, run:
   ```powershell
   npx localtunnel --port 5000
   ```
3. It will output an instant live public link (e.g. `https://calm-puma-82.loca.lt`) that connects directly to your live app!

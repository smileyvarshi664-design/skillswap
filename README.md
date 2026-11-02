# SkillSwap – Student Skill Exchange Platform

SkillSwap is a complete, full-stack peer-to-peer skill exchange platform designed specifically for college and university students.

The platform allows students to **teach skills they already know** and **learn new skills from other students** without paying money.

---

## 🌟 Key Highlights & Demo Flow

- **Smart Mutual Skill Matching Algorithm:**
  - Identifies bidirectional matches: *Student A teaches Python & wants UI/UX; Student B teaches UI/UX & wants Python*.
  - Calculates match percentage scores and highlights mutual matches with priority.
- **Role-Based Authentication:**
  - Secure JWT authentication with bcryptjs password hashing.
  - Role separation between **Students** and **Platform Administrators**.
- **1-Click Demo Login Buttons:**
  - Quick buttons on the Login page for immediate testing by college evaluators and faculty without typing.
- **End-to-End Exchange Lifecycle:**
  - Send Request ➔ Accept / Reject / Cancel ➔ Active Exchange ➔ Mark Completed ➔ 1–5 Star Rating & Peer Review.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React.js (Vite), HTML5, CSS3, JavaScript, React Router DOM v6, Axios, Lucide React icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Design System** | Custom modern purple & blue palette (`#6366f1`, `#3b82f6`, `#f8fafc`), clean typography, glassmorphism, responsive cards, micro-animations |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port 27017 (`mongodb://127.0.0.1:27017/skillswap`)

### 1. Clone or Open Workspace
```bash
cd skillswap
```

### 2. Backend Setup
```bash
cd backend
npm install
# Ensure .env exists with your MongoDB URI:
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/skillswap
# JWT_SECRET=skillswap_super_secret_jwt_key_2026_mfef
# JWT_EXPIRE=7d

# Seed the database with demo students, skills, exchanges, and admin
npm run seed

# Start backend server (runs on http://localhost:5000)
npm start
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 👥 Pre-Configured Demo Accounts (Ready to Test)

The seed script (`npm run seed`) loads realistic demo accounts:

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Admin** | System Administrator | `admin@skillswap.edu` | `Admin@123` | Full Admin Dashboard access |
| **Student** | Aarav Sharma | `aarav@skillswap.edu` | `Student@123` | Teaches: Python, Web Dev \| Learns: UI/UX, Video |
| **Student** | Priya Patel | `priya@skillswap.edu` | `Student@123` | Teaches: UI/UX Design \| Learns: Python (Mutual match with Aarav!) |
| **Student** | Rahul Verma | `rahul@skillswap.edu` | `Student@123` | Teaches: Data Science \| Learns: Communication |
| **Student** | Ananya Iyer | `ananya@skillswap.edu` | `Student@123` | Teaches: Communication \| Learns: Data Science (5★ rated) |
| **Student** | Rohan Mehta | `rohan@skillswap.edu` | `Student@123` | Teaches: Video Editing, Photography \| Learns: Web Dev |
| **Student** | Sneha Kulkarni | `sneha@skillswap.edu` | `Student@123` | Teaches: Web Development \| Learns: Video Editing |

> **Tip:** On the **Sign In** page (`/login`), click any of the **1-Click Demo Account** buttons to instantly fill credentials.

---

## 📂 Project Architecture

```
skillswap/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── models/
│   │   ├── User.js               # Student & Admin profile schema
│   │   ├── Skill.js              # Skill listing schema (teach vs learn)
│   │   ├── ExchangeRequest.js    # Proposal schema with duplicate prevention
│   │   ├── Exchange.js           # Active & completed exchange records
│   │   └── Feedback.js           # 1-5 star peer rating & review schema
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, getMe
│   │   ├── userController.js     # Explore students, user profiles, update
│   │   ├── skillController.js    # Add/edit/delete teaching & learning skills
│   │   ├── requestController.js  # Smart mutual matching, send, accept, reject
│   │   ├── exchangeController.js # Ongoing exchanges, mark completed
│   │   ├── feedbackController.js # Rating & review submission
│   │   └── adminController.js    # Admin stats, student activation toggle
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── matchingRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── exchangeRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── seed.js                   # Demo data seeder
│   ├── test_api.js               # Automated full-stack integration test
│   ├── server.js                 # Express application entrypoint
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Public top navigation
│   │   │   ├── Sidebar.jsx           # Student dashboard sidebar
│   │   │   ├── DashboardLayout.jsx   # Dashboard shell & header
│   │   │   ├── StudentCard.jsx       # Student card with skills & actions
│   │   │   ├── UserProfileModal.jsx  # Detailed student profile & reviews modal
│   │   │   ├── RequestModal.jsx      # Exchange proposal modal
│   │   │   ├── SkillModal.jsx        # Add/edit skill modal
│   │   │   ├── FeedbackModal.jsx     # 5-star interactive rating modal
│   │   │   ├── ProtectedRoute.jsx    # Authentication & admin route guard
│   │   │   └── Toast.jsx             # Floating alerts container
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state & toast notifications
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Hero, How It Works, Categories, Benefits
│   │   │   ├── RegisterPage.jsx      # Full student registration
│   │   │   ├── LoginPage.jsx         # Sign in with quick demo buttons
│   │   │   ├── DashboardPage.jsx     # Welcome, metrics, mutual matches alert
│   │   │   ├── ProfilePage.jsx       # Edit details, avatar picker, reviews
│   │   │   ├── MySkillsPage.jsx      # Teach / Learn skills tabbed manager
│   │   │   ├── ExploreStudentsPage.jsx# Search & category filters
│   │   │   ├── SkillMatchingPage.jsx # Visual mutual match comparison
│   │   │   ├── ExchangeRequestsPage.jsx# Received & Sent requests tabs
│   │   │   ├── MyExchangesPage.jsx   # Active & completed exchanges tracker
│   │   │   └── AdminDashboardPage.jsx# System metrics, user toggle, audit logs
│   │   ├── index.css                 # Custom purple/blue design system
│   │   ├── App.jsx                   # React Router routing configuration
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register student account
- `POST /api/auth/login` — Login student or admin
- `GET /api/auth/me` — Fetch current user profile & stats

### Students & Profiles
- `GET /api/users` — Explore students with search (`?search=`), category (`?category=`), teachSkill (`?teachSkill=`), and learnSkill (`?learnSkill=`)
- `GET /api/users/:id` — View student profile, skills, and peer reviews
- `PUT /api/users/profile` — Update logged-in student profile

### Skills
- `POST /api/skills` — Add skill (type: `teach` or `learn`, category, proficiency level)
- `GET /api/skills/my` — Get logged-in user's teaching and learning skills
- `PUT /api/skills/:id` — Update skill
- `DELETE /api/skills/:id` — Delete skill
- `GET /api/skills/explore` — Skill categories and popular skills overview

### Smart Matching
- `GET /api/matches` — Intelligent bidirectional match algorithm prioritizing mutual matches

### Exchange Requests
- `POST /api/requests` — Send skill exchange proposal (prevents duplicate requests & self-requests)
- `GET /api/requests/received` — Incoming requests with sender info
- `GET /api/requests/sent` — Outgoing requests with receiver info
- `PUT /api/requests/:id/accept` — Accept request (creates active Exchange)
- `PUT /api/requests/:id/reject` — Reject proposal
- `PUT /api/requests/:id/cancel` — Cancel pending sent request

### Exchanges & Feedback
- `GET /api/exchanges` — List active and completed exchanges
- `PUT /api/exchanges/:id/complete` — Mark exchange as completed
- `POST /api/feedback` — Submit 1–5 star rating and comment (prevents duplicates)
- `GET /api/feedback/:userId` — Fetch peer reviews for a student

### Admin
- `GET /api/admin/dashboard` — Platform statistics (students, skills, requests, exchanges)
- `GET /api/admin/users` — List all registered users
- `PUT /api/admin/users/:id/status` — Deactivate or activate user account
- `GET /api/admin/requests` — Exchange request audit logs

---

## 🎓 Faculty Evaluation Demonstration Steps

1. **Visit Landing Page (`/`):**
   - View modern hero with vibrant purple/blue palette, value propositions, and How It Works steps.
2. **Explore Students (`/explore`):**
   - Search for "Python", filter by "Designing", open student profile modal to inspect verified skills and reviews.
3. **Sign In (`/login`):**
   - Click **"Aarav (Student)"** demo button to log in.
4. **Inspect Student Dashboard (`/dashboard`):**
   - View Aarav's metrics (2 Teaching Skills, 2 Learning Skills), the **"Mutual Skill Matches Found"** glowing banner, and recommended matches.
5. **View Mutual Skill Matches (`/matches`):**
   - Observe how the engine identifies that Aarav teaches Python and wants UI/UX, while Priya teaches UI/UX and wants Python (93% Mutual Match).
6. **Manage Skills (`/my-skills`):**
   - Switch between "Skills I Can Teach" and "Skills I Want to Learn". Add or edit skills with categories and proficiency levels.
7. **Exchange Lifecycle (`/requests` & `/exchanges`):**
   - Review incoming proposals, accept requests, mark active exchanges as completed, and leave an interactive 5-star rating with written feedback.
8. **Admin Control Center (`/admin`):**
   - Log out, sign in with **"Admin Panel"** demo credentials, and review platform metrics, category charts, and the student deactivation toggle.

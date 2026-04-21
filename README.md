<div align="center">

<h1>✦ TaskFlow</h1>
<p><strong>A modern, full-stack task management app — built with React & Firebase</strong></p>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-taskflow--santhosh.vercel.app-7c6ff7?style=for-the-badge&logo=vercel)](https://taskflow-santhosh.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Santhosh--L--source%2Ftaskflow-24292e?style=for-the-badge&logo=github)](https://github.com/Santhosh-L-source/taskflow)
[![Firebase](https://img.shields.io/badge/Database-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

![TaskFlow Dashboard](https://img.shields.io/badge/status-live%20%26%20working-4ade80?style=flat-square)

</div>

---

## 📸 Preview

| Login | Dashboard | Create Task |
|---|---|---|
| Dark glassmorphism login card | Stat cards + task list | Modal with priority & due date |

---

## ✨ Features

- 🔐 **Real Authentication** — Email/password signup & login via Firebase Auth
- 🗄️ **Live Database** — Tasks stored in Firestore, persisted across sessions
- ✅ **Full Task CRUD** — Create, edit, delete, and status-cycle tasks
- 🎨 **Priority Badges** — Low / Medium / High with colour-coded indicators
- 📊 **Progress Tracking** — Stats cards + live completion progress bar
- 🔍 **Filter by Status** — All / To Do / In Progress / Done tabs
- 🌙 **Dark Glassmorphism UI** — Premium animated design with floating orbs
- 📱 **Responsive** — Works on mobile and desktop
- ⚡ **Fast** — Vite-built, 94 kB gzipped

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Authentication | Firebase Authentication (Email/Password) |
| Database | Cloud Firestore (NoSQL) |
| Hosting | Vercel |
| Font | Inter (Google Fonts) |

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/Santhosh-L-source/taskflow.git
cd taskflow/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. Enable **Authentication → Email/Password**
3. Create a **Firestore Database** (test mode)
4. Go to **Project Settings → Web app** → copy config

### 4. Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Firebase values:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
taskflow/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── firebase.js          # Firebase initialization
│   │   ├── App.jsx              # Router + route guards
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Full design system (CSS variables, animations)
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Firebase Auth state + helpers
│   │   ├── services/
│   │   │   └── taskService.js   # Firestore CRUD operations
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Sign in page
│   │   │   ├── Signup.jsx       # Register page (w/ password strength)
│   │   │   └── Dashboard.jsx    # Main app with stats & task list
│   │   └── components/
│   │       ├── Navbar.jsx       # Sticky nav with avatar & logout
│   │       ├── TaskCard.jsx     # Task card with status toggle
│   │       └── TaskModal.jsx    # Create / Edit task form
│   ├── vercel.json              # SPA routing config for Vercel
│   └── .env.example             # Environment variable template
└── .gitignore
```

---

## 🌐 Deployment

### Deploy to Vercel (recommended)

1. Fork this repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Set **Root Directory** to `frontend`
4. Add all 6 `VITE_FIREBASE_*` environment variables
5. Click **Deploy**
6. Add your Vercel domain to Firebase → **Authentication → Authorized domains**

---

## 📋 Firestore Security Rules (Production)

Replace the default test rules with these before going public:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 📄 License

MIT © [Santhosh L](https://github.com/Santhosh-L-source)

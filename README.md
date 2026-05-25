# 🚀 MERN Portfolio

A clean, modern personal portfolio built with the MERN stack (MongoDB, Express, React, Node.js). Features dark/light mode, smooth animations, a contact form that saves to MongoDB, and a projects API.

---

## 📁 Folder Structure

```
portfolio/
├── client/                     # React frontend (Create React App)
│   ├── public/
│   │   └── index.html          # HTML shell, Google Fonts link
│   └── src/
│       ├── App.js              # Root component — mounts all sections
│       ├── index.js            # ReactDOM entry — wraps ThemeProvider + Toaster
│       ├── index.css           # Global CSS variables (dark/light tokens), base styles
│       ├── context/
│       │   └── ThemeContext.js # Dark/light mode state + localStorage persistence
│       ├── hooks/
│       │   └── useFetch.js     # Generic data-fetching hook with cancel-on-unmount
│       ├── utils/
│       │   └── api.js          # Axios instance + named API call helpers
│       └── components/
│           ├── Navbar/         # Sticky nav, active-section highlight, mobile menu
│           ├── Hero/           # Landing section with animated blobs + CTAs
│           ├── About/          # Photo placeholder, bio, stats, resume download
│           ├── Skills/         # Grouped tech stack icon cards
│           ├── Projects/       # Fetches from API, loading spinner, project cards
│           ├── Contact/        # Validated form → POST /api/contact, toast feedback
│           └── Footer/         # Social links, back-to-top
│
├── server/                     # Express + MongoDB backend
│   ├── index.js                # App entry — middleware, routes, error handler, listen
│   ├── seed.js                 # One-time DB seeder with 4 sample projects
│   ├── .env.example            # Template for required env vars
│   ├── config/
│   │   └── db.js               # Mongoose connection helper
│   ├── models/
│   │   ├── Project.js          # Schema: title, description, techStack[], urls, timestamps
│   │   └── Message.js          # Schema: name, email, message, read flag, timestamps
│   └── routes/
│       ├── projects.js         # GET /api/projects, POST /api/projects
│       └── contact.js          # POST /api/contact (with express-validator)
│
├── package.json                # Root — concurrently dev script
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone & install

```bash
git clone https://github.com/yourusername/mern-portfolio.git
cd mern-portfolio
npm run install-all   # installs root + server + client deps
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database (optional but recommended)

```bash
cd server
node seed.js
```

This drops any existing projects and inserts 4 sample ones.

### 4. Run in development

From the **root** of the project:

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## 🌐 API Reference

All routes are prefixed with `/api`.

| Method | Endpoint        | Description                          | Body                                      |
|--------|-----------------|--------------------------------------|-------------------------------------------|
| GET    | `/api/projects` | Fetch all projects (newest first)    | —                                         |
| POST   | `/api/projects` | Add a new project                    | `{ title, description, techStack[], githubUrl?, liveUrl?, imageUrl? }` |
| POST   | `/api/contact`  | Submit a contact message             | `{ name, email, message }`                |
| GET    | `/api/health`   | Server health check                  | —                                         |

### Example: Add a project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My App",
    "description": "A cool thing I built",
    "techStack": ["React", "Node.js"],
    "githubUrl": "https://github.com/you/app",
    "liveUrl": "https://app.vercel.app"
  }'
```

---

## 🎨 Customisation Guide

| What to change            | Where                                                   |
|---------------------------|---------------------------------------------------------|
| Your name / tagline       | `client/src/components/Hero/Hero.js`                    |
| Your photo                | `client/src/components/About/About.js` — replace the `<div>` placeholder with `<img>` |
| Bio text & stats          | `client/src/components/About/About.js`                  |
| Social links              | `Hero.js` and `Footer/Footer.js`                        |
| Email address             | `Contact/Contact.js`                                    |
| Tech stack icons          | `Skills/Skills.js` — add/remove from the `SKILL_GROUPS` array |
| Colour palette            | `client/src/index.css` — edit the CSS custom properties in `:root` / `body.light` |
| Navbar logo initials      | `Navbar/Navbar.js` and `Footer/Footer.js`               |

---

## 🚀 Deployment

### Backend (Render / Railway / Fly.io)
1. Set the environment variables (`MONGO_URI`, `CLIENT_URL`, `PORT`) in your hosting dashboard.
2. Set build command: `cd server && npm install`
3. Set start command: `node server/index.js`

### Frontend (Vercel / Netlify)
1. Set **Root Directory** to `client`.
2. Add env var: `REACT_APP_API_URL=https://your-backend-url.com/api`
3. Deploy — Vercel auto-detects Create React App.

---

## 🛠 Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18, React Router v6   |
| Styling   | Custom CSS (CSS variables)  |
| HTTP      | Axios                       |
| Toasts    | react-hot-toast             |
| Backend   | Node.js, Express 4          |
| Database  | MongoDB, Mongoose           |
| Validation| express-validator           |
| Dev tools | nodemon, concurrently       |

---

## 📄 License

MIT — use it however you like.

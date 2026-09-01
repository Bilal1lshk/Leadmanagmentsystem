# Lead Management System

A full‑stack lead management application built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **MongoDB** (via Mongoose). It provides dashboards for leads, tasks, and follow‑ups, along with authentication via **next‑auth**.

---

## ✨ Features
- **Leads Dashboard** – view, create, edit, delete leads.
- **Tasks Dashboard** – manage tasks linked to leads.
- **Follow‑ups Dashboard** – schedule and track follow‑up actions, with real‑time status updates.
- **Authentication** – sign‑up, login, logout using JWT and NextAuth.
- **API Layer** – REST‑style routes under `app/api/` for leads, tasks, follow‑ups, and users.
- **Responsive UI** – built with Tailwind CSS and Shadcn components.
- **Data Seeding** – auto‑seeds demo data on first run.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Shadcn UI components
- **State Management**: Redux Toolkit
- **Database**: MongoDB (Mongoose 9)
- **Authentication**: NextAuth (credentials + JWT)
- **Server‑Side**: API routes in `app/api/*`
- **Deployment**: Vercel (or any Node host)

---

## 📦 Getting Started
### Prerequisites
- Node.js 20+ (recommended)
- npm, yarn, pnpm or bun
- MongoDB instance (local or Atlas) with connection string

### Installation
```bash
# Clone the repo
git clone <repo-url>
cd leadmanagmentsystem

# Install dependencies
npm install   # or yarn, pnpm, bun
```

### Environment Variables
Create a `.env.local` file in the project root:
```
MONGODB_URI=<your-mongodb-connection-string>
NEXTAUTH_SECRET=<random‑string>
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=<jwt-secret>
```

### Run the Development Server
```bash
npm run dev   # or yarn dev, pnpm dev, bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure (highlights)
- `app/api/` – API routes (Leads, Tasks, Follow‑ups, Users, Auth)
- `app/dashboard/` – UI pages for each entity (list, view, edit, create)
- `app/components/` – Reusable components (tables, forms, cards)
- `app/models/` – Mongoose schemas (`lead.ts`, `task.ts`, `followup.ts`, `user.ts`)
- `app/follow/page.tsx` – shortcut route redirecting to follow‑ups dashboard

---

## 🔧 Available Scripts
| Script | Description |
|--------|-------------|
| `dev` | Starts the Next.js development server |
| `build` | Compiles the app for production |
| `start` | Starts the production server |
| `lint` | Runs ESLint |

---

## 📚 API Overview
| Entity | Endpoints | Description |
|--------|-----------|-------------|
| **Leads** | `GET /api/dashboardapi/Leads/AllLead` – list leads<br>`POST /api/dashboardapi/Leads/CreateLead` – create lead<br>`PATCH /api/dashboardapi/Leads/UpdateStatus` – update lead status<br>`DELETE /api/dashboardapi/Leads/DeleteLead` – delete lead | CRUD for leads |
| **Tasks** | `GET /api/Task/AllTasks` – list tasks<br>`POST /api/Task/Createtask` – create task<br>`PATCH /api/Task/UpdateTask` – update task<br>`DELETE /api/Task/Deletetask` – delete task | Task management linked to leads |
| **Follow‑ups** | `GET /api/followups/All` – list follow‑ups (populated)<br>`GET /api/followups/Singlefollowup?id=...` – single follow‑up<br>`POST /api/followups/Create` – create follow‑up<br>`PATCH /api/followups/UpdateStatus` – update fields/status<br>`DELETE /api/followups/Delete` – delete follow‑up | Follow‑up scheduling and tracking |
| **Auth** | `POST /api/auth/signup` – register<br>`POST /api/auth/login` – login<br>`POST /api/auth/logout` – logout<br>`GET /api/auth/me` – current user | User authentication |

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Make your changes and ensure the TypeScript build passes:
   ```bash
   npx tsc --noEmit
   ```
4. Open a Pull Request describing your changes

---

## 📜 License
This project is licensed under the MIT License.

---

## 🙋‍♂️ Author
Created by **Bilal1lshk** – Lead Management System prototype.

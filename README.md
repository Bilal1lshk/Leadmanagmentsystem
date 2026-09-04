# Lead Management System

A full-stack lead management dashboard built with Next.js, TypeScript, Tailwind CSS, Redux Toolkit, and MongoDB.

## Features

- User signup, login, logout, and authenticated sessions
- Organization and workspace setup
- Lead creation, status updates, editing, and deletion
- Pipeline view for tracking lead progress
- Task creation, editing, and deletion
- Follow-up scheduling and status management
- Dashboard analytics, notifications, and search
- Responsive desktop and mobile dashboard layouts

## Tech Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Redux Toolkit and React Redux
- MongoDB with Mongoose
- NextAuth, JWT, and bcrypt-based authentication utilities
- Axios for client-side API requests
- Framer Motion and Lucide React for interface interactions

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database, either local or hosted with MongoDB Atlas

### Install

```bash
git clone <repository-url>
cd leadmanagmentsystem
npm install
```

### Configure environment variables

Create `.env.local` in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
```

Do not commit `.env.local` or any secret values.

### Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Public home page |
| `/login` | User login |
| `/signup` | User registration |
| `/setupworkspace` | Create or configure a workspace |
| `/dashboard` | Main dashboard |
| `/dashboard/leads` | Lead management |
| `/dashboard/pipeline` | Pipeline view |
| `/dashboard/followups` | Follow-up management |
| `/dashboard/task` | Task management |
| `/dashboard/analytics` | Dashboard analytics |
| `/dashboard/settings` | Workspace settings |

## API Areas

API route handlers are under `app/api/`:

- `app/api/auth/` - authentication and current-user endpoints
- `app/api/organization/` - workspace, member, and join-request endpoints
- `app/api/dashboardapi/Leads/` - lead operations
- `app/api/Task/` - task operations
- `app/api/followups/` - follow-up operations

## Project Structure

```text
app/
   api/           API route handlers
   components/    Shared UI and dashboard components
   dashboard/     Authenticated dashboard pages
   models/        Mongoose models
   redux/         Redux store and feature slices
   lib/           Authentication and utility helpers
public/          Static assets
```

## Validation

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Contributing

1. Create a feature branch.
2. Make focused changes consistent with the existing patterns.
3. Run lint and build checks.
4. Open a pull request with a summary and validation details.

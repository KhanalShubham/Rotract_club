# 🔗 Rotaract Club of Lamahi - MERN Setup Guide

## Project Structure

```
rotaract-lamahi-mern/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Login, Dashboard, ProjectsDashboard
│   │   ├── components/         # Navbar, RequireAuth
│   │   ├── services/           # API client
│   │   ├── utils/              # Auth helpers
│   │   ├── App.tsx             # Routes
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env                    # API_URL
│   └── README.md
│
└── server/                      # Express + MongoDB backend
    ├── src/
    │   ├── controllers/        # Auth, User, Project logic
    │   ├── models/            # User, Project schemas
    │   ├── routes/            # API endpoints
    │   ├── middleware/        # Auth JWT, RBAC
    │   ├── db/                # MongoDB connection
    │   ├── utils/             # Constants, Seeds
    │   ├── app.js             # Express app setup
    │   └── index.js           # Server entry
    ├── .env                   # DB, JWT, PORT
    ├── package.json
    └── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup (Terminal 1)

```bash
cd server
npm install
npm run seed:admin        # Create first SUPER_ADMIN user
npm run dev               # Start at http://localhost:5000
```

**Seed Admin Credentials:**
- Username: `superadmin`
- Password: `SuperAdmin@123`

### Frontend Setup (Terminal 2)

```bash
cd client
npm install
npm run dev               # Start at http://localhost:5173
```

### Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Login:** superadmin / SuperAdmin@123

---

## Key Features Implemented

### ✅ Authentication & Authorization
- JWT-based login (no public signup)
- Three roles: SUPER_ADMIN, ADMIN, MEMBER
- Role-based access control (RBAC) middleware
- Token stored in localStorage

### ✅ Project Management
- Create projects (pending → approval workflow)
- Admin approve/reject projects
- Bilingual content support (English/Nepali)
- Public and dashboard views
- Pagination-ready

### ✅ User Management (Admin)
- List all users
- Create new members/admins
- Activate/deactivate users
- No public signup (admin-only creation)

### ✅ Frontend Features
- Responsive React + Vite app
- TypeScript for type safety
- Protected routes with RequireAuth
- Navbar with user info & logout
- Clean, accessible UI
- Bilingual structure ready (i18n prep)

---

## API Endpoints

### Auth
```
POST   /api/auth/login                    # Login
```

### Users (Admin)
```
GET    /api/users                         # List users
POST   /api/users                         # Create user
PATCH  /api/users/:id/status             # Activate/deactivate
```

### Projects
```
GET    /api/projects                      # Public approved list
GET    /api/projects/:slug                # Public project details
GET    /api/projects/_dashboard/all       # Dashboard all projects
POST   /api/projects                      # Create project
PATCH  /api/projects/:id                  # Edit project
PATCH  /api/projects/:id/approve          # Approve (admin)
PATCH  /api/projects/:id/reject           # Reject (admin)
DELETE /api/projects/:id                  # Delete (admin)
```

---

## Database Models

### User
```javascript
{
  _id, fullName, username (unique), passwordHash,
  role (SUPER_ADMIN|ADMIN|MEMBER),
  isActive, timestamps
}
```

### Project
```javascript
{
  _id, slug (unique),
  title: { en, np },
  summary: { en, np },
  content: { en, np },
  year, category, coverImageUrl,
  status (PENDING|APPROVED|REJECTED),
  createdBy (User ref), approvedBy (User ref),
  approvedAt, timestamps
}
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rotaract_lamahi
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Next Steps (Future Features)

1. **Events & Registrations**
   - Event CRUD with approval workflow
   - EventRegistration with payment status
   - Capacity management

2. **Donations**
   - Donation form (public)
   - Payment gateway integration (eSewa/Khalti)
   - Donation verification (admin)

3. **Suggestions**
   - Public suggestion form
   - Admin review dashboard

4. **Blogs**
   - Bilingual blog posts
   - Draft/Approved workflow
   - Comments (optional)

5. **Payments Integration**
   - eSewa API integration
   - Khalti API integration
   - Payment verification webhooks

6. **Bilingual Support**
   - React-i18next setup
   - Nepali translations for UI
   - RTL support (future)

7. **Email Notifications**
   - SendGrid/SMTP integration
   - Approval notifications
   - Registration confirmations

8. **Deployment**
   - Frontend: Vercel/Netlify
   - Backend: Render/Railway
   - MongoDB: Atlas

---

## Development Notes

### Code Structure Best Practices
- Controllers: Business logic
- Routes: API endpoints with middleware
- Models: MongoDB schemas with indexes
- Middleware: Auth, RBAC, validation
- Services: Reusable utilities (email, payments)

### Security Checklist
✅ Passwords hashed with bcrypt
✅ JWT expiry set to 7 days
✅ RBAC middleware on all protected routes
✅ CORS configured for frontend origin
✅ No public signup (admin-only)
✅ Input validation on all POST/PATCH requests

### TypeScript in React
- All components fully typed
- Service functions return proper types
- API responses typed where needed

---

## Troubleshooting

### MongoDB Connection Error
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** Start MongoDB locally or use MongoDB Atlas
```bash
# Windows
mongod

# Or use MongoDB Atlas connection string in .env
```

### Port Already in Use
```
❌ EADDRINUSE: address already in use :::5000
```
**Fix:** Kill process or change PORT in .env

### CORS Error
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Check VITE_API_URL in frontend .env matches backend CORS origin

### JWT Expired
**Fix:** Token expires in 7 days. User must login again. Implement refresh token for longer sessions.

---

## Testing Login Flow

1. **Start both servers** (backend + frontend)
2. **Visit** http://localhost:5173
3. **Login with:**
   - Username: `superadmin`
   - Password: `SuperAdmin@123`
4. **Test creating projects:**
   - Go to /dashboard/projects
   - Fill form → Create
   - Approve as admin
   - View in public list (/api/projects)

---

## Useful Commands

```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev         # Start dev server
npm run seed:admin  # Create first admin user
npm start           # Production start

# Frontend
cd client
npm install         # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## File Organization Summary

**Backend** (27 files created)
- 3 models (User, Project, seeds)
- 3 controllers (Auth, User, Project)
- 3 routes
- 2 middleware
- Database connection & constants
- Main server files

**Frontend** (15 files created)
- 3 pages (Login, Dashboard, ProjectsDashboard)
- 2 components (Navbar, RequireAuth)
- API service & auth utilities
- Routing setup with TypeScript
- Base styling with CSS

---

## Ready to Deploy?

**Option A: Local Development**
- Running: Backend on 5000, Frontend on 5173
- Perfect for team development with Antigravity

**Option B: Cloud Deployment**
- Frontend: Vercel (recommended)
- Backend: Render or Railway
- Database: MongoDB Atlas (already cloud)

To prepare for deployment:
1. Update CORS origin in server/src/app.js
2. Use environment variables for all secrets
3. Run `npm run build` in frontend for production bundle
4. Set up MongoDB Atlas (free tier available)

---

**Status:** ✅ Full MERN stack ready to use
**Last Updated:** 2026-02-11

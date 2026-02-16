# Quick Commands for Antigravity

Copy-paste these commands to get running instantly.

## Start Backend

```bash
cd server
npm install
npm run seed:admin
npm run dev
```

Server: http://localhost:5000/api

## Start Frontend

```bash
cd client
npm install
npm run dev
```

App: http://localhost:5173

## Login Test

**Credentials (created by seed:admin):**
- Username: `superadmin`
- Password: `SuperAdmin@123`

## What's Included

✅ Complete MERN setup (MongoDB + Express + React + Node)
✅ JWT authentication + RBAC
✅ Project management with approval workflow
✅ User management (admin-only member creation)
✅ Bilingual content support (EN/NP ready)
✅ TypeScript in React
✅ Clean folder structure
✅ Error handling
✅ Responsive UI

## Next Features to Add

1. Event management
2. Event registrations with payments
3. Donation system (eSewa/Khalti)
4. Public suggestions form
5. Blog with approval workflow
6. Email notifications
7. i18n bilingual UI
8. Admin dashboard charts

## MongoDB Setup

**Local (default in .env):**
```
mongodb://127.0.0.1:27017/rotaract_lamahi
```

**MongoDB Atlas (cloud):**
1. Create free account: https://mongodb.com/atlas
2. Create database cluster
3. Get connection string
4. Replace MONGO_URI in server/.env

## Project Structure

```
server/src/
  ├── models/          (User, Project)
  ├── controllers/     (auth, users, projects)
  ├── routes/         (3 route files)
  ├── middleware/     (JWT auth, RBAC)
  ├── db/             (MongoDB connection)
  └── utils/          (constants, seeds)

client/src/
  ├── pages/          (Login, Dashboard, ProjectsDashboard)
  ├── components/     (Navbar, RequireAuth)
  ├── services/       (API client)
  ├── utils/          (auth helpers)
  └── App.tsx         (routing)
```

## API Test (after backend starts)

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"SuperAdmin@123"}'

# Get approved projects (public)
curl http://localhost:5000/api/projects

# Get dashboard projects (requires token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projects/_dashboard/all
```

## Production Checklist

- [ ] Change JWT_SECRET in server/.env
- [ ] Use MongoDB Atlas instead of localhost
- [ ] Set NODE_ENV=production
- [ ] Update CORS origin in server/src/app.js
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Render/Railway
- [ ] Test all workflows in production

---

**Questions?** Check SETUP_GUIDE.md for detailed info.

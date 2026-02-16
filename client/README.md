# Rotaract Club of Lamahi - Frontend

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Pages

- `/login` - Login page
- `/dashboard` - Dashboard home
- `/dashboard/projects` - Project management

## Features

- JWT-based authentication
- Role-based access control
- Bilingual UI support (EN/NP ready)
- Project creation and approval workflow
- Responsive design

## Build for Production

```bash
npm run build
```

Output: `dist/`

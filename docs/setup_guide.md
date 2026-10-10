# ToLet.com — Developer Setup & Architecture Guide

## Prerequisites
* **Node.js**: v18.17.0 or higher
* **npm**: v9 or higher
* **MongoDB**: Optional (The application features automatic zero-configuration in-memory fallback for immediate local testing if MongoDB daemon is not running)

---

## Environment Setup

### 1. Backend (`backend/.env`)
Copy `.env.example` to `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tolet_db
JWT_SECRET=tolet_bangladesh_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend (`frontend/.env.local`)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Starting the Project Locally

### 1. Start the Backend API
In a terminal window:
```bash
cd backend
npm run dev
```
The server will bind to `http://localhost:5000`. You can verify by visiting:
`http://localhost:5000/api/health`

### 2. Start the Frontend Next.js Server
In a second terminal window:
```bash
cd frontend
npm run dev
```
The application will bind to `http://localhost:3000`.

---

## Architecture Highlights
1. **Procedural Dhaka Architecture Art Engine (`frontend/src/lib/art.ts`)**:
   Generates authentic vector illustrations matching Dhaka city apartments (colonial arches, modern multi-storey balconies, lush rooftop gardens, and realistic interior living rooms) without external broken CDN images.
2. **Graceful Offline Data Sync**:
   Whether running with a connected MongoDB replica or in standalone prototype mode, the API controllers gracefully serve realistic Bangladesh rental listings without breaking.
3. **Admin Ink-Navy Layout System**:
   Admin dashboard adopts the `#14213D` ink-navy command palette and `#F5B83D` gold accents directly inspired by the original reference prototype styling.

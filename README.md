# ToLet.com — Bangladesh Rental Marketplace

A full-stack, production-oriented rental marketplace platform engineered for Bangladesh (Dhaka focused), faithfully preserving the layout, visual design tokens, and interactions of the prototype design.

---

## 🎨 Design Tokens & Aesthetics
The visual identity follows the custom design tokens:
* **Deep Forest Green**: `#123D32`
* **Primary Emerald**: `#176B52`
* **Interactive Green**: `#218363`
* **Soft Emerald**: `#E8F2EC`
* **Warm Ivory**: `#F7F5EF`
* **Primary Text**: `#202923`
* **Secondary Text**: `#626D65`
* **Border**: `#E2E7E1`
* **Muted Gold Accent**: `#D8B77A`
* **Admin Ink-Navy**: `#14213D` & **Admin Gold**: `#F5B83D`

Typography is powered by Google Fonts: **Inter** & **Noto Sans Bengali**.

---

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router) with TypeScript (Strict mode)
- **Styling**: Tailwind CSS & Design Token system matching the prototype CSS
- **Icons**: Lucide React
- **State & Query**: TanStack Query & React Context (`AppContext`)
- **Localization**: Bilingual support (Bangla `bn` as primary, English `en` as secondary) with Bengali digit formatting (`bn-BD`)

### Backend
- **Framework**: Node.js & Express.js with TypeScript
- **Database**: MongoDB with Mongoose (with automated in-memory fallback for offline development)
- **Validation**: Zod schema validation
- **Authentication**: JWT token in HTTP-only secure cookies with bcrypt password hashing
- **Security**: CORS origin whitelisting, centralized error handling, and role-based authorization

---

## 📁 Project Structure

```text
tolet-com/
├── reference/                # Original prototype HTML & assets (preserved unchanged)
│   └── ToLet.com.html
├── frontend/                 # Next.js App Router application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Recreated 12-section homepage
│   │   │   ├── properties/            # Listings filter & detail pages
│   │   │   ├── favorites/             # Wishlist / Saved homes
│   │   │   ├── compare/               # Sticky side-by-side comparison table
│   │   │   ├── wanted/                # Wanted property requests & posting
│   │   │   ├── login/                 # Role switcher auth
│   │   │   ├── register/              # BD phone validation & signup
│   │   │   ├── forgot-password/       # Password recovery flow
│   │   │   ├── otp-verify/            # 6-digit auto-advancing OTP
│   │   │   ├── reset-password/        # Password meter & reset
│   │   │   ├── dashboard/
│   │   │   │   ├── landlord/          # 6-Step property wizard & analytics
│   │   │   │   ├── tenant/            # Saved homes, inquiries, visits & profile
│   │   │   │   └── admin/             # Ink-navy moderation queue & user controls
│   │   │   └── (info)/                # pricing, help, faq, safety, contact, terms...
│   │   ├── components/       # Header, Footer, Cards, Shells
│   │   ├── context/          # AppContext (Language, favorites, comparison, user)
│   │   ├── lib/              # Procedural art generator, constants, mock data, API client
│   │   └── types/            # TypeScript strict definitions
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Environment variables, database connection, seed data
│   │   ├── middlewares/      # auth (JWT), validate (Zod), centralized errorHandler
│   │   ├── modules/          # auth, properties, wanted, inquiries, visits, admin, reports
│   │   ├── routes/           # Central API router
│   │   ├── utils/            # apiResponse, jwt
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server bootstrap
├── docs/                     # Setup guide and API documentation
│   ├── api_documentation.md
│   └── setup_guide.md
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Preview: `http://localhost:3000`

### 2. Backend (Express API)
```bash
cd backend
npm install
npm run dev
```
API Base URL: `http://localhost:5000`
Health Endpoint: `http://localhost:5000/api/health`

---

## 🔑 Demo Access & Roles

| Role | Username / Identifier | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Landlord** | `01711223344` or `landlord@tolet.com` | `password123` | `/dashboard/landlord` |
| **Tenant** | `01712345678` or `tenant@tolet.com` | `password123` | `/dashboard/tenant` |
| **Admin** | `admin@tolet.com` | `password123` | `/dashboard/admin` |

---

## 🇧🇩 Bangladesh Specific Features
- **Dhaka Prime Hubs**: Banasree, Mirpur, Uttara, Rampura, Mohammadpur, Bashundhara R/A.
- **Local Amenities & Rules**: Titas gas lines, 24h water, lift, generator backup, CCTV, prayer room/mosque nearby, bachelor vs family restrictions, advance month conventions.
- **Mobile Number Validation**: Strict `01[3-9]\d{8}` format.
- **BDT Currency**: Rendered with authentic Bengali numeral localization (`৳`, `toLocaleString('bn-BD')`).

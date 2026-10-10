# ToLet.com — REST API Documentation

The backend service is built using Node.js, Express, TypeScript, and MongoDB.

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/auth`)

### `POST /auth/register`
Creates a new tenant or landlord user account.
* **Body**:
  ```json
  {
    "name": "Md. Rafiqul Islam",
    "phone": "01711223344",
    "email": "rafiq@example.com",
    "password": "password123",
    "role": "landlord"
  }
  ```
* **Response (201)**: Returns user object and sets secure `token` cookie.

### `POST /auth/login`
Authenticates a user using their mobile number or email and password.
* **Body**:
  ```json
  {
    "identifier": "01711223344",
    "password": "password123",
    "role": "landlord"
  }
  ```
* **Response (200)**: Returns user profile and sets JWT cookie.

### `GET /auth/me`
Fetches the currently authenticated user's session profile.
* **Headers**: `Cookie: token=...` or `Authorization: Bearer <token>`
* **Response (200)**: Current user details and credit balance.

### `POST /auth/logout`
Clears the session cookie.

---

## 2. Properties (`/properties`)

### `GET /properties`
Fetches paginated listings with search and multi-filtering parameters.
* **Query Parameters**:
  - `loc`: `banasree`, `mirpur`, `uttara`, `rampura`, `mohammadpur`, `bashundhara`
  - `type`: `family`, `bachelor`, `sublet`, `room`, `studio`, `office`
  - `minRent`: minimum rent (BDT)
  - `maxRent`: maximum rent (BDT)
  - `beds`: bedroom count
  - `furn`: `furn`, `semi`, `unfurn`
  - `search`: search keywords
  - `feat`: `true` for featured
  - `sort`: `newest`, `rent_asc`, `rent_desc`, `views`
  - `page`: page number (default 1)
  - `limit`: results per page (default 20)
* **Response (200)**: Array of properties with metadata (`total`, `totalPages`, `page`).

### `GET /properties/:id`
Retrieves a single property listing and increments view counter.
* **Response (200)**: Full property details.

### `POST /properties` (Protected: Landlord & Admin)
Submits a new property listing for moderation.
* **Body**:
  ```json
  {
    "title": { "bn": "বনশ্রীতে ৩ বেডরুম ফ্ল্যাট", "en": "3-Bed Flat in Banasree" },
    "loc": "banasree",
    "sub": { "bn": "ব্লক-সি", "en": "Block C" },
    "type": "family",
    "rent": 28000,
    "adv": 2,
    "beds": 3,
    "baths": 3,
    "sqft": 1350,
    "furn": "semi",
    "avail": "2026-11-01",
    "floor": 4,
    "amen": ["lift", "gen", "gas", "sec", "balcony"],
    "cond": ["fam", "lease12", "utilsep"]
  }
  ```

### `PATCH /properties/:id/status` (Protected: Landlord & Admin)
Updates the listing status (`active`, `pending`, `rented`, `suspended`, `rejected`).

---

## 3. Wanted Properties (`/wanted`)

### `GET /wanted`
Lists active tenant wanted requests with optional location and type filtering.

### `POST /wanted` (Protected)
Submits a wanted flat requirement to the public board.

---

## 4. Inquiries & Visits (`/inquiries`, `/visits`)

### `POST /inquiries`
Sends an inquiry message directly to the landlord of a property.

### `GET /inquiries?propertyId=p1`
Retrieves inquiries for a specific property.

### `POST /visits`
Submits a physical property visit request with preferred date and time.

### `PATCH /visits/:id/status`
Updates visit request state (`requested`, `approved`, `declined`).

---

## 5. Admin Moderation (`/admin`)

* **Protected**: Requires user role `admin`.
* `GET /admin/stats`: KPI overview (total listings, pending queue, platform volume).
* `GET /admin/properties/pending`: Pending moderation queue.
* `POST /admin/properties/:id/moderate`: Action (`approve`, `reject`, `suspend`) with feedback reason.
* `GET /admin/reports`: User flags and scam reports.

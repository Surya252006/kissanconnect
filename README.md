# KisanConnect 🌾

> **Direct Farmer-to-Buyer Agricultural Marketplace**  
> *Built for transparency, fair pricing, and direct agricultural trade.*

---

## 📌 Problem Statement

In traditional agricultural supply chains, farmers often receive only a small fraction of the end-consumer price due to multiple intermediary markups, lack of price transparency, delayed settlements, and quality mismatches. Conversely, consumers and commercial buyers pay inflated prices without knowing produce origins or harvest freshness.

## 💡 Solution

**KisanConnect** is a full-stack MERN agricultural platform that connects farmers directly with retail consumers, bulk buyers, and wholesalers. It eliminates exploitative middlemen, guarantees transparent market price benchmarking, provides admin-governed produce verification, and automates atomic inventory control and logistics tracking.

---

## ✨ Key Features

1. **Role-Based Access Control (RBAC)**
   - Tailored interfaces and secure permissions for **FARMER**, **CONSUMER**, **RETAILER**, **WHOLESALER**, and **ADMIN**.
2. **Dynamic Agricultural Marketplace**
   - Live produce browsing with multi-parameter filtering (Category, Location, Price Range), real-time search, sorting, and pagination.
3. **Farmer Listing Management**
   - Easy produce onboarding with image uploads (Cloudinary support with graceful fallback), stock tracking, quality grading, and direct verification requests.
4. **Atomic Inventory & Orders Pipeline**
   - Race-condition-free stock reduction using MongoDB atomic operators (`$gte`, `$inc`), automated order total validation, and cancellation stock restoration.
5. **Logistics & Order Tracking**
   - End-to-end multi-step fulfillment tracking (`PENDING` → `CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED`) with synchronized logistics states (`PACKED`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`).
6. **Mandi Price Insights & Transparency**
   - Live comparison between local APMC/Mandi benchmark rates and KisanConnect direct farm prices with trend indicators (`UP`, `DOWN`, `STABLE`).
7. **Quality & Producer Verification**
   - Admin-governed verification workflow ensuring produce authentications and verified producer badges.
8. **Admin Operations & Analytics Dashboard**
   - Real-time MongoDB aggregation metrics for platform GMV, user demographics, inventory distribution, and recent marketplace transactions.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6, Axios
- **Backend:** Node.js, Express.js (ES Modules), Mongoose ODM
- **Database:** MongoDB Atlas (Aggregations, Compound Indexes, Atomic Transactions)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs password hashing
- **Media / Storage:** Cloudinary, Multer

---

## 📐 Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      React 18 + Vite                        │
│   (Marketplace, Orders, Farmer Portal, Admin Dashboard)     │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API / JWT Auth
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│  ├── Auth Middleware (JWT Verification)                     │
│  ├── Role Authorization (RBAC: Admin / Farmer / Buyer)      │
│  ├── Controllers (Atomic Stock, Aggregations, Verification) │
│  └── Centralized Error & 404 Handlers                       │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│      MongoDB Atlas          │ │     Cloudinary CDN          │
│  ├── Users                  │ │  Produce & Quality Images   │
│  ├── Products               │ └─────────────────────────────┘
│  ├── Orders                 │
│  ├── PriceInsights          │
│  └── Verifications          │
└─────────────────────────────┘
```

---

## 👥 User Roles & Permissions

| Role | Browse Produce | Create Product | Place Orders | Manage Customer Orders | Verifications | Analytics Dashboard |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **GUEST** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CONSUMER / BUYER** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **FARMER** | ✅ | ✅ | ❌ | ✅ | Request | ❌ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | Approve/Reject | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Surya252006/kissanconnect.git
   cd kissanconnect
   ```

2. **Install Root Dependencies:**
   ```bash
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   npm --prefix client install
   ```

4. **Install Server Dependencies:**
   ```bash
   npm --prefix server install
   ```

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kissanconnect?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Running Locally

You can run both client and server concurrently:
```bash
npm run dev
```

Or start them in separate terminal windows:
```bash
# Terminal 1: Backend Express API
npm --prefix server run dev

# Terminal 2: Frontend Vite App
npm --prefix client run dev
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user (`FARMER`, `CONSUMER`, `RETAILER`, `WHOLESALER`, `ADMIN`)
- `POST /api/auth/login` — Authenticate and receive JWT token

### Products (`/api/products`)
- `GET /api/products` — Filtered & paginated produce marketplace
- `GET /api/products/:id` — Single produce details with farmer information
- `GET /api/products/my` — Farmer's listed produce *(Farmer only)*
- `POST /api/products` — Create new produce listing *(Farmer only)*
- `PUT /api/products/:id` — Update produce details & inventory *(Owner only)*
- `DELETE /api/products/:id` — Remove produce listing *(Owner only)*

### Orders (`/api/orders`)
- `POST /api/orders` — Place order with atomic inventory deduction *(Buyer only)*
- `GET /api/orders/my` — Buyer order history *(Buyer only)*
- `GET /api/orders/farmer` — Farmer customer order queue *(Farmer only)*
- `GET /api/orders/:id` — Detailed order tracking & logistics view
- `PUT /api/orders/:id/status` — Update order fulfillment state *(Farmer only)*
- `PUT /api/orders/:id/logistics` — Update transit status *(Farmer only)*
- `PUT /api/orders/:id/cancel` — Cancel order & restore inventory *(Buyer/Owner only)*

### Price Insights (`/api/price-insights`)
- `GET /api/price-insights` — List Mandi benchmark prices and trends
- `POST /api/price-insights` — Create price benchmark *(Admin only)*
- `PUT /api/price-insights/:id` — Update price benchmark *(Admin only)*
- `DELETE /api/price-insights/:id` — Remove price benchmark *(Admin only)*

### Verifications (`/api/verifications`)
- `POST /api/verifications` — Request produce/farmer verification *(Authenticated users)*
- `GET /api/verifications` — View verification queue *(Admin only)*
- `PUT /api/verifications/:id/approve` — Approve verification request *(Admin only)*
- `PUT /api/verifications/:id/reject` — Reject verification request *(Admin only)*

### Analytics (`/api/analytics`)
- `GET /api/analytics/overview` — Aggregated platform metrics and recent transactions *(Admin only)*

---

## 🎬 5-Minute Hackathon Demo Flow

1. **Direct Marketplace Browsing (Guest / Buyer)**
   - Open `/` to view fresh produce cards with category filters, Mandi price indicators, and verified badges.
2. **Farmer Produce Listing (Farmer Flow)**
   - Log in as Farmer (`farmer@example.com`), open `/farmer/products/add`, list produce (e.g. *Fresh Organic Tomatoes*, ₹40/kg, 100kg), and request verification.
3. **Admin Verification & Price Benchmarking (Admin Flow)**
   - Log in as Admin (`admin@example.com`), open `/admin/verifications` to review and approve the produce verification.
   - Open `/price-insights` to benchmark Mandi rate (₹48/kg) vs. KisanConnect (₹40/kg).
4. **Buyer Checkout & Atomic Stock Deduction (Buyer Flow)**
   - Log in as Buyer, select 20kg of Tomatoes, enter delivery address, and place order.
   - Observe immediate atomic inventory decrease (100kg → 80kg).
5. **Logistics Fulfillment & Tracking (Farmer & Buyer Sync)**
   - Farmer updates order state: `PENDING` → `CONFIRMED` → `IN_TRANSIT` → `DELIVERED`.
   - Buyer tracks step-by-step progress visually on `/my-orders`.
6. **Platform Overview (Admin Analytics)**
   - Admin opens `/admin/dashboard` to view real-time GMV, active farmers, fulfillment distributions, and transaction ledger.

---

## 🔮 Future Scope

- **Agmarknet Mandi API Integration:** Automated daily syncing with official Indian Mandi price feeds.
- **WebSocket Push Notifications:** Real-time SMS and in-app alerts on order placement and logistics updates.
- **Multilingual Support:** Regional voice-assisted navigation in Hindi, Tamil, Telugu, and Kannada.
- **Integrated Cold-Chain Logistics Partners:** Direct API hooks with regional rural delivery logistics providers.

---

## 📄 License
This project is licensed under the MIT License.
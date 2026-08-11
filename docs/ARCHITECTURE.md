# KisanConnect — System Architecture & Technical Specifications

This document outlines the technical architecture, data models, state flows, security mechanisms, and design decisions of the KisanConnect platform.

---

## 1. High-Level Architecture Overview

KisanConnect is architected as a decoupled, monolithic RESTful MERN application with a React SPA frontend and an Express.js API backend running on Node.js, backed by MongoDB Atlas.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│               React 18 + Vite + Tailwind CSS                │
│  - SPA Routing (React Router v6)                            │
│  - Role-Based Protected Routes                              │
│  - Centralized Axios Interceptors & AuthContext             │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / Bearer JWT
┌──────────────────────────────▼──────────────────────────────┐
│                    API Gateway & Middleware                 │
│  - CORS Policy (Configured Origin)                          │
│  - Request Body JSON Parser                                 │
│  - JWT Verification Middleware (`protect`)                  │
│  - RBAC Authorization Middleware (`authorizeRoles`)         │
│  - Multer File Upload & Cloudinary Stream Pipe              │
│  - 404 & Centralized Error Handler                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Controllers & Business Logic              │
│  - Auth Controller (Registration, Login, Bcrypt Hashing)    │
│  - Product Controller (Listing, Filtering, Pagination)      │
│  - Order Controller (Atomic Inventory & Logistics Sync)     │
│  - Verification Controller (Product & User Auth Sync)       │
│  - Price Insights Controller (Mandi Benchmarking)           │
│  - Analytics Controller (MongoDB Aggregations & Metrics)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
┌──────────────────────────────▼──────────────────────────────┐
│                     Persistence Layer                       │
│                      MongoDB Atlas                          │
│  Collections:                                               │
│  ├── `users` (Roles, Profiles, Verification Status)         │
│  ├── `products` (Inventory, Prices, Quality, Verification)  │
│  ├── `orders` (Fulfillment Lifecycle, Logistics, Snapshots) │
│  ├── `priceinsights` (Mandi Comparisons, Trend Analytics)   │
│  └── `verifications` (Verification Audit Log)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization Pipeline (RBAC)

KisanConnect implements strict Role-Based Access Control (RBAC) enforced server-side.

### Supported Roles
1. `FARMER` — Producer of agricultural goods. Can list produce, edit/delete their own produce, view customer orders, and update fulfillment & logistics states.
2. `CONSUMER` / `BUYER` — Retail purchaser. Can browse marketplace, place orders, and track order logistics.
3. `RETAILER` / `WHOLESALER` — Commercial purchasers with bulk buying access.
4. `ADMIN` — Platform governance. Manages produce/farmer quality verifications, seeds and updates Mandi price benchmarks, and monitors platform-wide analytics and GMV.

### Auth Flow
```
User (Credentials) ──► POST /api/auth/login ──► Bcrypt Compare ──► Sign JWT (User ID + Role) ──► Return Token
Client Requests ──► Header `Authorization: Bearer <token>` ──► `protect` Middleware ──► req.user hydrated ──► `authorizeRoles`
```

---

## 3. Core Operational Pipelines

### A. Atomic Inventory & Order Placement Flow
To prevent race conditions and inventory overselling during high-volume marketplace transactions, orders use MongoDB atomic conditional updates:

```javascript
// 1. Atomically decrement stock only if available quantity >= requested quantity
const updatedProduct = await Product.findOneAndUpdate(
  { _id: productId, quantity: { $gte: requestedQuantity } },
  { $inc: { quantity: -requestedQuantity } },
  { new: true }
)

// 2. If updatedProduct is null -> Abort transaction, return 400 Insufficient Stock
// 3. If successful -> Create Order document with calculated totalAmount
```

### B. Order Cancellation & Stock Restoration
When an order is cancelled before shipping:
1. Validates that current status is `PENDING` or `CONFIRMED`.
2. Sets order status to `CANCELLED`.
3. Atomically restores produce quantity via `Product.findByIdAndUpdate(productId, { $inc: { quantity: orderItem.quantity } })`.

### C. Quality Verification Synchronization Flow
1. Farmer submits verification request for produce listing (`POST /api/verifications`).
2. Verification record created with `status: 'PENDING'`.
3. Admin reviews request on `/admin/verifications`.
4. Admin clicks **Approve**:
   - `Verification.status` becomes `VERIFIED`.
   - Linked `Product.isVerified` is atomically set to `true`.
   - Produce cards in Marketplace immediately display the `✓ Verified Produce` badge.

### D. Analytics & GMV Aggregation Pipeline
Admin analytics overview uses native MongoDB aggregation pipelines and `Promise.all` count queries without loading document collections into Node.js heap memory:

```javascript
// Total GMV Calculation (Excluding Cancelled Orders)
Order.aggregate([
  { $match: { status: { $ne: 'CANCELLED' } } },
  { $group: { _id: null, total: { $sum: '$totalAmount' } } }
])
```

---

## 4. Media & Image Optimization

- **Cloudinary Integration:** Images uploaded via `multipart/form-data` are processed through Multer and streamed to Cloudinary CDN storage.
- **Graceful Fallback:** If Cloudinary credentials are not configured in local development, local produce images in `client/public/products/` (`tomato.jpg`, `onion.jpg`, etc.) are served with automatic error fallback handlers (`onError` event hooks in React).

---

## 5. Security & Data Protection Measures

- **JWT Expiration & Verification:** All protected routes verify token integrity using secret-signed HS256 tokens.
- **Strict Parameter Whitelisting:** Critical fields such as `isVerified`, `status`, and `role` are strictly guarded against mass-assignment vulnerabilities.
- **Environment Isolation:** Zero credentials or secrets are committed or tracked in source control; `.env` is maintained in `.gitignore`.
- **Centralized Error Handling:** Database stack traces and operational errors are sanitized in production to prevent information disclosure.

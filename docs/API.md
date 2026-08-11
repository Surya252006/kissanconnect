# KisanConnect — REST API Specification

Base URL: `http://localhost:5000/api`

---

## 1. System Health

### `GET /api/health`
- **Access:** Public
- **Description:** Returns API and database connectivity status.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "KisanConnect API is running",
    "database": "connected"
  }
  ```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "Kumar Farmer",
    "email": "kumar@example.com",
    "password": "Password123!",
    "role": "FARMER",
    "phone": "9876543210",
    "location": "Pollachi, Tamil Nadu"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "65cb7a...",
        "name": "Kumar Farmer",
        "email": "kumar@example.com",
        "role": "FARMER",
        "isVerified": false
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "kumar@example.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "65cb7a...",
        "name": "Kumar Farmer",
        "email": "kumar@example.com",
        "role": "FARMER"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

---

## 3. Product Marketplace (`/api/products`)

### `GET /api/products`
- **Access:** Public
- **Query Parameters:** `search`, `category`, `location`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "products": [...],
      "pagination": {
        "page": 1,
        "limit": 12,
        "total": 24,
        "pages": 2
      }
    }
  }
  ```

### `GET /api/products/:id`
- **Access:** Public
- **Response `200 OK`:** Returns single produce object with populated farmer information.

### `GET /api/products/my`
- **Access:** Private (`FARMER` only)
- **Response `200 OK`:** Returns produce listings created by the authenticated farmer.

### `POST /api/products`
- **Access:** Private (`FARMER` only)
- **Body / Multipart Form:** `name`, `category`, `price`, `quantity`, `unit`, `location`, `description`, `qualityStatus`, `image`
- **Response `201 Created`:** Returns created produce document.

### `PUT /api/products/:id`
- **Access:** Private (`FARMER` owner only)
- **Response `200 OK`:** Returns updated produce document.

### `DELETE /api/products/:id`
- **Access:** Private (`FARMER` owner only)
- **Response `200 OK`:** Produces `{ "success": true, "message": "Product deleted successfully" }`.

---

## 4. Orders & Inventory (`/api/orders`)

### `POST /api/orders`
- **Access:** Private (`CONSUMER`, `RETAILER`, `WHOLESALER`, `ADMIN`)
- **Body:**
  ```json
  {
    "productId": "65cb7a...",
    "quantity": 10,
    "deliveryAddress": {
      "street": "12 MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }
  ```
- **Response `201 Created`:** Returns created order with calculated total and atomic stock deduction.

### `GET /api/orders/my`
- **Access:** Private (`CONSUMER` / Authenticated Buyer)
- **Response `200 OK`:** Returns buyer's order history.

### `GET /api/orders/farmer`
- **Access:** Private (`FARMER` only)
- **Response `200 OK`:** Returns orders placed for the farmer's produce.

### `PUT /api/orders/:id/status`
- **Access:** Private (`FARMER` owner only)
- **Body:** `{ "status": "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" }`
- **Response `200 OK`:** Returns updated order.

### `PUT /api/orders/:id/logistics`
- **Access:** Private (`FARMER` owner only)
- **Body:** `{ "logisticsStatus": "PACKED" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" }`
- **Response `200 OK`:** Returns updated order.

### `PUT /api/orders/:id/cancel`
- **Access:** Private (`BUYER` or `FARMER`)
- **Response `200 OK`:** Cancels order and atomically restores inventory stock.

---

## 5. Mandi Price Insights (`/api/price-insights`)

### `GET /api/price-insights`
- **Access:** Public / Authenticated
- **Query Parameters:** `search`, `category`, `location`
- **Response `200 OK`:** Returns list of price benchmarking insights.

### `POST /api/price-insights`
- **Access:** Private (`ADMIN` only)
- **Body:** `{ "productName": "Tomatoes", "category": "Vegetables", "marketPrice": 48, "platformPrice": 40, "unit": "kg", "location": "Coimbatore", "trend": "DOWN" }`
- **Response `201 Created`:** Returns created price insight.

### `PUT /api/price-insights/:id`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:** Returns updated price insight.

### `DELETE /api/price-insights/:id`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:** Deletes price insight.

---

## 6. Produce & Farmer Verification (`/api/verifications`)

### `POST /api/verifications`
- **Access:** Private (Authenticated User / Farmer)
- **Body:** `{ "type": "PRODUCT" | "USER", "productId": "...", "remarks": "GI Tag Verification" }`
- **Response `201 Created`:** Returns pending verification request.

### `GET /api/verifications`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:** Returns verification queue.

### `PUT /api/verifications/:id/approve`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:** Approves request and synchronizes `isVerified: true` on target entity.

### `PUT /api/verifications/:id/reject`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:** Rejects request and sets `isVerified: false` on target entity.

---

## 7. Analytics (`/api/analytics`)

### `GET /api/analytics/overview`
- **Access:** Private (`ADMIN` only)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 46,
      "totalFarmers": 21,
      "totalConsumers": 25,
      "totalProducts": 7,
      "verifiedProducts": 5,
      "totalOrders": 4,
      "pendingOrders": 1,
      "confirmedOrders": 1,
      "deliveredOrders": 2,
      "cancelledOrders": 0,
      "totalMarketplaceValue": 11600,
      "recentOrders": [...]
    }
  }
  ```

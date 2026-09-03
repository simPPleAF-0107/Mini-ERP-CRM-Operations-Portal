# 🏢 Mini ERP + CRM Operations Portal

A full-stack ERP/CRM system built for wholesale and distribution companies. Manage customers, products, inventory, and sales challans — all with role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## ✨ Features

- **Customer Management** — CRUD, follow-up notes, customer status tracking (Lead → Active → Inactive), customer types (Retail / Wholesale / Distributor)
- **Product Management** — CRUD, SKU tracking, low-stock alerts with configurable thresholds
- **Inventory Management** — Stock movements (IN/OUT), movement history log, negative stock prevention
- **Sales Challans** — Create/confirm/cancel delivery challans, product snapshots at confirmation, atomic stock deduction via database transactions
- **Dashboard** — Summary statistics, low-stock alerts, recent challans, upcoming follow-ups
- **Role-Based Access Control** — 4 roles (Admin, Sales, Warehouse, Accounts) with granular permissions
- **JWT Authentication** — Stateless auth with Bearer tokens

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Frontend** | React 19 + TypeScript + Vite |
| **UI Library** | Ant Design (antd) |
| **HTTP Client** | Axios (with auth interceptors) |
| **Validation** | Zod |
| **Containerization** | Docker + docker-compose |

---

## 📁 Project Structure

```
mini-erp-crm/
├── backend/
│   ├── src/
│   │   ├── config/           # Database, environment, constants
│   │   ├── middleware/        # auth, errorHandler, validate
│   │   ├── modules/
│   │   │   ├── auth/          # Login, JWT, RBAC
│   │   │   ├── customers/     # Customer CRUD + follow-up notes
│   │   │   ├── products/      # Product CRUD + low-stock
│   │   │   ├── inventory/     # Stock movements
│   │   │   ├── challans/      # Sales challan lifecycle
│   │   │   └── dashboard/     # Summary stats
│   │   ├── prisma/            # Schema + seed script
│   │   └── utils/             # Pagination, response helpers
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # ProtectedRoute
│   │   ├── contexts/          # AuthContext
│   │   ├── layouts/           # AdminLayout (sidebar + topbar)
│   │   ├── pages/             # All page components
│   │   ├── services/          # API service layer (Axios)
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── postman/                   # Postman collection
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **PostgreSQL** 14+ (or Docker)

### Option 1: Docker (Recommended) 🐳

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# The database is auto-migrated and seeded on first run
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### Option 2: Local Development

#### 1. Start PostgreSQL

Create a database named `mini_erp_crm`:

```sql
CREATE DATABASE mini_erp_crm;
```

#### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL if needed

npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### 3. Frontend Setup (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to the backend at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Create `backend/.env` (copy from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_erp_crm
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

---

## 👥 Seed Data & Test Credentials

The database is seeded with sample data for immediate testing:

### Users (4 Roles)

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | `admin@erp.com` | `admin123` |
| 🟢 Sales | `sales@erp.com` | `sales123` |
| 🟡 Warehouse | `warehouse@erp.com` | `warehouse123` |
| 🔵 Accounts | `accounts@erp.com` | `accounts123` |

### Sample Data

- **10 customers** with various types and statuses
- **15 products** across categories (Grains, Pulses, Oils, Spices, Beverages, Dairy, Protein)
- **3 challans** (1 Draft, 1 Confirmed, 1 Cancelled)
- **Follow-up notes** and **stock movements**

---

## 🔐 Role-Based Access Control

| Feature | Admin | Sales | Warehouse | Accounts |
|---------|:-----:|:-----:|:---------:|:--------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ❌ | ❌ |
| Products | ✅ | ✅ (view) | ✅ | ✅ (view) |
| Inventory | ✅ | ❌ | ✅ | ❌ |
| Challans | ✅ | ✅ | ❌ | ✅ (view) |

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Login → returns JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | All roles |

### Customers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/customers` | List customers (paginated, searchable, filterable) | Admin, Sales |
| `GET` | `/api/customers/:id` | Customer detail with follow-up notes | Admin, Sales |
| `POST` | `/api/customers` | Create customer | Admin, Sales |
| `PUT` | `/api/customers/:id` | Update customer | Admin, Sales |
| `POST` | `/api/customers/:id/notes` | Add follow-up note | Admin, Sales |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/products` | List products (paginated, searchable) | All roles |
| `GET` | `/api/products/low-stock` | Products below minimum stock threshold | Admin, Warehouse |
| `GET` | `/api/products/:id` | Product detail with stock movement history | All roles |
| `POST` | `/api/products` | Create product | Admin, Warehouse |
| `PUT` | `/api/products/:id` | Update product | Admin, Warehouse |

### Inventory

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/inventory/movements` | List stock movements (filterable by product) | Admin, Warehouse |
| `POST` | `/api/inventory/movements` | Record stock movement (IN/OUT) | Admin, Warehouse |

### Challans

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/challans` | List challans (paginated, filterable by status) | Admin, Sales, Accounts |
| `GET` | `/api/challans/:id` | Challan detail with line items | Admin, Sales, Accounts |
| `POST` | `/api/challans` | Create challan (Draft status) | Admin, Sales |
| `PUT` | `/api/challans/:id` | Update draft challan | Admin, Sales |
| `PATCH` | `/api/challans/:id/confirm` | Confirm challan → deducts stock atomically | Admin, Sales |
| `PATCH` | `/api/challans/:id/cancel` | Cancel challan | Admin, Sales |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/dashboard/stats` | Summary statistics and alerts | All roles |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/health` | Service health status | Public |

---

## 🔄 Business Logic

### Challan Confirmation Flow

```
Create Challan (DRAFT) → Confirm → Stock Deducted → CONFIRMED
                       → Cancel → CANCELLED (no stock change)
```

1. **Validation**: All items must have sufficient stock
2. **Insufficient stock**: Returns `400` with details of which items are short
3. **Atomic deduction**: Uses Prisma transactions to deduct stock for all items
4. **Stock movements**: Creates `OUT` movement records with challan reference
5. **Immutability**: Only `DRAFT` challans can be confirmed or edited

### Stock Movement Rules

- **IN** movements → increase `currentStock`
- **OUT** movements → decrease `currentStock`
- **Negative stock prevention** → enforced at the service layer
- **Full audit trail** → every movement logged with user, reason, and timestamp

### Product Snapshots

`ChallanItem` stores a **snapshot** of product data (name, SKU, category, unit price) at creation time. This ensures historical accuracy even if product details are later updated.

---

## 📮 Postman Collection

A complete Postman collection is included at `postman/Mini-ERP-CRM.postman_collection.json`.

### How to Use

1. Import the collection into [Postman](https://www.postman.com/)
2. Run the **Login** request first — the token is auto-saved to collection variables
3. All subsequent requests automatically include the `Authorization: Bearer {{token}}` header

---

## 🗄 Database Schema

```
User ─────────┐
              ├──→ FollowUpNote ←── Customer
              ├──→ StockMovement ←── Product
              └──→ Challan ──→ ChallanItem ←── Product
                      └──── Customer
```

### Enums

- **Role**: `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`
- **CustomerType**: `RETAIL`, `WHOLESALE`, `DISTRIBUTOR`
- **CustomerStatus**: `LEAD`, `ACTIVE`, `INACTIVE`
- **MovementType**: `IN`, `OUT`
- **ChallanStatus**: `DRAFT`, `CONFIRMED`, `CANCELLED`

---

## 📜 Scripts Reference

### Backend

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Compile TypeScript
npm start             # Run compiled JavaScript
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with test data
```

### Frontend

```bash
npm run dev           # Start Vite dev server (port 5173)
npm run build         # Type-check + production build
npm run preview       # Preview production build
```

---

## 📄 License

NOT FOR FREE USE.

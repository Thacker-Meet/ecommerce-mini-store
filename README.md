# Cartify - Your One-Stop Online Shopping Destination

A full-stack E-Commerce platform built as part of a structured internship roadmap.

## Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* Context API
* CSS (Vanilla)

### Backend

* Node.js
* Express.js

### Databases

* MongoDB Atlas (Products)
* MySQL (Users, Orders, Order Items)

### Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt (Password Hashing)
* Role-based Access Control (Admin / User)

---

# Features

## Product Management

* Product Listing
* Product Details
* Search Products
* Category Filtering
* Responsive Product Cards

## Shopping Cart

* Add to Cart from Product List & Detail pages
* Dynamic "Add to Cart" / "Go to Cart" button state
* Quantity increment / decrement
* Remove items from cart
* Cart persists using localStorage
* Cart item count badge in Navbar

## Checkout & Orders

* Checkout page with shipping information form
* Place Order API (MongoDB stock validation + MySQL order storage)
* Atomic stock decrement with rollback on failure
* Order Confirmation page with Order ID
* Order History page (user-specific)

## Authentication

* User Signup
* User Login
* Password Hashing (bcrypt)
* JWT Authentication
* Protected Routes
* Current User Endpoint (`/api/auth/me`)

## Admin Dashboard

* Admin role verification from database
* Admin middleware for backend route protection
* Admin Layout with sidebar navigation
* `/admin/products` — Product management view
* `/admin/orders` — All orders management view
* Admin-only Navbar link (visible only to admins)
* Non-admin users are blocked from admin routes

## User Experience

* Responsive Design
* Loading States
* Error Handling
* Show/Hide Password Toggle
* Persistent Login Session
* Logout Functionality
* User-friendly stock error messages

---

# Project Structure

```text
Cartify
│
├── frontend
│   └── src
│       ├── components
│       │   ├── AdminLayout.jsx
│       │   ├── AdminRoute.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── hooks
│       │   ├── useAuth.js
│       │   └── useCart.js
│       ├── pages
│       │   ├── AdminOrdersPage.jsx
│       │   ├── AdminProductsPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── OrderConfirmationPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── ProductListPage.jsx
│       │   └── SignupPage.jsx
│       ├── services
│       │   └── api.js
│       ├── styles
│       │   ├── admin.css
│       │   ├── auth.css
│       │   ├── cart.css
│       │   ├── global.css
│       │   ├── home.css
│       │   ├── navbar.css
│       │   ├── productCard.css
│       │   ├── productDetail.css
│       │   ├── productList.css
│       │   └── status.css
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend
│   └── src
│       ├── config
│       │   ├── mongo.js
│       │   └── mysql.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── orderController.js
│       │   └── productController.js
│       ├── data
│       │   └── products.js
│       ├── middleware
│       │   ├── adminMiddleware.js
│       │   ├── authMiddleware.js
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── models
│       │   └── productModel.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── orderRoutes.js
│       │   ├── pingRoutes.js
│       │   ├── productRoutes.js
│       │   └── protectedRoutes.js
│       ├── validators
│       │   └── productValidator.js
│       ├── seedProducts.js
│       ├── server.js
│       └── testOrders.js
│
└── screenshots
```

---

# API Endpoints

## Products

| Method | Endpoint | Access | Description |
|--------|---------------------|--------|-------------------------------|
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product by ID |
| POST | `/api/products` | Admin | Create a new product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |

## Authentication

| Method | Endpoint | Access | Description |
|--------|---------------------|---------|-------------------------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Private | Get current user profile |

## Orders

| Method | Endpoint | Access | Description |
|--------|--------------------------|---------|-------------------------------|
| POST | `/api/orders` | Private | Place a new order |
| GET | `/api/orders/my-orders` | Private | Get logged-in user's orders |
| GET | `/api/orders` | Admin | Get all orders (admin only) |

## Protected Routes

| Method | Endpoint | Access | Description |
|--------|------------------------------|---------|-------------------------------|
| GET | `/api/protected/dashboard` | Private | Test protected route access |

---

# Database Schema

## MongoDB (Products Collection)

| Field | Type | Required |
|-------------|---------|----------|
| name | String | Yes |
| slug | String | Yes |
| price | Number | Yes |
| category | String | Yes |
| images | [String] | No |
| stock | Number | Yes |
| description | String | Yes |

## MySQL (Users Table)

| Field | Type | Description |
|---------------|--------------|----------------------|
| id | INT (PK) | Auto-increment |
| name | VARCHAR | User's full name |
| email | VARCHAR | Unique email |
| password_hash | VARCHAR | bcrypt hashed password|
| role | VARCHAR | 'user' or 'admin' |
| created_at | TIMESTAMP | Account creation date |

## MySQL (Orders Table)

| Field | Type | Description |
|--------------|----------------|-------------------------------|
| id | INT (PK) | Auto-increment |
| user_id | INT (FK) | References users(id) |
| total_amount | DECIMAL(10,2) | Order total price |
| status | VARCHAR(50) | 'Pending', 'Completed', etc. |
| created_at | TIMESTAMP | Order placement date |

## MySQL (Order Items Table)

| Field | Type | Description |
|--------------|----------------|-------------------------------|
| id | INT (PK) | Auto-increment |
| order_id | INT (FK) | References orders(id) |
| product_id | VARCHAR(24) | MongoDB product ObjectId |
| product_name | VARCHAR(255) | Snapshot of product name |
| quantity | INT | Number of items ordered |
| price | DECIMAL(10,2) | Price per unit at order time |

---

# Completed Roadmap

## Week 1

* Backend Setup
* MongoDB Integration
* Product APIs
* Product Model
* Product CRUD Foundation

## Week 2

* React Setup
* Home Page
* Product List Page
* Product Detail Page
* Search
* Category Filters
* Responsive UI

## Week 3

* MySQL Setup
* Users Table
* JWT Authentication
* Signup API
* Login API
* Auth Middleware
* Protected Routes
* AuthContext
* Login Page
* Signup Page
* Orders Protected Page
* Form Validation
* Password Visibility Toggle
* Loading & Error States

## Week 4

* Cart Context & Cart Provider
* useCart Hook
* Add to Cart (Product List & Detail pages)
* Dynamic "Add to Cart" / "Go to Cart" button
* Cart persistence via localStorage
* Cart Page
* Checkout Page with shipping form
* Order Confirmation Page
* Orders History Page
* MySQL Orders & Order Items Tables
* POST /api/orders (stock validation + MySQL insert)
* GET /api/orders/my-orders
* Atomic MongoDB stock decrement with rollback
* Out-of-stock error handling
* Frontend checkout validation
* Admin role check via JWT
* Admin middleware (DB role verification)
* Admin Layout & Sidebar
* /admin/products management page
* /admin/orders management page
* Protected admin routes (frontend & backend)
* Admin-only Navbar links

---

# Installation

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=ecommerce
MYSQL_PORT=3306
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

---

# Author

Meet Thacker

Computer Science Engineering Student

Built as part of internship training and full-stack learning roadmap.

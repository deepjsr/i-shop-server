# 🛒 I-Shop Server (Backend API)

Backend server for the I-Shop Full Stack E-Commerce application.

Built using **Node.js**, **Express.js**, and **MongoDB**, this server provides RESTful APIs for user authentication, product management, and order handling.

---

## 🚀 Live API Documentation

Swagger Docs:  
👉 https://i-shop-server.onrender.com/api-docs/

---

## 🧠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Swagger (API Documentation)
- Render (Deployment)

---

## 📦 Features

- 🔐 User Registration & Login (JWT-based authentication)
- 🛍️ Product CRUD APIs
- 🛒 Cart & Order Management
- 🔒 Protected Routes (Auth Middleware)
- 📄 Swagger API Documentation
- 🌐 Production Deployment on Render

---

## 🛠️ API Endpoints Overview

### 🔐 Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user & receive JWT |

---

### 🛍️ Product Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (Protected) |
| PUT | /api/products/:id | Update product (Protected) |
| DELETE | /api/products/:id | Delete product (Protected) |

---

### 🛒 Order Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order (Protected) |
| GET | /api/orders | Get user orders (Protected) |

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Token must be sent in Authorization header:

## Authorization: Bearer <token>
4. Middleware verifies token before allowing protected access

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository


```
git clone https://github.com/deepjsr/i-shop-server.git

cd i-shop-server

```


### 2️⃣ Install Dependencies

npm install


### 3️⃣ Setup Environment Variables

Create a `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

```

### 4️⃣ Run Server

npm start


Server runs at:
http://localhost:5000


---

## 📁 Project Structure

i-shop-server/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── server.js
└── package.json


---

## 🎯 What This Project Demonstrates

- Backend API architecture design
- Middleware implementation
- Authentication & authorization handling
- RESTful route structuring
- Production deployment workflow
- API documentation using Swagger

---

## 👨‍💻 Author

**Deep Jyoti Sarma**  
Junior Full Stack Developer (React | Node.js)

Portfolio: https://deep-dev.in/  
GitHub: https://github.com/deepjsr

---


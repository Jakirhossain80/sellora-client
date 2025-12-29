# 🛒 Sellora – MERN Stack E-Commerce Platform

Sellora is a **full-stack MERN e-commerce application** built with modern tools and best practices.  
It supports user authentication, product browsing, cart & checkout, secure payments, and a powerful admin dashboard for managing the store.

---

## 📌 Project Overview

**Sellora** is designed as a scalable and production-ready e-commerce platform where:

- Users can browse products, manage their cart, and complete payments securely
- Admins can manage products, orders, and platform features
- The project follows a clean folder structure and separation of concerns
- The app is fully deployable on **Vercel** using the Vercel CLI

---

## ✨ Features

### 👤 User Features
- User registration & login (JWT authentication)
- Browse products with search & filters
- View product details
- Add/remove products from cart
- Manage delivery addresses
- Secure checkout with **Stripe**
- View order history
- Write product reviews

### 🛠️ Admin Features
- Admin authentication & protected routes
- Add, update, and delete products
- Upload product images (Cloudinary)
- Manage customer orders
- Manage featured sections
- View platform analytics (extendable)

---

## 🧰 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Redux Toolkit**
- **React Router**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT Authentication**

### Other Services
- **Stripe** – payments & webhooks
- **Cloudinary** – image storage
- **Vercel** – deployment

---

## 📂 Folder Structure

### Client (`client/`)


client/
├─ public/
├─ src/
│ ├─ assets/
│ ├─ components/
│ │ ├─ admin-view/
│ │ ├─ shopping-view/
│ │ ├─ common/
│ │ └─ ui/
│ ├─ config/
│ ├─ hooks/
│ ├─ pages/
│ │ ├─ admin-view/
│ │ ├─ auth/
│ │ ├─ shopping-view/
│ │ └─ unauth-page/
│ ├─ store/
│ │ ├─ admin/
│ │ ├─ auth/
│ │ ├─ shop/
│ │ └─ store.js
│ ├─ App.jsx
│ ├─ main.jsx
│ └─ index.css
├─ index.html
├─ package.json
└─ vite.config.js


server/
├─ api/
│ └─ index.js # Vercel serverless entry
├─ app.js # Express app configuration
├─ server.js # Local dev server
├─ controllers/
├─ routes/
│ ├─ admin/
│ ├─ auth/
│ ├─ shop/
│ └─ common/
├─ models/
├─ helpers/
├─ vercel.json
└─ package.json



---

## 🔐 Environment Variables

### Server (`server/.env.example`)
```env
NODE_ENV=production
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sellora

JWT_SECRET=your_jwt_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_********
STRIPE_WEBHOOK_SECRET=whsec_********



### Client (`client/.env.example`)
```env)

VITE_API_BASE_URL=http://localhost:5000


👨‍💻 Author & Credits

Md. Jakir Hossain
MERN Stack Web Developer

GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile

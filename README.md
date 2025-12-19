# 🚀 Collaborative Task Manager - Full Stack Project

> **Note:** Detailed documentation for individual components can be found in their respective folders:
> - 📂 [Frontend Documentation](./client/README.md)
> - 📂 [Backend Documentation](./server/README.md)

---

## 🌐 Live Deployment Links
| Component | Hosting Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [collaborative-task-manager-git-main-sharduljoshi2001s-projects.vercel.app](https://collaborative-task-manager-git-main-sharduljoshi2001s-projects.vercel.app/login) |
| **Backend API** | Render | [https://collaborative-task-manager-backend-888e.onrender.com](https://collaborative-task-manager-backend-888e.onrender.com) |

---

## 🔐 Test Credentials (Existing Database Users)
You can use the following accounts already stored in the Render PostgreSQL database to test the application:

### 1. User 1
- **Name:** Shardul Joshi
- **Email:** `shardul@example.com`
- **Password:** `securepassword123`

### 2. User 2
- **Name:** Suchita Joshi
- **Email:** `suchita@example.com`
- **Password:** `shardul@2001`

---

## ⚠️ Important Database Note
Please note that the backend is connected to a **Render Free Tier PostgreSQL Instance**. 
- **Expiry:** This database will remain active until **January 19, 2026**.
- **Cold Start:** Since it's a free instance, the first API request might take 50+ seconds to respond if the server is in "sleep" mode.

---

## 🛠️ Tech Stack Used
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Socket.io-client.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Socket.io.
- **Database:** PostgreSQL (Hosted on Render).
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing.

---

## 📸 Project Features
- **Real-time Updates:** Tasks update instantly across all connected clients using WebSockets.
- **Role-based Logic:** Users can create tasks and assign them to others.
- **SPA Routing:** Seamless navigation using React Router (configured for Vercel rewrites).
- **Graceful Error Handling:** Automatic redirection to registration if a user is not found.
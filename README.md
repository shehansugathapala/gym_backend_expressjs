# 🏋️ Gym Management System Backend

A **production-ready backend API** built with **Node.js, Express, and PostgreSQL** for managing a Gym Management System.

---

## 🚀 Features

* 🔐 Authentication (Register/Login with JWT)
* 👤 Role-based access (Admin / Trainer / Member)
* 🏋️ Membership plans management
* 👥 Member management
* 📅 Attendance tracking (extendable)
* 💳 Payment system (extendable)
* 🛡️ Secure API with middleware (JWT, validation, error handling)

---

## 🧰 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT (jsonwebtoken)
* bcryptjs
* express-validator
* dotenv
* nodemon

---

## 📁 Project Structure

```
src/
 ├── config/
 ├── controllers/
 ├── middlewares/
 ├── routes/
 ├── services/
 ├── utils/
 ├── validations/
 ├── app.js
 └── server.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone git@github.com:shehansugathapala/gym_backend_expressjs.git
cd gym_backend_expressjs
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Create `.env` file

```
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sample_db
DB_USER=sugathapala
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

### 4️⃣ Run database

Make sure PostgreSQL is running and create database:

```
sample_db
```

Run schema (if available):

```
psql -d sample_db -f sql/schema.sql
```

---

### 5️⃣ Start server

Development:

```
npm run dev
```

Production:

```
npm start
```

---

## 🌐 Base URL

```
http://localhost:5001
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

---

### 🏋️ Plans

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/api/plans` | Get all plans            |
| POST   | `/api/plans` | Create plan (Admin only) |

---

### 👥 Members

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/api/members`     | Get all members  |
| GET    | `/api/members/:id` | Get member by ID |

---

### 🧪 Test

| Method | Endpoint |
| ------ | -------- |
| GET    | `/test`  |

---

## 🔐 Authentication

Use JWT token in headers:

```
Authorization: Bearer YOUR_TOKEN
```

---

## 🧪 Example Request (Register)

```
POST /api/auth/register
```

```json
{
  "full_name": "Shehan Sugathapala",
  "email": "shehan@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

## ⚠️ Common Errors

| Error | Reason                  |
| ----- | ----------------------- |
| 400   | Validation error        |
| 401   | Unauthorized (no token) |
| 403   | Forbidden (not admin)   |
| 500   | Server/DB issue         |

---

## 📌 Future Improvements

* Subscription management
* Payment integration
* Attendance analytics
* File uploads (profile images)
* Swagger API documentation
* Docker support

---

## 👨‍💻 Author

**Shehan Sugathapala**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

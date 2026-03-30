# Gym Management System — API Endpoint Reference

Base URL: `http://localhost:5001`

---

## Auth

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | — | Register a new user |
| POST | `/api/auth/login` | No | — | Login and receive JWT token |

### POST `/api/auth/register`
**Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```
> `role` accepts: `member`, `trainer`, `admin`

### POST `/api/auth/login`
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## Members

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/members` | admin, trainer | List all members |
| GET | `/api/members/:id` | admin, trainer, member | Get member by ID |
| PUT | `/api/members/:id` | admin, member | Update member profile |
| DELETE | `/api/members/:id` | admin | Delete member |

### PUT `/api/members/:id`
**Body (all optional):**
```json
{
  "full_name": "Jane Doe",
  "phone": "0771234567",
  "gender": "female",
  "date_of_birth": "1995-06-15",
  "address": "123 Main St",
  "emergency_contact": "0779876543",
  "profile_image_url": "https://example.com/image.jpg",
  "status": "active"
}
```
> `gender` accepts: `male`, `female`, `other`
> `status` accepts: `active`, `inactive`

---

## Plans

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/plans` | any authenticated | List all plans |
| GET | `/api/plans/:id` | any authenticated | Get plan by ID |
| POST | `/api/plans` | admin | Create a new plan |
| PUT | `/api/plans/:id` | admin | Update a plan |
| DELETE | `/api/plans/:id` | admin | Delete a plan |

### POST `/api/plans`
**Body:**
```json
{
  "name": "Monthly Basic",
  "price": 29.99,
  "duration_days": 30,
  "description": "Basic monthly membership"
}
```
> `name`, `price`, `duration_days` are required

---

## Trainers

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/trainers` | admin, member | List all trainers |
| GET | `/api/trainers/:id` | admin, trainer, member | Get trainer by ID |
| PUT | `/api/trainers/:id` | admin, trainer | Update trainer profile |
| DELETE | `/api/trainers/:id` | admin | Delete trainer |

### PUT `/api/trainers/:id`
**Body (all optional):**
```json
{
  "phone": "0771234567",
  "specialization": "Cardio",
  "hire_date": "2024-01-01",
  "status": "active"
}
```
> `status` accepts: `active`, `inactive`

---

## Subscriptions

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/subscriptions` | admin, trainer | List all subscriptions |
| GET | `/api/subscriptions/:id` | admin, trainer, member | Get subscription by ID |
| POST | `/api/subscriptions` | admin | Create a subscription |
| PUT | `/api/subscriptions/:id` | admin | Update a subscription |
| DELETE | `/api/subscriptions/:id` | admin | Delete a subscription |

### POST `/api/subscriptions`
**Body:**
```json
{
  "member_id": 1,
  "plan_id": 2,
  "start_date": "2026-03-30",
  "end_date": "2026-04-30",
  "status": "active"
}
```
> `member_id`, `plan_id`, `start_date`, `end_date` are required
> `status` accepts: `active`, `expired`, `cancelled` (optional, defaults to `active`)

---

## Payments

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/payments` | admin | List all payments |
| GET | `/api/payments/:id` | admin | Get payment by ID |
| POST | `/api/payments` | admin | Record a payment |
| PUT | `/api/payments/:id` | admin | Update a payment |
| DELETE | `/api/payments/:id` | admin | Delete a payment |

### POST `/api/payments`
**Body:**
```json
{
  "member_id": 1,
  "subscription_id": 2,
  "amount": 29.99,
  "payment_method": "cash",
  "status": "paid"
}
```
> `member_id`, `subscription_id`, `amount` are required
> `payment_method` accepts: `cash`, `card`, `online` (optional)
> `status` accepts: `paid`, `pending`, `failed` (optional, defaults to `pending`)

---

## Attendance

> All endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/attendance` | admin, trainer | List all attendance records |
| GET | `/api/attendance/member/:memberId` | admin, trainer, member | Get attendance by member ID |
| POST | `/api/attendance/check-in` | admin, member | Record a check-in |
| PUT | `/api/attendance/check-out/:id` | admin, member | Record a check-out |

### POST `/api/attendance/check-in`
**Body:**
```json
{
  "member_id": 1
}
```

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are returned by `/api/auth/register` and `/api/auth/login`.

---

## Error Responses

All errors follow the format:
```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error or bad request |
| 401 | Missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Resource not found |
| 500 | Internal server error |

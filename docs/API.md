# VERITY API Documentation

> Base URL: `http://localhost:5000`

---

## 🔐 Authentication

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "John Doe",
    "role": "student"
  }
}
```

---

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "yourpassword",
  "role": "student"
}
```

---

## 👤 Users

### GET `/api/users/me`
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📢 Announcements

### GET `/api/announcements`
Fetch all announcements. Role-based filtering applied automatically.

### POST `/api/announcements`
Create a new announcement (Lecturer/Manager only).

**Request Body (multipart/form-data):**
```
title: string
content: string
category: string
file: (optional) file attachment
```

---

## 📅 Calendar / Events

### GET `/api/events`
Get all calendar events for the current user.

### POST `/api/events`
Create a new calendar event.

---

## 🔔 Notifications

Notifications are delivered in real-time via **Socket.IO**.

**Events:**
| Event | Direction | Description |
|---|---|---|
| `notification:new` | Server → Client | New notification received |
| `notification:read` | Client → Server | Mark notification as read |

---

*This document covers core endpoints. Full API reference is available via Postman collection.*

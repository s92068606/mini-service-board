Mini Service Request Board

A full-stack web application where homeowners can post service requests (e.g., plumbing, electrical work), and tradespeople can browse and manage them.

Built as part of a Full-Stack Developer Intern assessment.

---

## 🚀 Tech Stack

### Frontend
- Next.js (App Router, TypeScript)
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose ODM

### Authentication
- JWT (JSON Web Token)
- bcryptjs (password hashing)

---

## 📌 Features

### Core Features
- Create service requests
- View all requests
- View request details
- Update request status (Open → In Progress → Closed)
- Delete requests

### Authentication
- User registration
- User login
- Protected routes (JWT-based)

### UI
- Responsive dashboard layout
- Card-based job listing
- Clean form design
- Status badges

---
# 📁 Project Structure
/backend → Express API server
/frontend → Next.js application
---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/your-username/service-board.git
cd service-board

---
# Backend Setup
cd backend
npm install

▶️ Run Instructions

Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm run dev
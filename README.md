# 🚀 Hintro – Real-Time Collaborative Kanban Board

Hintro is a full-stack real-time Kanban board application built with modern web technologies.  
It supports task management, drag-and-drop functionality, real-time activity updates, role-based access control, and collaboration features.

---

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Owner, Admin, Member)
- Secure protected routes

### 📋 Board Management
- Create boards
- Rename board
- Transfer ownership
- Invite members via email
- Role management

### 📑 Lists
- Create lists
- Rename lists
- Delete lists (Owner/Admin only)
- Drag & drop ordering

### ✅ Tasks
- Create tasks
- Edit task title (double-click)
- Delete tasks (Owner/Admin only)
- Drag & drop between lists
- Task descriptions
- Due dates with overdue highlighting
- Assign/unassign members
- Labels
- Comments system

### ⚡ Real-Time Updates
- Socket.io integration
- Live activity logs
- Real-time task creation & movement

### 📊 Activity Panel
- Expand / collapse
- Real-time board activity tracking

---

# 🏗 Architecture

## Frontend
- React (TypeScript)
- Tailwind CSS
- dnd-kit (Drag & Drop)
- Socket.io client
- Axios for API communication
- React Hot Toast for notifications

Structure:

frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── api/
│ ├── context/
│ └── socket.ts


## Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Socket.io
- JWT Authentication
- Nodemailer (Email invites)

Structure:

backend/
├── src/
│ ├── modules/
│ │ ├── board/
│ │ ├── list/
│ │ ├── task/
│ │ ├── activity/
│ │ └── boardMember/
│ ├── middlewares/
│ ├── invite/
│ └── config/


---

# 🛠 Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd hintro

cd backend
npm install

Create .env file

DATABASE_URL=postgresql://username:password@localhost:5432/hintro
JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

npx prisma generate 
npx prisma migrate dev

RUN backend 

- npm run dev

backend will run on 

http://localhost:5000 

Frontend Setup

cd frontend 
npm install 
npm run dev

frontend will run on: 


📡 API Documentation
Authentication
Register
POST /api/auth/register

Login
POST /api/auth/login

Boards
Create Board
POST /api/boards

Rename Board
PUT /api/boards/:boardId

Transfer Ownership
PUT /api/boards/:boardId/transfer/:userId

Lists
Create List
POST /api/lists

Get Lists
GET /api/lists/:boardId

Rename List
PUT /api/lists/:listId

Delete List
DELETE /api/lists/:listId

Tasks
Create Task
POST /api/tasks

Update Task
PUT /api/tasks/:taskId

Move Task
PUT /api/tasks/:taskId/move

Delete Task
DELETE /api/tasks/:taskId

Task Assignees
Assign User
POST /api/task-assignees/:taskId/:userId

Remove User
DELETE /api/task-assignees/:taskId/:userId

Comments
Add Comment
POST /api/comments/:taskId

Activity
Get Activity Logs
GET /api/activity/:boardId

🔒 Role System
Role	Permissions
OWNER	Full access
ADMIN	Manage tasks & lists
MEMBER	Limited access

Only OWNER & ADMIN can:

Delete lists

Delete tasks

Transfer ownership

📧 Invite System

Invite users via email

Uses Nodemailer with Gmail SMTP

Invited user joins board after registration

⚙️ Assumptions

Users must be registered before assignment

Lists maintain position order

Tasks maintain position order inside lists

Only Owner/Admin can delete content

⚖️ Trade-offs

No pagination for activity logs (limited to recent)

Email invite uses basic SMTP (no production mail service)

No file uploads

No caching layer

No unit tests included

👤 Demo Credentials
Email: demo@hintro.com
Password: 123456

🎯 Future Improvements

Board background customization

Dark/Light theme toggle

Task priority levels

Attachments support

Notifications system

Deployment to cloud (AWS / Vercel)

🧑‍💻 Author

Built by: Kishan Pun
Tech Stack: React | Node.js | Prisma | PostgreSQL | Socket.io


🚀 TaskFlow – Real-Time Collaborative Kanban Board

TaskFlow is a full-stack real-time Kanban board application built with modern web technologies.
It enables teams to manage tasks collaboratively with drag-and-drop functionality, real-time updates, role-based access control, and activity tracking.

🌟 Features
🔐 Authentication & Authorization

JWT-based authentication

Role-based access control (Owner, Admin, Member)

Protected API routes

Secure middleware-based access validation

📋 Board Management

Create boards

Rename boards

Transfer ownership

Invite members by email

Delete board (Owner only)

📑 List Management

Create lists

Rename lists

Delete lists (Owner/Admin only)

Position-based ordering

Drag-and-drop reordering

✅ Task Management

Create tasks

Edit task title (double-click / Enter to save)

Delete tasks (Owner/Admin only)

Drag-and-drop between lists

Task descriptions

Due dates with overdue highlighting

Assign / Unassign members

Labels

Comment system

⚡ Real-Time Features

Socket.io integration

Live task updates

Real-time activity logs

Board-level synchronization

📊 Activity Panel

Expand / Collapse panel

Real-time activity tracking

Action metadata logging

🏗 System Architecture
Frontend

Tech Stack

React (TypeScript)

Tailwind CSS

dnd-kit (Drag & Drop)

Socket.io Client

Axios

React Hot Toast

Structure

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── api/
│   ├── context/
│   └── socket.ts

Backend

Tech Stack

Node.js

Express

Prisma ORM

PostgreSQL

JWT Authentication

Socket.io

Nodemailer (Email invites)

Structure

backend/
├── src/
│   ├── modules/
│   │   ├── board/
│   │   ├── list/
│   │   ├── task/
│   │   ├── activity/
│   │   └── boardMember/
│   ├── middlewares/
│   ├── config/
│   └── server.ts

🛠 Setup Instructions
1️⃣ Clone Repository
git clone <your-repository-url>
cd taskflow

2️⃣ Backend Setup
cd backend
npm install

Create .env file inside backend folder:
DATABASE_URL=postgresql://username:password@localhost:5432/taskflow
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

Run Prisma
npx prisma generate
npx prisma migrate dev

Start Backend
npm run dev


Backend runs at:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

📡 API Documentation
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
Boards
Method	Endpoint
POST	/api/boards
GET	/api/boards
PUT	/api/boards/:boardId
DELETE	/api/boards/:boardId
PUT	/api/boards/:boardId/transfer/:userId
Lists
Method	Endpoint
POST	/api/lists
GET	/api/lists/:boardId
PUT	/api/lists/:listId
DELETE	/api/lists/:listId
Tasks
Method	Endpoint
POST	/api/tasks
PUT	/api/tasks/:taskId
PUT	/api/tasks/:taskId/move
DELETE	/api/tasks/:taskId
Task Assignees
Method	Endpoint
POST	/api/task-assignees/:taskId/:userId
DELETE	/api/task-assignees/:taskId/:userId
Comments
Method	Endpoint
POST	/api/comments/:taskId
Activity
Method	Endpoint
GET	/api/activity/:boardId
🔒 Role System
Role	Permissions
OWNER	Full control
ADMIN	Manage lists & tasks
MEMBER	Limited task access

Only OWNER can:

Delete board

Transfer ownership

Rename board

Only OWNER & ADMIN can:

Delete lists

Delete tasks

Edit lists

📧 Invite System

Invite users via email

Uses Nodemailer with Gmail SMTP

Invited user becomes board member after registration

⚙️ Assumptions

Users must be registered before assignment

Lists maintain position-based ordering

Tasks maintain position ordering within lists

Role-based access is enforced via middleware

Email invites assume valid SMTP credentials

⚖️ Trade-offs

No pagination for activity logs

No file uploads

No caching layer

No unit/integration tests

Basic email configuration (not production mail service)

👤 Demo Credentials
Email: demo@taskflow.com
Password: 123456

🚀 Future Improvements

Board background customization

Light/Dark theme toggle

Task priority system

File attachments

Notification system

Cloud deployment (AWS / Vercel)

Unit testing

API rate limiting

👨‍💻 Author

Kishan Pun

Tech Stack:
React | TypeScript | Node.js | Express | Prisma | PostgreSQL | Socket.io
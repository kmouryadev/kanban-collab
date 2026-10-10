# **Kanban Collaboration Board – Project README**

This project is a real-time collaborative Kanban board application featuring boards, lists, tasks, drag-and-drop functionality, and multi-user collaboration using Socket.io.
Both the frontend and backend are built from scratch using modern web technologies.

This document explains how to install, configure, and run the full project, along with architecture details and upcoming enhancements.

---

## **1. Features**

### **Board Management**

* Create, update, delete boards
* Share boards with other users
* Remove members from a board (owner only)
* Configure workflow rules restricting which lists members can move tasks between (owner only; owner always bypasses the rules)
* Real-time synchronized board updates

### **List Management**

* Create, update, delete, reorder lists (owner only)
* Drag-and-drop list reordering
* Real-time list updates

### **Task Management**

* Create, update, delete tasks (board owner and members)
* Move tasks between lists and reorder tasks inside a list
* Assign a task to any board member, including yourself
* Track who last updated a task
* Filter the board by assignee (All / Unassigned / Me / a specific member)
* Real-time task sync

### **Permissions Overview**

* **Owner**: full control — boards, lists, members, workflow rules, and tasks
* **Members**: can view everything and fully manage tasks (create/edit/move/assign/delete), but cannot manage lists, workflow rules, or board membership

### **Authentication**

* JWT-based login & signup
* Protected API routes

### **Real-Time Collaboration**

* Socket.io room-based updates
* Live syncing of board/list/task/member/workflow operations

---

## **2. Tech Stack**

### **Frontend**

* React + TypeScript
* Vite
* TailwindCSS
* React Query (TanStack Query)
* Zustand state management
* Socket.io Client
* DnD Kit / React DnD
* shadcn/ui

### **Backend**

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Socket.io Server
* JWT Authentication
* Layered services + controllers architecture

---

## **3. Basic Project Folder Structure**

```
root/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── store/
│   │   ├── types/
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md (this file)
```

---

## **4. Installation Instructions**

### **Prerequisites**

Install:

* Node.js (v18+)
* npm
* MongoDB running as a **replica set** (MongoDB Atlas, including the free M0 tier, satisfies this automatically). List/task reordering and moving use multi-document transactions, which standalone `mongod` instances cannot run — if using local MongoDB, initialize it as a single-node replica set (`rs.initiate()`).

---

## **5. Setting Up Backend**

### Install dependencies

```sh
cd backend
npm install
```

### Environment variables (.env)

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret>
FRONTEND_URL=http://localhost:5173
```

### Run backend

```sh
npm run dev
```

Backend runs at:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## **6. Setting Up Frontend**

### Install dependencies

```sh
cd frontend
npm install
```

### Environment variables (.env)

```
VITE_API_URL="http://localhost:5000/api"
VITE_BACKEND_URL="http://localhost:5000"
```

### Run frontend

```sh
npm run dev
```

Frontend runs at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## **7. Running the Full Application**

* Start MongoDB
* Run backend
* Run frontend
* Open: [http://localhost:5173](http://localhost:5173)
* Login and start collaborating in real-time

---

## **8. Future Scope**

### **🔹 1. Board Activity Log**

Track actions like task creation, deletion, movements, and user activity.

### **🔹 2. Task Enhancements**

Add attachments, due dates, labels, and checklist subtasks.

### **🔹 3. Collaboration Features**

Show online users on a board and real-time typing/edit indicators.

### **🔹 4. Roles Beyond Owner/Member**

Introduce admin/editor/viewer-style roles instead of the current owner/member split.

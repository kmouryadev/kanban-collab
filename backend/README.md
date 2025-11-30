# **Collaborative Kanban App – Backend**

**Node.js | Express | TypeScript | MongoDB | Socket.io**

This backend powers a **real-time collaborative Kanban application**, supporting multiple users working together on shared boards with live updates.

---

## **Overview**

This backend exposes **REST APIs** for boards, lists, tasks and provides **real-time synchronization** using Socket.io.
All requests are authenticated using **JWT**, and every collaborative event is synced using **board rooms**.

---

## **Features**

### **Core Features**

* JWT-based user authentication
* Create, update, delete **boards**
* Share boards with other members
* Create and manage **lists**
* Create, update, reorder, move, and delete **tasks**
* Global error handling, validation & clean service architecture

### **Real-Time Features**

* Each board is treated as a **Socket.io Room**
* Users join/leave rooms when opening a board
* All CRUD operations broadcast updates to room members
* Supports:

  * List reorder
  * Task reorder
  * Task move between lists
* Authorization on socket connection

---

## **Tech Stack**

### **Runtime & Framework**

* Node.js
* Express.js
* TypeScript

### **Database**

* MongoDB
* Mongoose ODM

### **Real-Time Layer**

* Socket.io (Server)
* Board-level room management
* Event emitters for boards, lists, tasks

### **Security & Utilities**

* JWT Authentication
* Bcrypt Password Hashing

---

## 📂 **Folder Structure**

```
backend/
│
├── src/
│   ├── config/
│   │   ├── db.ts
|   |
│   ├── constants/
│   │   ├── httpCodes.ts
│   │   ├── messages.ts
│   │
│   ├── controllers/
│   │   ├── v1
|   │       ├── board.controller.ts
|   │       ├── list.controller.ts
|   │       ├── task.controller.ts
|   │       ├── auth.controller.ts
|   |
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │
│   ├── services/
│   │   ├── v1
|   │       ├── board.service.ts
|   │       ├── list.service.ts
|   │       ├── task.service.ts
|   │       ├── auth.service.ts
│   │
│   ├── models/
│   │   ├── Board.model.ts
│   │   ├── List.model.ts
│   │   ├── Task.model.ts
│   │   ├── User.model.ts
│   │
│   ├── routes/
│   │   ├── v1
│   │        ├──boards 
│   │        |    ├── board.routes.ts
│   │        |    ├── list.routes.ts
│   │        |    ├── task.routes.ts
│   │        |    ├── index.ts
│   │        ├── index.ts
│   │        ├── auth.routes.ts
|   |
│   ├── socket/
│   │   ├── event.ts
│   │   ├── index.ts
│   │   ├── emit/
│   │   │   ├── board.ts
│   │   │   ├── list.ts
│   │   │   ├── task.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── express.d.ts
│   │   ├── userpayload.ts
|   |
│   ├── utils/
│   │   ├── error.ts
│   │   ├── generateToken.ts
│   │
│   ├── server.ts
│   ├── app.ts
│
├── package.json
├── tsconfig.json
├── .env
├── README.md
```

---

## 🔑 **Environment Variables**

Create a `.env` file in the **backend root**:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kanban
JWT_SECRET=your_jwt_secret
JWT_TOKEN_EXPIRE_TIME=1d
```

---

## 🛠️ **Installation & Setup**

### **1. Install dependencies**

```sh
npm install
```

### **2. Start development server**

```sh
npm run dev
```

Starts:

* **API:** [http://localhost:5000/api](http://localhost:5000/api)
* **Socket.io:** same port, `/socket.io`

## **API Endpoints**

### **Board APIs**

```
GET     /api/v1/boards
POST    /api/v1/boards
PATCH   /api/v1/boards/:id
DELETE  /api/v1/boards/:id
SHARED  /api/v1/boards/:id/share
```

### **List APIs**

```
GET       /api/v1/boards/:boardId/lists
POST      /api/v1/boards/:boardId/lists
PATCH     /api/v1/boards/:boardId/lists/:listId
DELETE    /api/v1/boards/:boardId/lists/:listId
REORDER   /api/v1/boards/:boardId/lists/reorder
```

### **Task APIs**

```
GET       /api/v1/boards/:boardId/lists/:listId/tasks
POST      /api/v1/boards/:boardId/lists/:listId/tasks
PATCH     /api/v1/boards/:boardId/tasks/:taskId
DELETE    /api/v1/boards/:boardId/tasks/:taskId
MOVE      /api/v1/boards/:boardId/tasks/:taskId/move
REORDER   /api/v1/boards/:boardId/tasks/:listId/reorder
```

---

## **Socket Events**

### **Client → Server**

* `board:join`
* `board:leave`

### **Server → Client**

* `board:updated`
* `board:deleted`
* `list:created`
* `list:updated`
* `list:deleted`
* `list:reordered`
* `task:created`
* `task:updated`
* `task:deleted`
* `task:moved`
* `task:reordered`

---

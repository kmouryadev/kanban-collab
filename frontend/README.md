# **Kanban Collaboration – Frontend**

**React | TypeScript | Vite | Zustand | TanStack Query | Socket.IO | shadcn/ui**

This is the frontend application for the Collaborative Kanban Board.
It interacts with a Node.js backend using REST APIs and synchronizes data in real-time using Socket.IO.

The UI is built with **TailwindCSS** and a custom component library powered by **shadcn/ui**.

---

## **Overview**

This SPA (Single Page Application) uses:

* React 18 + TypeScript
* Zustand for client-side state
* TanStack Query for API caching and invalidation
* Socket.IO Client for real-time updates
* TailwindCSS + shadcn/ui for modern UI components
* Axios for API communication
* React Router for navigation

---

## **Tech Stack**

### **Core Technologies**

* React 18
* TypeScript
* Vite
* Zustand
* TanStack Query
* Socket.IO Client
* Axios
* TailwindCSS
* **shadcn/ui**

---

## **Folder Structure**

```
frontend/
│
├── src/
│   ├── api/                # Axios API wrappers and API calls
│   ├── apiRoutes/          # API route constants
│   ├── components/         
│   │   ├── layout/         # Layout structures (navbar, sidebar, etc.)
│   │   ├── molecules/      # UI components for List, Task, and Board
│   │   ├── ui/             # shadcn/ui wrapper components & base UI
│   ├── hooks/              # Queries, mutations, socket hooks
│   ├── lib/                # Helpers (socket instance, toast, utils)
│   ├── pages/              # Screens (Boards, BoardDetails, Auth, etc.)
│   ├── store/              # Zustand global stores
│   ├── routes/             # Route wrapper mentioned here
│   ├── validation/         # all the validation for the forms used in project are mention here
│   ├── types/              # TypeScript DTOs & interfaces
│   ├── App.tsx             
│   ├── main.tsx            
│
├── public/                 
├── index.html
├── tsconfig.json
├── tailwind.config.js
└── package.json

```

---

## **Environment Variables**

Create a `.env` file inside `frontend/`:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

---

## **Installation & Setup**

### 1. Install dependencies

```sh
npm install
```

### 2. Run development server

```sh
npm run dev
```

App runs at:
**[http://localhost:5173](http://localhost:5173)**

---

## **Socket.IO Integration**

Shared socket instance:
`src/lib/socket.ts`

Real-time features handled via:
`src/hooks/useBoardSocket.ts`

Includes:

* Token-based auth
* Auto reconnect
* Live board/list/task updates

---

## **UI Component System**

Uses:

### TailwindCSS

Utility-first CSS for styling.

### shadcn/ui

Customizable, accessible components installed on demand.

---

## **Generating New UI Components (shadcn/ui)**

To create any new UI component:

1. Visit **[https://ui.shadcn.com/](https://ui.shadcn.com/)**

2. Navigate to the component you want (e.g., Button, Dialog, Sheet)

3. Copy the installation command shown (usually like):

   ```sh
   npx shadcn-ui add button
   ```

4. Run that command inside the **frontend folder**:

   ```sh
   cd frontend
   npx shadcn-ui add <component-name>
   ```

This will automatically generate or update the component inside:
 `src/components/ui/`

Your design system grows automatically as you add components.

---

## **Key Features**

* JWT authentication
* Board listing & management
* List creation, editing, deletion
* Task creation, editing, deletion
* Drag and drop (lists & tasks)
* Real-time sync using Socket.IO
* Share boards with other users
* Mobile responsive layout

---
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import BoardsList from "../pages/boards/BoardsList";
import Home from "../pages/home/Home";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import BoardsListPage from "../pages/boards/BoardsList";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/boards"
        element={
          <PrivateRoute>
            <BoardsListPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/boards" replace />} />

      <Route
        path="/boards"
        element={
          <PrivateRoute>
            <BoardsList />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

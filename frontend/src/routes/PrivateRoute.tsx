import { Navigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
  if (!Auth.isLoggedIn()) {
    Auth.logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

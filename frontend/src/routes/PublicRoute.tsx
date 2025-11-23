import { Navigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  if (Auth.isLoggedIn()) {
    return <Navigate to="/boards" replace />;
  }

  return children;
};

export default PublicRoute;

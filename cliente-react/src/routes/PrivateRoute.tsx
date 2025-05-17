import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PrivateLayout from "../components/PrivateLayout";

export function PrivateRoute() {
  const { user } = useContext(AuthContext);
  return user ? (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

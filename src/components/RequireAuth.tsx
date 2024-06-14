import { useAuthState } from "@/context/AuthProvider";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }: { allowedRoles: number[] }) => {
  const { auth } = useAuthState();
  const location = useLocation();

  return auth?.roles?.find((role: number) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

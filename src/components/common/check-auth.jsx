import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage =
    path.startsWith("/auth/login") || path.startsWith("/auth/register");

  // Root route redirect
  if (path === "/") {
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // Not logged in but trying to access protected pages
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" replace />;
  }

  // Logged in but trying to access login/register pages
  if (isAuthenticated && isAuthPage) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // Role protection
  if (isAuthenticated && user?.role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  if (isAuthenticated && user?.role === "admin" && path.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;

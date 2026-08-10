import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
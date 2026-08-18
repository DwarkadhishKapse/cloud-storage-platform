import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FavoritesPage from "../pages/FavoritesPage";
import FolderPage from "../pages/FolderPage";
import MyFilesPage from "../pages/MyFilesPage";
import RecentPage from "../pages/RecentPage";
import TrashPage from "../pages/TrashPage";
import SharedWithMePage from "../pages/SharedWithMePage";
import SearchPage from "../pages/SearchPage";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/files" element={<MyFilesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/shared-with-me" element={<SharedWithMePage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/folder/:id" element={<FolderPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

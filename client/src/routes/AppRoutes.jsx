import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/DashboardPage";
import FavoritesPage from "../pages/FavoritesPage";
import MyFilesPage from "../pages/MyFilesPage";
import RecentPage from "../pages/RecentPage";
import TrashPage from "../pages/TrashPage";
import FolderPage from "../pages/FolderPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/files" element={<MyFilesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/folder/:folderId" element={<FolderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

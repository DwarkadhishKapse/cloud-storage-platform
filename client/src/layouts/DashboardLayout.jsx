import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateFolderModal from "../components/CreateFolderModal";
import UploadFileModal from "../components/UploadFileModal";

const DashboardLayout = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [folderRefreshKey, setFolderRefreshKey] = useState(0);

  const location = useLocation();

  const folderMatch = location.pathname.match(/^\/folder\/([^/]+)$/);

  const currentFolderId = folderMatch ? folderMatch[1] : null;

  const handleFolderCreated = () => {
    setFolderRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        onNewFolder={() => setIsCreateFolderOpen(true)}
        onUploadFile={() => setIsUploadModalOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 bg-white p-6">
          <Outlet
            context={{
              folderRefreshKey,
            }}
          />
        </main>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        parentId={currentFolderId}
        onFolderCreated={handleFolderCreated}
      />

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;

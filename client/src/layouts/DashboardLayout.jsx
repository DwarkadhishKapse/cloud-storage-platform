import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateFolderModal from "../components/CreateFolderModal";
import UploadFileModal from "../components/UploadFileModal";

const DashboardLayout = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        onNewFolder={() => setIsCreateFolderOpen(true)}
        onUploadFile={() => setIsUploadModalOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 bg-white p-6">
          <Outlet />
        </main>
      </div>
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;

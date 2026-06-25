import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateFolderModal from "../components/CreateFolderModal";

const DashboardLayout = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onNewFolder={() => setIsCreateFolderOpen(true)} />

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
    </div>
  );
};

export default DashboardLayout;

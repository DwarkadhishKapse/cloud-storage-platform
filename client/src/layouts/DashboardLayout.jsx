import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <Outlet />
    </>
  );
};

export default DashboardLayout;

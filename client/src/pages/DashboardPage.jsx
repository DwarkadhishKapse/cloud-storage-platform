import React from "react";
import FolderCard from "../components/FolderCard";

const folders = [
  {
    id: 1,
    name: "College",
  },
  {
    id: 2,
    name: "Photos",
  },
  {
    id: 3,
    name: "Documents",
  },
];

const DashboardPage = () => {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => (
          <FolderCard key={folder.id} name={folder.name} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

import React from "react";
import FolderCard from "../components/FolderCard";
import Breadcrumb from "../components/Breadcrumb";
import FileCard from "../components/FileCard";
import useViewStore from "../store/useViewStore";
import { useNavigate } from "react-router-dom";

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

const files = [
  {
    id: 1,
    name: "Resume.pdf",
    size: "2.3 MB",
    type: "pdf",
  },
  {
    id: 2,
    name: "DBMS Notes.pdf",
    size: "5.8 MB",
    type: "pdf",
  },
  {
    id: 3,
    name: "Goa.jpg",
    size: "1.2 MB",
    type: "image",
  },
];

const breadcrumbItems = ["Home"];

const DashboardPage = () => {
  const navigate = useNavigate();

  const { view } = useViewStore();
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Dashboard</h1>

      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            name={folder.name}
            onClick={() => navigate(`/folder/${folder.id}`)}
          />
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }
        >
          {files.map((file) => (
            <FileCard
              key={file.id}
              name={file.name}
              size={file.size}
              type={file.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

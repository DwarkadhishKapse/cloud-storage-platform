import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const FolderPage = () => {
  const { folderId } = useParams();

  const breadcrumbItems = ["Home", `Folder ${folderId}`];
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-4xl font-bold text-slate-900">Folder {folderId}</h1>
    </div>
  );
};

export default FolderPage;

import React from "react";
import FileCard from "../components/FileCard";
import useFileStore from "../store/useFileStore";
import { formatFileSize } from "../utils/formatFileSize";

const RecentPage = () => {
  const { files } = useFileStore();

  const recentFiles = [...files]
    .filter((file) => !file.isDeleted)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (recentFiles.length === 0) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-slate-700">Recent Files</h2>
        <p className="mt-3 text-slate-500">Upload files to see them here.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Recent</h1>

      <div className="space-y-4">
        {recentFiles.map((file) => (
          <FileCard
            key={file.id}
            name={file.name}
            size={formatFileSize(file.size)}
            type={file.type}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentPage;

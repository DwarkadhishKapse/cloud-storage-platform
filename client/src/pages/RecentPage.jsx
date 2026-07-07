import React, { useState } from "react";
import FileCard from "../components/FileCard";
import useFileStore from "../store/useFileStore";
import PreviewFileModal from "../components/PreviewFileModal";
import DeleteFileModal from "../components/DeleteFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

const RecentPage = () => {
  const {
    files,
    previewFile,
    setPreviewFile,
    closePreview,
    setDetailFile,
    detailFile,
    closeDetail,
    toggleFileFavorite,
    moveFileToTrash,
  } = useFileStore();

  const [fileToDelete, setFileToDelete] = useState(null);

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
            isFavorite={file.isFavorite}
            onClick={() => setPreviewFile(file)}
            onFavorite={() => toggleFileFavorite(file.id)}
            onDetail={() => setDetailFile(file)}
            onDelete={() => setFileToDelete(file)}
            onDownload={() => downloadFile(file)}
          />
        ))}
      </div>
      <PreviewFileModal file={previewFile} onClose={closePreview} />

      <FileDetailsPanel file={detailFile} onClose={closeDetail} />

      <DeleteFileModal
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={() => {
          if (!fileToDelete) return;

          moveFileToTrash(fileToDelete.id);
          setFileToDelete(null);
        }}
      />
    </div>
  );
};

export default RecentPage;

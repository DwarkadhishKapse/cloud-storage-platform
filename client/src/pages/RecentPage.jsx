import React, { useEffect, useState } from "react";

import FileCard from "../components/FileCard";
import PreviewFileModal from "../components/PreviewFileModal";
import DeleteFileModal from "../components/DeleteFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";

import useFileStore from "../store/useFileStore";

import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

import {
  getFiles,
  moveFileToTrash as moveFileToTrashApi,
} from "../services/file.service";

const RecentPage = () => {
  const {
    files,
    setFiles,
    previewFile,
    setPreviewFile,
    closePreview,
    setDetailFile,
    detailFile,
    closeDetail,
    toggleFileFavorite,
    moveFileToTrash: moveFileToTrashLocal,
  } = useFileStore();

  const [fileToDelete, setFileToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        setLoading(true);

        const response = await getFiles();

        setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch recent files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFiles();
  }, [setFiles]);

  const recentFiles = [...files]
    .filter((file) => !file.isTrashed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleMoveFileToTrash = async () => {
    if (!fileToDelete) return;

    try {
      await moveFileToTrashApi(fileToDelete.id);

      moveFileToTrashLocal(fileToDelete.id);

      setFileToDelete(null);
    } catch (error) {
      console.error("Failed to move file to trash:", error);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center text-slate-500">
        Loading recent files...
      </div>
    );
  }

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
        onConfirm={handleMoveFileToTrash}
      />
    </div>
  );
};

export default RecentPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import Breadcrumb from "../components/Breadcrumb";
import DeleteFolderModal from "../components/DeleteFolderModal";
import DeleteFileModal from "../components/DeleteFileModal";
import RenameFolderModal from "../components/RenameFolderModal";
import PreviewFileModal from "../components/PreviewFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import FolderDetailsPanel from "../components/FolderDetailsPanel";
import { getFiles } from "../services/file.service";

import useViewStore from "../store/useViewStore";
import useFolderStore from "../store/useFolderStore";
import useFileStore from "../store/useFileStore";
import useSearchStore from "../store/useSearchStore";
import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

const breadcrumbItems = ["Home"];

const DashboardPage = () => {
  const navigate = useNavigate();

  const { view } = useViewStore();
  const { searchQuery } = useSearchStore();

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

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
    moveFileToTrash,
  } = useFileStore();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getFiles();
        setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [setFiles]);

  const {
    folders,
    moveToTrash,
    renameFolder,
    toggleFolderFavorite,
    detailFolder,
    setDetailFolder,
    closeFolderDetail,
  } = useFolderStore();

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const activeFolders = folders.filter((folder) => !folder.isDeleted);
  const activeFiles = files.filter((file) => !file.isTrashed);

  const filteredFolders = activeFolders.filter((folder) =>
    folder.name.toLowerCase().includes(normalizedQuery),
  );

  const filteredFiles = activeFiles.filter((file) =>
    file.name.toLowerCase().includes(normalizedQuery),
  );

  const hasResults = filteredFolders.length > 0 || filteredFiles.length > 0;

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Dashboard</h1>

      <Breadcrumb items={breadcrumbItems} />

      {!hasResults && normalizedQuery && (
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-slate-700">
            🔍 No results found
          </h2>

          <p className="mt-3 text-slate-500">Try another search term.</p>
        </div>
      )}

      {loadingFiles && (
        <div className="mt-10 text-center text-slate-500">Loading files...</div>
      )}

      {filteredFolders.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                name={folder.name}
                isFavorite={folder.isFavorite}
                onClick={() => navigate(`/folder/${folder.id}`)}
                onDelete={() => setFolderToDelete(folder)}
                onEdit={() => setFolderToEdit(folder)}
                onFavorite={() => toggleFolderFavorite(folder.id)}
                onDetail={() => setDetailFolder(folder)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                name={file.name}
                size={formatFileSize(file.size)}
                isFavorite={file.isFavorite}
                onClick={() => setPreviewFile(file)}
                onFavorite={() => toggleFileFavorite(file.id)}
                onDownload={() => downloadFile(file)}
                onDelete={() => setFileToDelete(file)}
                onDetail={() => setDetailFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      <DeleteFolderModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (!folderToDelete) return;

          moveToTrash(folderToDelete.id);
          setFolderToDelete(null);
        }}
      />

      <DeleteFileModal
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={() => {
          if (!fileToDelete) return;

          moveFileToTrash(fileToDelete.id);
          setFileToDelete(null);
        }}
      />

      <RenameFolderModal
        folder={folderToEdit}
        onClose={() => setFolderToEdit(null)}
        onConfirm={(newName) => {
          if (!folderToEdit) return;

          renameFolder(folderToEdit.id, newName);
          setFolderToEdit(null);
        }}
      />

      <FolderDetailsPanel folder={detailFolder} onClose={closeFolderDetail} />

      <PreviewFileModal file={previewFile} onClose={closePreview} />

      <FileDetailsPanel file={detailFile} onClose={closeDetail} />
    </div>
  );
};

export default DashboardPage;

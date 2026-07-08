import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFolderStore from "../store/useFolderStore";
import useFileStore from "../store/useFileStore";
import useViewStore from "../store/useViewStore";
import useSearchStore from "../store/useSearchStore";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import { formatFileSize } from "../utils/formatFileSize";
import DeleteFolderModal from "../components/DeleteFolderModal";
import RenameFolderModal from "../components/RenameFolderModal";
import DeleteFileModal from "../components/DeleteFileModal";
import PreviewFileModal from "../components/PreviewFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import { downloadFile } from "../utils/downloadFile";

const MyFilesPage = () => {
  const navigate = useNavigate();
  const { folders, toggleFolderFavorite, renameFolder, moveToTrash } =
    useFolderStore();
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

  const { view } = useViewStore();
  const { searchQuery } = useSearchStore();

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const [fileToDelete, setFileToDelete] = useState(null);

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const activeFolders = folders.filter((folder) => !folder.isDeleted);
  const activeFiles = files.filter((file) => !file.isDeleted);

  const filteredFolders = activeFolders.filter((folder) =>
    folder.name.toLowerCase().includes(normalizedQuery),
  );
  const filteredFiles = activeFiles.filter((file) =>
    file.name.toLowerCase().includes(normalizedQuery),
  );

  const hasResults = filteredFolders.length > 0 || filteredFiles.length > 0;

  const hasActiveItems = activeFolders.length > 0 || activeFiles.length > 0;

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">My Files</h1>

      {!hasResults && normalizedQuery && (
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-slate-700">
            No results found
          </h2>

          <p className="mt-3 text-slate-500">Try another search term.</p>
        </div>
      )}

      {!hasActiveItems && !normalizedQuery && (
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-slate-700">
            My Files is empty
          </h2>

          <p className="mt-3 text-slate-500">
            Upload a file or create a folder to get started.
          </p>
        </div>
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
                onFavorite={() => toggleFolderFavorite(folder.id)}
                onEdit={() => setFolderToEdit(folder)}
                onDelete={() => setFolderToDelete(folder)}
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
                onClick={() => setPreviewFile(file)}
                isFavorite={file.isFavorite}
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

      <RenameFolderModal
        folder={folderToEdit}
        onClose={() => setFolderToEdit(null)}
        onConfirm={(newName) => {
          if (!folderToEdit) return;

          renameFolder(folderToEdit.id, newName);
          setFolderToEdit(null);
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

      <PreviewFileModal file={previewFile} onClose={closePreview} />

      <FileDetailsPanel file={detailFile} onClose={closeDetail} />
    </div>
  );
};

export default MyFilesPage;

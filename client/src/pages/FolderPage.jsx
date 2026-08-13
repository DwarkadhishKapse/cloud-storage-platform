import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import PreviewFileModal from "../components/PreviewFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import DeleteFileModal from "../components/DeleteFileModal";
import useFileStore from "../store/useFileStore";

import { getFolderContents } from "../services/folder.service";
import { moveFileToTrash } from "../services/file.service";

import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

const FolderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { folderRefreshKey } = useOutletContext();

  const [folder, setFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleFileFavorite } = useFileStore();

  const [previewFile, setPreviewFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        setLoading(true);

        const response = await getFolderContents(id);

        setFolder(response.folder);
        setFolders(response.folders);
        setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch folder:", error);

        setFolder(null);
        setFolders([]);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [id, folderRefreshKey]);

  const handleToggleFavorite = async (fileId) => {
    try {
      const updatedFile = await toggleFileFavorite(fileId);

      setFiles((currentFiles) =>
        currentFiles.map((file) => (file.id === fileId ? updatedFile : file)),
      );

      setDetailFile((currentFile) =>
        currentFile?.id === fileId ? updatedFile : currentFile,
      );
    } catch (error) {
      console.error("Failed to toggle file favorite:", error);
    }
  };

  const handleMoveFileToTrash = async () => {
    if (!fileToDelete) return;

    try {
      await moveFileToTrash(fileToDelete.id);

      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.id !== fileToDelete.id),
      );

      setFileToDelete(null);
    } catch (error) {
      console.error("Failed to move file to trash:", error);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center text-slate-500">Loading folder...</div>
    );
  }

  if (!folder) {
    return (
      <div className="mt-20 text-center text-red-500">Folder not found.</div>
    );
  }

  const breadcrumbItems = ["Home", folder.name];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="mb-8 text-4xl font-bold text-slate-900">{folder.name}</h1>

      {folders.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {folders.map((childFolder) => (
              <FolderCard
                key={childFolder.id}
                name={childFolder.name}
                isFavorite={childFolder.isFavorite}
                onClick={() => navigate(`/folder/${childFolder.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                name={file.name}
                size={formatFileSize(file.size)}
                isFavorite={file.isFavorite}
                onClick={() => setPreviewFile(file)}
                onFavorite={() => handleToggleFavorite(file.id)}
                onDownload={() => downloadFile(file)}
                onDelete={() => setFileToDelete(file)}
                onDetail={() => setDetailFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-slate-500">This folder is empty.</p>
        </div>
      )}

      <PreviewFileModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <FileDetailsPanel file={detailFile} onClose={() => setDetailFile(null)} />

      <DeleteFileModal
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleMoveFileToTrash}
      />
    </div>
  );
};

export default FolderPage;

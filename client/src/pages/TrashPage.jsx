import React, { useEffect, useState } from "react";

import useFolderStore from "../store/useFolderStore";
import useFileStore from "../store/useFileStore";

import TrashFolderCard from "../components/TrashFolderCard";
import TrashFileCard from "../components/TrashFileCard";

import DeleteForeverFolderModal from "../components/DeleteForeverFolderModal";
import DeleteForeverFileModal from "../components/DeleteForeverFileModal";

import { formatFileSize } from "../utils/formatFileSize";

import {
  getTrashedFiles,
  restoreFile as restoreFileApi,
  permanentlyDeleteFile as permanentlyDeleteFileApi,
} from "../services/file.service";

const TrashPage = () => {
  const { folders, restoreFolder, permanentlyDeleteFolder } = useFolderStore();

  const { files, setFiles, restoreFile, permanentlyDeleteFile } =
    useFileStore();

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrashedFiles = async () => {
      try {
        const response = await getTrashedFiles();

        setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch trashed files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashedFiles();
  }, [setFiles]);

  const trashFolders = folders.filter((folder) => folder.isDeleted);

  const trashFiles = files.filter((file) => file.isTrashed);

  const handleRestoreFile = async (file) => {
    try {
      await restoreFileApi(file.id);

      restoreFile(file.id);
    } catch (error) {
      console.error("Failed to restore file:", error);
    }
  };

  const handlePermanentlyDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await permanentlyDeleteFileApi(fileToDelete.id);

      permanentlyDeleteFile(fileToDelete.id);

      setFileToDelete(null);
    } catch (error) {
      console.error("Failed to permanently delete file:", error);
    }
  };

  const hasTrash = trashFolders.length > 0 || trashFiles.length > 0;

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-slate-500">Loading trash...</p>
      </div>
    );
  }

  if (!hasTrash) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-slate-700">
          Trash is empty
        </h2>

        <p className="mt-3 text-slate-500">
          Deleted files and folders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Trash</h1>

      {trashFolders.length > 0 && (
        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

          <div className="space-y-4">
            {trashFolders.map((folder) => (
              <TrashFolderCard
                key={folder.id}
                name={folder.name}
                onRestore={() => restoreFolder(folder.id)}
                onDeleteForever={() => setFolderToDelete(folder)}
              />
            ))}
          </div>
        </div>
      )}

      {trashFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

          <div className="space-y-4">
            {trashFiles.map((file) => (
              <TrashFileCard
                key={file.id}
                name={file.name}
                size={formatFileSize(file.size)}
                onRestore={() => handleRestoreFile(file)}
                onDeleteForever={() => setFileToDelete(file)}
              />
            ))}
          </div>
        </div>
      )}

      <DeleteForeverFolderModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (!folderToDelete) return;

          permanentlyDeleteFolder(folderToDelete.id);
          setFolderToDelete(null);
        }}
      />

      <DeleteForeverFileModal
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handlePermanentlyDeleteFile}
      />
    </div>
  );
};

export default TrashPage;

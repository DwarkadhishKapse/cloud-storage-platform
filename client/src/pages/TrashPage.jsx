import React, { useEffect, useState } from "react";

import useFolderStore from "../store/useFolderStore";
import useFileStore from "../store/useFileStore";

import TrashFolderCard from "../components/TrashFolderCard";
import TrashFileCard from "../components/TrashFileCard";

import DeleteForeverFolderModal from "../components/DeleteForeverFolderModal";
import DeleteForeverFileModal from "../components/DeleteForeverFileModal";
import PreviewFileModal from "../components/PreviewFileModal";

import { formatFileSize } from "../utils/formatFileSize";

import {
  getTrashedFiles,
  restoreFile as restoreFileApi,
  permanentlyDeleteFile as permanentlyDeleteFileApi,
} from "../services/file.service";

import { getTrashedFolders } from "../services/folder.service";

const TrashPage = () => {
  const { folders, setFolders, restoreFolder, permanentlyDeleteFolder } =
    useFolderStore();

  const { files, setFiles, restoreFile, permanentlyDeleteFile } =
    useFileStore();

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [loading, setLoading] = useState(true);

  const buildTrashTree = (folderList, fileList) => {
    const folderMap = new Map(
      folderList.map((folder) => [folder.id, { ...folder, children: [], files: [] }]),
    );

    const rootFolders = [];
    const rootFiles = [];

    folderList.forEach((folder) => {
      const node = folderMap.get(folder.id);

      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId).children.push(node);
      } else {
        rootFolders.push(node);
      }
    });

    fileList.forEach((file) => {
      const parentFolder = folderMap.get(file.folderId);

      if (parentFolder) {
        parentFolder.files.push(file);
      } else {
        rootFiles.push(file);
      }
    });

    return { rootFolders, rootFiles };
  };

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const [folderResponse, fileResponse] = await Promise.all([
          getTrashedFolders(),
          getTrashedFiles(),
        ]);

        setFolders(folderResponse.folders);
        setFiles(fileResponse.files);
      } catch (error) {
        console.error("Failed to fetch trash:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrash();
  }, [setFolders, setFiles]);

  const trashFolders = folders.filter((folder) => folder.isTrashed);
  const trashFiles = files.filter((file) => file.isTrashed);
  const { rootFolders, rootFiles } = buildTrashTree(trashFolders, trashFiles);

  const handleRestoreFile = async (file) => {
    try {
      await restoreFileApi(file.id);

      restoreFile(file.id);
    } catch (error) {
      console.error("Failed to restore file:", error);
    }
  };

  const handleRestoreFolder = async (folder) => {
    try {
      await restoreFolder(folder.id);
    } catch (error) {
      console.error("Failed to restore folder:", error);
    }
  };

  const handleDeleteForeverFolder = async (folder) => {
    if (!folder) return;

    setFolderToDelete(folder);
  };

  const handlePermanentlyDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await permanentlyDeleteFileApi(fileToDelete.id);

      permanentlyDeleteFile(fileToDelete.id);

      setFileToDelete(null);

      if (previewFile?.id === fileToDelete.id) {
        setPreviewFile(null);
      }
    } catch (error) {
      console.error("Failed to permanently delete file:", error);
    }
  };

  const handlePermanentlyDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      await permanentlyDeleteFolder(folderToDelete.id);

      setFolderToDelete(null);
    } catch (error) {
      console.error("Failed to permanently delete folder:", error);
    }
  };

  const hasTrash = rootFolders.length > 0 || rootFiles.length > 0;

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

      {rootFolders.length > 0 && (
        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

          <div className="space-y-4">
            {rootFolders.map((folder) => (
              <TrashFolderCard
                key={folder.id}
                name={folder.name}
                folders={folder.children}
                files={folder.files}
                onRestore={() => handleRestoreFolder(folder)}
                onDeleteForever={() => handleDeleteForeverFolder(folder)}
                onOpenFile={(file) => setPreviewFile(file)}
                onRestoreFile={(file) =>
                  file?.folderId ? handleRestoreFile(file) : handleRestoreFolder(file)
                }
                onDeleteForeverFile={(file) =>
                  file?.folderId ? setFileToDelete(file) : setFolderToDelete(file)
                }
              />
            ))}
          </div>
        </div>
      )}

      {rootFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

          <div className="space-y-4">
            {rootFiles.map((file) => (
              <TrashFileCard
                key={file.id}
                name={file.name}
                size={formatFileSize(file.size)}
                onClick={() => setPreviewFile(file)}
                onRestore={() => handleRestoreFile(file)}
                onDeleteForever={() => setFileToDelete(file)}
              />
            ))}
          </div>
        </div>
      )}

      <PreviewFileModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <DeleteForeverFolderModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handlePermanentlyDeleteFolder}
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

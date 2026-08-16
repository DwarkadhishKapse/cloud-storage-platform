import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import PreviewFileModal from "../components/PreviewFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import ShareModal from "../components/ShareModal";

import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

import {
  getSharedFilesWithMe,
} from "../services/file.service";

import { getSharedFoldersWithMe } from "../services/folder.service";

const SharedWithMePage = () => {
  const navigate = useNavigate();

  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemToShare, setItemToShare] = useState(null);

  useEffect(() => {
    const fetchSharedItems = async () => {
      try {
        setLoading(true);

        const [filesResponse, foldersResponse] = await Promise.all([
          getSharedFilesWithMe(),
          getSharedFoldersWithMe(),
        ]);

        setSharedFiles(filesResponse.files || []);
        setSharedFolders(foldersResponse.folders || []);
      } catch (error) {
        console.error("Failed to fetch shared items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItems();
  }, []);

  const closePreview = () => setPreviewFile(null);
  const closeDetail = () => setDetailFile(null);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-slate-600">
            Loading shared items...
          </div>
        </div>
      </div>
    );
  }

  const hasSharedItems =
    sharedFolders.length > 0 || sharedFiles.length > 0;

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Shared with me</h1>

      {!hasSharedItems ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <h2 className="mb-2 text-xl font-semibold text-slate-600">
            No shared items yet
          </h2>
          <p className="text-slate-500">
            Files and folders shared with you will appear here
          </p>
        </div>
      ) : (
        <>
          {sharedFolders.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sharedFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    name={folder.name}
                    isFavorite={folder.isFavorite}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {sharedFiles.length > 0 && (
            <div>
              <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

              <div className="space-y-4">
                {sharedFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    name={file.name}
                    size={formatFileSize(file.size)}
                    isFavorite={file.isFavorite}
                    onClick={() => setPreviewFile(file)}
                    onDownload={() => downloadFile(file)}
                    onDetail={() => setDetailFile(file)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <PreviewFileModal file={previewFile} onClose={closePreview} />

      <FileDetailsPanel file={detailFile} onClose={closeDetail} />

      <ShareModal
        item={itemToShare?.item}
        type={itemToShare?.type}
        onClose={() => setItemToShare(null)}
      />
    </div>
  );
};

export default SharedWithMePage;

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import PreviewFileModal from "../components/PreviewFileModal";
import FileDetailsPanel from "../components/FileDetailsPanel";
import ShareModal from "../components/ShareModal";

import { searchItems } from "../services/search.service";
import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

import useViewStore from "../store/useViewStore";
import useFileStore from "../store/useFileStore";
import useFolderStore from "../store/useFolderStore";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() || "";

  const { view } = useViewStore();

  const { toggleFileFavorite } = useFileStore();
  const { toggleFolderFavorite } = useFolderStore();

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [previewFile, setPreviewFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);
  const [itemToShare, setItemToShare] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setFolders([]);
        setFiles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await searchItems(query);

        setFolders(response.folders || []);
        setFiles(response.files || []);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Unable to complete the search.");
        setFolders([]);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleToggleFileFavorite = async (fileId) => {
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

  const handleToggleFolderFavorite = async (folderId) => {
    try {
      const updatedFolder = await toggleFolderFavorite(folderId);

      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId ? updatedFolder : folder,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle folder favorite:", error);
    }
  };

  const totalResults = folders.length + files.length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">Search</p>

        <h1 className="mt-1 text-4xl font-bold text-slate-900">
          Search results
        </h1>

        {query && (
          <p className="mt-2 text-slate-500">
            Results for{" "}
            <span className="font-medium text-slate-700">"{query}"</span>
          </p>
        )}
      </div>

      {loading && (
        <div className="mt-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">
            Searching your files and folders...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-16 text-center">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && query && totalResults === 0 && (
        <div className="mt-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            🔍
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800">
            No results found
          </h2>

          <p className="mt-2 text-slate-500">
            Try searching for a different file or folder name.
          </p>
        </div>
      )}

      {!loading && !error && totalResults > 0 && (
        <div className="space-y-10">
          {folders.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Folders</h2>

                <span className="text-sm text-slate-500">
                  {folders.length} {folders.length === 1 ? "folder" : "folders"}
                </span>
              </div>

              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    name={folder.name}
                    isFavorite={folder.isFavorite}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                    onFavorite={() => handleToggleFolderFavorite(folder.id)}
                    onShare={() =>
                      setItemToShare({
                        item: folder,
                        type: "folder",
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {files.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Files</h2>

                <span className="text-sm text-slate-500">
                  {files.length} {files.length === 1 ? "file" : "files"}
                </span>
              </div>

              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    name={file.name}
                    size={formatFileSize(file.size)}
                    isFavorite={file.isFavorite}
                    onClick={() => setPreviewFile(file)}
                    onFavorite={() => handleToggleFileFavorite(file.id)}
                    onDownload={() => downloadFile(file)}
                    onDetail={() => setDetailFile(file)}
                    onShare={() =>
                      setItemToShare({
                        item: file,
                        type: "file",
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <PreviewFileModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <FileDetailsPanel file={detailFile} onClose={() => setDetailFile(null)} />

      <ShareModal
        item={itemToShare?.item}
        type={itemToShare?.type}
        onClose={() => setItemToShare(null)}
      />
    </div>
  );
};

export default SearchPage;

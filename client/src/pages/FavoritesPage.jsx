import React from "react";
import { useNavigate } from "react-router-dom";
import useFolderStore from "../store/useFolderStore";
import useFileStore from "../store/useFileStore";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import PreviewFileModal from "../components/PreviewFileModal";
import { formatFileSize } from "../utils/formatFileSize";
import { downloadFile } from "../utils/downloadFile";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { folders, toggleFolderFavorite } = useFolderStore();
  const { files, toggleFileFavorite, previewFile, setPreviewFile, closePreview } = useFileStore();

  const activeFolders = folders.filter((folder) => !folder.isDeleted);
  const favoriteFolders = activeFolders.filter((folder) => folder.isFavorite);

  const activeFiles = files.filter((file) => !file.isDeleted);
  const favoriteFiles = activeFiles.filter((file) => file.isFavorite);

  const hasFavorites = favoriteFolders.length > 0 || favoriteFiles.length > 0;

  if (!hasFavorites) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-slate-700">
          No favorites yet
        </h2>
        <p className="mt-3 text-slate-500">
          Star files and folders to access them quickly.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Favorites</h1>
      {favoriteFolders.length > 0 && (
        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Folders</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favoriteFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                name={folder.name}
                isFavorite={folder.isFavorite}
                onClick={() => navigate(`/folder/${folder.id}`)}
                onFavorite={() => toggleFolderFavorite(folder.id)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {favoriteFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Files</h2>

          <div className="space-y-4">
            {favoriteFiles.map((file) => (
              <FileCard
                key={file.id}
                name={file.name}
                size={formatFileSize(file.size)}
                isFavorite={file.isFavorite}
                onClick={() => setPreviewFile(file)}
                onFavorite={() => toggleFileFavorite(file.id)}
                onDownload={() => downloadFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      <PreviewFileModal file={previewFile} onClose={closePreview} />
    </div>
  );
};

export default FavoritesPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import useFolderStore from "../store/useFolderStore";
import FolderCard from "../components/FolderCard";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { folders, toggleFavorite } = useFolderStore();

  const favoriteFolders = folders.filter((folder) => folder.isFavorite);

  if (favoriteFolders.length === 0) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-slate-700">
          No favorites yet
        </h2>
        <p className="mt-3 text-slate-500">
          Star folders to access them quickly.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Favorites</h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {favoriteFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            name={folder.name}
            isFavorite={folder.isFavorite}
            onClick={() => navigate(`/folder/${folder.id}`)}
            onFavorite={() => toggleFavorite(folder.id)}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

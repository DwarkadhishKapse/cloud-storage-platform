import React, { useState } from "react";
import useFolderStore from "../store/useFolderStore";
import TrashFolderCard from "../components/TrashFolderCard";
import DeleteForeverModal from "../components/DeleteForeverModal";

const TrashPage = () => {
  const { folders, restoreFolder, permanentlyDeleteFolder } = useFolderStore();

  const [folderToDelete, setFolderToDelete] = useState(null);

  const trashFolders = folders.filter((folder) => folder.isDeleted);

  if (trashFolders.length === 0) {
    return (
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-slate-700">
          Trash is empty
        </h2>
        <p className="mt-3 text-slate-500">Deleted folders will appear here.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Trash</h1>

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

      <DeleteForeverModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (!folderToDelete) return;
          permanentlyDeleteFolder(folderToDelete.id);
          setFolderToDelete(null);
        }}
      />
    </div>
  );
};

export default TrashPage;

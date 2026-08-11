import { create } from "zustand";

const useFolderStore = create((set) => ({
  folders: [],

  setFolders: (folders) =>
    set({
      folders,
    }),

  addFolder: (folder) =>
    set((state) => ({
      folders: [folder, ...state.folders],
    })),

  detailFolder: null,

  setDetailFolder: (folder) =>
    set({
      detailFolder: folder,
    }),

  closeFolderDetail: () =>
    set({
      detailFolder: null,
    }),

  moveToTrash: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, isDeleted: true } : folder,
      ),
    })),

  restoreFolder: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, isDeleted: false } : folder,
      ),
    })),

  permanentlyDeleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  renameFolderLocal: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder,
      ),
    })),

  toggleFolderFavorite: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? {
              ...folder,
              isFavorite: !folder.isFavorite,
            }
          : folder,
      ),
    })),
}));

export default useFolderStore;

import { create } from "zustand";
import { toggleFolderFavorite } from "../services/folder.service";

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

  toggleFolderFavorite: async (id) => {
    try {
      const response = await toggleFolderFavorite(id);

      set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === id ? response.folder : folder,
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle folder favorite:", error);
    }
  },
}));

export default useFolderStore;

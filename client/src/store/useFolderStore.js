import { create } from "zustand";

const useFolderStore = create((set) => ({
  folders: [
    {
      id: 1,
      name: "College",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "Photos",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },
    {
      id: 3,
      name: "Documents",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },
  ],

  detailFolder: null,

  setDetailFolder: (folder) =>
    set({
      detailFolder: folder,
    }),

  closeFolderDetail: () =>
    set({
      detailFolder: null,
    }),

  createFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        {
          id: Date.now(),
          name,
          isFavorite: false,
          isDeleted: false,
          createdAt: Date.now(),
        },
      ],
    })),

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

  renameFolder: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder,
      ),
    })),

  toggleFolderFavorite: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? { ...folder, isFavorite: !folder.isFavorite }
          : folder,
      ),
    })),
}));

export default useFolderStore;

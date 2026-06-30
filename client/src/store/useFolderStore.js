import { create } from "zustand";

const useFolderStore = create((set) => ({
  folders: [
    {
      id: 1,
      name: "College",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Photos",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Documents",
      isFavorite: false,
    },
  ],

  createFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        {
          id: Date.now(),
          name,
          isFavorite: false,
        },
      ],
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  renameFolder: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder,
      ),
    })),

  toggleFolder: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? { ...folder, isFavorite: !folder.isFavorite }
          : folder,
      ),
    })),
}));

export default useFolderStore;

import { create } from "zustand";

const useFolderStore = create((set) => ({
  folders: [
    {
      id: 1,
      name: "College",
      isFavorite: false,
      isDeleted: false,
    },
    {
      id: 2,
      name: "Photos",
      isFavorite: false,
      isDeleted: false,
    },
    {
      id: 3,
      name: "Documents",
      isFavorite: false,
      isDeleted: false,
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
          isDeleted: false,
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
    set((state)=>({
      folders: state.folders.map((folder)=>
        folder.id === id
        ? {...folder, isDeleted: false}
        : folder
      ),
    })),

  renameFolder: (id, newName) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder,
      ),
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? { ...folder, isFavorite: !folder.isFavorite }
          : folder,
      ),
    })),
}));

export default useFolderStore;

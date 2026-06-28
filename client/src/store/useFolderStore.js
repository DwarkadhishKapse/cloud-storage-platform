import { create } from "zustand";

const useFolderStore = create((set) => ({
  folders: [
    {
      id: 1,
      name: "College",
    },
    {
      id: 2,
      name: "Photos",
    },
    {
      id: 3,
      name: "Documents",
    },
  ],

  createFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        {
          id: Date.now(),
          name,
        },
      ],
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),
}));

export default useFolderStore;

import { create } from "zustand";

const useFileStore = create((set) => ({
  files: [
    {
      id: 1,
      name: "Resume.pdf",
      size: 2411724,
      type: "pdf",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },

    {
      id: 2,
      name: "DBMS Notes.pdf",
      size: 6081740,
      type: "pdf",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },

    {
      id: 3,
      name: "Goa.jpg",
      size: 1258291,
      type: "image",
      isFavorite: false,
      isDeleted: false,
      createdAt: Date.now(),
    },
  ],

  addFile: (fileObject) => {
    set((state) => ({
      files: [
        ...state.files,
        {
          id: Date.now(),
          isFavorite: false,
          isDeleted: false,
          createdAt: Date.now(),
          ...fileObject,
        },
      ],
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isFavorite: !file.isFavorite } : file,
      ),
    }));
  },

  moveFileToTrash: (id) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isDeleted: true } : file,
      ),
    }));
  },

  restoreFile: (id) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isDeleted: false } : file,
      ),
    }));
  },

  permanentlyDeleteFile: (id) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    }));
  },
}));

export default useFileStore;

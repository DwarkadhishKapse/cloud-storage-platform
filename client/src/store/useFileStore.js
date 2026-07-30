import { create } from "zustand";

const useFileStore = create((set) => ({
  files: [],

  setFiles: (files) =>
    set({
      files,
    }),

  previewFile: null,

  detailFile: null,

  setPreviewFile: (file) =>
    set({
      previewFile: file,
    }),

  closePreview: () =>
    set({
      previewFile: null,
    }),

  setDetailFile: (file) =>
    set({
      detailFile: file,
    }),

  closeDetail: () =>
    set({
      detailFile: null,
    }),

  addFile: (fileObject) => {
    set((state) => ({
      files: [
        ...state.files,
        {
          id: Date.now(),
          isFavorite: false,
          isTrashed: false,
          createdAt: Date.now(),
          ...fileObject,
        },
      ],
    }));
  },

  toggleFileFavorite: (id) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isFavorite: !file.isFavorite } : file,
      ),
    })),

  moveFileToTrash: (id) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isTrashed: true } : file,
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

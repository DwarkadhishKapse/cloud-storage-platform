import { create } from "zustand";
import { toggleFileFavorite as toggleFileFavoriteService } from "../services/file.service";

const useFileStore = create((set) => ({
  files: [],

  setFiles: (files) =>
    set({
      files,
    }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

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

  toggleFileFavorite: async (id) => {
    const response = await toggleFileFavoriteService(id);

    set((state) => ({
      files: state.files.map((file) => (file.id === id ? response.file : file)),
    }));
  },

  moveFileToTrash: (id) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isTrashed: true } : file,
      ),
    })),

  restoreFile: (id) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, isTrashed: false } : file,
      ),
    })),

  permanentlyDeleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
}));

export default useFileStore;

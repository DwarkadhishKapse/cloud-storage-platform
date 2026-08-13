import { create } from "zustand";
import { toggleFileFavorite as toggleFileFavoriteApi } from "../services/file.service";

const useFileStore = create((set) => ({
  files: [],

  setFiles: (files) =>
    set({
      files,
    }),

  addFile: (file) =>
    set((state) => ({
      files: [file, ...state.files],
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
    try {
      const response = await toggleFileFavoriteApi(id);

      set((state) => ({
        files: state.files.map((file) =>
          file.id === id ? response.file : file,
        ),
      }));

      return response.file;
    } catch (error) {
      console.error("Failed to toggle file favorite:", error);
      throw error;
    }
  },

  moveFileToTrash: (id) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              isTrashed: true,
            }
          : file,
      ),
    })),

  restoreFile: (id) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              isTrashed: false,
            }
          : file,
      ),
    })),

  permanentlyDeleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
}));

export default useFileStore;

import { create } from "zustand";

import useFileStore from "./useFileStore";
import {
  toggleFolderFavorite,
  moveFolderToTrash,
  restoreFolder,
  permanentlyDeleteFolder,
} from "../services/folder.service";

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

  moveToTrash: async (id) => {
    try {
      const response = await moveFolderToTrash(id);

      set((state) => ({
        folders: state.folders.map((folder) =>
          response.folderIds.includes(folder.id)
            ? {
                ...folder,
                isTrashed: true,
              }
            : folder,
        ),
      }));

      if (response.fileIds?.length) {
        useFileStore.getState().moveFilesToTrash(response.fileIds);
      }

      return response;
    } catch (error) {
      console.error("Failed to move folder to trash:", error);
      throw error;
    }
  },

  restoreFolder: async (id) => {
    try {
      const response = await restoreFolder(id);

      set((state) => ({
        folders: state.folders.map((folder) =>
          response.folderIds.includes(folder.id)
            ? {
                ...folder,
                isTrashed: false,
              }
            : folder,
        ),
      }));

      if (response.fileIds?.length) {
        useFileStore.getState().restoreFiles(response.fileIds);
      }

      return response;
    } catch (error) {
      console.error("Failed to restore folder:", error);
      throw error;
    }
  },

  permanentlyDeleteFolder: async (id) => {
    try {
      const response = await permanentlyDeleteFolder(id);

      set((state) => ({
        folders: state.folders.filter(
          (folder) => !response.folderIds.includes(folder.id),
        ),
      }));

      if (response.fileIds?.length) {
        useFileStore.getState().permanentlyDeleteFiles(response.fileIds);
      }

      return response;
    } catch (error) {
      console.error("Failed to permanently delete folder:", error);
      throw error;
    }
  },

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

      return response.folder;
    } catch (error) {
      console.error("Failed to toggle folder favorite:", error);
      throw error;
    }
  },
}));

export default useFolderStore;

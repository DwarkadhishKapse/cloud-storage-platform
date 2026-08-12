import api from "./api";

export const getFolders = async () => {
  const response = await api.get("/folders");

  return response.data;
};

export const createFolder = async (folderData) => {
  const response = await api.post("/folders", folderData);

  return response.data;
};

export const renameFolder = async (folderId, name) => {
  const response = await api.patch(`/folders/${folderId}`, {
    name,
  });

  return response.data;
};

export const toggleFolderFavorite = async (folderId) => {
  const response = await api.patch(`/folders/${folderId}/favorite`);

  return response.data;
};

export const moveFolderToTrash = async (folderId) => {
  const response = await api.patch(`/folders/${folderId}/trash`);

  return response.data;
};

export const getTrashedFolders = async () => {
  const response = await api.get("/folders/trash");

  return response.data;
};

export const restoreFolder = async (folderId) => {
  const response = await api.patch(`/folders/${folderId}/restore`);

  return response.data;
};

export const permanentlyDeleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}/permanent`);

  return response.data;
};

export const getFolderContents = async (folderId) => {
  const response = await api.get(`/folders/${folderId}`);

  return response.data;
};
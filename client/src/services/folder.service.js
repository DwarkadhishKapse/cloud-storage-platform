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

export const deleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}`);

  return response.data;
};

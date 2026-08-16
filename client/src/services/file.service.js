import api from "./api";

export const getFiles = async () => {
  const response = await api.get("/files");

  return response.data;
};

export const getTrashedFiles = async () => {
  const response = await api.get("/files/trash");

  return response.data;
};

export const uploadFile = async (formData) => {
  const response = await api.post("/files/upload", formData);

  return response.data;
};

export const toggleFileFavorite = async (fileId) => {
  const response = await api.patch(`/files/${fileId}/favorite`);

  return response.data;
};

export const downloadFile = async (fileId) => {
  const response = await api.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });

  return response;
};

export const moveFileToTrash = async (fileId) => {
  const response = await api.patch(`/files/${fileId}/trash`);

  return response.data;
};

export const restoreFile = async (fileId) => {
  const response = await api.patch(`/files/${fileId}/restore`);

  return response.data;
};

export const permanentlyDeleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);

  return response.data;
};

export const getSharedFilesWithMe = async () => {
  const response = await api.get("/shares/shared-with-me/files");

  return response.data;
};

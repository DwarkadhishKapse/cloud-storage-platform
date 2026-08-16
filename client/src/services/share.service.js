import api from "./api";

export const getFileSharing = async (fileId) => {
  const response = await api.get(`/shares/files/${fileId}`);

  return response.data;
};

export const getFolderSharing = async (folderId) => {
  const response = await api.get(`/shares/folders/${folderId}`);

  return response.data;
};

export const getFileAccess = async (fileId) => {
  const response = await api.get(`/shares/files/${fileId}/access`);

  return response.data;
};

export const getFolderAccess = async (folderId) => {
  const response = await api.get(`/shares/folders/${folderId}/access`);

  return response.data;
};

export const addFileShare = async (fileId, email, role) => {
  const response = await api.post(`/shares/files/${fileId}`, {
    email,
    role,
  });

  return response.data;
};

export const addFolderShare = async (folderId, email, role) => {
  const response = await api.post(`/shares/folders/${folderId}`, {
    email,
    role,
  });

  return response.data;
};

export const updateFileShareRole = async (fileId, userId, role) => {
  const response = await api.patch(`/shares/files/${fileId}/users/${userId}`, {
    role,
  });

  return response.data;
};

export const updateFolderShareRole = async (folderId, userId, role) => {
  const response = await api.patch(
    `/shares/folders/${folderId}/users/${userId}`,
    {
      role,
    },
  );

  return response.data;
};

export const removeFileShare = async (fileId, userId) => {
  const response = await api.delete(`/shares/files/${fileId}/users/${userId}`);

  return response.data;
};

export const removeFolderShare = async (folderId, userId) => {
  const response = await api.delete(
    `/shares/folders/${folderId}/users/${userId}`,
  );

  return response.data;
};

export const updateFileGeneralAccess = async (fileId, linkAccess) => {
  const response = await api.patch(`/shares/files/${fileId}/general`, {
    linkAccess,
  });

  return response.data;
};

export const updateFolderGeneralAccess = async (folderId, linkAccess) => {
  const response = await api.patch(`/shares/folders/${folderId}/general`, {
    linkAccess,
  });

  return response.data;
};

export const getPublicFile = async (shareToken) => {
  const response = await api.get(`/shares/public/files/${shareToken}`);

  return response.data;
};

export const getPublicFolder = async (shareToken) => {
  const response = await api.get(`/shares/public/folders/${shareToken}`);

  return response.data;
};

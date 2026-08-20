import api from "./api";

export const getStorage = async () => {
  const response = await api.get("/storage");

  return response.data;
};
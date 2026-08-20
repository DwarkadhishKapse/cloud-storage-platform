import asyncHandler from "../utils/asyncHandler.js";

import { getStorageService } from "../services/storage.service.js";

export const getStorage = asyncHandler(async (req, res) => {
  const result = await getStorageService(req.user.id);

  return res.status(200).json(result);
});
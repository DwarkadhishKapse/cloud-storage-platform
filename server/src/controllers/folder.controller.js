import asyncHandler from "../utils/asyncHandler.js";
import { createFolderService } from "../services/folder.service.js";

export const createFolder = asyncHandler(async (req, res) => {
  const result = await createFolderService(req.body, req.user.id);

  return res.status(201).json(result);
});

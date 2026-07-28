import asyncHandler from "../utils/asyncHandler.js";
import { uploadFileService } from "../services/file.service.js";

export const uploadFile = asyncHandler(async (req, res) => {
  const result = await uploadFileService(req.file, req.body, req.user.id);

  return res.status(201).json(result);
});
    
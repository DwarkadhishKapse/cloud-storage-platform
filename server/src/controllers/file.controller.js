import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadFileService,
  getFilesService,
  moveFileToTrashService,
} from "../services/file.service.js";

export const uploadFile = asyncHandler(async (req, res) => {
  const result = await uploadFileService(req.file, req.body, req.user.id);

  return res.status(201).json(result);
});

export const getFiles = asyncHandler(async (req, res) => {
  const result = await getFilesService(req.user.id);

  return res.status(200).json(result);
});

export const moveFileToTrash = asyncHandler(async (req, res) => {
  const result = await moveFileToTrashService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

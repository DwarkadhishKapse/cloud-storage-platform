import asyncHandler from "../utils/asyncHandler.js";
import {
  createFolderService,
  getFoldersService,
  renameFolderService,
  deleteFolderService,
} from "../services/folder.service.js";

export const createFolder = asyncHandler(async (req, res) => {
  const result = await createFolderService(req.body, req.user.id);

  return res.status(201).json(result);
});

export const getFolders = asyncHandler(async (req, res) => {
  const result = await getFoldersService(req.user.id);

  return res.status(200).json(result);
});

export const renameFolder = asyncHandler(async (req, res) => {
  const result = await renameFolderService(
    req.params.id,
    req.body,
    req.user.id,
  );

  return res.status(200).json(result);
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const result = await deleteFolderService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

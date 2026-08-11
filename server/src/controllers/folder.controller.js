import asyncHandler from "../utils/asyncHandler.js";

import {
  createFolderService,
  getFoldersService,
  getTrashedFoldersService,
  renameFolderService,
  moveFolderToTrashService,
  restoreFolderService,
  permanentlyDeleteFolderService,
  toggleFolderFavoriteService,
} from "../services/folder.service.js";

export const createFolder = asyncHandler(async (req, res) => {
  const result = await createFolderService(req.body, req.user.id);

  return res.status(201).json(result);
});

export const getFolders = asyncHandler(async (req, res) => {
  const result = await getFoldersService(req.user.id);

  return res.status(200).json(result);
});

export const getTrashedFolders = asyncHandler(async (req, res) => {
  const result = await getTrashedFoldersService(req.user.id);

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

export const moveFolderToTrash = asyncHandler(async (req, res) => {
  const result = await moveFolderToTrashService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const restoreFolder = asyncHandler(async (req, res) => {
  const result = await restoreFolderService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const permanentlyDeleteFolder = asyncHandler(async (req, res) => {
  const result = await permanentlyDeleteFolderService(
    req.params.id,
    req.user.id,
  );

  return res.status(200).json(result);
});

export const toggleFolderFavorite = asyncHandler(async (req, res) => {
  const result = await toggleFolderFavoriteService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

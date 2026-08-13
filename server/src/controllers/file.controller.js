import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import {
  uploadFileService,
  getFilesService,
  getTrashedFilesService,
  moveFileToTrashService,
  restoreFileService,
  permanentlyDeleteFileService,
  toggleFileFavoriteService,
  getFileForDownloadService,
} from "../services/file.service.js";

export const uploadFile = asyncHandler(async (req, res) => {
  const result = await uploadFileService(req.file, req.body, req.user.id);

  return res.status(201).json(result);
});

export const getFiles = asyncHandler(async (req, res) => {
  const result = await getFilesService(req.user.id);

  return res.status(200).json(result);
});

export const getTrashedFiles = asyncHandler(async (req, res) => {
  const result = await getTrashedFilesService(req.user.id);

  return res.status(200).json(result);
});

export const moveFileToTrash = asyncHandler(async (req, res) => {
  const result = await moveFileToTrashService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const restoreFile = asyncHandler(async (req, res) => {
  const result = await restoreFileService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const permanentlyDeleteFile = asyncHandler(async (req, res) => {
  const result = await permanentlyDeleteFileService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const toggleFileFavorite = asyncHandler(async (req, res) => {
  const result = await toggleFileFavoriteService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const downloadFile = asyncHandler(async (req, res) => {
  const file = await getFileForDownloadService(req.params.id, req.user.id);

  const response = await fetch(file.url);

  if (!response.ok) {
    throw new ApiError(502, "Unable to download file from storage");
  }

  const contentType =
    response.headers.get("content-type") ||
    file.mimeType ||
    "application/octet-stream";

  const buffer = Buffer.from(await response.arrayBuffer());

  const safeFileName = file.name.replace(/"/g, '\\"');

  res.setHeader("Content-Type", contentType);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeFileName}"`,
  );

  res.setHeader("Content-Length", buffer.length);

  res.send(buffer);
});

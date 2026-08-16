import asyncHandler from "../utils/asyncHandler.js";

import {
  getFileSharingService,
  getFolderSharingService,
  addFileShareService,
  addFolderShareService,
  removeFileShareService,
  removeFolderShareService,
  updateFileShareRoleService,
  updateFolderShareRoleService,
  updateFileGeneralAccessService,
  updateFolderGeneralAccessService,
} from "../services/share.service.js";

import {
  getFileAccessService,
  getFolderAccessService,
} from "../services/access.service.js";

export const getFileSharing = asyncHandler(async (req, res) => {
  const result = await getFileSharingService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const getFolderSharing = asyncHandler(async (req, res) => {
  const result = await getFolderSharingService(req.params.id, req.user.id);

  return res.status(200).json(result);
});

export const addFileShare = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const result = await addFileShareService(
    req.params.id,
    req.user.id,
    email,
    role,
  );

  return res.status(200).json(result);
});

export const addFolderShare = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const result = await addFolderShareService(
    req.params.id,
    req.user.id,
    email,
    role,
  );

  return res.status(200).json(result);
});

export const updateFileShareRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const result = await updateFileShareRoleService(
    req.params.id,
    req.user.id,
    req.params.userId,
    role,
  );

  return res.status(200).json(result);
});

export const updateFolderShareRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const result = await updateFolderShareRoleService(
    req.params.id,
    req.user.id,
    req.params.userId,
    role,
  );

  return res.status(200).json(result);
});

export const removeFileShare = asyncHandler(async (req, res) => {
  const result = await removeFileShareService(
    req.params.id,
    req.user.id,
    req.params.userId,
  );

  return res.status(200).json(result);
});

export const removeFolderShare = asyncHandler(async (req, res) => {
  const result = await removeFolderShareService(
    req.params.id,
    req.user.id,
    req.params.userId,
  );

  return res.status(200).json(result);
});

export const updateFileGeneralAccess = asyncHandler(async (req, res) => {
  const { linkAccess } = req.body;

  const result = await updateFileGeneralAccessService(
    req.params.id,
    req.user.id,
    linkAccess,
  );

  return res.status(200).json(result);
});

export const updateFolderGeneralAccess = asyncHandler(async (req, res) => {
  const { linkAccess } = req.body;

  const result = await updateFolderGeneralAccessService(
    req.params.id,
    req.user.id,
    linkAccess,
  );

  return res.status(200).json(result);
});

export const getFileAccess = asyncHandler(async (req, res) => {
  const result = await getFileAccessService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    access: result,
  });
});

export const getFolderAccess = asyncHandler(async (req, res) => {
  const result = await getFolderAccessService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    access: result,
  });
});

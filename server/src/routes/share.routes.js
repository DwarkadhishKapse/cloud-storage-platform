import { Router } from "express";

import protect from "../middleware/auth.middleware.js";

import {
  getFileSharing,
  getFolderSharing,
  addFileShare,
  addFolderShare,
  updateFileShareRole,
  updateFolderShareRole,
  removeFileShare,
  removeFolderShare,
  updateFileGeneralAccess,
  updateFolderGeneralAccess,
  getFileAccess,
  getFolderAccess,
  getPublicFileAccess,
  getPublicFolderAccess,
  getSharedFilesWithMe,
  getSharedFoldersWithMe,
} from "../controllers/share.controller.js";

const router = Router();

router.get("/public/files/:shareToken", getPublicFileAccess);
router.get("/public/folders/:shareToken", getPublicFolderAccess);

router.get("/shared-with-me/files", protect, getSharedFilesWithMe);
router.get("/shared-with-me/folders", protect, getSharedFoldersWithMe);

router.get("/files/:id", protect, getFileSharing);
router.get("/files/:id/access", protect, getFileAccess);
router.post("/files/:id", protect, addFileShare);
router.patch("/files/:id/users/:userId", protect, updateFileShareRole);
router.delete("/files/:id/users/:userId", protect, removeFileShare);
router.patch("/files/:id/general", protect, updateFileGeneralAccess);

router.get("/folders/:id", protect, getFolderSharing);
router.get("/folders/:id/access", protect, getFolderAccess);
router.post("/folders/:id", protect, addFolderShare);
router.patch("/folders/:id/users/:userId", protect, updateFolderShareRole);
router.delete("/folders/:id/users/:userId", protect, removeFolderShare);
router.patch("/folders/:id/general", protect, updateFolderGeneralAccess);

export default router;

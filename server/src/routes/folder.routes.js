import { Router } from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createFolder,
  getFolders,
  getTrashedFolders,
  renameFolder,
  moveFolderToTrash,
  restoreFolder,
  permanentlyDeleteFolder,
  toggleFolderFavorite,
  getFolderContents,
} from "../controllers/folder.controller.js";

const router = Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.get("/trash", protect, getTrashedFolders);
router.get("/:id", protect, getFolderContents);
router.patch("/:id", protect, renameFolder);
router.patch("/:id/favorite", protect, toggleFolderFavorite);
router.patch("/:id/trash", protect, moveFolderToTrash);
router.patch("/:id/restore", protect, restoreFolder);
router.delete("/:id/permanent", protect, permanentlyDeleteFolder);

export default router;

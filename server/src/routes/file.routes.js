import { Router } from "express";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  uploadFile,
  getFiles,
  getTrashedFiles,
  moveFileToTrash,
  restoreFile,
  permanentlyDeleteFile,
  toggleFileFavorite,
  downloadFile,
} from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);
router.get("/trash", protect, getTrashedFiles);
router.get("/:id/download", protect, downloadFile);
router.patch("/:id/favorite", protect, toggleFileFavorite);
router.patch("/:id/trash", protect, moveFileToTrash);
router.patch("/:id/restore", protect, restoreFile);
router.delete("/:id", protect, permanentlyDeleteFile);

export default router;

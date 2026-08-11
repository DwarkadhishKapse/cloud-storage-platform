import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadFile,
  getFiles,
  moveFileToTrash,
  toggleFileFavorite,
} from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);
router.patch("/:id/trash", protect, moveFileToTrash);
router.patch("/:id/favorite", protect, toggleFileFavorite);

export default router;

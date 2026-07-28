import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createFolder,
  getFolders,
  renameFolder,
} from "../controllers/folder.controller.js";

const router = Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.patch("/:id", protect, renameFolder);

export default router;

import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadFile } from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", protect, upload.single("file"), uploadFile);

export default router;
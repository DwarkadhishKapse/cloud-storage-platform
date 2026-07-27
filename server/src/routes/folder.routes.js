import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { createFolder, getFolders } from "../controllers/folder.controller.js";


const router = Router();

router.post("/", protect, createFolder);
router.get("/", protect, getFolders);

export default router;

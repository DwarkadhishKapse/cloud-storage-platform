import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { createFolder } from "../controllers/folder.controller.js";

const router = Router();

router.post("/", protect, createFolder);

export default router;

import { Router } from "express";

import protect from "../middleware/auth.middleware.js";

import { getStorage } from "../controllers/storage.controller.js";

const router = Router();

router.get("/", protect, getStorage);

export default router;
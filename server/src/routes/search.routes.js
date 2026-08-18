import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = Router();

router.get("/", protect, search);

export default router;
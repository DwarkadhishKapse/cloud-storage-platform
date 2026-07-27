import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;

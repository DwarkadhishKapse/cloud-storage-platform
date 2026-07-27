import asyncHandler from "../utils/asyncHandler.js";
import { registerUser, loginUser } from "../services/auth.service.js";
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res
    .status(200)
    .cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: result.message,
      user: result.user,
    });
});

import asyncHandler from "../utils/asyncHandler.js";
import { registerUser, loginUser } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return res
    .status(201)
    .cookie("accessToken", result.token, cookieOptions)
    .json({
      success: true,
      message: result.message,
      user: result.user,
    });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return res
    .status(200)
    .cookie("accessToken", result.token, cookieOptions)
    .json({
      success: true,
      message: result.message,
      user: result.user,
    });
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful.",
    });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

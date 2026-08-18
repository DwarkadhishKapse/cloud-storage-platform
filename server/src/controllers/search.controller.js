import asyncHandler from "../utils/asyncHandler.js";
import { searchService } from "../services/search.service.js";

export const search = asyncHandler(async (req, res) => {
  const result = await searchService(req.query.q, req.user.id);

  return res.status(200).json(result);
});
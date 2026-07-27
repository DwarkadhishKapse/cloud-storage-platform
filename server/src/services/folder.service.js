import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export const createFolderService = async (folderData, ownerId) => {
  const { name, parentId } = folderData;

  if (!name) {
    throw new ApiError(400, "Folder name is required.");
  }

  let parentFolder = null;

  if (parentId) {
    parentFolder = await prisma.folder.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentFolder) {
      throw new ApiError(404, "Parent folder not found.");
    }

    if (parentFolder.ownerId !== ownerId) {
      throw new ApiError(403, "You are not allowed to access this folder.");
    }
  }

  const folder = await prisma.folder.create({
    data: {
      name,
      parentId,
      ownerId,
    },
  });

  return {
    success: true,
    message: "Folder created successfully.",
    folder,
  };
};

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

export const getFoldersService = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    folders,
  };
};

export const renameFolderService = async (folderId, folderData, ownerId) => {
  const { name } = folderData;

  if (!name) {
    throw new ApiError(400, "Folder name is required");
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(403, "You are not allowed to modify this folder");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name,
    },
  });

  return {
    success: true,
    message: "Folder renamed successfully.",
    folder: updatedFolder,
  };
};

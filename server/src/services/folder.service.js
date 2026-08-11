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
    throw new ApiError(400, "Folder name is required.");
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
    throw new ApiError(403, "You are not allowed to modify this folder.");
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

export const getTrashedFoldersService = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
      isTrashed: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    success: true,
    folders,
  };
};

export const moveFolderToTrashService = async (folderId, ownerId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(403, "You are not allowed to modify this folder.");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      isTrashed: true,
    },
  });

  return {
    success: true,
    message: "Folder moved to trash successfully.",
    folder: updatedFolder,
  };
};

export const restoreFolderService = async (folderId, ownerId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(403, "You are not allowed to modify this folder.");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      isTrashed: false,
    },
  });

  return {
    success: true,
    message: "Folder restored successfully.",
    folder: updatedFolder,
  };
};

export const permanentlyDeleteFolderService = async (folderId, ownerId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(403, "You are not allowed to delete this folder.");
  }

  const childFolders = await prisma.folder.findFirst({
    where: {
      parentId: folderId,
    },
  });

  if (childFolders) {
    throw new ApiError(
      400,
      "Cannot permanently delete a folder that contains child folders.",
    );
  }

  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });

  return {
    success: true,
    message: "Folder permanently deleted.",
  };
};

export const toggleFolderFavoriteService = async (folderId, ownerId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to modify this folder.",
    );
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      isFavorite: !folder.isFavorite,
    },
  });

  return {
    success: true,
    message: updatedFolder.isFavorite
      ? "Folder added to favorites."
      : "Folder removed from favorites.",
    folder: updatedFolder,
  };
};

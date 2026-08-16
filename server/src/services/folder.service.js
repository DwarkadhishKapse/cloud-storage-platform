import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import { getFolderAccessService } from "./access.service.js";

const getFolderSubtree = async (folderId, ownerId) => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
    },
  });

  const folderMap = new Map(folders.map((folder) => [folder.id, folder]));
  const rootFolder = folderMap.get(folderId);

  if (!rootFolder) {
    throw new ApiError(404, "Folder not found.");
  }

  const subtree = [];
  const queue = [folderId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const currentFolder = folderMap.get(currentId);

    if (!currentFolder) continue;

    subtree.push(currentFolder);

    for (const folder of folders) {
      if (folder.parentId === currentId) {
        queue.push(folder.id);
      }
    }
  }

  return subtree;
};

const getFolderDepth = (folder, folderMap) => {
  let depth = 0;
  let current = folder;

  while (current.parentId) {
    const parent = folderMap.get(current.parentId);

    if (!parent) break;

    depth += 1;
    current = parent;
  }

  return depth;
};

const getFolderSubtreeIds = (folders) => {
  return folders.map((folder) => folder.id);
};

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

    if (parentFolder.isTrashed) {
      throw new ApiError(
        400,
        "Cannot create a folder inside a trashed folder.",
      );
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

export const getFoldersService = async (userId) => {
  const folders = await prisma.folder.findMany({
    where: {
      parentId: null,
      isTrashed: false,
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      shares: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const accessibleFolders = folders.filter((folder) => {
    if (folder.ownerId === userId) return true;
    if (folder.shares.length > 0) return true;
    return false;
  });

  return {
    success: true,
    folders: accessibleFolders,
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

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot rename a trashed folder.");
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

  if (folder.isTrashed) {
    throw new ApiError(400, "Folder is already in trash.");
  }

  const subtree = await getFolderSubtree(folderId, ownerId);
  const folderIds = getFolderSubtreeIds(subtree);

  const updatedFiles = await prisma.file.updateMany({
    where: {
      ownerId,
      folderId: {
        in: folderIds,
      },
      isTrashed: false,
    },
    data: {
      isTrashed: true,
    },
  });

  await prisma.folder.updateMany({
    where: {
      ownerId,
      id: {
        in: folderIds,
      },
      isTrashed: false,
    },
    data: {
      isTrashed: true,
    },
  });

  const updatedFolder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  const affectedFiles = await prisma.file.findMany({
    where: {
      ownerId,
      folderId: {
        in: folderIds,
      },
    },
    select: {
      id: true,
    },
  });

  return {
    success: true,
    message: "Folder moved to trash successfully.",
    folder: updatedFolder,
    folderIds,
    fileIds: affectedFiles.map((file) => file.id),
    affectedFileCount: updatedFiles.count,
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

  if (!folder.isTrashed) {
    throw new ApiError(400, "Folder is not in trash.");
  }

  const subtree = await getFolderSubtree(folderId, ownerId);
  const folderIds = getFolderSubtreeIds(subtree);

  await prisma.folder.updateMany({
    where: {
      ownerId,
      id: {
        in: folderIds,
      },
      isTrashed: true,
    },
    data: {
      isTrashed: false,
    },
  });

  await prisma.file.updateMany({
    where: {
      ownerId,
      folderId: {
        in: folderIds,
      },
      isTrashed: true,
    },
    data: {
      isTrashed: false,
    },
  });

  const restoredFolder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  const restoredFiles = await prisma.file.findMany({
    where: {
      ownerId,
      folderId: {
        in: folderIds,
      },
    },
    select: {
      id: true,
    },
  });

  return {
    success: true,
    message: "Folder restored successfully.",
    folder: restoredFolder,
    folderIds,
    fileIds: restoredFiles.map((file) => file.id),
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

  if (!folder.isTrashed) {
    throw new ApiError(
      400,
      "Folder must be in trash before permanent deletion.",
    );
  }

  const subtree = await getFolderSubtree(folderId, ownerId);
  const folderIds = getFolderSubtreeIds(subtree);

  const files = await prisma.file.findMany({
    where: {
      ownerId,
      folderId: {
        in: folderIds,
      },
    },
  });

  for (const file of files) {
    let resourceType = "raw";

    if (file.mimeType?.startsWith("image/")) {
      resourceType = "image";
    } else if (file.mimeType?.startsWith("video/")) {
      resourceType = "video";
    }

    try {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: resourceType,
        type: "upload",
        invalidate: true,
      });
    } catch (error) {
      console.error(
        `Cloudinary deletion failed for ${file.publicId}:`,
        error.message,
      );
    }
  }

  const folderMap = new Map(subtree.map((item) => [item.id, item]));

  const foldersByDepth = [...subtree].sort(
    (a, b) => getFolderDepth(b, folderMap) - getFolderDepth(a, folderMap),
  );

  await prisma.$transaction(async (tx) => {
    await tx.file.deleteMany({
      where: {
        ownerId,
        folderId: {
          in: folderIds,
        },
      },
    });

    for (const currentFolder of foldersByDepth) {
      await tx.folder.delete({
        where: {
          id: currentFolder.id,
        },
      });
    }
  });

  return {
    success: true,
    message: "Folder permanently deleted.",
    folderIds,
    fileIds: files.map((file) => file.id),
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

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot modify a trashed folder.");
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

export const getFolderContentsService = async (folderId, userId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      shares: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
      children: {
        where: {
          isTrashed: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      files: {
        where: {
          isTrashed: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  if (folder.isTrashed) {
    throw new ApiError(404, "Folder not found");
  }

  await getFolderAccessService(folderId, userId);

  const breadcrumb = [{ label: "Home", path: "/" }];
  let currentParentId = folder.parentId;

  while (currentParentId) {
    const parentFolder = await prisma.folder.findUnique({
      where: {
        id: currentParentId,
      },
    });

    if (!parentFolder) break;

    breadcrumb.splice(1, 0, {
      label: parentFolder.name,
      path: `/folder/${parentFolder.id}`,
    });

    currentParentId = parentFolder.parentId;
  }

  breadcrumb.push({
    label: folder.name,
    path: null,
  });

  const { children, files, ...folderData } = folder;

  return {
    success: true,
    folder: {
      ...folderData,
      breadcrumb,
    },
    folders: children,
    files: files.map((file) => ({
      ...file,
      size: Number(file.size),
    })),
  };
};

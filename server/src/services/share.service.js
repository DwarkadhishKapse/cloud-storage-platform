import crypto from "crypto";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

const generateShareToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const getUserForSharing = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new ApiError(400, "Email address is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "No ClouD user was found with this email address");
  }

  return user;
};

const getShareUserData = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
});

const getFileShareService = async (fileId, ownerId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
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
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to manage sharing for this file.",
    );
  }

  if (file.isTrashed) {
    throw new ApiError(400, "Cannot manage sharing for a file in trash.");
  }

  let shareToken = file.shareToken;

  if (file.linkAccess === "ANYONE" && !shareToken) {
    shareToken = generateShareToken();

    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        shareToken,
      },
    });
  }
  return {
    success: true,
    item: {
      id: file.id,
      name: file.name,
      type: "file",
    },
    owner: getShareUserData(file.owner),
    people: file.shares.map((share) => ({
      user: getShareUserData(share.user),
      role: share.role,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
    })),
    generalAccess: {
      type: file.linkAccess,
      role: "VIEWER",
    },
    shareToken,
  };
};

const getFolderShareService = async (folderId, ownerId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
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
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to manage sharing for this folder.",
    );
  }

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot manage sharing for a folder in trash.");
  }

  let shareToken = folder.shareToken;

  if (folder.linkAccess === "ANYONE" && !shareToken) {
    shareToken = generateShareToken();

    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        shareToken,
      },
    });
  }
  return {
    success: true,
    item: {
      id: folder.id,
      name: folder.name,
      type: "folder",
    },
    owner: getShareUserData(folder.owner),
    people: folder.shares.map((share) => ({
      user: getShareUserData(share.user),
      role: share.role,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
    })),
    generalAccess: {
      type: folder.linkAccess,
      role: "VIEWER",
    },
    shareToken,
  };
};

export const getFileSharingService = async (fileId, ownerId) => {
  return getFileShareService(fileId, ownerId);
};

export const getFolderSharingService = async (folderId, ownerId) => {
  return getFolderShareService(folderId, ownerId);
};

export const addFileShareService = async (
  fileId,
  ownerId,
  email,
  role = "VIEWER",
) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to share this file.");
  }

  if (file.isTrashed) {
    throw new ApiError(400, "Cannot share a file in trash.");
  }

  if (!["VIEWER", "COMMENTER", "EDITOR"].includes(role)) {
    throw new ApiError(400, "Invalid sharing role.");
  }

  const user = await getUserForSharing(email);

  if (user.id === ownerId) {
    throw new ApiError(400, "The owner already has access to this file.");
  }

  const share = await prisma.fileShare.upsert({
    where: {
      fileId_userId: {
        fileId,
        userId: user.id,
      },
    },
    update: {
      role,
    },
    create: {
      fileId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "File access updated successfully.",
    share: {
      user: getShareUserData(share.user),
      role: share.role,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
    },
  };
};

export const addFolderShareService = async (
  folderId,
  ownerId,
  email,
  role = "VIEWER",
) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to share this folder.");
  }

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot share a folder in trash.");
  }

  if (!["VIEWER", "COMMENTER", "EDITOR"].includes(role)) {
    throw new ApiError(400, "Invalid sharing role.");
  }

  const user = await getUserForSharing(email);

  if (user.id === ownerId) {
    throw new ApiError(400, "The owner already has access to this folder.");
  }

  const share = await prisma.folderShare.upsert({
    where: {
      folderId_userId: {
        folderId,
        userId: user.id,
      },
    },
    update: {
      role,
    },
    create: {
      folderId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Folder access updated successfully.",
    share: {
      user: getShareUserData(share.user),
      role: share.role,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
    },
  };
};

export const removeFileShareService = async (fileId, ownerId, userId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to manage sharing for this file.",
    );
  }

  const share = await prisma.fileShare.findUnique({
    where: {
      fileId_userId: {
        fileId,
        userId,
      },
    },
  });

  if (!share) {
    throw new ApiError(404, "Sharing permission not found.");
  }

  await prisma.fileShare.delete({
    where: {
      fileId_userId: {
        fileId,
        userId,
      },
    },
  });

  return {
    success: true,
    message: "File access removed successfully.",
  };
};

export const removeFolderShareService = async (folderId, ownerId, userId) => {
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
      "You do not have permission to manage sharing for this folder.",
    );
  }

  const share = await prisma.folderShare.findUnique({
    where: {
      folderId_userId: {
        folderId,
        userId,
      },
    },
  });

  if (!share) {
    throw new ApiError(404, "Sharing permission not found.");
  }

  await prisma.folderShare.delete({
    where: {
      folderId_userId: {
        folderId,
        userId,
      },
    },
  });

  return {
    success: true,
    message: "Folder access removed successfully.",
  };
};

export const updateFileGeneralAccessService = async (
  fileId,
  ownerId,
  linkAccess,
) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to manage sharing for this file.",
    );
  }

  if (file.isTrashed) {
    throw new ApiError(400, "Cannot change sharing for a file in trash.");
  }

  if (!["RESTRICTED", "ANYONE"].includes(linkAccess)) {
    throw new ApiError(400, "Invalid link access setting.");
  }

  const updatedFile = await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      linkAccess,
      shareToken:
        linkAccess === "ANYONE"
          ? file.shareToken || generateShareToken()
          : null,
    },
  });

  return {
    success: true,
    message:
      linkAccess === "ANYONE"
        ? "Anyone with the link can access this file."
        : "File access is now restricted.",
    generalAccess: {
      type: updatedFile.linkAccess,
      role: "VIEWER",
    },
    shareToken: updatedFile.shareToken,
  };
};

export const updateFolderGeneralAccessService = async (
  folderId,
  ownerId,
  linkAccess,
) => {
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
      "You do not have permission to manage sharing for this folder.",
    );
  }

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot change sharing for a folder in trash.");
  }

  if (!["RESTRICTED", "ANYONE"].includes(linkAccess)) {
    throw new ApiError(400, "Invalid link access setting.");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      linkAccess,
      shareToken:
        linkAccess === "ANYONE"
          ? folder.shareToken || generateShareToken()
          : null,
    },
  });

  return {
    success: true,
    message:
      linkAccess === "ANYONE"
        ? "Anyone with the link can access this folder."
        : "Folder access is now restricted.",
    generalAccess: {
      type: updatedFolder.linkAccess,
      role: "VIEWER",
    },
    shareToken: updatedFolder.shareToken,
  };
};

export const updateFileShareRoleService = async (
  fileId,
  ownerId,
  userId,
  role,
) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(
      403,
      "You do not have permission to manage sharing for this file.",
    );
  }

  if (file.isTrashed) {
    throw new ApiError(400, "Cannot change sharing for a file in trash.");
  }

  if (!["VIEWER", "COMMENTER", "EDITOR"].includes(role)) {
    throw new ApiError(400, "Invalid sharing role.");
  }

  const share = await prisma.fileShare.findUnique({
    where: {
      fileId_userId: {
        fileId,
        userId,
      },
    },
  });

  if (!share) {
    throw new ApiError(404, "File share not found.");
  }

  const updatedShare = await prisma.fileShare.update({
    where: {
      fileId_userId: {
        fileId,
        userId,
      },
    },
    data: {
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "File access role updated successfully.",
    share: {
      user: updatedShare.user,
      role: updatedShare.role,
      createdAt: updatedShare.createdAt,
      updatedAt: updatedShare.updatedAt,
    },
  };
};

export const updateFolderShareRoleService = async (
  folderId,
  ownerId,
  userId,
  role,
) => {
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
      "You do not have permission to manage sharing for this folder.",
    );
  }

  if (folder.isTrashed) {
    throw new ApiError(400, "Cannot change sharing for a folder in trash.");
  }

  if (!["VIEWER", "COMMENTER", "EDITOR"].includes(role)) {
    throw new ApiError(400, "Invalid sharing role.");
  }

  const share = await prisma.folderShare.findUnique({
    where: {
      folderId_userId: {
        folderId,
        userId,
      },
    },
  });

  if (!share) {
    throw new ApiError(404, "Folder share not found.");
  }

  const updatedShare = await prisma.folderShare.update({
    where: {
      folderId_userId: {
        folderId,
        userId,
      },
    },
    data: {
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Folder access role updated successfully.",
    share: {
      user: updatedShare.user,
      role: updatedShare.role,
      createdAt: updatedShare.createdAt,
      updatedAt: updatedShare.updatedAt,
    },
  };
};

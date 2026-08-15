import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

const rolePriority = {
  VIEWER: 1,
  COMMENTER: 2,
  EDITOR: 3,
};

const getHigherRole = (currentRole, newRole) => {
  if (!currentRole) return newRole;

  return rolePriority[newRole] > rolePriority[currentRole]
    ? newRole
    : currentRole;
};

const getFolderAncestors = async (folderId) => {
  const folders = await prisma.folder.findMany({
    select: {
      id: true,
      parentId: true,
      ownerId: true,
      isTrashed: true,
    },
  });

  const folderMap = new Map(folders.map((folder) => [folder.id, folder]));

  const ancestors = [];
  let currentFolder = folderMap.get(folderId);

  while (currentFolder?.parentId) {
    const parentFolder = folderMap.get(currentFolder.parentId);

    if (!parentFolder) break;

    ancestors.push(parentFolder);
    currentFolder = parentFolder;
  }

  return ancestors;
};

export const getFileAccessService = async (fileId, userId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
    include: {
      shares: {
        where: {
          userId,
        },
      },
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  if (file.isTrashed) {
    throw new ApiError(404, "File not found.");
  }

  if (file.ownerId === userId) {
    return {
      allowed: true,
      role: "OWNER",
      source: "OWNER",
    };
  }

  let role = null;
  let source = null;

  const directShare = file.shares[0];

  if (directShare) {
    role = directShare.role;
    source = "FILE";
  }

  if (file.folderId) {
    const ancestors = await getFolderAncestors(file.folderId);

    const folderIds = [file.folderId, ...ancestors.map((folder) => folder.id)];

    const folderShares = await prisma.folderShare.findMany({
      where: {
        folderId: {
          in: folderIds,
        },
        userId,
      },
    });

    for (const share of folderShares) {
      const previousRole = role;

      role = getHigherRole(role, share.role);

      if (role !== previousRole) {
        source = "FOLDER";
      }
    }
  }

  if (role) {
    return {
      allowed: true,
      role,
      source,
    };
  }

  throw new ApiError(403, "You do not have permission to access this file.");
};

export const getFolderAccessService = async (folderId, userId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      shares: {
        where: {
          userId,
        },
      },
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.isTrashed) {
    throw new ApiError(404, "Folder not found.");
  }

  if (folder.ownerId === userId) {
    return {
      allowed: true,
      role: "OWNER",
      source: "OWNER",
    };
  }

  let role = null;
  let source = null;

  const directShare = folder.shares[0];

  if (directShare) {
    role = directShare.role;
    source = "FOLDER";
  }

  const ancestors = await getFolderAncestors(folderId);

  const ancestorIds = ancestors.map((ancestor) => ancestor.id);

  if (ancestorIds.length > 0) {
    const ancestorShares = await prisma.folderShare.findMany({
      where: {
        folderId: {
          in: ancestorIds,
        },
        userId,
      },
    });

    for (const share of ancestorShares) {
      const previousRole = role;

      role = getHigherRole(role, share.role);

      if (role !== previousRole) {
        source = "INHERITED_FOLDER";
      }
    }
  }

  if (role) {
    return {
      allowed: true,
      role,
      source,
    };
  }

  throw new ApiError(403, "You do not have permission to access this folder.");
};

export const getPublicFileAccessService = async (shareToken) => {
  const file = await prisma.file.findUnique({
    where: {
      shareToken,
    },
  });

  if (!file || file.isTrashed || file.linkAccess !== "ANYONE") {
    throw new ApiError(404, "Shared file not found.");
  }

  return {
    allowed: true,
    role: "VIEWER",
    source: "PUBLIC_LINK",
    file,
  };
};

export const getPublicFolderAccessService = async (shareToken) => {
  const folder = await prisma.folder.findUnique({
    where: {
      shareToken,
    },
  });

  if (!folder || folder.isTrashed || folder.linkAccess !== "ANYONE") {
    throw new ApiError(404, "Shared folder not found.");
  }

  return {
    allowed: true,
    role: "VIEWER",
    source: "PUBLIC_LINK",
    folder,
  };
};

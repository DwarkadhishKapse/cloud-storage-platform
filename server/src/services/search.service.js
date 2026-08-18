import prisma from "../lib/prisma.js";

const getFolderAncestors = (folderId, folderMap) => {
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

export const searchService = async (query, userId) => {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return {
      success: true,
      query: "",
      folders: [],
      files: [],
    };
  }

  const [folders, files] = await Promise.all([
    prisma.folder.findMany({
      where: {
        isTrashed: false,
        name: {
          contains: normalizedQuery,
          mode: "insensitive",
        },
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
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.file.findMany({
      where: {
        isTrashed: false,
        name: {
          contains: normalizedQuery,
          mode: "insensitive",
        },
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
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const allFolders = await prisma.folder.findMany({
    where: {
      isTrashed: false,
    },
    select: {
      id: true,
      parentId: true,
      ownerId: true,
    },
  });

  const folderMap = new Map(allFolders.map((folder) => [folder.id, folder]));

  const sharedFolderShares = await prisma.folderShare.findMany({
    where: {
      userId,
      folder: {
        isTrashed: false,
      },
    },
    select: {
      folderId: true,
    },
  });

  const directlySharedFolderIds = new Set(
    sharedFolderShares.map((share) => share.folderId),
  );

  const accessibleFolderIds = new Set();

  for (const folder of folders) {
    if (folder.ownerId === userId) {
      accessibleFolderIds.add(folder.id);
      continue;
    }

    if (folder.shares.length > 0) {
      accessibleFolderIds.add(folder.id);
      continue;
    }

    const ancestors = getFolderAncestors(folder.id, folderMap);

    const hasInheritedAccess = ancestors.some((ancestor) =>
      directlySharedFolderIds.has(ancestor.id),
    );

    if (hasInheritedAccess) {
      accessibleFolderIds.add(folder.id);
    }
  }

  const accessibleFolders = folders.filter((folder) =>
    accessibleFolderIds.has(folder.id),
  );

  const accessibleFiles = [];

  for (const file of files) {
    if (file.ownerId === userId) {
      accessibleFiles.push(file);
      continue;
    }

    if (file.shares.length > 0) {
      accessibleFiles.push(file);
      continue;
    }

    if (!file.folderId) continue;

    if (accessibleFolderIds.has(file.folderId)) {
      accessibleFiles.push(file);
      continue;
    }

    const ancestors = getFolderAncestors(file.folderId, folderMap);

    const hasInheritedAccess = ancestors.some((ancestor) =>
      directlySharedFolderIds.has(ancestor.id),
    );

    if (hasInheritedAccess) {
      accessibleFiles.push(file);
    }
  }

  return {
    success: true,
    query: normalizedQuery,
    folders: accessibleFolders,
    files: accessibleFiles.map((file) => ({
      ...file,
      size: Number(file.size),
    })),
  };
};

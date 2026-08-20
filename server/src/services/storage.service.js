import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export const STORAGE_LIMIT = 15n * 1024n * 1024n * 1024n;

export const getStorageService = async (userId) => {
  const result = await prisma.file.aggregate({
    where: {
      ownerId: userId,
    },
    _sum: {
      size: true,
    },
  });

  const used = result._sum.size || 0n;

  const available = STORAGE_LIMIT > used ? STORAGE_LIMIT - used : 0n;

  const usedPercentage = Number((used * 10000n) / STORAGE_LIMIT) / 100;

  return {
    success: true,
    storage: {
      used: Number(used),
      limit: Number(STORAGE_LIMIT),
      available: Number(available),
      usedPercentage,
    },
  };
};

export const checkStorageAvailable = async (userId, fileSize) => {
  const result = await prisma.file.aggregate({
    where: {
      ownerId: userId,
    },
    _sum: {
      size: true,
    },
  });

  const used = result._sum.size || 0n;
  const incomingFileSize = BigInt(fileSize);

  const available = STORAGE_LIMIT - used;

  if (incomingFileSize > available) {
    const availableMB = Number(available) / (1024 * 1024);

    throw new ApiError(
      400,
      `Storage limit exceeded. You only have ${availableMB.toFixed(
        2,
      )} MB available.`,
    );
  }

  return true;
};

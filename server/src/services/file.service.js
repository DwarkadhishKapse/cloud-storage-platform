import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import { getFileAccessService } from "./access.service.js";
import { checkStorageAvailable } from "./storage.service.js";

export const uploadFileService = async (file, body, ownerId) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  await checkStorageAvailable(ownerId, file.size);

  const folderId = body.folderId || null;

  if (folderId) {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (!folder) {
      throw new ApiError(404, "The specified folder does not exist");
    }

    if (folder.ownerId !== ownerId) {
      throw new ApiError(
        403,
        "You do not have permission to upload files to this folder",
      );
    }
  }

  let uploadResult;

  try {
    uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cloud-storage-platform",
          resource_type: "auto",
          filename_override: file.originalname,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    throw new ApiError(
      error.http_code || 500,
      error.message || "Unable to upload the file",
    );
  }

  if (!uploadResult) {
    throw new ApiError(500, "File upload failed");
  }

  const uploadedFile = await prisma.file.create({
    data: {
      name: file.originalname,
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      mimeType: file.mimetype,
      size: BigInt(file.size),
      ownerId,
      folderId,
    },
  });

  return {
    success: true,
    message: "File uploaded successfully",
    file: {
      ...uploadedFile,
      size: Number(uploadedFile.size),
    },
  };
};

export const getFilesService = async (userId) => {
  const files = await prisma.file.findMany({
    where: {
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

  const accessibleFiles = files.filter((file) => {
    if (file.ownerId === userId) return true;
    if (file.shares.length > 0) return true;
    return false;
  });

  return {
    success: true,
    files: accessibleFiles.map((file) => ({
      ...file,
      size: Number(file.size),
    })),
  };
};

export const moveFileToTrashService = async (fileId, ownerId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to modify this file");
  }

  await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      isTrashed: true,
    },
  });

  return {
    success: true,
    message: "File moved to trash successfully",
  };
};

export const toggleFileFavoriteService = async (fileId, ownerId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to modify this file");
  }

  const updatedFile = await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      isFavorite: !file.isFavorite,
    },
  });

  return {
    success: true,
    message: updatedFile.isFavorite
      ? "File added to favorites"
      : "File removed from favorites",
    file: {
      ...updatedFile,
      size: Number(updatedFile.size),
    },
  };
};

export const getFileForDownloadService = async (fileId, userId) => {
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
    throw new ApiError(404, "File not found");
  }

  if (file.isTrashed) {
    throw new ApiError(400, "This file is in trash");
  }

  await getFileAccessService(fileId, userId);

  return file;
}

export const getTrashedFilesService = async (ownerId) => {
  const files = await prisma.file.findMany({
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
    files: files.map((file) => ({
      ...file,
      size: Number(file.size),
    })),
  };
};

export const restoreFileService = async (fileId, ownerId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to restore this file");
  }

  if (!file.isTrashed) {
    throw new ApiError(400, "File is not in trash");
  }

  const restoredFile = await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      isTrashed: false,
    },
  });

  return {
    success: true,
    message: "File restored successfully",
    file: {
      ...restoredFile,
      size: Number(restoredFile.size),
    },
  };
};

export const permanentlyDeleteFileService = async (fileId, ownerId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.ownerId !== ownerId) {
    throw new ApiError(403, "You do not have permission to delete this file");
  }

  if (!file.isTrashed) {
    throw new ApiError(400, "File is not in trash");
  }

  let resourceType = "raw";

  if (file.mimeType?.startsWith("image/")) {
    resourceType = "image";
  } else if (file.mimeType?.startsWith("video/")) {
    resourceType = "video";
  }

  try {
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);

    throw new ApiError(
      502,
      "Unable to delete the file from storage. Please try again.",
    );
  }

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });

  return {
    success: true,
    message: "File permanently deleted",
  };
};

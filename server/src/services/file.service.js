import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const uploadFileService = async (file, body, ownerId) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

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

export const getFilesService = async (ownerId) => {
  const files = await prisma.file.findMany({
    where: {
      ownerId,
      isTrashed: false,
    },
    orderBy: {
      createdAt: "desc",
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

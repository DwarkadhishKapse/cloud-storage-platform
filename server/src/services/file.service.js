import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadFileService = async (file, body, ownerId) => {
  if (!file) {
    throw new ApiError(400, "Please upload a file.");
  }

  if (body.folderId) {
    const folder = await prisma.folder.findUnique({
      where: {
        id: body.folderId,
      },
    });

    if (!folder) {
      throw new ApiError(404, "Folder not found.");
    }

    if (folder.ownerId !== ownerId) {
      throw new ApiError(
        403,
        "You are not allowed to upload files to this folder.",
      );
    }
  }

  const uploadResult = await new Promise((resolve, reject) => {
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

    Readable.from(file.buffer).pipe(uploadStream);
  });

  const uploadedFile = await prisma.file.create({
    data: {
      name: file.originalname,
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      mimeType: file.mimetype,
      size: BigInt(file.size),
      ownerId,
      folderId: body.folderId || null,
    },
  });

  return {
    success: true,
    message: "File uploaded successfully.",
    file: uploadedFile,
  };
};

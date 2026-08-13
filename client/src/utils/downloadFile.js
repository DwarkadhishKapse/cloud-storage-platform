import { downloadFile as downloadFileService } from "../services/file.service";

export const downloadFile = async (file) => {
  try {
    const response = await downloadFileService(file.id);

    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || file.mimeType,
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};

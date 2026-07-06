export const downloadFile = (file) => {
  if (!file.previewUrl) {
    alert("This file cannot be downloaded.");
    return;
  }
  
  const link = document.createElement("a");

  link.href = file.previewUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

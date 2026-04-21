export const getFilePath = (url: string, bucket: string) => {
  if (!url) return null;
  const parts = url.split(`${bucket}/`);
  return parts.length > 1 ? parts[1] : null;
};

export const getFileNameFromUrl = (url: string) => {
  if (!url) return "Unknown Audio File";
  try {
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const decodedName = decodeURIComponent(lastPart);
    const match = decodedName.match(/^audio_\d+_(.+)$/);
    return match && match[1] ? match[1] : decodedName;
  } catch (e) {
    return "Audio File";
  }
};

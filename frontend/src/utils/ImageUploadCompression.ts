import imageCompression from "browser-image-compression";

export const ImageUploadCompression = async (file: File) => {
  const imageFile = file;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.log(error);
    return file;
  }
};

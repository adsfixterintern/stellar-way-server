import { cloudinaryInstance } from '../../app/config/cloudinary.config';

const processSingleFile = (file: Express.Multer.File | undefined) => {
  return file ? { url: file.path, public_id: file.filename } : null;
};

const processMultipleFiles = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));
};

const deleteImageFromCloudinary = async (publicId: string) => {
  const result = await cloudinaryInstance.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    throw new Error('Image could not be deleted or already removed!');
  }
  return result;
};

export const UploadService = {
  processSingleFile,
  processMultipleFiles,
  deleteImageFromCloudinary,
};


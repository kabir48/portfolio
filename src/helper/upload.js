// helpers/cloudinaryHelper.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
})
// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// /**
//  * Upload an image to Cloudinary with specified options
//  * @param {string} filePath - The path of the image file to upload
//  * @param {string} folder - The folder in Cloudinary where the image will be stored
//  * @param {object} options - Options for resizing and quality
//  * @returns {Promise<object>} - A promise that resolves to the upload result
//  */
// const uploadImage = async (filePath, folder, options = {}) => {
//   try {
//     const { width, height, quality } = options;
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: folder || 'default_folder', // Default folder if not provided
//       transformation: [
//         {
//           width: width || 500, // Default width if not provided
//           height: height || 500, // Default height if not provided
//           crop: 'limit', // Crop mode
//           quality: quality || 'auto' // Default quality if not provided
//         }
//       ]
//     });
//     return { url: result.secure_url, public_id: result.public_id };
//   } catch (error) {
//     console.error('Error uploading image to Cloudinary:', error);
//     throw error;
//   }
// };


// /**
//  * Upload an image to Cloudinary
//  * @param {string} filePath - Path to the image file
//  * @param {string} folder - Cloudinary folder to upload to
//  * @param {object} options - Options for image transformation
//  * @param {string} publicId - Custom public ID for the image
//  * @returns {Promise<object>} - Result containing the URL and public ID of the uploaded image
//  */
// const uploadImage = async (filePath, folder, options, publicId) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder,
//       public_id: publicId,
//       transformation: [
//         {
//           width: options.width || 500,
//           height: options.height || 500,
//           crop: 'limit',
//           quality: options.quality || 'auto'
//         }
//       ]
//     });
//     return { url: result.secure_url, public_id: result.public_id };
//   } catch (error) {
//     console.error('Error uploading image to Cloudinary:', error);
//     throw error;
//   }
// };

const uploadImage = (imagePath, folder, options, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath,
      {
        folder,
        public_id: publicId,
        width: options.width,
        height: options.height,
        quality: options.quality,
        crop: 'limit' // Ensures the aspect ratio is maintained
      },
      (error, result) => {
        if (error) return reject(error);
        fs.unlinkSync(imagePath); // Remove file from server after upload
        resolve(result);
      }
    );
  });
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<void>}
 */
const deleteImage = async (publicId) => {
  try {
    //console.log(`Deleting image with publicId: ${publicId}`);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

const uploadFile = async (filePath, folder, options = {}, publicId) => {
  try {
      const result = await cloudinary.uploader.upload(filePath, {
          folder: folder,
          public_id: publicId,
          resource_type: options.resource_type || 'auto', // 'auto' will detect and handle any file type
          ...options,
      });
      return {
          url: result.secure_url,
          public_id: result.public_id,
      };
  } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
  }
};

module.exports ={
  uploadImage,
  deleteImage,
  uploadFile
};



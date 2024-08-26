const CategoryModel = require("../models/CategoryModel.js");
const { uploadImage, deleteImage } = require('../helper/upload.js');
const createCategory = async (req) => {
  try {
    const { categoryName } = req.body;
    const imagePath = req.file.path;

    const folder = 'portfolio/category';
    const options = {
      width: 200,
      height: 200,
      quality: 100
    };
    
    //categoryName = categoryName.trim().replace(/^"+|"+$/g, '');
    const publicId = `${categoryName.replace(/\s+/g, '_')}`;

    const { url, public_id } = await uploadImage(imagePath, folder, options, publicId);

    const newCategory = new CategoryModel({
      categoryName,
      categoryImg: url,
      publicId: public_id // Store the publicId returned by Cloudinary
    });

    await newCategory.save();

    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Server error' };
  }

}

// ====Read Category====//
const getAllCategories = async (req) => {
  try {
    let category = await CategoryModel.aggregate([
      {
        $sort: { _id: -1 }
      },
      {
        $project: { createdAt: 0, updatedAt: 0 }
      }
    ]);
    return { success: "success", data: category };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


const updateCategory = async (req, catId) => {
  try {
    const { categoryName } = req.body;
    let imagePath;

    if (req.file) {
      imagePath = req.file.path;
      //console.log('Image path:', imagePath); 
    }

    
    const folder = 'ecommerce/category';
    const options = {
      width: 200,
      height: 200,
      quality: 100,
    };

    //====Find the current brand to get the existing image details====
    const currentCategory = await CategoryModel.findById(catId);
    if (!currentCategory) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    //=========Upload image to Cloudinary if a new image was uploaded=======//
    let imageUrl;
    let publicId;
    if (imagePath) {
      //=========Delete the old image from Cloudinary if it exists========//
      if (currentCategory.categoryImg && currentCategory.publicId) {
        await deleteImage(currentCategory.publicId);
      }

      // ====Create a unique public ID using the brand name====//
      const newPublicId = `${categoryName.replace(/\s+/g, '_')}`;

      // Upload the new image
      const result = await uploadImage(imagePath, folder, options, newPublicId);
      //console.log('Upload result:', result); 
      imageUrl = result.url;
      publicId = result.public_id;
    }

    // Update brand details in MongoDB
    const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, {
      categoryName,
      ...(imageUrl && { categoryImg: imageUrl, publicId }) // ===========Update brandImage and publicId only if imageUrl exists=========
    }, { new: true });

    return{ success: true, category: updatedCategory };
  } catch (error) {
    console.error('Error updating Category:', error);
    return{ success: false, error: 'Server error' };
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  updateCategory
}
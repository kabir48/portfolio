let FeatureModel=require("../models/FeatureModel.js");
const { uploadImage, deleteImage } = require('../helper/upload.js');
 const createFeature=async(req)=>{
    try{
        let {name,description}=req.body;
        let imagePath=req.file.path;

        let folder='ecommerce/feature';
        let options={
            width:800,
            height:620,
            quality:100
        }

        const publicId = `${name.replace(/\s+/g, '_')}`;
        const { url, public_id } = await uploadImage(imagePath, folder, options, publicId);
        const newfeature=new FeatureModel({
            name,
            description,
            image:url,
            publicId:public_id

        });
        await newfeature.save();
        return { success: true, feature: newfeature };
    }catch(error){
        console.error('Error creating category:', error);
        return { success: false, error: 'Server error' };
    }
 }

 module.exports={
    createFeature
 }
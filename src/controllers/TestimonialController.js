const TestimonialModel=require('../models/TestimonialModel.js');
const { uploadImage, deleteImage } = require('../helper/upload.js');
exports.createTestimonial=async(req,res)=>{
    try{
        const {category_id,name,short_description,review}=req.body;
        if(!category_id || !name || !review){
            return res.status(400).json({ error: 'All fields are required'});
        
        }
        const imagePath = req.file.path; 
        const folder = 'protfolio/testimonial';
        const options = {
            width: 80, 
            height: 80, 
            quality: 100 
        };
        const publicId = `${name.replace(/\s+/g, '_')}`;
        const { url: urlLogo} = await uploadImage(imagePath, folder, options,publicId);

        const newTestimonialCreate = new TestimonialModel({
            category_id,
            name,
            short_description,
            review,
            image: urlLogo,
        });

        await newTestimonialCreate.save(); // Corrected to newResumeCreate.save()
        return res.status(200).json({ success: true, data: newTestimonialCreate });
    }catch(error){
        return res.status(500).json({ success: false, data:error.message.toString()});
    }
}

exports.updateTestimonial=async(req,res)=>{
    try{
        const {id}=req.params;
        const {category_id,name,short_description,review}=req.body;
        const files = req.files;
        const existingTestimonial = await TestimonialModel.findById(id);
        if (!existingTestimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        if (files && files.image) {
            const imagePath = files.image[0].path;
            const imageFolder = 'portfolio/testimonial';
            const imageOptions = {
                width: 80, 
                height: 80, 
                quality: 100 
            };
            const publicLogoName = name.replace(/\s+/g, '_');

            const { url: urlLogo } = await uploadImage(imagePath, imageFolder, imageOptions, publicLogoName);

            // Check if the URL is undefined
            if (!urlLogo) {
                return res.status(500).json({ success: false, error: 'Failed to upload Image' });
            }

            if (!urlLogo) {
                return res.status(500).json({ success: false, error: 'Failed to upload image' });
            }
            existingTestimonial.image = urlLogo;
        }
        existingTestimonial.category_id = category_id || existingTestimonial.category_id;
        existingTestimonial.name = name || existingTestimonial.name;
        existingTestimonial.short_description = short_description || existingTestimonial.short_description;
        existingTestimonial.review = review || existingTestimonial.review;

        await existingTestimonial.save();
        return res.status(200).json({ success: true, data: existingTestimonial });
    }catch(error){
        return res.status(500).json({ success:false,data:error.message.toString()})
    }
}

exports.readTestimonial=async(req,res)=>{
    try{
        $stage={
            $lookup: {
                from: "categories",
                let: { category_id: "$category_id" }, // Pass category_id
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$category_id"] },
                                    { $eq: ["$status", "1"] } // Ensure category is active
                                ]
                            }
                        }
                    }
                ],
                as: "category"
            }
        };
        const unwindStage = { $unwind: "$category" };
        const data = await TestimonialModel.aggregate([
            stage,
            unwindStage,
            projectionStage
        ]);

        // Return the data
        return res.status(200).json({ status: 'success', data: data });

    }catch(error){
        return res.status(500).json({success:false,data:error.message.toString()})
    }
}

exports.changeTestimonialStatus=async(req,res)=>{
    try{
        const {id}=req.params;
        const data=await TestimonialModel.findById(id);
        if(data.status=="1"){
            TestimonialModel.updateOne({_id:id},{status:"0"});
            return rse.status(200).json({success:"Data Stored Successfully"});
        }else{
            TestimonialModel.updateOne({_id:id},{status:"1"});
            return rse.status(200).json({success:"Data Stored Successfully"});
        }
    }catch(erorr){
        return res.status(500).json({status:false,error:error.message.toString()})
    }
}
const ResumeModel=require('../models/ResumeModel.js');
const { uploadImage, deleteImage } = require('../helper/upload.js');

exports.createResume = async (req, res) => {
    try {
        const { category_id, title, year, designation } = req.body;
        const files = req.files;

        // Log the files to see what is being sent
        //console.log("Files:", files);

        // Check if files and logo exist
        if (!files || !files.logo) {
            return res.status(400).json({ success: false, error: 'Logo is required' });
        }

        const logoPath = files.logo[0].path;
        const logoFolder = 'portfolio/resume';
        const logoOptions = {
            width: 100,
            height: 100,
            quality: 100
        };
        const publicLogoName = 'Logo'.replace(/\s+/g, '_');
        const { url: urlLogo } = await uploadImage(logoPath, logoFolder, logoOptions, publicLogoName);

        const newResumeCreate = new ResumeModel({
            category_id,
            title,
            year,
            designation,
            logo: urlLogo,
        });

        await newResumeCreate.save(); // Corrected to newResumeCreate.save()
        return res.status(201).json({ success: true, data: newResumeCreate });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


exports.updateData = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, title, year, designation } = req.body;
        const files = req.files;

        const existingResume = await ResumeModel.findById(id);
        if (!existingResume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }

        if (files && files.logo) {
            const logoPath = files.logo[0].path;
            const logoFolder = 'portfolio/resume';
            const logoOptions = {
                width: 100,
                height: 100,
                quality: 100
            };
            const publicLogoName = 'Logo'.replace(/\s+/g, '_');

            const { url: urlLogo } = await uploadImage(logoPath, logoFolder, logoOptions, publicLogoName);

            // Check if the URL is undefined
            if (!urlLogo) {
                return res.status(500).json({ success: false, error: 'Failed to upload logo image' });
            }

            existingResume.logo = urlLogo;
        }

        existingResume.category_id = category_id || existingResume.category_id;
        existingResume.title = title || existingResume.title;
        existingResume.year = year || existingResume.year;
        existingResume.designation = designation || existingResume.designation;

        await existingResume.save();

        return res.status(200).json({ success: true, data: existingResume });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};



exports.changeStatusResume=async(req,res)=>{
    try{
       const {id}=req.params;
       let headerBody=req.body;
       const changeStatus=await ResumeModel.find({_id:id});
       //console.log(changeStatus)
       if(changeStatus[0].status=== "active"){
            headerBody={status:"inactive"};
            await ResumeModel.updateOne({_id:id},headerBody);
            res.json({ status: 'status change successfully' });
       }else{
            headerBody={status:"active"};
            await ResumeModel.updateOne({_id:id},headerBody);
            res.json({ status: 'status changed successfully' });
       }
    }catch(erorr){
        return res.status(500).json({ success: false, error: error.message });
    }
}


exports.resumeLists = async (req, res) => {
    try {
        const joinStageResume = {
            $lookup: {
                from: "categories",
                let: { category_id: "$category_id" }, // Pass category_id
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$category_id"] },
                                    { $eq: ["$status", "active"] } // Ensure category is active
                                ]
                            }
                        }
                    }
                ],
                as: "category"
            }
        };

        const unwindStage = { $unwind: "$category" };
        const matchStatge={
            $match:{status:"active"}
        }
        const projectionStage = {
            $project: {
                _id: 0,
                createdAt: 0,
                updatedAt: 0,
                'category._id': 0,
                'category.createdAt': 0,
                'category.updatedAt': 0,
                'category.categoryImg': 0,
                'category.publicId': 0,
            }
        };

        const data = await ResumeModel.aggregate([
            matchStatge,
            joinStageResume,
            unwindStage,
            projectionStage
        ]);

        // Return the data
        return res.json({ status: 'success', data: data });
    } catch (error) {
        console.error("Error in resumeLists:", error);
        return res.status(500).json({ status: "fail", message: "Something went wrong!" });
    }
};




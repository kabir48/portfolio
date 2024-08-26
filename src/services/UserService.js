let EmailHelper=require("../helper/EmailHelper.js");
let UserModel=require("../models/UserModel.js");
let {EncodeToken}=require("../helper/AuthToken.js");
let ProfileModel=require('../models/ProfileModel.js')
const { uploadImage, deleteImage,uploadFile} = require('../helper/upload.js');
const mongoose = require("mongoose");
const ObjectID=mongoose.Types.ObjectId
const userOtpCreate=async(req)=>{
    try{
        let email=req.params.email;
       //console.log(email)
        let code=Math.floor(100000+Math.random()*900000);
        let emailData = {
            EmailTo: email,
            EmailText: "Your PIN Code is= " + code,
            emailSubject: "Otp Verification"
        };
        await EmailHelper(emailData);
        await UserModel.updateOne({email:email},{$set:{otp:code}},{upsert:true});
        return {status:"success",message:"6 Digit Otp Send To You Mail"}
    }catch(error){
        return {status:"fail", message:error.toString()}
    }
}

const verifyOtp=async(req)=>{
    try{
       let email=req.params.email;
       let otp=req.params.otp;
       let countCurrentUser=await UserModel.find({email:email,otp:otp}).count('total');
       if(countCurrentUser>0){
            let user_id=await UserModel.find({email:email,otp:otp}).select('_id');
            let token=EncodeToken(email,user_id[0]['_id'].toString())
            await UserModel.updateOne({email:email},{$set:{otp:"0"}})
            return {status:"success", message:"Valid OTP",token:token}
        }
        else{
            return {status:"fail", message:"Invalid OTP"}
        }
        
    }catch(error){
        return {status:"fail", message:error.toString()}
    }
}


const profileCreateService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let reqBody = req.body;
        reqBody.user_id = user_id;

        const { tag, title, details, languages, freelance } = reqBody;

        // File paths for image, PDF, and video
        const files = req.files;
        const imagePath = files.profileImage ? files.profileImage[0].path : null;
        const pdfPath = files.pdf ? files.pdf[0].path : null;
        const videoPath = files.video ? files.video[0].path : null;

        // Initialize Cloudinary URLs
        let imageUrl = null, pdfUrl = null, videoUrl = null;
        let imagePublicId = null, pdfPublicId = null, videoPublicId = null;

        // Upload image to Cloudinary if provided
        if (imagePath) {
            const imageFolder = 'portfolio/user/image';
            const imageOptions = { width: 300, height: 300, quality: 100 };
            imagePublicId = `${user_id}_IMAGE`;
            ({ url: imageUrl, public_id: imagePublicId } = await uploadImage(imagePath, imageFolder, imageOptions, imagePublicId));
        }

        // Upload PDF to Cloudinary if provided
        if (pdfPath) {
            const pdfFolder = 'portfolio/user/pdfs';
            pdfPublicId = `${user_id}_PDF`;
            ({ url: pdfUrl, public_id: pdfPublicId } = await uploadFile(pdfPath, pdfFolder, {}, pdfPublicId));
        }

        // Upload video to Cloudinary if provided
        if (videoPath) {
            const videoFolder = 'portfolio/user/videos';
            const videoOptions = { resource_type: 'video' }; // Specify resource type as video
            videoPublicId = `${user_id}_VIDEO`;
            ({ url: videoUrl, public_id: videoPublicId } = await uploadFile(videoPath, videoFolder, videoOptions, videoPublicId));
        }

        // Update the profile in the database
        await ProfileModel.updateOne(
            { user_id: user_id },
            {
                $set: {
                    ...reqBody,
                    profileImage: imageUrl, // Set profileImage URL
                    pdf: pdfUrl,            // Set PDF URL
                    video: videoUrl         // Set Video URL
                }
            },
            { upsert: true }
        );

        return { status: "success", message: "Profile Save Success" };
    } catch (error) {
        return { status: "fail", message: error.toString() };
    }
};


const viewProfileService = async (req) => {
    try {
        // const user_id = new ObjectID(req.headers.user_id);
        // const matchStage = { $match: { user_id: user_id } };
        const joinStageUser = {
            $lookup: {
                from: "users",
                localField: "user_id", 
                foreignField: "_id",
                as: "user"
            }
        };

        // Unwind the user array
        const unwindUserStage = { $unwind: "$user" };

        // Project the necessary fields
        const projectionStage = {
            $project: {
                _id:0,
                createdAt: 0,
                updatedAt: 0,
                'user._id': 0,
                'user.password': 0,
                'user.createdAt': 0,
                'user.updatedAt': 0,
                'user.publicId': 0,
            }
        };

        // Perform the aggregation
        const data = await ProfileModel.aggregate([
            //matchStage,
            joinStageUser,
            unwindUserStage,
            projectionStage
        ]);

        if (!data || data.length === 0) {
            return { status: "fail", message: "No profile data found for the user." };
        }
        
        return { status: "success", data: data };
    } catch (error) {
        console.error("Error in viewProfileService:", error); // Log the error for debugging
        return { status: "fail", message: "Something went wrong!" };
    }
};



// Make sure you correctly handle file uploads with your chosen middleware (e.g., Multer).

 


module.exports={
    userOtpCreate,
    verifyOtp,
    profileCreateService,
    viewProfileService
}
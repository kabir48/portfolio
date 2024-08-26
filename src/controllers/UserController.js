const ProfileModel = require("../models/ProfileModel.js");
const { uploadImage, deleteImage } = require('../helper/upload.js');
const dotEnv = require('dotenv');
const bcrypt = require('bcrypt');
const UserModel=require('../models/UserModel')
dotEnv.config({
    path: './config.env'
});
const mongoose = require("mongoose");
const ObjectId=mongoose.Types.ObjectId
let {EncodeToken}=require("../helper/AuthToken.js");
const { manageSession } = require('../helper/sessionHelper.js');
const {
    userOtpCreate,verifyOtp,profileCreateService,viewProfileService
}=require("../services/UserService.js");



exports.createUser=async(req,res)=>{
    try{
        const {
            name, email, phone, password
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required'});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const imagePath = req.file.path; 
        const folder = 'protfolio/user';
        const options = {
            width: 300, 
            height: 300, 
            quality: 100 
        };
        
        const publicId = `${name.replace(/\s+/g, '_')}`;
        const { url, public_id} = await uploadImage(imagePath, folder, options,publicId);

        const userCreate = new UserModel({
            name,
            email,
            phone,
            password: hashPassword,
            image: url,
            publicId:public_id
        });
        const userData = await userCreate.save();
        res.status(202).json({ message: 'User created successfully', userData });
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ status: "fail", message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "fail", message: "Invalid email or password" });
        }

        // Generate a token (assuming you're using JWT)
        const token = EncodeToken(email, user._id.toString());

        return res.status(200).json({ status: "success", message: "Login successful", token: token });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message });
    }
};

// user profile view
exports.viewProfile=async(req,res)=>{
    try{
        const userId = req.headers.user_id;
       // console.log(userId)
        const userObjectId = new ObjectId(userId);
        let data=await UserModel.aggregate([
            {
                $match:{_id:userObjectId}
            }
            ,{
                $project:{_id:0,createdAt:0,updatedAt:0,password:0,publicId:0}
            }
        ]);
        return res.status(200).json({status:"success",data:data})
    }catch(error){
        return res.status(500).json({status:"fail",error:error.toString()})
    }
}


exports.logoutFunction=async(req,res)=>{
    let cookieOption={expires:new Date(Date.now()-24*6060*1000), httpOnly:false}
    res.cookie('token',"",cookieOption)
    return res.status(200).json({status:"success"})
 }

//  ======Profile Create====//
exports.profileCreate=async (req,res)=>{
    let result=await profileCreateService(req)
    return res.status(200).json(result)
}


//  ======Profile Update====//
exports.profileUpdate=async (req,res)=>{
    let result=await profileCreateService(req)
    return res.status(200).json(result)
}

exports.profileView=async(req,res)=>{
    let result=await viewProfileService(req);
    return res.status(200).json(result)
}
 
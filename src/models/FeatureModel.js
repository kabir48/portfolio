const mongoose=require("mongoose");
const dataSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },description:{
        type:String,
        required:false
    },image:{
       type:String, 
       required:true
    },publicId:{
        type:String, 
        required:false
    }
},{timestamps:true,versionKey:false});

const FeatureModel=mongoose.model('features',dataSchema);
module.exports=FeatureModel
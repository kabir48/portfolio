let mongoose=require("mongoose");
let categoryDataSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    categoryImg:{
        type:String,
        required:false
    },
    status:{
        type:String,
        default:"active"
    }
    ,publicId:{
        type:String,
        required:false,
    }
},{timestamps:true,versionKey:false});

let CategoryModel=mongoose.model("categories",categoryDataSchema);
module.exports = CategoryModel;
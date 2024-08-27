const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
    category_id:{type:mongoose.Schema.Types.ObjectId,required:true},
    name:{type:String,required:true},
    image:{type:String},
    short_description:{type:String,required:false,validate:{
        validator:function(limit){
            return limit.length <=30;
        },
        message:"Not More Than 30"
    }},
    status:{type:Number,default:1},
    review:{type:String}
},{timestamps:true,versionKey:false});
const TestimonialModel=mongoose.model('testimonials',DataSchema);
module.exports=TestimonialModel
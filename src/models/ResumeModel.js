const mongoose=require('mongoose');
const dataSchema=mongoose.Schema({
    category_id:{type:mongoose.Schema.Types.ObjectId,required:true},
    title:{type:String,required:true},
    logo:{type:String},
    year:{type:String},
    status:{
        type:String,
        default:"active"
    },
    designation:{
        type:String,
    }
},{timestamps:true,versionKey:false});

const ResumeModel=mongoose.model('resumes',dataSchema);
module.exports=ResumeModel
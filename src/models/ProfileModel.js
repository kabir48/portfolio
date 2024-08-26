const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
        user_id:{type:mongoose.Schema.Types.ObjectId,required:true},
        tag:{type:String},
        title:{type:String},
        details:{type:String},
        languages:{type:String},
        profileImage:{type:String},
        pdf:{type:String},
        video:{type:String},
        freelance:{type:String,default:"Available"},
    },
    {timestamps:true,versionKey:false}
)
const ProfileModel=mongoose.model('profiles',DataSchema)
module.exports=ProfileModel
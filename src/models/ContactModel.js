const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
    category_id:{type:mongoose.Schema.Types.ObjectId,required:true},
    name:{type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:0
    },
    message:{
       type:String,
       required:true,
       validate: {
            validator: function(limit) {
                return limit.length <=50;
            },
            message: 'Message must be Less Than 50 characters',
        },
    }
},{timestamps:true,versionKey:false}
);
const ContactModel=mongoose.model('contacts',DataSchema);
module.exports=ContactModel
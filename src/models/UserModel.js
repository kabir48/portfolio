const mongoose=require('mongoose');
const DataSchema=mongoose.Schema({
        name:{type:String,
            required:true
        },
        phone:{type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
        },
        image:{
            type:String,
            required:false
        },
        password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                return password.length >= 6;
            },
            message: 'Password must be at least 6 characters',
        },
    },
    publicId:{
        type:String,
        required:false,
    },
    country:{
        type:String,
        required:true,
    },
    university :{
        type:String,
        required:true,
    }
},
    {timestamps:true,versionKey:false}
)
const UserModel=mongoose.model('users',DataSchema)
module.exports=UserModel
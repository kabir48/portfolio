const ContactModel=require('../models/ContactModel.js');
const isEmailBlocked=require('../helper/EmailValidation.js');
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone,category_id,message} = req.body;

        // Check if the email is blocked
        if (isEmailBlocked(email)) {
            return res.status(400).json({ error: 'Email is blocked' });
        }

        if (!name || !email || !phone || !category_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const contactCreate = new ContactModel({
            name,
            email,
            phone,
            category_id,
            message
        });

        const contactData = await contactCreate.save();
        res.status(202).json({ message: 'Contact Created Successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.contactLists=async(req,res)=>{
    try{
        const joinStage={
            $lookup:{
                from:"categories",
                localField:"category_id",
                foreignField:"_id",
                as: "category"
            }
        };
        const unwindStage = { $unwind: "$category" };
        const projectionStage = {
            $project: {
                _id:0,
                createdAt: 0,
                updatedAt: 0,
                'category._id': 0,
                'category.createdAt': 0,
                'category.updatedAt': 0,
            }
        };
        const data = await ContactModel.aggregate([
            //matchStage,
            joinStage,
            unwindStage,
            projectionStage
        ]);
        console.log(data)
        if (!data || data.length === 0) {
            return { status: "fail", message: "No profile data found for the user." };
        }
        
        return { status: "success", data: data };
    }catch(error){
        console.error("Error in viewProfileService:", error); // Log the error for debugging
        return { status: "fail", message: "Something went wrong!" };
    }
}

exports.changeStatus=async(req,res)=>{
    try{
        const {id}=req.params;
        const bodyData=req.body;
        const data=await ContactModel.find({_id:id});
        if(data[0].status===0){
            bodyData=1;
            await ContactModel.updateOne({_id:id},bodyData);
            return { status: "Status Changed Successfully"};
        }
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.deleteContact=async(req,res)=>{
    try{
        const {id}=req.params;
        await ContactModel.deleteOne({_id:id});
        return res.status(200).json({ success: "Status Changed Successfully" });
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
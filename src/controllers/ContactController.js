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

exports.contactLists = async (req, res) => {
    try {
        const joinStage = {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        };
        
        const unwindStage = { $unwind: "$category" };
        
        const projectionStage = {
            $project: {
                _id: 0,
                createdAt: 0,
                updatedAt: 0,
                'category._id': 0,
                'category.createdAt': 0,
                'category.updatedAt': 0,
                'category.publicId': 0,
            }
        };
        
        const data = await ContactModel.aggregate([
            joinStage,
            unwindStage,
            projectionStage
        ]);
        
        if (!data || data.length === 0) {
            return res.status(404).json({ status: "fail", message: "No contact data found." });
        }
        
        return res.status(200).json({ status: "success", data: data });
    } catch (error) {
        console.error("Error in contactLists:", error); // Log the error for debugging
        return res.status(500).json({ status: "fail", message: "Something went wrong!" });
    }
};


exports.changeContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ContactModel.findOne({ _id: id });
        
        if (!data) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        if (data.status === "0") {
            await ContactModel.updateOne({ _id: id }, { status: "1" });
            return res.status(200).json({ success: true, message: "Status changed successfully" });
        } else {
            return res.status(200).json({ success: true, message: "No status change needed" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


exports.deleteContact=async(req,res)=>{
    try{
        const {id}=req.params;
        await ContactModel.deleteOne({_id:id});
        return res.status(200).json({ success: "Item Deleted Successfully" });
    }catch(error){
        return res.status(500).json({ success: false, error: error.message });
    }
}
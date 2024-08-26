const CategoryModel = require("../models/CategoryModel.js");
let CategoryService=require("../services/CategoryService.js");

exports.CreateCategory = async (req, res) => {
    try {
      //console.log('Request received:', req);
      const result = await CategoryService.createCategory(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
};
exports.ReadCategory=async(req,res)=>{
    try {
        const result = await CategoryService.getAllCategories(req);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.UpdateCategory = async (req, res) => {
    const catId = req.params.id;
    try {
      const result = await CategoryService.updateCategory(req, catId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
};

exports.changeStatus=async(req,res)=>{
  try{
      const {id}=req.params;
      let headerBody=req.body;
      const category=await CategoryModel.find({
        _id:id
      });
      if(category[0].status==="active"){
        headerBody={status:"inactive"}
        await CategoryModel.updateOne({_id:id},headerBody)
        res.json({ status: 'status change successfully' });
      }else{
        headerBody={status:"active"}
        await CategoryModel.updateOne({_id:id},headerBody)
        res.json({ status: 'status change successfully'});
      }
  }catch(error){
    return res.status(500).json({ success: false, error: error.message });
  }
}
  
  
const FeatureService=require('../services/FeatureService.js');
exports.CreateFeature=async(req,res)=>{
     try{
        const results=await FeatureService.createFeature(req);
        return res.status(200).json(results);
     }catch(error){
        return res.status(500).json({ success: false, error: error.message });
     }
 }
const SiteSettingModal=require('../models/SiteSettingModal.js');
const { uploadImage, deleteImage } = require('../helper/upload.js');
exports.createSetting = async (req, res) => {
    try {
      const { name, description, email, phone, address,facebook,twitter,linkedin,youtube,domain } = req.body;
      const files = req.files;
  
      if (!files.logo || !files.favicon) {
        return res.status(400).json({ success: false, error: 'Logo and favicon are required' });
      }
  
      const logoPath = files.logo[0].path;
      const faviconPath = files.favicon[0].path;
  
      const logoFolder = 'portfolio/logo';
      const faviconFolder = 'portfolio/logo';
  
      const logoOptions = {
        width: 150,
        height: 70,
        quality: 100
      };
  
      const faviconOptions = {
        width: 70,
        height: 70,
        quality: 100
      };
  
      const publicLogoName = 'Logo'.replace(/\s+/g, '_');
      const publicFaviconName = 'Favicon'.replace(/\s+/g, '_');
  
      const { url: urlLogo, public_id: publicLogo } = await uploadImage(logoPath, logoFolder, logoOptions, publicLogoName);
      const { url: urlFavicon, public_id: publicFavicon } = await uploadImage(faviconPath, faviconFolder, faviconOptions, publicFaviconName);
  
      const newSiteSetting = new SiteSettingModal({
        name,
        description,
        email,
        phone,
        address,
        facebook,
        twitter,
        linkedin,
        youtube,
        domain,
        logo: urlLogo,
        favicon: urlFavicon,
        public_logo: publicLogo,
        public_favicon: publicFavicon
      });
  
      await newSiteSetting.save();
  
      return res.status(201).json({ success: true, data: newSiteSetting });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };



exports.readData=async(req,res)=>{
    try{
        const data= await  SiteSettingModal.aggregate([
            {
                $project:{'createdAt':0,'updatedAt':0,_id:0}
            },
            {
                $match:{status:"active"}
            }
        ]);
        
        return res.json({ status: 'success', data:data });
    }catch(error){
        return res.json({ error: error.message || 'Server Problem' });
    };
}


exports.updateData = async (req, res) => {
  try {
      const { id } = req.params; // Assuming the ID is passed as a route parameter
      const { name, description, email, phone, address, facebook, twitter, linkedin, youtube, domain } = req.body;
      const files = req.files;

      // Find the existing site setting by ID
      const siteSetting = await SiteSettingModal.findById(id);
      if (!siteSetting) {
          return res.status(404).json({ success: false, error: 'Site setting not found' });
      }

      // If new logo file is provided, upload it and update the logo details
      if (files && files.logo) { // Check if files and logo exist
          const logoPath = files.logo[0].path;
          const logoFolder = 'portfolio/logo';
          const logoOptions = { width: 150, height: 70, quality: 100 };
          const publicLogoName = 'Logo'.replace(/\s+/g, '_');
          const { url: urlLogo, public_id: publicLogo } = await uploadImage(logoPath, logoFolder, logoOptions, publicLogoName);
          siteSetting.logo = urlLogo;
          siteSetting.public_logo = publicLogo;
      }

      // If new favicon file is provided, upload it and update the favicon details
      if (files && files.favicon) { // Check if files and favicon exist
          const faviconPath = files.favicon[0].path;
          const faviconFolder = 'portfolio/logo';
          const faviconOptions = { width: 70, height: 70, quality: 100 };
          const publicFaviconName = 'Favicon'.replace(/\s+/g, '_');
          const { url: urlFavicon, public_id: publicFavicon } = await uploadImage(faviconPath, faviconFolder, faviconOptions, publicFaviconName);
          siteSetting.favicon = urlFavicon;
          siteSetting.public_favicon = publicFavicon;
      }

      // Update the other fields
      siteSetting.name = name || siteSetting.name;
      siteSetting.description = description || siteSetting.description;
      siteSetting.email = email || siteSetting.email;
      siteSetting.phone = phone || siteSetting.phone;
      siteSetting.address = address || siteSetting.address;
      siteSetting.facebook = facebook || siteSetting.facebook;
      siteSetting.twitter = twitter || siteSetting.twitter;
      siteSetting.linkedin = linkedin || siteSetting.linkedin;
      siteSetting.youtube = youtube || siteSetting.youtube;
      siteSetting.domain = domain || siteSetting.domain;

      // Save the updated site setting
      await siteSetting.save();

      return res.status(200).json({ success: true, data: siteSetting });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};


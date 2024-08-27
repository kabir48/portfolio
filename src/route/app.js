const express = require("express");
const router = express.Router();
//const upload = require('../middleware/upload.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadMany = multer({ dest: 'uploads/' });
// const multiUpload = uploadMany.fields([
//     { name: 'img1', maxCount: 1 },
//     { name: 'img2', maxCount: 1 },
//     { name: 'img3', maxCount: 1 },
//     { name: 'img4', maxCount: 1 }
//   ]);

// Setup Multer storage for the file upload and video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
  }
});

const uploadLarge = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).fields([
  { name: 'profileImage', maxCount: 1 }, 
  { name: 'pdf', maxCount: 1 },          
  { name: 'video', maxCount: 1 },       
]);

//====All Controllers======//
const UserController=require('../controllers/UserController.js');
const CategoryController = require('../controllers/CategoryController.js');
const FeatureController=require("../controllers/FeatureController.js");
const SiteSettingController=require('../controllers/SiteSettingController.js');
const ResumeController=require('../controllers/ResumeController.js');
const ContactController=require('../controllers/ContactController.js');
const TestimonialController=require('../controllers/TestimonialController.js')

//=====middlware part=====//
const AuthMiddleware=require('../middleware/AuthMiddleware.js');


//=====Api Calling Routes====//
const userRouter=express.Router();
  userRouter.post('/create',upload.single('image'),UserController.createUser);
  userRouter.post('/login',UserController.login);
  userRouter.get('/view-profile/',AuthMiddleware,UserController.viewProfile);
  userRouter.post('/profile-create',uploadLarge,AuthMiddleware,UserController.profileCreate);
  userRouter.post('/profile-update',uploadLarge,AuthMiddleware,UserController.profileUpdate);
  

const siteSettingRouter=express.Router();
siteSettingRouter.post(
    '/site-setting-store',
    upload.fields([
      { name: 'favicon', maxCount: 1 },
      { name: 'logo', maxCount: 1 }
    ]),
    AuthMiddleware,
    SiteSettingController.createSetting
  );
    siteSettingRouter.get('/read-setting-list/',AuthMiddleware,SiteSettingController.readData);
    siteSettingRouter.put('/site-setting-update/:id',AuthMiddleware,SiteSettingController.updateData);


// router.delete('/delete-user/:id',UserController.deleteUser);
router.get('/user/logout',AuthMiddleware,UserController.logoutFunction);
//======Brands part starts from here====//

// =====Category Parts=====//
const categoryRouter = express.Router();
    categoryRouter.get('/lists', AuthMiddleware,CategoryController.ReadCategory);
    categoryRouter.post('/create', upload.single('categoryImg'),AuthMiddleware,CategoryController.CreateCategory);
    categoryRouter.post('/update/:id', upload.single('categoryImg'),AuthMiddleware,CategoryController.UpdateCategory);
    categoryRouter.get('/category-status-changed/:id', AuthMiddleware,CategoryController.changeStatus);

const featureRouter = express.Router();
    featureRouter.post('/create',upload.single('image'),FeatureController.CreateFeature);

const resumeRouter=express.Router();
    resumeRouter.post('/create-resume',upload.fields([{ name: 'logo', maxCount: 1 }]),AuthMiddleware,ResumeController.createResume);
    resumeRouter.put('/update-resume/:id',upload.fields([{ name: 'logo', maxCount: 1 }]),AuthMiddleware,ResumeController.updateData);
    resumeRouter.get('/change-resume-status/:id',AuthMiddleware,ResumeController.changeStatusResume);

const contactRouter = express.Router();
    contactRouter.get('/contact-lists',AuthMiddleware,ContactController.contactLists);
    contactRouter.get('/contact-status/:id',AuthMiddleware,ContactController.changeContactStatus);
    contactRouter.delete('/contact-delete/:id',AuthMiddleware,ContactController.deleteContact)

const testimonialRouter=express.Router();
    testimonialRouter.get('/testimonial-lists',AuthMiddleware,TestimonialController.readTestimonial)
    testimonialRouter.post('/testimonial-store',AuthMiddleware,TestimonialController.createTestimonial)
    testimonialRouter.put('/testimonial-update/:id',AuthMiddleware,TestimonialController.updateTestimonial)
    testimonialRouter.get('/testimonial-status/:id',AuthMiddleware,TestimonialController.changeTestimonialStatus)
        
  // =======For The Front Design Starts  from here=====//
  userRouter.get('/about-me-lists',UserController.profileView);    
  resumeRouter.get('/resume-lists',ResumeController.resumeLists);
  contactRouter.post('/contact-store',ContactController.createContact);
  testimonialRouter.get('/testimonial-all',TestimonialController.readTestimonial)
 

router.use('/category', categoryRouter);
router.use('/feature', featureRouter);
router.use('/user', userRouter);
router.use('/setting', siteSettingRouter);
router.use('/resume', resumeRouter);
router.use('/contact', contactRouter);
router.use('/testimonial', testimonialRouter);
module.exports = router;
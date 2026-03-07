let express = require('express')
let router = express.Router();
const { requireCookie,protectRoute,protectRouteAdmin } = require('../../middleware/auth');
let {signsuperadmin,homesuperadmin,setting,changpassword,project,tableuser,createproject,activity,resource,dashboard,analytic,issuesInCategory,status,page404,notifaction,index} = require('../../controllers/web/superadmin')

router.get('/pages/superadmin/login', signsuperadmin);
router.get('/pages/home',requireCookie,homesuperadmin); 
router.get('/pages/setting',requireCookie, setting);
router.get('/pages/changpassword',requireCookie,changpassword);
router.get('/pages/project-setting',requireCookie,project); 
router.get('/pages/tableuser',protectRouteAdmin, tableuser);
router.get('/pages/activity',protectRouteAdmin,activity);
router.get('/pages/resource',requireCookie,resource);
router.get('/pages/dashboard',protectRoute, dashboard);
router.get('/pages/analytic',requireCookie,analytic);
router.get('/pages/notifaction',requireCookie,notifaction);

router.get('/pages/createproject',requireCookie, createproject);

router.get('/pages/issuecategory',requireCookie, issuesInCategory);
router.get('/pages/status',protectRouteAdmin, status);

router.get('/pages/404',page404);

router.get('/index',index)

module.exports = router;

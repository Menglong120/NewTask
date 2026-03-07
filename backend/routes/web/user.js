let express = require('express')
let router = express.Router();
let {signinuser} = require('../../controllers/web/user')

router.get('/user/login', signinuser);
router.get('/', (req, res) => {
    res.redirect('index');
})

module.exports = router;

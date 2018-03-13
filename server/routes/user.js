const userController = require('../controllers/user.js');
const Router = require('koa-router');

const router = new Router();

router.post('/user', ctx => userController.postUserAuth(ctx));
router.get('/user/:id', ctx => userController.getUserInfo(ctx));
router.get('/usercheck/:username', ctx => userController.userCheck(ctx));
router.post('/user/signup', ctx => userController.createUser(ctx));

module.exports = router;

const stockcodeController = require('../controllers/stockcode');
const Router = require('koa-router');

const router = new Router();

router.get('/stockcodelist', ctx => stockcodeController.getStockCodeList(ctx));

module.exports = router;

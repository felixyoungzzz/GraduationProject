const Router = require('koa-router');
const stockindexController = require('../controllers/realtimestock');

const router = new Router();

router.get('/realtimestock/:indexCode', ctx =>
  stockindexController.getrealtimeStock(ctx),
);

module.exports = router;

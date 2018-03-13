const Router = require('koa-router');
const historystockController = require('../controllers/historystock');

const router = new Router();

router.get('/historystock/:code/:start/:end/:period', ctx =>
  historystockController.gethistoryStock(ctx),
);

module.exports = router;

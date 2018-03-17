const Router = require('koa-router');
const realtimestockController = require('../controllers/realtimestock');

const router = new Router();

router.get('/realtimestock/:indexCode', ctx =>
  realtimestockController.getrealtimeStock(ctx),
);

router.get('/userrealtimestock/:userId', ctx =>
  realtimestockController.getUserRealtimeStock(ctx),
);

router.get('/daystock/:stockSymbol', ctx =>
  realtimestockController.getDayStock(ctx),
);
module.exports = router;

const Router = require('koa-router');
const jwt = require('koa-jwt');

const userRouter = require('./user');
const collectionRouter = require('./collection');
const realtimestockRouter = require('./realtimestock');
const stockcodeRouter = require('./stockcode');
const historystockRouter = require('./historystock');

const router = new Router();

router.use('/auth', userRouter.routes());
router.use(
  '/api',
  jwt({ secret: 'stock-project' }).unless({
    path: [/\//],
  }),
  collectionRouter.routes(),
);
router.use(
  '/api',
  jwt({ secret: 'stock-project' }).unless({
    path: [/\//],
  }),
  realtimestockRouter.routes(),
);
router.use(
  '/api',
  jwt({ secret: 'stock-project' }).unless({
    path: [/\//],
  }),
  stockcodeRouter.routes(),
);
router.use(
  '/api',
  jwt({ secret: 'stock-project' }).unless({
    path: [/\//],
  }),
  historystockRouter.routes(),
);

module.exports = router;

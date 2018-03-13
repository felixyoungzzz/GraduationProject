const collectionController = require('../controllers/collection.js');
const Router = require('koa-router');

const router = new Router();

router.get('/collection/:userId', ctx =>
  collectionController.getUserCollection(ctx),
);

module.exports = router;

const collectionController = require('../controllers/collection.js');
const Router = require('koa-router');

const router = new Router();

router.get('/collection/:userId', ctx =>
  collectionController.getUserCollection(ctx),
);

router.put('/collection', ctx => collectionController.addUserCollection(ctx));
router.post('/collection', ctx => collectionController.delUserCollection(ctx));

module.exports = router;

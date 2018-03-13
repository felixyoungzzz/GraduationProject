const collectionModel = require('../models/collection.js');

async function getUserCollection(ctx) {
  let userId = ctx.params.userId;
  let userCollection = await collectionModel.getUserCollectionByUserID(userId);
  ctx.body = userCollection;
}

module.exports = {
  getUserCollection,
};

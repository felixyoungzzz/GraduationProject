const collectionModel = require('../models/collection.js');
const stockcodeModel = require('../models/stockcode.js');

async function getUserCollection(ctx) {
  let userId = ctx.params.userId;
  let userCollection = await collectionModel.getUserCollectionByUserID(userId);
  ctx.body = userCollection;
}

async function addUserCollection(ctx) {
  try {
    let option = ctx.request.body;
    let result = await collectionModel.addUserCollection(option);
    ctx.body = {
      success: true,
    };
  } catch (err) {
    ctx.body = {
      success: false,
      info: err,
    };
  }
}

async function delUserCollection(ctx) {
  try {
    let option = ctx.request.body;
    let result = await collectionModel.delUserCollection(option);
    ctx.body = {
      success: true,
    };
  } catch (err) {
    ctx.body = {
      success: false,
      info: err,
    };
  }
}

module.exports = {
  getUserCollection,
  addUserCollection,
  delUserCollection,
};

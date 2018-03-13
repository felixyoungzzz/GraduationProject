const db = require('../config/db.js');

const stockDb = db.Stock;
const Collection = stockDb.import('../schema/user_stock_collection.js');

async function getUserCollectionByUserID(userId) {
  let userCollection = await Collection.findAll({
    where: {
      user_id: userId,
    },
    attributes: ['stock_id'],
  });
  return userCollection;
}

async function addUserCollection(option) {
  let userId = option.userId;
  let collections = [];
  option.collections.forEach(el => {
    collections.push({
      user_id: userId,
      stock_id: el,
    });
  });
  let result = await Collection.bulkCreate(collections);
  return true;
}

async function delUserCollection(option) {
  let userId = option.userId;
  let collections = option.collections;
  for (let el of collections) {
    let result = await Collection.destroy({
      where: {
        user_id: userId,
        stock_id: el,
      },
    });
  }
  return true;
}

module.exports = {
  getUserCollectionByUserID,
  addUserCollection,
  delUserCollection,
};

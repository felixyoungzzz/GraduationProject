const db = require('../config/db.js');

const stockDb = db.Stock;
const Collection = stockDb.import('../schema/user_stock_collection.js');

async function getUserCollectionByUserID(userId) {
  let userCollection = await Collection.findAll({
    where: {
      user_id: userId,
    },
    attributes: ['stock_symbol', 'stock_id'],
  });
  return userCollection;
}

module.exports = {
  getUserCollectionByUserID,
};

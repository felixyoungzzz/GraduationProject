const db = require('../config/db');

const stockDb = db.Stock;
const stockCode = stockDb.import('../schema/stock_code.js');

async function getAllStockCode() {
  let stockcodeList = await stockCode.findAll({
  });
  return stockcodeList;
}

module.exports = {
  getAllStockCode,
};

const db = require('../config/db');

const stockDb = db.Stock;
const stockCode = stockDb.import('../schema/stock_code.js');

async function getAllStockCode() {
  let stockcodeList = await stockCode.findAll({});
  return stockcodeList;
}

async function getStockCodeById(stockId) {
  let stockSymbol = await stockCode.findOne({
    where: {
      stock_id: stockId,
    },
    attributes: ['stock_symbol'],
  });
  return stockSymbol;
}

module.exports = {
  getAllStockCode,
  getStockCodeById,
};

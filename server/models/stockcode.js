const db = require('../config/db');

const stockDb = db.Stock;
const stockCode = stockDb.import('../schema/stock_code.js');

async function getAllStockCode() {
  let result = await stockCode.findAll({});
  let stockcodeList = [];
  result.forEach(el => {
    stockcodeList.push({
      stock_id: el.stock_id,
      stock_name: el.stock_name,
      stock_symbol: el.stock_symbol.slice(2),
    });
  });
  return stockcodeList;
}

async function getStockCodeById(stockId) {
  let stockSymbol = await stockCode.findOne({
    where: {
      stock_id: stockId,
    },
    attributes: ['stock_name', 'stock_symbol'],
  });
  return stockSymbol;
}

module.exports = {
  getAllStockCode,
  getStockCodeById,
};

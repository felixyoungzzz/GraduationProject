const stockcodeModel = require('../models/stockcode');

async function getStockCodeList(ctx) {
  let stockcodeList = await stockcodeModel.getAllStockCode();
  ctx.body = stockcodeList;
}

module.exports = {
  getStockCodeList,
};

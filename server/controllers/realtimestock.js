const axios = require('axios');
const collectionModel = require('../models/collection');
const stockcodeModel = require('../models/stockcode');

async function getrealtimeStock(ctx) {
  let indexCode = ctx.params.indexCode;
  let res = await axios.get('http://hq.sinajs.cn/list=' + indexCode);
  let result = res.data.split(',');
  if (indexCode.includes('_')) {
    if (!result[3].includes('-')) {
      result[2] = '+' + result[2];
      result[3] = '+' + result[3];
    }
    ctx.body = {
      current: result[1],
      change: result[2],
      percentage: result[3],
    };
  } else {
    let change = result[3] - result[2];
    let percentage = change / result[3] * 100;
    if (change > 0) {
      ctx.body = {
        current: result[3],
        change: '+' + change.toFixed(3).toString(),
        percentage: '+' + percentage.toFixed(2).toString(),
      };
    } else {
      ctx.body = {
        current: result[3],
        change: change.toFixed(3).toString(),
        percentage: percentage.toFixed(2).toString(),
      };
    }
  }
}

async function getUserRealtimeStock(ctx) {
  let userId = ctx.params.userId;
  let results = [];
  let collections = await collectionModel.getUserCollectionByUserID(userId);
  for (let el of collections) {
    let stock = await stockcodeModel.getStockCodeById(el.stock_id);
    let res = await axios.get('http://hq.sinajs.cn/list=' + stock.stock_symbol);
    let result = res.data.split(',');
    if (stock.stock_symbol.includes('_')) {
      if (!result[3].includes('-')) {
        result[2] = '+' + result[2];
        result[3] = '+' + result[3];
      }
      results.push({
        symbol: stock.stock_symbol,
        name: stock.stock_name,
        current: result[1],
        change: result[2],
        percentage: result[3],
      });
    } else {
      let change = result[3] - result[2];
      let percentage = change / result[3] * 100;
      if (change > 0) {
        results.push({
          symbol: stock.stock_symbol,
          name: stock.stock_name,
          current: result[3],
          change: '+' + change.toFixed(3).toString(),
          percentage: '+' + percentage.toFixed(2).toString(),
        });
      } else {
        results.push({
          symbol: stock.stock_symbol,
          name: stock.stock_name,
          current: result[3],
          change: change.toFixed(3).toString(),
          percentage: percentage.toFixed(2).toString(),
        });
      }
    }
  }
  ctx.body = results;
}

module.exports = {
  getrealtimeStock,
  getUserRealtimeStock,
};

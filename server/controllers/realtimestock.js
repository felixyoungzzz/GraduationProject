const axios = require('axios');

async function getrealtimeStock(ctx) {
  let indexCode = ctx.params.indexCode;
  let res = await axios.get('http://hq.sinajs.cn/list=' + indexCode);
  let result = res.data.split(',');
  console.log(result);
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

module.exports = {
  getrealtimeStock,
};

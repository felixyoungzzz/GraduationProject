const axios = require('axios');

async function getrealtimeStock(ctx) {
  let indexCode = ctx.params.indexCode;
  let res = await axios.get('http://hq.sinajs.cn/list=' + indexCode);
  let result = res.data.slice(30, -3).split(',');
  if (!result[2].includes('-')) {
    result[1] = '+' + result[1];
    result[2] = '+' + result[2];
  }
  ctx.body = {
    current: result[0],
    change: result[1],
    percentage: result[2],
  };
}

module.exports = {
  getrealtimeStock,
};

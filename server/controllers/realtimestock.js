const axios = require('axios');

async function getrealtimeStock(ctx) {
  let indexCode = ctx.params.indexCode;
  let res = await axios.get('http://hq.sinajs.cn/list=' + indexCode);
  let result = res.data.split(',');
  if (!result[3].includes('-')) {
    result[2] = '+' + result[2];
    result[3] = '+' + result[3];
  }
  ctx.body = {
    current: result[1],
    change: result[2],
    percentage: result[3],
  };
}

module.exports = {
  getrealtimeStock,
};

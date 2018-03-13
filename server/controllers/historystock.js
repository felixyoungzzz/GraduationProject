const axios = require('axios');

async function gethistoryStock(ctx) {
  let res = await axios.get('http://q.stock.sohu.com/hisHq', {
    params: {
      code: 'cn_' + ctx.params.code,
      start: ctx.params.start,
      end: ctx.params.end,
      period: ctx.params.period,
    },
  });
  let originalData = res.data[0].hq.map(processedData);
  let result = [];
  originalData.forEach((od, index) => {
    result[index] = {
      date: od[0],
      open: od[1],
      close: od[2],
      change: od[3],
      percentage: od[4],
      low: od[5],
      high: od[6],
      volume: od[7],
    };
  });
  ctx.body = result;
}

function processedData(data) {
  return data.slice(0, -2);
}

module.exports = {
  gethistoryStock,
};

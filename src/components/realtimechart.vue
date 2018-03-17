<template>
  <div>
    <div class="realtime-chart hidden" v-bind:class="symbol">
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { Transform } from 'stream';
export default {
  props: ['symbol'],
  data() {
    return {
      width: 968,
      height: 380,
      margin: {
        top: 10,
        right: 40,
        bottom: 10,
        left: 40,
      },
    };
  },
  mounted() {
    this.drawRealTimeChart();
    this.$on(this.symbol, function() {
      let item = document.querySelector('.' + this.symbol);
      if (item.className.includes('hidden')) {
        this.changetoshow();
      } else {
        this.changetohidden();
      }
    });
  },
  methods: {
    //changeview
    changetoshow() {
      let item = document.querySelector('.' + this.symbol);
      item.classList.remove('hidden');
      item.classList.add('show');
    },
    changetohidden() {
      let item = document.querySelector('.' + this.symbol);
      item.classList.remove('show');
      item.classList.add('hidden');
    },

    //draw real time chart
    async drawRealTimeChart() {
      //获取实时最高最低价
      let priceRange = await this.$http.get(
        '/api/realtimestock/' + this.symbol,
      );
      let high = parseFloat(priceRange.data.high),
        low = parseFloat(priceRange.data.low);

      let svg = d3
        .select('.' + this.symbol)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
      //details
      let rWidth = this.width - this.margin.left - this.margin.right,
        rHeight = this.height - this.margin.top - this.margin.bottom;

      let inner_svg = svg
        .append('g')
        .attr(
          'transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')',
        );

      //x坐标轴
      let tFormat = d3.timeParse('%H%M');
      let xAxisScale = d3
        .scaleLinear()
        .domain([1, 5])
        .range([0, rWidth]);

      let xAxis = d3
        .axisBottom()
        .scale(xAxisScale)
        .ticks(6)
        .tickValues([1, 2, 3, 4, 5])
        .tickFormat(time => {
          if (time === 1) {
            return '09:30';
          } else if (time === 2) {
            return '10:30';
          } else if (time === 3) {
            return '13:00';
          } else if (time === 4) {
            return '14:00';
          } else {
            return '15:00';
          }
        });

      inner_svg
        .append('g')
        .attr('transform', 'translate(0,' + rHeight * (3 / 4) + ')')
        .call(xAxis);

      //获取分时线数据
      let res = await this.$http.get('/api/daystock/' + this.symbol);
      let daystockData = res.data;

      let data = daystockData.data,
        total = 242,
        count = daystockData.count,
        yestClose = daystockData.yestclose;

      //y坐标轴
      let yAxisScale = '';

      //判断昨日收盘价与今天数据的关系
      if (yestClose > high) {
        yAxisScale = d3
          .scaleLinear()
          .domain([low, yestClose + (yestClose - low) / 10])
          .range([rHeight, rHeight / 4]);
      } else if (yestClose < low) {
        yAxisScale = d3
          .scaleLinear()
          .domain([yestClose - (yestClose - low) / 10, high])
          .range([rHeight, rHeight / 4]);
      } else {
        yAxisScale = d3
          .scaleLinear()
          .domain([low, high])
          .range([rHeight, rHeight / 4]);
      }

      let yAxis = d3
        .axisLeft()
        .scale(yAxisScale)
        .ticks(6);

      inner_svg
        .append('g')
        .attr('transform', 'translate(0,-' + rHeight / 4 + ')')
        .call(yAxis);

      //走势图

      //涨跌幅坐标轴
      let changePer = [
        (high - yestClose) * 100 / yestClose,
        (low - yestClose) * 100 / yestClose,
      ];
      let changeAxisScale = d3
        .scaleLinear()
        .domain([changePer[1], changePer[0]])
        .range([rHeight, rHeight / 4]);

      let changeAxis = d3
        .axisRight()
        .scale(changeAxisScale)
        .ticks(6)
        .tickFormat(per => {
          return per.toFixed(2) + '%';
        });

      inner_svg
        .append('g')
        .attr('transform', 'translate(' + rWidth + ',-' + rHeight / 4 + ')')
        .call(changeAxis);

      //走势线
      //获取走势线数据和均线数据
      let trendData = [];
      let averageData = [];
      data.forEach((el, index) => {
        let x = (index + 1) * rWidth / total;
        trendData.push([x, yAxisScale(+el[1])]);
        averageData.push([x, yAxisScale(+el[2])]);
      });

      //计算走势线path的数据
      let trendData_d = '';
      trendData.forEach((el, index) => {
        if (index === 0) {
          trendData_d += 'M' + el[0] + ' ' + el[1];
        } else {
          trendData_d += ' L' + el[0] + ' ' + el[1];
        }
      });

      //画走势线
      inner_svg
        .append('g')
        .attr('transform', 'translate(0,-' + rHeight / 4 + ')')
        .append('path')
        .attr('d', trendData_d)
        .attr('fill', 'none')
        .attr('stroke-width', '1px')
        .attr('stroke', '#4647fb');

      //计算均线path的数据
      let averageData_d = '';
      averageData.forEach((el, index) => {
        if (index === 0) {
          averageData_d += 'M' + el[0] + ' ' + el[1];
        } else {
          averageData_d += ' L' + el[0] + ' ' + el[1];
        }
      });

      //画均线
      inner_svg
        .append('g')
        .attr('transform', 'translate(0,-' + rHeight / 4 + ')')
        .append('path')
        .attr('d', averageData_d)
        .attr('fill', 'none')
        .attr('stroke-width', '1px')
        .attr('stroke', '#cb3e62');

      //画昨日收盘线
      inner_svg
        .append('g')
        .attr('transform', 'translate(0,-' + rHeight / 4 + ')')
        .append('line')
        .attr('x1', 0)
        .attr('y1', yAxisScale(yestClose))
        .attr('x2', rWidth)
        .attr('y2', yAxisScale(yestClose))
        .attr('fill', 'none')
        .attr('stroke-width', '1px')
        .attr('stroke', '#846c5c')
        .attr('stroke-dasharray', '30 5');

      //交易量柱状图
      let barWidth = 2,
        barPadding = 2;

      let highVolume = Math.max.apply(Math, data.map(el => el[3]));
      let barYscale = d3
        .scaleLinear()
        .domain([0, highVolume])
        .range([0, rHeight / 5]);

      let barColor = ['green', '#4d5834', '#7a6653', '#ca5643', 'red'];
      inner_svg
        .append('g')
        .attr('transform', 'translate(0,' + 4 * rHeight / 5 + ')')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('height', d => {
          return barYscale(d[3]);
        })
        .attr('width', barWidth)
        .attr('x', (d, i) => {
          return i * rWidth / total;
        })
        .attr('y', 0)
        .attr('fill', d => {
          if (d[3] < highVolume / 5) {
            return barColor[0];
          } else if (d[3] < 2 * highVolume / 5) {
            return barColor[1];
          } else if (d[3] < 3 * highVolume / 5) {
            return barColor[2];
          } else if (d[3] < 4 * highVolume / 5) {
            return barColor[3];
          } else {
            return barColor[4];
          }
        })
        .attr('transform', (d, i) => {
          return 'translate(0,' + barYscale(highVolume - d[3]) + ')';
        });

      //添加注释
      inner_svg
        .append('g')
        .append('text')
        .text('最高成交量:' + highVolume)
        .attr('font-size', '12px')
        .attr('transform', 'translate(0,' + 5 * rHeight / 6 + ')');
    },
  },
};
</script>

<style>
.hidden {
  height: 0px;
  visibility: hidden;
}

.show {
  height: 380px;
}
</style>

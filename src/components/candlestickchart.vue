<template>
  <div>
    <div class="main-box">
      <el-cascader placeholder="试试搜索: 平安银行" :options="options" filterable @change="handler1"></el-cascader>

      <div class="middle-box">
        <p class="middle-label">选择数据</p>
        <p class="update-text">更新时间:{{updateTime}}</p>
      </div>

      <el-card>
        <el-date-picker editable v-model="dateRange" type="daterange" align="left" unlink-panels range-separator="至" value-format="yyyyMMdd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" @change="handler2">
        </el-date-picker>

        <div class="candlestick-box">
          <el-tabs v-model="kType" type="card">
            <el-tab-pane label="日K线" name="day">
              <div class="d-candlestick"></div>
            </el-tab-pane>
            <el-tab-pane label="周K线" name="week">
              <div class="w-candlestick"></div>
            </el-tab-pane>
            <el-tab-pane label="月K线" name="month">
              <div class="m-candlestick"></div>
            </el-tab-pane>
          </el-tabs>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
import * as d3 from 'd3';
export default {
  data() {
    //get user info
    const getUserId = _ => {
      const token = sessionStorage.getItem('stock-project');
      if (token && token !== 'null') {
        let userInfo = jwt.decode(token);
        return userInfo.userId;
      } else {
        return null;
      }
    };
    return {
      width: 1000,
      height: 480,
      updateTime: new Date().toTimeString(),
      //data
      userId: getUserId(),

      //options
      options: [
        {
          value: 'all',
          label: '所有股票',
          children: [],
        },
        {
          value: 'collection',
          label: '我的收藏',
          children: [],
        },
      ],

      //date
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      code: 'sz000001 平安银行',
      kType: 'day',
      dateRange: [
        this.dateFormatter(
          new Date().setTime(new Date() - 3600 * 1000 * 24 * 90),
        ),
        this.dateFormatter(new Date()),
      ],
    };
  },
  methods: {
    dateFormatter: d3.timeFormat('%Y%m%d'),
    async updateData() {
      let res1 = await this.$http.get('/api/stockcodelist');
      let stocklist = res1.data;
      let res2 = await this.$http.get('/api/collection/' + this.userId);
      let userstocklist = res2.data;
      let userstockids = [];
      userstocklist.forEach(el => {
        userstockids.push(el.stock_id);
      });
      stocklist.forEach((el, index) => {
        if (userstockids.includes(el.stock_id)) {
          this.options[1].children.push({
            value: el.stock_symbol + ' ' + el.stock_name,
            label: el.stock_symbol.slice(2) + ' ' + el.stock_name,
          });
        } else {
          this.options[0].children.push({
            value: el.stock_symbol + ' ' + el.stock_name,
            label: el.stock_symbol.slice(2) + ' ' + el.stock_name,
          });
        }
      });
    },

    handler1(value) {
      this.code = value[1];
      this.redrawK_line();
    },

    handler2() {
      this.redrawK_line();
    },

    async getResult(type) {
      let res = await this.$http.get(
        '/api/historystock/' +
          this.code.slice(2, 8) +
          '/' +
          this.dateRange[0] +
          '/' +
          this.dateRange[1] +
          '/' +
          type,
      );
      return this.processedData(res.data);
    },
    async processedData(originData) {
      let data = {
        data: originData,
        min_price: Math.min.apply(
          Math,
          originData.map(function(o) {
            return o.low;
          }),
        ),
        max_price: Math.max.apply(
          Math,
          originData.map(function(o) {
            return o.high;
          }),
        ),
        first_day: originData.find((v, i, od) => {
          return i === 0;
        }).date,
        last_day: originData.find((v, i, od) => {
          return i === od.length - 1;
        }).date,
      };
      return data;
    },
    async drawK_line(container) {
      let type = container.split('-')[0];
      let result = await this.getResult(type);
      let data = result.data,
        min_price = result.min_price,
        max_price = result.max_price,
        length = data.length,
        first_day = result.first_day,
        last_day = result.last_day;
      let svg = d3
        .select('.' + container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
      let candlePadding = 2;
      let margin = { top: 30, right: 50, bottom: 30, left: 50 };
      let k_width = this.width - margin.left - margin.right,
        k_height = this.height - margin.top - margin.bottom;
      let tickNumber = 8;
      let inner_svg = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      let yscale = d3
        .scaleLinear()
        .domain([min_price, max_price])
        .range([0, k_height]);

      //纵向坐标轴数据
      let y_axisscale = d3
        .scaleLinear()
        .domain([min_price, max_price])
        .range([k_height, 0]);

      let yaxis = d3
        .axisLeft()
        .scale(y_axisscale)
        .ticks(tickNumber);

      //画纵轴
      inner_svg.append('g').call(yaxis);

      //横向坐标轴数据
      let dateFormat = d3.timeParse('%Y-%m-%d');

      let x_axisscale = d3
        .scaleLinear()
        .domain([dateFormat(last_day), dateFormat(first_day)])
        .range([0, k_width]);

      let xaxis = d3
        .axisBottom()
        .scale(x_axisscale)
        .ticks(tickNumber)
        .tickFormat(d3.timeFormat('%Y-%m-%d'));

      //画横轴
      inner_svg
        .append('g')
        .attr('transform', 'translate(0,' + k_height + ')')
        .call(xaxis);

      //根据数据画K线图的矩形
      inner_svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
          return (length - 1 - i) * (k_width / length);
        })
        .attr('y', (d, i) => {
          return (
            k_height - yscale(d3.max([parseFloat(d.open), parseFloat(d.close)]))
          );
        })
        .attr('width', (d, i) => {
          return k_width / length - candlePadding;
        })
        .attr('height', (d, i) => {
          return Math.abs(yscale(d.open) - yscale(d.close));
        })
        .attr('fill', d => {
          if (d.open < d.close) return 'red';
          else return 'green';
        })
        .append('svg:title')
        .text(d => {
          return (
            '日期' +
            d.date +
            '\n开盘价:' +
            d.open +
            '\n收盘价:' +
            d.close +
            '\n涨跌额:' +
            d.change +
            '\n涨跌幅:' +
            d.percentage +
            '\n最低价:' +
            d.low +
            '\n最高价:' +
            d.high +
            '\n成交量:' +
            d.volume
          );
        });
      //根据最高价最低价画K线图的线
      inner_svg
        .append('g')
        .selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', (d, i) => {
          return (
            (length - 1 - i) * (k_width / length) +
            (k_width / length - candlePadding) / 2
          );
        })
        .attr('x2', (d, i) => {
          return (
            (length - 1 - i) * (k_width / length) +
            (k_width / length - candlePadding) / 2
          );
        })
        .attr('y1', (d, i) => {
          return k_height - yscale(d.low);
        })
        .attr('y2', (d, i) => {
          return k_height - yscale(d.high);
        })
        .attr('stroke', d => {
          if (d.open < d.close) return 'red';
          else return 'green';
        });

      //上标
      inner_svg
        .append('g')
        .attr('transform', 'translate(10,3)')
        .append('text')
        .attr('font-size', '12px')
        .text(this.code.slice(2));
    },
    async redrawK_line() {
      await d3.selectAll('svg').remove();
      this.drawK_line('d-candlestick');
      this.drawK_line('w-candlestick');
      this.drawK_line('m-candlestick');
    },
  },
  created() {
    this.updateData();
    this.drawK_line('d-candlestick');
    this.drawK_line('w-candlestick');
    this.drawK_line('m-candlestick');
  },
};
</script>

<style>
.middle-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.middle-label {
  margin: 1.5rem;
  font-size: 2rem;
}

.candlestick-box {
  margin-top: 1rem;
}
</style>

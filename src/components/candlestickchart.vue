<template>
  <div>
    <el-select v-model="code" placeholder="试试搜索: 平安银行" filterable>
      <el-option v-for="item in stockCodes" :key="item.stock_symbol" :label="item.stock_symbol+labelString+item.stock_name" :value="item.stock_symbol">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelString: ' ',

      //option
      code: '',

      //data
      stockCodes: [],
    };
  },
  methods: {
    getStockCodeList() {
      this.$http.get('/api/stockcodelist').then(res => {
        this.stockCodes = res.data;
      });
    },
  },
  created() {
    this.getStockCodeList();
  },
};
</script>

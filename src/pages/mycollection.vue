<template>
  <div>
    <div class="top-box">
      <p class="top-label">Collection</p>
    </div>
    <div class="main-box">
      <el-card>
        <el-transfer v-model="selectCode" :data="stockcodeList" filterable filter-placeholder="请输入股票代码或名字" :titles="['所有股票', '我的收藏']" :button-texts="['移除收藏', '加入收藏']" :props="{
          key:'stock_symbol',
          label:'stock_name'
        }" :render-content="renderFunc" :left-default-checked="notCollectedStock" :right-default-checked="collectedStock" @change="handleChange">
        </el-transfer>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stockcodeList: [],
      selectCode: [],
      notCollectedStock: [],
      collectedStock: [],
      renderFunc(h, option) {
        return (
          <span>
            {option.stock_id} - {option.stock_name}
            {option.stock_symbol}
          </span>
        );
      },
    };
  },
  methods: {
    getStockCodeList() {
      this.$http
        .get('/api/stockcodelist')
        .then(res => {
          this.stockcodeList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
  },
  created() {
    this.getStockCodeList();
  },
};
</script>

<style>

</style>

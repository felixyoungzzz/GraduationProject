<template>
  <div>
    <div class="top-box">
      <p class="top-label">Collection</p>
    </div>
    <div class="main-box">
      <el-card>
        <el-transfer v-model="collectedStock" :data="stockcodeList" filterable filter-placeholder="请输入股票代码或名字" :titles="['所有股票', '我的收藏']" :button-texts="['移除收藏', '加入收藏']" :props="{
          key:'stock_id',
          label:'stock_name'
        }" :render-content="renderFunc" @change="handleChange" :filter-method="filterMethod">
        </el-transfer>
      </el-card>
      <div class="middle-box">
        <p class="middle-label">实时数据</p>
        <p class="update-text">更新时间:{{updateTime}}</p>
      </div>

      <el-card class="collection-table">
        <el-table :data="collectionData" style="width: 100%">
          <el-table-column prop="name" label="股票名字" width="180">
          </el-table-column>
          <el-table-column prop="current" label="实时报价" width="180">
          </el-table-column>
          <el-table-column prop="change" label="涨跌额">
          </el-table-column>
          <el-table-column prop="percentage" label="涨跌幅/%">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
import { setTimeout } from 'timers';
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
      //user
      userId: getUserId(),

      //transfer data
      stockcodeList: [],
      collectedStock: [],
      renderFunc(h, option) {
        return (
          <span>
            {option.stock_id} - {option.stock_name}
            {option.stock_symbol}
          </span>
        );
      },

      //user realtime collection
      collectionData: [],
      updateTime: new Date().toTimeString(),
    };
  },
  methods: {
    //get all stock
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

    //get user collection
    getuserCollection(userId) {
      this.$http.get('/api/collection/' + userId).then(res => {
        this.collectedStock = res.data.map(el => {
          return el.stock_id;
        });
      });
    },

    //get user realtime collection
    getRealtimeCollection(userId) {
      this.$http.get('/api/userrealtimestock/' + userId).then(res => {
        this.collectionData = res.data;
      });
    },
    //handler for change
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        this.$http
          .put('/api/collection', {
            userId: this.userId,
            collections: movedKeys,
          })
          .then(res => {
            if (res.data.success) {
              this.getRealtimeCollection(this.userId);
              this.updateTime = new Date().toTimeString();
              this.$notify({
                type: 'success',
                message: '收藏成功！',
              });
            } else {
              this.$notify.error({
                message: res.data.info,
              });
            }
          })
          .catch(err => {
            this.$notify.error('请求错误！' + err);
          });
      } else {
        this.$http
          .post('/api/collection', {
            userId: this.userId,
            collections: movedKeys,
          })
          .then(res => {
            if (res.data.success) {
              this.getRealtimeCollection(this.userId);
              this.updateTime = new Date().toTimeString();
              this.$notify({
                type: 'success',
                message: '移除成功！',
              });
            } else {
              this.$notify.error({
                message: res.data.info,
              });
            }
          })
          .catch(err => {
            this.$notify.error('请求错误！' + err);
          });
      }
    },

    //update data
    updateData() {
      this.getStockCodeList();
      this.getuserCollection(this.userId);
      this.getRealtimeCollection(this.userId);
    },

    //up or down
    upordown(per) {
      if (per.includes('+')) {
        return true;
      } else return false;
    },

    //transfer filter method
    filterMethod(query, item) {
      let label = item.stock_name + item.stock_symbol;
      return label.indexOf(query) > -1;
    },
  },
  created() {
    this.updateData();
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
  font-family: 'Dosis', sans-serif;
}
</style>

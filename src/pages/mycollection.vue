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
        }" :render-content="renderFunc" @change="handleChange">
        </el-transfer>
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
    },
  },
  created() {
    this.updateData();
  },
};
</script>

<style>

</style>

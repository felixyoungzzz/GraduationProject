<template>
  <div>
    <div class="top-box">
      <p class="top-label">Home</p>
      <p class="update-text">更新时间:{{updateTime}}</p>
    </div>
    <div class="main-box">
      <div class="index-card-box">
        <div v-for="item in indexCode" :key="item.code" class="index-card">
          <p class="index-text-top" v-bind:class="{up:upordown(item.details.percentage),down:!upordown(item.details.percentage)}">{{item.name}}
            <span> {{item.details.percentage}}%</span>
          </p>
          <p class="index-text-bottom">{{item.details.current}} /
            <span v-bind:class="{up:upordown(item.details.percentage),down:!upordown(item.details.percentage)}"> {{item.details.change}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //Stock index code
      indexCode: [
        {
          code: 's_sh000001',
          name: '上证指数',
          details: {
            current: '',
            change: '',
            percentage: '',
          },
        },
        {
          code: 's_sz399001',
          name: '深证成指',
          details: {
            current: '',
            change: '',
            percentage: '',
          },
        },
        {
          code: 's_sz399006',
          name: '创业指数',
          details: {
            current: '',
            change: '',
            percentage: '',
          },
        },
      ],

      updateTime: new Date().toTimeString(),
    };
  },
  methods: {
    getStockIndex() {
      this.indexCode.forEach(index => {
        this.$http.get('/api/realtimestock/' + index.code).then(res => {
          index.details.current = res.data.current;
          index.details.change = res.data.change;
          index.details.percentage = res.data.percentage;
        });
      });
    },
    upordown(per) {
      if (per.includes('+')) {
        return true;
      } else return false;
    },
  },
  created() {
    this.getStockIndex();
  },
};
</script>

<style>
/* top box contains text */
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.top-label {
  color: black;
  margin-left: 0;
  margin-top: -2.5rem;
  font-size: 4.5rem;
  font-family: 'Dosis', sans-serif;
}

.update-text {
  align-self: flex-end;
  color: #888;
  font-style: italic;
}

.main-box {
  margin-top: 1rem;
}

/* stock index card */
.index-card-box {
  width: 75%;
  display: flex;
  background: #f7f7f7;
}

.index-card {
  width: 200px;
  padding: 1.5rem 2.5rem;
  margin-right: 1rem;
  user-select: none;
}

.index-text-top {
  font-size: 2rem;
}

.index-text-bottom {
  font-size: 1.5rem;
  font-family: 'Dosis', sans-serif;
}

/* change color depending on index up or down */
.up {
  color: #ec6149;
}

.down {
  color: #81c14f;
}
</style>

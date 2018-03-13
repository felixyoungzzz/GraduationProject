<template>
  <div>
    <el-container>
      <el-header class="header">
        <div class="main-container header-layout">
          <div class="brand">
            <img src="../assets/brand-logo.png" alt="">
            <p class="brand-text text1">Candle
              <span class="brand-text text2">Stock</span>
            </p>
          </div>
          <div class="navbar">
            <el-menu :default-active="activeIndex" mode="horizontal" router>
              <el-menu-item index="1" route="/home">首页</el-menu-item>
              <el-menu-item index="2" route="/candlestickview">K线图</el-menu-item>
              <el-submenu index="3">
                <template slot="title">Hi, {{username}}</template>
                <el-menu-item index="3-1" route="/mycollection">我的收藏</el-menu-item>
                <el-menu-item index="3-2" route="/personalcenter">个人中心</el-menu-item>
                <el-menu-item index="3-3" @click="signout">退出登陆</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </div>
      </el-header>
      <el-main class="main-container">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
export default {
  data() {
    return {
      //user info
      username: '',

      //el-menu
      activeIndex: '1',
    };
  },
  created() {
    const userInfo = this.getUserInfo();
    this.username = userInfo.username;
    this.$router.push('/home');
  },
  methods: {
    //get user info
    getUserInfo() {
      const token = sessionStorage.getItem('stock-project');
      if (token && token !== 'null') {
        let userInfo = jwt.decode(token);
        return userInfo;
      } else {
        return null;
      }
    },

    //sign out
    signout() {
      sessionStorage.removeItem('stock-project');
      this.$router.push('/');
    },
  },
};
</script>

<style>
.main-container {
  width: 1140px;
  margin: 0 auto;
}

.header-layout {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

/* brand */
.brand {
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.brand-text {
  font-size: 18px;
  font-style: italic;
}

.text1 {
  color: #1bb99a;
}

.text2 {
  color: #df4e5e;
}

/* header */
.header {
  border-bottom: solid 1px #e6e6e6;
}
</style>

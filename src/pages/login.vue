<template>
  <div class="container">
    <h1 class="title">在线查看股票相关图表</h1>
    <p class="sub-title">Here,你可以查看你收藏的股票的K线图以及实时数据</p>
    <el-card id="card-box">
      <div class="chart-box">
        <img src="../assets/login-logo.svg" alt="">
      </div>
      <el-tabs class="tabs-box" @tab-click="switchPane" value="loginPane" v-model="activeTabPane">
        <el-tab-pane name="loginPane">
          <span slot="label">
            <i class="iconfont icon-link"></i> 登陆</span>
          <transition name="el-zoom-in-top" appear>
            <el-form v-if="show1" :model="loginForm" status-icon :rules="loginRules" ref="loginForm">
              <el-form-item prop="username">
                <el-input placeholder="请输入用户名" v-model="loginForm.username" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button round type="primary" @click="loginSubmit('loginForm')">登陆</el-button>
              </el-form-item>
            </el-form>
          </transition>
        </el-tab-pane>
        <el-tab-pane name="signupPane">
          <span slot="label">
            <i class="iconfont icon-bussinessman"></i> 注册</span>
          <transition name="el-zoom-in-top">
            <el-form v-if="show2" :model="signupForm" :rules="signupRules" status-icon ref="signupForm">
              <el-form-item prop="username">
                <el-input placeholder="请输入用户名" v-model="signupForm.username" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" v-model="signupForm.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="checkpass">
                <el-input placeholder="请再次输入密码" type="password" v-model="signupForm.checkpass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button round type="primary" @click="signupSubmit('signupForm')">注册</el-button>
                <el-button round type="info" @click="resetForm('signupForm')">清空</el-button>
              </el-form-item>
            </el-form>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //validate function
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空！'));
      } else {
        callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空！'));
      } else {
        callback();
      }
    };
    var checkSignuname = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空！'));
      } else {
        let result = await this.$http.get('/auth/usercheck/' + value);
        if (result.data.userExisted) {
          callback(new Error('用户已存在'));
        } else {
          callback();
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空！'));
      } else {
        if (this.signupForm.checkpass !== '') {
          this.$refs.signupForm.validateField('checkpass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空！'));
      } else if (value !== this.signupForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      //tabs
      activeTabPane: 'loginPane',

      //login
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ validator: checkUsername, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
      },

      //sign up
      signupForm: {
        username: '',
        password: '',
        checkpass: '',
      },
      signupRules: {
        username: [{ validator: checkSignuname, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkpass: [
          {
            validator: validatePass2,
            trigger: 'blur',
          },
        ],
      },

      //switch details
      show1: true,
      show2: false,

      //
    };
  },
  methods: {
    switchPane(target) {
      if (target.name === 'loginPane') {
        this.show1 = true;
        this.show2 = false;
      } else {
        this.show2 = true;
        this.show1 = false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //login
    loginSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
          };
          this.$http
            .post('/auth/user', user)
            .then(res => {
              if (res.data.success) {
                sessionStorage.setItem('stock-project', res.data.token);
                this.$notify({
                  type: 'success',
                  message: '登陆成功！',
                });
                this.$router.push('/stock');
              } else {
                this.$notify.error(res.data.info);
                sessionStorage.setItem('stock-project', null);
              }
            })
            .catch(err => {
              this.$notify.error('请求错误！' + err);
              sessionStorage.setItem('stock-project', null);
            });
        } else {
          return false;
        }
      });
    },

    //sign up
    signupSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let user = {
            username: this.signupForm.username,
            password: this.signupForm.password,
          };
          console.log(user);
          this.$http
            .post('/auth/user/signup', user)
            .then(res => {
              if (res.data.success) {
                this.$refs[formName].resetFields();
                this.activeTabPane = 'loginPane';
                this.show1 = true;
                this.show2 = false;
                this.$notify({
                  type: 'success',
                  message: '注册成功！请登陆。',
                });
              } else {
                this.$notify.error(res.data.info);
              }
            })
            .catch(err => {
              this.$notify.error('请求错误！' + err);
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  user-select: none;
}

.title {
  font-size: 2.75rem;
  color: #555;
  margin-top: 6rem;
  margin-bottom: 0;
}

.sub-title {
  font-size: 1.75rem;
  color: #888;
  margin-top: 0;
  margin-bottom: 2rem;
}

#card-box {
  width: 330px;
  height: 500px;
  border-radius: 16px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.chart-box {
  text-align: center;
  padding: 2rem 2.5rem;
}

.chart-box img {
  max-width: 50%;
}
</style>

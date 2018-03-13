const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function postUserAuth(ctx) {
  let data = ctx.request.body;
  let userInfo = await userModel.getUserbyName(data.username);
  if (userInfo != null) {
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        success: false,
        info: '密码错误！',
      };
    } else {
      let userToken = {
        userId: userInfo.user_id,
        username: userInfo.user_name,
      };

      let secret = 'stock-project';
      let token = jwt.sign(userToken, secret, { expiresIn: '7d' });
      ctx.body = {
        success: true,
        token: token,
      };
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！',
    };
  }
}

async function getUserInfo(ctx) {
  let id = ctx.params.id;
  let userInfo = await userModel.getUserbyId(id);
  ctx.body = userInfo;
}

async function userCheck(ctx) {
  let username = ctx.params.username;
  let userInfo = await userModel.getUserbyName(username);
  if (userInfo) {
    ctx.body = {
      userExisted: true,
    };
  } else {
    ctx.body = {
      userExisted: false,
    };
  }
}

async function createUser(ctx) {
  try {
    let user = ctx.request.body;
    let hashPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    user.password = hashPassword;
    let result = await userModel.createUser(user);

    ctx.body = {
      success: true,
    };
  } catch (err) {
    ctx.body = {
      success: false,
      info: err,
    };
  }
}

module.exports = {
  postUserAuth,
  getUserInfo,
  userCheck,
  createUser,
};

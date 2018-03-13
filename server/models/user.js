const db = require('../config/db.js');

const stockDb = db.Stock;
const User = stockDb.import('../schema/user.js');

async function getUserbyId(id) {
  let userInfo = await User.findOne({
    where: {
      user_id: id,
    },
  });
  return userInfo;
}

async function getUserbyName(name) {
  const userInfo = await User.findOne({
    where: {
      user_name: name,
    },
  });
  return userInfo;
}

async function createUser(user) {
  await User.create({
    user_name: user.username,
    password: user.password,
  });
  return true;
}

module.exports = {
  getUserbyId,
  getUserbyName,
  createUser,
};

const sequelize = require('sequelize');

const Stock = new sequelize('mysql://root:felix@localhost/graduationproject', {
  define: {
    timestamps: false,
  },
});

module.exports = {
  Stock,
};

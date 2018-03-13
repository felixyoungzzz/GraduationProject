/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_code', {
    stock_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stock_symbol: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      defaultValue: '0'
    },
    stock_name: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'stock_code'
  });
};

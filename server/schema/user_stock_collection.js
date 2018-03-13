/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_stock_collection', {
    collection_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    stock_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'user_stock_collection'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      defaultValue: '0'
    },
    password: {
      type: DataTypes.CHAR(128),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'user'
  });
};

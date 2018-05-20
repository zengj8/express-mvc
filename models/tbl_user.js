/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    },
    name : {
      type :DataTypes.STRING(50),
      defaultValue : '',
      allowNull:false
    },
    age : {
      type : DataTypes.INTEGER(3)
    },
    info: {
      type :DataTypes.STRING(50),
      get : function () {
        let info = this.getDataValue('info');
        return info ? JSON.parse(info) : {};
      },
      set : function (val) {
        val = val ? val : {};
        if (val && typeof val !== 'string') {
          val = JSON.stringify(val);
        }
        return this.setDataValue('info', val);
      }
    }
  }, {
    tableName : 'tbl_user',
    freezeTableName : true,
    timestamps : false
  });
};
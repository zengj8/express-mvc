/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UserCourseRelate', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    }
  }, {
    tableName : 'tbl_user_course_relate',
    freezeTableName : true,
    timestamps : false
  });
};
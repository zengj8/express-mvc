/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('CourseCategory', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    },
    name : {
      type :DataTypes.STRING(50),
      defaultValue : '',
      allowNull:false,
      comment : '分类名'
    },
    level : {
      type : DataTypes.INTEGER(2),
      defaultValue : 1,
      allowNull : false,
      comment : '分类级别'
    },
    parent_id : {
      type : DataTypes.INTEGER,
      allowNull : true,
      comment : '父分类id'
    }
  }, {
    tableName : 'tbl_course_category',
    freezeTableName : true,
    timestamps : false,
    classMethods : {
      associate : (models) => {
        // ----分类与分类关系 1:n-----
        models.CourseCategory.belongsTo(models.CourseCategory, {
          as : 'Parent',
          foreignKey : 'parent_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
        models.CourseCategory.hasMany(models.CourseCategory, {
          as : 'Children',
          foreignKey : 'parent_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
      }
    }
  });
};
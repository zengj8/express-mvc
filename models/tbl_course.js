/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Course', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    },
    category_id : {
      type :DataTypes.INTEGER,
      allowNull:false,
      comment : '课程分类id'
    },
    name : {
      type :DataTypes.STRING(50),
      defaultValue : '',
      allowNull:false,
      comment : '课程名'
    }
  }, {
    tableName : 'tbl_course',
    freezeTableName : true,
    timestamps : false,
    classMethods : {
      associate : (models) => {
        // ----分类与课程为 1:n 关系-----
        models.Course.belongsTo(models.CourseCategory, {
          foreignKey : 'category_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
        models.CourseCategory.hasMany(models.Course, {
          as : 'Courses',
          foreignKey : 'category_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
        // ----用户与课程为 n:m 关系-----
        models.User.belongsToMany(models.Course, {
          through : 'UserCourseRelate',
          foreignKey : 'user_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
        models.Course.belongsToMany(models.User, {
          through : 'UserCourseRelate',
          foreignKey : 'course_id',
          onDelete : 'CASCADE',
          onUpdate : 'CASCADE'
        });
      }
    }
  });
};
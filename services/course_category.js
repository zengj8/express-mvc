/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = {
  getCourseCategory,
  addCourseCategory
};

/**
 * 获取课程分类
 * @returns {*}
 */
async function getCourseCategory(options) {
  let page = options.page;
  let pagesize = options.pagesize;
  let categories = await db.CourseCategory.findAll({
    where : {level : 1},
    include : [
      {
        model : db.CourseCategory,
        as : 'Children'
      }
    ],
    offset : (page - 1) * pagesize,
    limit : pagesize
  });
  return categories;
}

/**
 * 添加课程分类
 * @param options
 * @returns {options}
 */
async function addCourseCategory(options) {
  return await db.CourseCategory.create(options);
}
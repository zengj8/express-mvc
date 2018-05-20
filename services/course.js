/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = {
  getCourses,
  getCourseDetail
};

/**
 * 获取课程列表
 * @param options
 * @returns {*}
 */
async function getCourses(options) {
  let page = options.page || 1;
  let pagesize = options.pagesize || 20;
  return await db.Course.findAndCountAll({
    include : [
      {
        model : db.CourseCategory
      },
      {
        model : db.User,
        through : {attributes : []}
      }
    ],
    offset : (page - 1) * pagesize,
    limit : pagesize
  })
}

/**
 * 获取单个课程
 * @param id
 */
async function getCourseDetail(id) {
  let course = await db.Course.findById(id);
  let Users = await course.getUsers({raw : true});
  course = course.get();
  course.Users = Users;
  return course;
}
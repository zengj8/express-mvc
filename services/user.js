/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = {
  getUsers
};

/**
 * 获取用户列表
 * @returns {*}
 */
async function getUsers(options) {
  let page = options.page || 1;
  let pagesize = options.pagesize || 20;
  return await db.User.findAndCountAll({
    include : [
      {
        model : db.Course,
        as : 'Courses',
        through : {attributes : []}
      }
    ],
    // raw : true,
    offset : (page - 1) * pagesize,
    limit : pagesize
  });
}
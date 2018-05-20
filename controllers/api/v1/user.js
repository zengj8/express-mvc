/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const userService = require('../../../services/user');

module.exports = handleError({
  getUsers
});

async function getUsers(req, res, next) {
  let schema = {
    page    : {in: 'query', isInt: true, defaultValue: 1, optional: true},
    pagesize: {in: 'query', isInt: true, defaultValue: 10, optional: true}
  };
  await paramValidator(schema, req);
  let users  = await userService.getUsers(req.query);
  return next({code: 200, msg: {total: users.count, count: users.rows.length, data: users.rows}});
}

/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const userService = require('../../services/user');

module.exports = {
  index
};

async function index(req,res, next) {
  let users = await userService.getUsers({});
  res.locals.users = users;
  return next({code : 200, view : 'users'});
}
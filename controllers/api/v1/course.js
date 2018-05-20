/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const courseService = require('../../../services/course');

module.exports = handleError({
  getCourses,
  getCourseDetail
});

async function getCourses(req, res, next) {
  let schema = {
    page    : {in: 'query', isInt: true, defaultValue: 1, optional: true},
    pagesize: {in: 'query', isInt: true, defaultValue: 10, optional: true}
  };
  await paramValidator(schema, req);
  let users = await courseService.getCourses(req.query);
  return next({code : 200, msg : {total : users.count, count : users.rows.length, data : users.rows}});
}

async function getCourseDetail(req, res, next) {
  let schema = {
    id    : {in: 'params', isInt: true, notEmpty: true},
  };
  await paramValidator(schema, req);
  let course = await courseService.getCourseDetail(req.params.id);
  return next({code : 200, msg : course});
}
/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const courseCategoryService = require('../../../services/course_category');

module.exports = handleError({
  getCourseCategory,
  addCourseCategory
});

async function getCourseCategory(req, res, next) {
  let schema = {
    page    : {in: 'query', isInt: true, defaultValue: 1, optional: true},
    pagesize: {in: 'query', isInt: true, defaultValue: 10, optional: true}
  };
  await paramValidator(schema, req);
  let courseCategories = await courseCategoryService.getCourseCategory(req.query);
  return next({code: 200, msg: courseCategories});
}

async function addCourseCategory(req, res, next) {
  let schema = {
    name     : {in: 'body', notEmpty: true},
    level    : {in: 'body', isInt: true, notEmpty: true},
    parent_id: {in: 'body', isInt: true, optional: true}
  };
  await paramValidator(schema, req);
  let category = await courseCategoryService.addCourseCategory(req.body);
  return next({code: 200, msg: '添加成功', ext: category});
}
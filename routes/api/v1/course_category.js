/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const categoryCtrl = require('../../../controllers/api/v1/category');

module.exports = (router) => {
  router.get('/categories', categoryCtrl.getCourseCategory);
  router.post('/categories', categoryCtrl.addCourseCategory);
};


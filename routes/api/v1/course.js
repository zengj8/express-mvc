/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const courseCtrl = require('../../../controllers/api/v1/course');

module.exports = (router) => {
  router.get('/courses',  courseCtrl.getCourses);
  router.get('/courses/:id', courseCtrl.getCourseDetail);
};
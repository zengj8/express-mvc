/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const webCtrl = require('../../controllers/web/web');

module.exports = (router) => {
  router.get('/', webCtrl.index);
};
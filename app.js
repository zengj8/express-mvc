/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

require('./global_regist');
const web = require('./servers/web');

Promise.resolve([web]).each(function (app) {
  app.start();
});
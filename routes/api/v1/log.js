'use strict';

const log = require('../../controllers/v1/log');

module.exports = (router) => {
  router.get('/execsql', log.execSQL);
  router.get('/log/:fileName', log.getLogger);
};
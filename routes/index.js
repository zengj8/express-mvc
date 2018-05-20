/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

function createRouter(versionDir) {
  let router = express.Router();
  fs.readdirSync(versionDir).forEach(function (file) {
    require(path.join(versionDir, file))(router);
  });
  return router;
}

const router = module.exports = express.Router();
const v1 = createRouter(path.join(__dirname, 'api/v1'));
const web = createRouter(path.join(__dirname, 'web'));

router.use('/', web);
router.use('/api/v1', v1);

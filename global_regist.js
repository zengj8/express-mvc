/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

global.ROOT_PATH = __dirname;

global.fs             = require('fs');
global.path           = require('path');
global.fse            = require('fs-extra');

global.md5            = require('md5');
global.config         = require('config');
global._              = require('lodash');
global.Promise        = require('bluebird');
global.utils          = require('./utils');
global.logger         = require('./tools/logger');

global.db             = require('./models');
global.sequelize      = require('./models').sequelize;

// cache: 普通缓存
// pcache: 持久化缓存，主要存储没有过期时间的缓存
const Cache           = require('./cache/cache');
global.ckey           = require('./cache/cache-key');
// global.cache          = require('./lib/cache');
global.cache          = new Cache(config.redis);
global.pcache         = new Cache(config.persistentRedis);

global.handleError    = require('./middlewares/error-handle');
global.paramValidator = require('./middlewares/param-validator');
global.ENUMS          = require('./enums');

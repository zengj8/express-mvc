/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const log4js = require('log4js');
const path = require('path');

fse.mkdirsSync(config.log.dir);
fse.mkdirsSync(config.log.dir + 'main');

const log4jsConfig = {
  "replaceConsole" : config.log.replaceConsole,
  "level" : config.log.level,
  "appenders": [
    {
      "type" : "console"
    },
    {
      "type": "dateFile",
      "filename": path.join(config.log.dir, 'main/log'),
      "pattern" : "yyyyMMdd",
      "alwaysIncludePattern" : true,
      "maxLogSize": 20480,
      "backups": 3,
      "category": "main"
    },
    {
      "type": "logLevelFilter",
      "level": "ERROR",
      "appender" : {
        type : "file",
        filename : path.join(config.log.dir,'main.ERROR'),
        maxLogSize : 20480
      },
      "category": "main"
    }
  ]
};

log4js.configure(log4jsConfig);

const logger = log4js.getLogger('main');
logger.setLevel('AUTO');

logger.log4js = log4js;

module.exports = logger;

/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const path = require('path');
const pkg = require('../package.json');

module.exports = {
  web         : {
    url : 'http://127.0.0.1:10086',
    host:'127.0.0.1',
    port: 10086,
    name: pkg.name
  },

  view        : {
    cache : {},
    engine: 'ejs',
    dir   : 'views'
  },

  log         : {
    dir           : `/var/log/${pkg.name}/`,
    nolog         : /\.(js|css|png|jpg|jpeg|ico|svg|gif)/,
    format        : ":remote-addr :method :url :status :response-time ms :user-agent :content-length",
    replaceConsole: true,
    level         : "AUTO",
    console       : false
  },

  static      : {
    dir   : path.join(__dirname, '../public'),
    maxAge: 1000 * 60 * 60,
    // 页面缓存设置
    pageCacheStatus : false,
    pageCacheRedisPre : 'webStatic:',
    expire : 60 * 60 * 24
  },

  redis       : {
    host: '127.0.0.1',
    port: 6379,
    db  : 8,
    sessionDB : 2,
    password  : '',
    opt : {auth_pass: ''}
  },

  persistentRedis: {
    host: '127.0.0.1',
    port: 6379,
    db  : 3
  },

  mysql       : {
    host              : '127.0.0.1',
    username          : 'root',
    password          : 'root',
    port              : 3306,
    database          : 'expressmvc',
    connectTimeout    : 5000,
    waitForConnections: true,
    maxConnections    : 200,
    minConnections    : 2,
    connectionLimit   : 50,
    logging           : true
  }
};
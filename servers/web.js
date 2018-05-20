/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const path             = require('path');
const mysql            = require('mysql');
const responseTime     = require('response-time');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const serveFavicon     = require('serve-favicon');
const expressSession   = require('express-session');
const SessStore        = require('connect-redis')(expressSession);
const express          = require('express');
const ejs              = require('ejs');
const compression      = require('compression');
const expressValidator = require('express-validator');

const ValidatorConfig = require('../middlewares/param-validator/config');
const ejsHelper       = require('../middlewares/ejs-helper');
const finallyResp     = require('../middlewares/finally-resp');
// const pageCache       = require('../middlewares/static-page');

const router = require('../routes');

const app = express();

app.set('views', path.join(__dirname, '..', config.view.dir));
app.set('view engine', config.view.engine);
app.engine('.html', ejs.__express);
app.engine('.ejs', ejs.__express);

app.use(compression());
app.use(responseTime());
app.use(logger.log4js.connectLogger(logger, config.log));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(cookieParser());
app.use(expressSession({
  proxy            : true,
  resave           : true,
  saveUninitialized: false,
  name             : 'express-mvc',
  secret           : 'express-mvc-secret',
  store            : new SessStore({
    host: config.redis.host,
    port: config.redis.port,
    db  : config.redis.sessionDB,
    pass: config.redis.password
  }),
  cookie           : {
    maxAge  : 1000 * 60 * 60 * 7,
    httpOnly: false
  }
}));

app.use(ejsHelper());
app.use(serveFavicon(path.join(__dirname, '../public/favicon.ico')));
app.use(express.static(config.static.dir, {maxAge: config.static.maxAge}));

// app.use(pageCache(_.extend(config.static, {noCache: config.log.nolog})));

app.use(expressValidator(ValidatorConfig));

app.use(router);

app.use((req, res, next) => next({code: 404}));

app.use(finallyResp.finallyResp({format: 'JSON'}));

function start() {
  // return Promise.promisify(initDatabase)().then(() => {
  //   return app.listen(config.web.port, function () {
  //     logger.info(config.web.name, config.web.url, 'start up!');
  //   });
  // }).catch((err) => {
  //   logger.error(err);
  //   process.exit(1);
  // });

  app.listen(config.web.port, function () {
    logger.info(config.web.name, config.web.url, 'start up!');
  });
  return db.sequelize.sync({force: false}).catch(function (err) {
    logger.error(err);
    process.exit(1);
  });
}

function initDatabase(callback) {
  let con = mysql.createConnection({
    host    : config.mysql.host,
    database: 'mysql',
    user    : config.mysql.username,
    password: config.mysql.password
  });
  con.connect();
  let sql = `create database if not exists ${config.mysql.database} default charset utf8 collate utf8_general_ci`;
  con.query(sql, (err, results) => {
    if (err) {
      return callback(err);
    } else {
      db.sequelize.sync({force: false}).then(() => callback(null, results)).catch((err) => callback(err));
    }
  });
}

if (!module.parent) {
  start();
} else {
  exports.start = start;
}

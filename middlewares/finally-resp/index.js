/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const status = require('./defines');

exports.finallyResp = function (options) {
  options = options || {};
  let defaultFormat = options.format || 'JSONString';

  return function finallyResp(result, req, res, next) {
    if (_.isError(result)) {
      result = {
        status : 'interalError',
        code : 500,
        err : result,
        msg : result.message
      }  
    }

    let msg = result.msg || status[result.code].desc;
    let ext = result.ext || {};
    let view = null;
    if (!(req.url.indexOf('/api') > -1)) {
      view = result.view || status[result.code].view;
    }
    let page = result.page;
    let err = result.err;
    let desc = result.desc || status[result.code].desc;

    function handleError(err) {
      logger.error('\nError begin', '\n', err, '\n', 'Error End');
      if (_.isError(err)) {
        // 对于异常错误可以在这里报警
        // err为字符串的话不需要报警（所以在Promise.reject时需要注意用Promise.reject(new Error('xxx'))还是Promise.reject('xxx')）
      }
      if (page || view) {
        res.render('500', {err : err});
      }
    }
    res.status(result.code);
    if (view) {
      if (err) {
        handleError(err);  
      } else {
        res.render(view, (err, html) => {
          if (err) {
            handleError(err);
          } else {
            res.send(html);
            // if (config.static.pageCacheStatus && !config.log.nolog.test(req.url)) {
            //   let pageCachePathKey = config.static.pageCacheRedisPre + req.url;
            //   cache.set(pageCachePathKey, html, config.static.expire);
            // }
          }
        })
      } 
    } else if (page) {
      res.send(page);    
    } else {
      if (err) {
        handleError(err);  
      } 
      let retObj = {
        RetSucceed : true,
        Succeed : status[result.code].succeed,
        Code : result.code,
        Desc : desc,
        Message : msg,
        extData : ext
      };
      let format = defaultFormat;
      if (format === 'JSONString') {
        res.send(JSON.stringify(retObj));
      } else {
        res.json(retObj);
      }
    }
  }
};

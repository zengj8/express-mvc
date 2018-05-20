/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function () {
  return function (req, res, next) {
    // 提供EJS页面方法
    helper(res.locals);
    next();
  }
};

function helper(locals) {
  locals.dateFormat = function (millSeconds, fmt = 'yyyy-MM-dd hh:mm') {
    if (!millSeconds) {
      return '';
    }
    if (typeof millSeconds === 'string') {
      millSeconds = Number.parseInt(millSeconds);
    }
    let date = new Date(millSeconds);
    let o = {
      'M+' : date.getMonth() + 1,
      'd+' : date.getDate(),
      'h+' : date.getHours(),
      'm+' : date.getMinutes(),
      's+' : date.getSeconds(),
      'q+' : Math.floor((date.getMonth() + 3) / 3),
      'S' : date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ((`00${o[k]}`).substr(`${o[k]}`).length));
      }
    }
    return fmt;
  }
}
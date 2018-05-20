/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

module.exports = function (params) {
  if (typeof params === 'function') {
    return catchError(params);
  }
  if (typeof params === 'object') {
    for (let key in params) {
      if (typeof params[key] === 'function') {
        params[key] = catchError(params[key]);
      }
    }
  }
  return params;
};

/**
 * 错误catch
 * @param controller
 * @returns {Function}
 */
function catchError(controller) {
  return function (req, res, next) {
    let func = controller.apply(null, arguments);
    if (func && typeof func.then === 'function') {
      return func.catch((err) => {
        if (typeof err === 'string' && err.indexOf('参数') > -1) {
          return next({code : 400, msg : err, err : err});
        }
        return next({code : 500, msg : err.message || err, err : err});
      });
    }
    return func;
  };
}

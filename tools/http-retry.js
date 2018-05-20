'use strict';

/**
 * http 请求重试
 *
 * @param {function} fn
 * @returns {*}
 */
module.exports = fn => {
  if (typeof fn === 'function') {
    return retry(fn);
  }
  if (typeof fn === 'object') {
    Object.keys(fn).forEach(i => (fn[i] = retry(fn[i])));
  }
  return fn;
};

/**
 * http 请求重试
 *
 * @param {any} fn
 * @param {number} [times=3]
 * @param {number} [delay=0]
 * @returns {*}
 */
function retry(fn, times = 3, delay = 0) {
  return function request(...args) {
    return fn(...args).catch(err => {
      if (needRetry(err)) {
        if (times -- > 0) {
          return Promse.delay(delay).then(() => request(...args));
        } else {
          logger.error(`HTTP Retry Failed, function: ${fn.name}, params:`, args);
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(err);
      }
    });
  };
}

/**
 * 对系统特定异常进行判断，决定是否重试
 *
 * @param {Object} err
 * @returns {Boolean}
 */
function needRetry(err) {
  const emsg = err.toString().toLowerCase();
  return emsg.includes('socket hang up')
    || emsg.includes('timeout')
    || emsg.includes('econnreset')
    || emsg.includes('econnrefused')
    || emsg.includes('etimedout')
}

// 使用方法：
// httpRetry(fn)
// or:
// module.exports = httpRetry({
//   login,
//   getToken
// });
// login 和 getToken 为普通函数

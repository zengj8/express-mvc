/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

let customSanitizers = {
  toArray(value) {
    return (typeof value === 'string') ? JSON.parse(value) : value;
  },
  toIntArray(value) {
    return _.map((typeof value === 'string') ? JSON.parse(value) : value, _.toInteger);
  },
  // 可定制自己需要的数据类型
  toInfo(value) {
    return (typeof value === 'string') ? JSON.parse(value) : value;
  }
};

let customValidators = {
  isArray(value) {
    try {
      return _.isArray((typeof value === 'string') ? JSON.parse(value) : value);
    } catch (e) {
      return false;
    }
  },
  isIntArray(value) {
    try {
      value = (typeof value === 'string') ? JSON.parse(value) : value;
      return _.isArray(value) && _.every(value, (item) => _.isInteger(parseInt(item)));
    } catch (e) {
      return false;
    }
  },
  // 自己定制的数据类型 Info: {'frame': '', 'style': '', 'genre': []}
  isInfo(value) {
    try {
      value = (typeof value === 'string') ? JSON.parse(value) : value;
      if (!_.has(value, 'frame') || !_.has(value, 'style') || !_.has(value, 'genre')) {
        return false;
      }
      let genre = value['genre'];
      return _.isArray((typeof genre === 'string') ? JSON.parse(genre) : genre);
    } catch (e) {
      return false;
    }
  }
};

module.exports = {
  customSanitizers,
  customValidators
};
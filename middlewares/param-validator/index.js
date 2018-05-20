/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const sanitizeMap = {
  isInt     : 'toInt',
  isFloat   : 'toFloat',
  isDate    : 'toDate',
  isArray   : 'toArray',
  isIntArray: 'toIntArray'
};

module.exports = async function (schema, req) {
  let newSchema = _.cloneDeep(schema);
  for (let key in newSchema) {
    if (_.has(newSchema[key], 'defaultValue')) {
      delete newSchema[key].defaultValue;
    }
  }
  req.check(newSchema);
  let result = await req.getValidationResult();
  if (!result.isEmpty()) {
    let errors = result.useFirstErrorOnly().array();
    return Promise.reject(`参数${errors[0].param}验证错误`);
  } else {
    // 添加默认值
    for (let key in schema) {
      if (_.has(schema[key], 'defaultValue') && schema[key].in) {
        req[schema[key].in][key] = req[schema[key].in][key] ? req[schema[key].in][key] : schema[key].defaultValue;
      }
      for (let sanitizeKey in sanitizeMap) {
        if (schema[key][sanitizeKey]) {
          req.sanitize(key)[sanitizeMap[sanitizeKey]]();
        }
      }
    }
    return {};
  }
};
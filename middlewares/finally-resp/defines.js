/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const status = {
  200 : {succeed : true, code : 200, status : 'success', desc : '成功'},
  500 : {succeed : true, code : 500, status : 'interalError', desc : '内部错误', view : '500'},
  404 : {succeed : true, code : 404, status : 'notFound', desc : '接口不存在', view : '404'},
  403 : {succeed : true, code : 403, status : 'noAuth', desc : '没有权限'},
  400 : {succeed : true, code : 400, status : 'paramError', desc : '参数错误'}
};

module.exports = status;
/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const Redis = require('ioredis');

module.exports = new Cache({redis : config.redis});

/**
 * 缓存类
 * @param options
 * @constructor
 */
function Cache(options) {
  this._client = new Redis(options.redis);
}

Cache.prototype.set = async function (key, content, expire) {
  await this._client.set(key, JSON.stringify(content || ''));
  if (expire) {
    await this._client.expire(key, expire);
  }
  return null;
};

Cache.prototype.get = async function (key, func, expire, refresh = false) {
  let cacheContent = await this._client.get(key);
  if (cacheContent && !refresh) {
    return JSON.parse(cacheContent);
  }
  if (typeof func === 'function') {
    let content = await func();
    await this.set(key, content, expire);
    return content;
  } else {
    return null;
  }
};

// 更新即删缓存的用
Cache.prototype.hset = async function (key, field, content, expire) {
  await this._client.hset(key, field, JSON.stringify(content) || '');
  if (expire) {
    await this._client.expire(key, expire);
  }
  return null;
};

Cache.prototype.hget = async function (key, field, func, expire, refresh = false) {
  let cacheContent = await this._client.hget(key, field);
  if (cacheContent && !refresh) {
    return JSON.parse(cacheContent);
  }
  if (typeof func === 'function') {
    let content = await func();
    await this.hset(key, field, content, expire);
    return content;
  } else {
    return null;
  }
};

Cache.prototype.del = async function (key) {
  return await this._client.del(key);
};

Cache.prototype.hdel = async function (key, fieldArr) {
  return await this._client.hdel(key, fieldArr);
};

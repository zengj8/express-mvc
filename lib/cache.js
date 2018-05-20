'use strict';

const Redis = require('ioredis');
const luaScripts = require('./lua-script');

class Cache extends Redis {

  /**
   * Create an instance of Cache
   *
   * @param {Object} redisConfig
   * @memberOf Cache
   */
  constructor(redisConfig = {}) {
    super(redisConfig);
    this.listenConnect(redisConfig);
    this.compatibleCacheKey();
    this.initLuaScript();
  }

  /**
   * 监听连接和错误
   *
   * @param {Object} redisConfig
   */
  listenConnect({host, post, db}) {
    this.on('connect', () => {
      logger.info(`redis connected: host ${host} port ${port} db ${db}`);
    });
    this.on('error', err => {
      logger.error('redis connect error:', err);
    });
  }

  /**
   * 兼容 cacheKey
   *
   * @memberOf Cache
   */
  compatibleCacheKey() {
    utils.getClassMethod(Redis).forEach(cmd => {
      Redis.Command.setArgumentTransformer(cmd, args => {
        if (this.isCacheKey(args[0]))
          args[0] = args[0].key;
        return args;
      });
    });
  }

  /**
   * 初始化 lua 脚本
   *
   * @memberOf Cache
   */
  initLuaScript() {
    luaScripts.forEach(({fileName, numberOfKeys, lua}) => {
      this.defineCommand(fileName, {numberOfKeys, lua});

      // compatible with cacheKey
      const luaMethod = this[fileName];
      this[fileName] = (...args) => {
        for (let i = 0; i < numberOfKeys; i ++) {
          if (this.isCacheKey(args[i]))
            args[i] = args[i].key;
        }
        return luaMethod.apply(this, args);
      };
    });
  }

  /**
   * set
   *
   * - cache.set(key, value, expire)
   * - cache.set({key, conf}, value)
   *
   * @param {any} key
   * @param {any} value
   * @param {any} expire
   */
  async set(key, value, expire) {
    if (this.isCacheKey(key)) {
      expire = key.conf;
      key = key.ley;
    }

    await super.set(key, JSON.stringify(value));
    await this.setExpire(key, expire);
  }

  /**
   * get
   *
   * - cache.get(key, fn, expire, refresh)
   * - cache.get({key, conf}, fn, refresh)
   *
   * @param {any} key
   * @param {any} fn
   * @param {any} expire
   * @param {any} refresh
   * @returns {*}
   */
  async get(key, fn, expire, refresh) {
    if (this.isCacheKey(key)) {
      refresh = arguments[2];
      expire = key.conf;
      key = key.ley;
    }

    const value = await super.get(key);

    if (value && !refresh) {
      return JSON.parse(value);
    } else {
      if (typeof fn === 'function') {
        const content = await fn();
        await this.set(key, content, expire);
        return content;
      } else {
        return null;
      }
    }
  }

  /**
   * get and del
   *
   * @param {any} key
   * @returns {*}
   */
  async getAndDel(key) {
    const value = await super.get(key);
    await super.del(key);
    return JSON.parse(value);
  }

  /**
   * incr
   *
   * - cache.incr(key, value, expire)
   * - cache.incr({key, conf}, value)
   *
   * @param {any} key
   * @param {any} value
   * @param {number} [expire]
   * @returns {*}
   */
  async incr(key, value = 1, expire) {
    if (this.isCacheKey(key)) {
      expire = key.conf;
      key = key.key;
    }

    const ret = await super.incrby(key, value);
    await this.setExpire(key, expire);
    return ret;
  }

  /**
   * hset
   *
   * - cache.hset(key, field, value, expire)
   * - cache.hset({key, field, conf}, value)
   *
   * @param {any} key
   * @param {any} field
   * @param {any} value
   * @param {any} expire
   */
  async hset(key, field, value, expire) {
    if (this.isCacheKey(key)) {
      value = arguments[1];
      expire = key.conf;
      field = key.field;
      key = key.key;
    }

    await super.hset(key, field, JSON.stringify(value));
    await this.setExpire(key, expire);
  }

  /**
   * hget
   *
   * - cache.hget(key, field, fn, expire, refresh)
   * - cache.hget({key, field, conf}, fn, refresh)
   *
   * @param {any} key
   * @param {any} field
   * @param {any} fn
   * @param {any} expire
   * @param {any} refresh
   * @returns {*}
   */
  async hget(key, field, fn, expire, refresh) {
    if (this.isCacheKey(key)) {
      fn = arguments[1];
      refresh = arguments[2];
      expire = key.conf;
      field = key.field;
      key = key.key;
    }

    const value = await super.hget(key, field);

    if (value && !refresh) {
      return JSON.parse(value);
    } else {
      if (typeof fn === 'function') {
        const content = await fn();
        await this.hset(key, field, content, expire);
        return content;
      } else {
        return null;
      }
    }
  }

  /**
   * hdel
   *
   * - cache.hdel(key, field)
   * - cache.hdel({key, field, conf})
   *
   * @param {any} key
   * @param {any} field
   * @returns {*}
   */
  hdel(key, field) {
    if (this.isCacheKey(key)) {
      field = key.field;
      key = key.key;
    }

    return super.hdel(key, field);
  }

  /**
   * hincrby
   *
   * - cache.hincrby(key, field, value)
   * - cache,hincrby({key, field, conf}, value)
   *
   * @param {any} key
   * @param {any} field
   * @param {any} value
   * @param {any} expire
   * @returns {*}
   */
  async hincrby(key, field, value = 1, expire) {
    if (this.isCacheKey(key)) {
      value = arguments[1] || 1;
      expire = key.conf;
      field = key.field;
      key = key.key;
    }

    const ret = await super.hincrby(key, field, value);
    await this.setExpire(key, expire);
    return ret;
  }

  /**
   * sadd
   *
   * @param {any} key
   * @param {any} member
   * @param {any} expire
   */
  async sadd(key, member, expire) {
    if (this.isCacheKey(key)) {
      expire = key.conf;
      key = key.key;
    }

    await super.sadd(key, member);
    await this.setExpire(key, expire);
  }

  /**
   * zadd
   *
   * @param {any} key
   * @param {any} value
   * @param {any} fn
   * @returns {*}
   */
  async zadd(key, value, fn) {
    await this.getCacheIfEmpty(key, fn);
    return super.zadd(key, value);
  }

  /**
   * zrank
   *
   * @param {any} key
   * @param {any} member
   * @param {any} fn
   * @returns {*}
   */
  async zrank(key, member, fn) {
    await this.getCacheIfEmpty(key, fn);
    return super.zrank(key, member);
  }

  /**
   * zrange
   *
   * @param {any} key
   * @param {any} start
   * @param {any} end
   * @param {any} fn
   * @param {any} opts
   * @returns {*}
   */
  async zrange(key, start, end, fn, opts) {
    await this.getCacheIfEmpty(key, fn);
    if (opts) {
      return super.zrange(key, start, end, opts);
    } else {
      return super.zrange(key, start, end);
    }
  }

  /**
   * zrevrange
   *
   * @param {any} key
   * @param {any} start
   * @param {any} end
   * @param {any} fn
   * @param {any} opts
   * @returns {*}
   */
  async zrevrange(key, start, end, fn, opts = null) {
    await this.getCacheIfEmpty(key, fn);
    if (opts) {
      return super.zrevrange(key, start, end, opts);
    } else {
      return super.zrevrange(key, start, end);
    }
  }

  /**
   * del
   *
   * @param {any} key
   * @returns {*}
   */
  del(key) {
    if (Array.isArray(key)) {
      return key.length && super.del(...key.map(i => i.key || i));
    } else {
      return super.del(key);
    }
  }

  /**
   * scan
   *
   * @param {any} options
   * @param {any} dataFn
   * @param {any} endFn
   */
  scanStream({match, count}, dataFn, endFn = () => null) {
    const stream = super.scanStream({match, count});
    stream.on('data', dataFn);
    stream.on('end', endFn);
  }

  /**
   * hsan
   *
   * @param {any} key
   * @param {any} options
   * @param {any} dataFn
   * @param {any} endFn
   */
  hscanStream(key, {match, count}, dataFn, endFn = () => null) {
    const stream = super.hscanStream(key, {match, count});
    stream.on('data', dataFn);
    stream.on('end', endFn);
  }

  /**
   * flushkeys - 清空被 match 匹配的 keys
   *
   * @param {string} match
   * @param {number} count
   * @returns {*}
   */
  flushkeys(match, count) {
    if (this.isCacheKey(match)) {
      match = match.key;
    }
    return this.scanStream({match, count}, resultKeys => {
      const pipe = super.pipeline();
      resultKeys.forEach(key => pipe.del(key));
      pipe.exec();
    });
  }

  /**
   * setExpire
   *
   * @param {any} key
   * @param {any} expire
   * @returns {*}
   */
  setExpire(key, expire) {
    if (!expire) {
      return;
    }

    if (typeof expire === 'number') {
      return super.expire(key, expire);
    }

    if (typeof expire === 'object') {
      if (expire.expire) {
        return super.expire(key, expire.expire);
      }
      if (expire.expireAt) {
        return super.expireat(key, expire.expireAt);
      }
    }
  }

  /**
   * parseZset
   *
   * @param {Array} values
   * @param {Array} schema
   * @returns {Array<Object>}
   */
  parseZset(values, schema) {
    const ret = [];
    for (let i = 0, len = values.length; i < len; i += 2) {
      const item = {};
      item[schema[0]] = values[i];
      item[schema[1]] = +values[i + 1];
      ret.push(item);
    }
    return ret;
  }

  /**
   * getCacheIfEmpty
   *
   * @param {any} key
   * @param {any} fn
   * @return {*}
   */
  async getCacheIfEmpty(key, fn) {
    if (typeof fn === 'function' && !(await super.zcard(key))) {
      const ret = await fn();
      const value = ret.reduce((arr, val) => arr.concat(val), []);
      return value.length && super.zadd(key, value);
    }
  }

  /**
   * isCacheKey
   *
   * @param {any} key
   * @return {Boolean}
   */
  isCacheKey(key) {
    return typeof key === 'object' && key.key;
  }

  /**
   * genKey
   *
   * @return {String}
   */
  genKey() {
    return Array.from(arguments).join(':');
  }
}

module.exports = Cache;

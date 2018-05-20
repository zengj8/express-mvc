'use strict';

const uuid = require('uuid');

// 分布式锁
module.exports = (fn, {key, expire = 3}) => {
  return async (...args) => {
    const lockKey = `lock:${key}`;
    const value = uuid();
    const lock = await cache.getLock(lockKey, expire, value);

    if (lock) {
      await fn(...args);
      await cache.releaseLock(lockKey, value);
    }
  };
};

// 加锁方法：
// const redisLock = require('redis-lock');
// const lock = redisLock(fn, {key: 'test'});
// lock();  --> 加锁
// do();    --> 其他方法

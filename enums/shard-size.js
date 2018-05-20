'use strict';

/**
 * redis 每个分片的大小
 *
 * hash、list、zset 根据 *-max-ziplist-entries 而定
 * set 根据 set-max-intset-entries 而定
 *
 * 保证每个分片的最大容量和上述配置相等可以节省内存
 *
 * 实际使用中可工具基准测试对上述配置进行调整
 */
module.exports = {
  HASH: 1000,
  LIST: 512,
  ZSET: 128,
  SET: 512
};
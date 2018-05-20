'use strict';

const SHARD_SIZE = ENUMS.shard_size;

class CacheKey {

  /**
   * 统计pv
   *
   * 采用 hash 分片，每个分片存储 1000 个元素，取 id 后 3 位数字为 field
   * 需设置 redis 的 hash-max-ziplist-value 为 1000
   *
   * @params {Number} id
   * @return {Object}
   */
  pv(id) {
    const shardId = parseInt(id / SHARD_SIZE.HASH);
    const field = id.toString().slice(-3);
    return {key: cache.genKey('pv', shardId), field};
  }

  tokenMap(token) {
    return {
      key: 'token_type',
      field: token,
      conf: {expire: ENUMS.TIME.MINUTE * 5}
    }
  }
}

module.exports = new CacheKey();

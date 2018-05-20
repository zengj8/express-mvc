'use strict';

const crypto = require('crypto');

class Crypto {
  constructor(method, key) {
    this.method = method;
    this.key = key;
  }

  encrypt(data) {
    const cipher = crypto.createCipher(this.method, this.key);
    let str = cipher.update(data, 'utf8', 'hex');
    str += cipher.final('hex');
    return str;
  }

  decrypt(data) {
    const decipher = crypto.createDecipher(this.method, this.key);
    let str = decipher.update(data, 'hex', 'utf8');
    str += decipher.final('utf8');
    return str;
  }
}

module.exports = Crypto;

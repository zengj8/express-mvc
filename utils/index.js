/**
 * @author suhuiyuan@henhaoji.com
 *
 * @Date 2018/5/20
 */

'use strict';

const crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const ipaddr = require('ipaddr.js');
const iconv  = require('iconv-lite');
const validator = require('validator');

module.exports = {
  md5,
  getClientIP,
  encodeBase64,
  decodeBase64,
  validator,
  isProEnv,
  toArray,
  stringToArray,
  escapeSearchChar,
  toGBKString,
  fetchId,
  getClassMethod,
  ipToInt,
  removeHTML
};

/**
 * 计算字符串md5值
 * @param str
 */
function md5(str) {
  let buf = new Buffer(str);
  str = buf.toString('binary');
  let md5 = crypto.createHash('md5');
  md5.update(str);
  let hash = md5.digest('hex');
  return hash;
}

function getClientIP(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
    req.socket.remoteAddress || req.connection.socket.remoteAddress;
  return ip624(ip.split(',')[0]);
}

/**
 * 转换ip
 * @param ip
 * @returns {*}
 */
function ip624(ip) {
  if (ipaddr.IPv6.isValid(ip)) {
    let addr = ipaddr.parse(ip);
    if (addr.isIPv4MappedAddress()) {
      return addr.toIPv4Address().octets.join('.');
    }
  }
  return ip;
}

/**
 * base64加密
 * @param content
 * @returns {String}
 */
function encodeBase64(content) {
  return new Buffer(JSON.stringify(content)).toString('base64');
}

/**
 * base64解密
 * @param content
 * @returns {String}
 */
function decodeBase64(content) {
  return new Buffer(content, 'base64').toString();
}

function isProEnv() {
  return process.env.NODE_ENV === 'production';
}

function toArray(v) {
  return Array.isArray(v) ? v : [v];
}

function stringToArray(value) {
  return (typeof value === 'string') ? JSON.parse(value) : value;
}

function escapeSearchChar(value) {
  return value.trim().replace('%', '\\%').replace('_', '\\_');
}

function toGBKString(str) {
  return iconv.encode(str, 'GBK')
    .reduce((pre, cur) => `${pre}${cur.toString(16)}`, '');
}

/**
 * 根据数组中第一个键值提取数组中的id
 *
 * @param {Array} list
 * @return {Array}
 */
function fetchId(list) {
  if (list && list.length) {
    const key = Object.keys(list[0]);
    return _.map(list, key[0]);
  } else {
    return [];
  }
}

function getClassMethod(targetClass) {
  return Object.getOwnPropertyNames(targetClass.prototype)
    .filter(method => method !== 'constructor');
}

function ipToInt(ip) {
  let ipl = 0;
  ip.split('.').forEach(octet => {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return (ipl >>> 0);
}

function removeHTML(content) {
  return content.replace(/<[^>]*>/g, '');
}

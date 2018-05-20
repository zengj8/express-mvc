'use strict';

const xss = require('xss');

module.exports = {
  filterXSS
};

const whiteList = {
  br: [],
  img: ['src', 'alt', 'title', 'align', 'border', 'valign', 'width', 'height', 'class', 'style']
};

const naiveTags = ['p', 'div', 'ul', 'li', 'caption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'span', 'em'];
const naiveAttrs = ['style'];

naiveTags.forEach(tag => {
  whiteList[tag] = naiveAttrs;
});

const tableTags = ['title', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'];
const tableAttrs = ['width', 'height', 'border', 'align', 'valign', 'cellspacing',
  'callpaddding', 'style', 'bgcolor', 'rowspan', 'colspan'];

tableTags.forEach(tag => {
  whiteList[tag] = tableAttrs;
});

/**
 * xss 过滤
 *
 * @param {String} content
 * @returns {String}
 */
function filterXSS(content) {
  return new xss.FilterXSS({whiteList}).process(content);
}

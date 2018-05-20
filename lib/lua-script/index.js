'use strict';

const luaScripts = [];

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const lua = fs.readdirSync(path.join(__dirname, file), {encoding: 'utf8'});
    const numberOfKeys = _.uniq(lua.match(/KEYS\[\d+]/g)).length;
    const fileName = file.split('.')[0];
    luaScripts.push({fileName, numberOfKeys, lua});
  });

module.exports = luaScripts;

const fs = require('node:fs');
const source = fs.readFileSync('./bookmarklet/bitbucket.js', 'utf8');
const text = source
  .replace(/(\s{2,})|(\r)|(\n)/gim, '')
  .replace(/(\s=\s)/gim, '=')
  .replace(/(\s=>\s)/gim, '=>')
  .replace(/(\s\|\|\s)/gim, '||');
fs.writeFileSync('./bookmarklet/bitbucket.txt', `javascript:${text}`);

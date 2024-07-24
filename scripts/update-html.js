const { exec } = require('node:child_process');

exec([
  'rm -rf ../node/html',
  'mv ../build ../node/html',
].join(' && '));


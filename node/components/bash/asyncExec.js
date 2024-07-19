const util = require('node:util');
const { exec } = require('node:child_process');

const asyncExec = util.promisify(exec);

module.exports = asyncExec;

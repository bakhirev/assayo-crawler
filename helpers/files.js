const fs = require('node:fs');
const util = require('node:util');
const { exec } = require('node:child_process');

const log = require('../helpers/logger')('FileAPI');

function isExists(path) {
  if (!path) return false;
  return fs.existsSync(path);
}

function createFolder(path) {
  if (!path) return false;
  const newPath = `./${path}`;
  if (isExists(newPath)) return false;
  try {
    log.debug(`create folder ${newPath}`);
    fs.mkdirSync(newPath, { recursive: true });
  } catch(e) {
    log.error('cant create folder');
    return 'Cant create folder';
  }
  return false;
}

function getFolderNameByUrl(url) {
  const parts = url.split('/').pop().split('.');
  parts.pop();
  return parts.join('.');
}

const asyncExec = util.promisify(exec);

async function applyBashCommand(command) {
  try {
    log.debug(command);
    await asyncExec(command);
  } catch(e) {
    log.error(e);
    return true;
  }
  return false;
}

module.exports = {
  isExists,
  createFolder,
  getFolderNameByUrl,
  applyBashCommand,
};

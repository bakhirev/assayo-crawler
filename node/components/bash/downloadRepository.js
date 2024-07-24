const { isExists, applyBashCommand } = require('../../helpers/files');
const ERROR = require('../errors/constants');
const {
  getCommand,
  openFolder,
  getRepository,
  removeFolder,
} = require('./bashCommands');

async function downloadRepository(parent, folder, config, repository) {
  const needRemoveAfterUse = repository.needRemoveAfterUse
    ?? config.input.needRemoveAfterUse
    ?? false;

  if (isExists(folder)) {
    if (!needRemoveAfterUse) return false;
    const commandForRemove = removeFolder(folder);
    const folderIsNotRemoved = await applyBashCommand(commandForRemove);
    if (folderIsNotRemoved) return ERROR.REMOVE_FOLDER;
  }

  const commandForDownload = getCommand([
    openFolder(parent),
    getRepository(repository.url),
  ]);
  const cantDownloadRepo = await applyBashCommand(commandForDownload);
  if (cantDownloadRepo) return ERROR.DOWNLOAD_REPOSITORY;

  return false;
}

module.exports = downloadRepository;

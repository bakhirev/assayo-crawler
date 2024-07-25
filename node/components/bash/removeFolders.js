const { applyBashCommand, isExists } = require('../../helpers/files');
const ERROR = require('../errors/constants');
const {
  removeFolder,
} = require('./bashCommands');

async function removeFolders(allFolders, foldersForRemove, report) {
  const removedFolders = report.needRemoveAfterUse
    ? allFolders
    : foldersForRemove

  if (!removedFolders.length) {
    return false;
  }

  const errors = [];

  for (const folder of removedFolders) {
    if (!isExists(folder)) continue;

    const commandForRemoveFolder = removeFolder(folder);
    const cantRemoveFile = await applyBashCommand(commandForRemoveFolder);
    if (cantRemoveFile) errors.push(ERROR.REMOVE_FOLDER);
  }

  return errors.length
    ? errors
    : false;
}

module.exports = removeFolders;

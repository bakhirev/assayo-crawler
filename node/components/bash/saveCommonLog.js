const { applyBashCommand, isExists, createFolder } = require('../../helpers/files');
const { removeFile, joinFiles } = require('./bashCommands');
const ERROR = require('../Errors/constants');

async function saveCommonLog(folders, report, config) {
  const files = folders.map((folder) => `${folder}.txt`);
  const folder = report?.log?.folder
    ? `./output/${config.output.folder}/${report?.log?.folder}`
    : `./output/${config.output.folder}`;
  const file = `${folder}/${report?.log?.name}.txt`;

  if (!isExists(folder)) {
    const commandForCreateFolder = createFolder(folder);
    if (commandForCreateFolder) return ERROR.CREATE_FOLDER;
  }

  if (isExists(file)) {
    const commandForRemoveFile = removeFile(file);
    const cantRemoveFile = await applyBashCommand(commandForRemoveFile);
    if (cantRemoveFile) return ERROR.REMOVE_FILE;
  }

  if (files.length > 0) {
    const commandForJoinFiles = joinFiles(files, file);
    const cantJoinFiles = await applyBashCommand(commandForJoinFiles);
    if (cantJoinFiles) return ERROR.CREATE_FILE;
  }

  return false;
}

module.exports = saveCommonLog;


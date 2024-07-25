const { applyBashCommand, isExists } = require('../../helpers/files');
const ERROR = require('../errors/constants');
const {
  getCommand,
  openFolder,
  removeFile,
  getLog,
  getLogWithoutFile,
} = require('./bashCommands');

async function createLogForRepository(folder, config, report) {
  const file = `${folder}.txt`;
  if (isExists(file)) {
    const commandForRemoveFile = removeFile(file);
    const cantRemoveFile = await applyBashCommand(commandForRemoveFile);
    if (cantRemoveFile) return ERROR.REMOVE_FILE;
  }

  const fileName = folder.split('/').pop();
  const removeFileInfo = config?.output?.removeFileInfo ||  report?.log?.removeFileInfo;
  const commandForCreateLog = getCommand([
    openFolder(folder),
    (removeFileInfo
      ? getLogWithoutFile(fileName)
      : getLog(fileName)
    ),
  ]);

  const cantCreateLog = await applyBashCommand(commandForCreateLog);
  if (cantCreateLog) return ERROR.CREATE_FILE;

  return false;
}

module.exports = createLogForRepository;

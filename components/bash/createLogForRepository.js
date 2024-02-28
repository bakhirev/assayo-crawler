const { applyBashCommand, isExists } = require('../../helpers/files');
const ERROR = require('../errors/constants');
const {
  getCommand,
  openFolder,
  removeFile,
  getLog,
} = require('./bashCommands');

async function createLogForRepository(folder, config, repository) {
  const file = `${folder}/log.txt`;
  if (isExists(file)) {
    const commandForRemoveFile = removeFile(file);
    const cantRemoveFile = await applyBashCommand(commandForRemoveFile);
    if (cantRemoveFile) return ERROR.REMOVE_FILE;
  }

  const commandForCreateLog = getCommand([
    openFolder(folder),
    getLog,
  ]);
  const cantCreateLog = await applyBashCommand(commandForCreateLog);
  if (cantCreateLog) return ERROR.CREATE_FILE;

  return false;
}

module.exports = createLogForRepository;

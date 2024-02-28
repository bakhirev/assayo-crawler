const { applyBashCommand } = require('../../helpers/files');
const ERROR = require('../errors/constants');
const {
  getCommand,
  openFolder,
  fetchAllBranch,
  checkoutBranch,
  updateBranch,
} = require('./bashCommands');

async function fetchAndUpdateBranch(folder, config, repository) {
  const command = getCommand([
    openFolder(folder),
    fetchAllBranch,
    (repository.branchName
      ? checkoutBranch(repository.branchName)
      : null),
    updateBranch,
  ]);
  const cantUpdateBranch = await applyBashCommand(command);
  if (cantUpdateBranch) return ERROR.UPDATE_BRANCH;

  return false;
}

module.exports = fetchAndUpdateBranch;

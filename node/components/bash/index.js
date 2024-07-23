const createLogForRepository = require('../bash/createLogForRepository');
const fetchAndUpdateBranch = require('../bash/fetchAndUpdateBranch');
const downloadRepository = require('../bash/downloadRepository');
const saveCommonLog = require('../bash/saveCommonLog');
const removeFolders = require('../bash/removeFolders');

module.exports = {
  createLogForRepository,
  fetchAndUpdateBranch,
  downloadRepository,
  saveCommonLog,
  removeFolders,
};

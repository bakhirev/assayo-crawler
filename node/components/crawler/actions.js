const {
  createLogForRepository,
  fetchAndUpdateBranch,
  downloadRepository,
  saveCommonLog,
  removeFolders
} = require('../bash');
const {
  createFolder,
  getFolderNameByUrl
} = require('../../helpers/files');
const log = require('../Logger')('Crawler');

async function getAsyncStatus(callback, errors, success) {
  const errorMessage = await callback();
  if (errorMessage) {
    log.warning(errorMessage);
    errors.push(errorMessage);
    return false;
  }
  if (success) {
    success();
  }
  return true;
}

function getStatus(callback, errors) {
  const errorMessage = callback();
  if (!errorMessage) return true;

  log.warning(errorMessage);
  errors.push(errorMessage);
  return false;
}

const methods = {
  reportValidation(step) {
    const report = step?.report;
    const id = report?.code || step?.meta?.reportIndex;

    log.info(`Report #${id} was taken to work.`);

    if (typeof report.status === 'number' && report.status !== 1) {
      log.warning(`Report "status" is not 1 (ready to parse).`);
      return false;
    }

    if (!report.code) {
      log.warning(`Report have not "code" for save result.`);
      return false;
    }

    if (!report.repositories?.length) {
      log.warning(`Report have not "repositories" for processing.`);
      return false;
    }

    return true;
  },

  initRepository(step, config) {
    const repository = step.repository;
    const parentFolder = repository.folder
      ? `./input/${config.input.folder}/${repository.folder}`
      : `./input/${config.input.folder}`;
    const folder = `${parentFolder}/${getFolderNameByUrl(repository.url)}`;

    step.meta.parentFolder = parentFolder;
    step.meta.folder = folder;

    const id = step?.report?.code || step?.meta?.reportIndex;
    log.info(`Repository ${repository?.url} (report #${id}) was taken to work.`);
  },

  createFoldersForRepository(step, config, errors) {
    const parentFolder = step.meta.parentFolder;
    return getStatus(() => createFolder(parentFolder), errors);
  },

  async downloadRepository(step, config, errors) {
    const repository = step.repository;
    const parentFolder = step.meta.parentFolder;
    const folder = step.meta.folder;
    return await getAsyncStatus(async () => (
      await downloadRepository(parentFolder, folder, config, repository)
    ), errors);
  },

  setFlagsForRepository(step, config) {
    const folder = step.meta.folder;
    const needRemoveAfterUse = config.input.needRemoveAfterUse
      || step.report.needRemoveAfterUse
      || step.repository.needRemoveAfterUse;

    if (needRemoveAfterUse) {
      step.foldersForRemove.push(folder);
    }
  },

  async fetchRepository(step, config, errors) {
    const repository = step.repository;
    const folder = step.meta.folder;
    return await getAsyncStatus(async () => (
      await fetchAndUpdateBranch(folder, config, repository)
    ), errors);
  },

  async getRepositoryLog(step, config, errors) {
    const report = step.report;
    const folder = step.meta.folder;
    return await getAsyncStatus(async () => (
      await createLogForRepository(folder, config, report)
    ), errors, () => {
      step.meta.foldersWithLogFiles.push(step.meta.folder);
    });
  },

  async getReportLog(step, config, errors) {
    const report = step.report;
    const folders = step.meta.foldersWithLogFiles;
    return await getAsyncStatus(async () => (
      await saveCommonLog(folders, report, config, report.repositories)
    ), errors);
  },

  async removeReportFolders(step, config, errors) {
    const report = step.report;
    const folders = step.meta.foldersWithLogFiles;
    const foldersForRemove = step.meta.foldersForRemove;
    return await getAsyncStatus(async () => (
      await removeFolders(folders, foldersForRemove, report)
    ), errors);
  },
}

module.exports = methods;

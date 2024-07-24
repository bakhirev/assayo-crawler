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
  taskValidation(step) {
    const task = step?.task;
    const id = task?.code || step?.meta?.taskIndex;

    log.info(`Task #${id} was taken to work.`);

    if (typeof task.status === 'number' && task.status !== 1) {
      log.warning(`Task "status" is not 1 (ready to parse).`);
      return false;
    }

    if (!task.code) {
      log.warning(`Task have not "code" for save result.`);
      return false;
    }

    if (!task.repositories?.length) {
      log.warning(`Task have not "repositories" for processing.`);
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

    const id = step?.task?.code || step?.meta?.taskIndex;
    log.info(`Repository ${repository?.url} (task #${id}) was taken to work.`);
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
    const needClearAfterUse = config.input.needClearAfterUse
      || step.task.needClearAfterUse
      || step.repository.needClearAfterUse;

    if (needClearAfterUse) {
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
    const task = step.task;
    const folder = step.meta.folder;
    return await getAsyncStatus(async () => (
      await createLogForRepository(folder, config, task)
    ), errors, () => {
      step.meta.foldersWithLogFiles.push(step.meta.folder);
    });
  },

  async getTaskLog(step, config, errors) {
    const task = step.task;
    const folders = step.meta.foldersWithLogFiles;
    return await getAsyncStatus(async () => (
      await saveCommonLog(folders, task, config, task.repositories)
    ), errors);
  },

  async removeTaskFolders(step, config, errors) {
    const task = step.task;
    const folders = step.meta.foldersWithLogFiles;
    const foldersForRemove = step.meta.foldersForRemove;
    return await getAsyncStatus(async () => (
      await removeFolders(folders, foldersForRemove, task)
    ), errors);
  },
}

module.exports = methods;

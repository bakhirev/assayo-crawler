const createLogForRepository = require('../bash/createLogForRepository');
const fetchAndUpdateBranch = require('../bash/fetchAndUpdateBranch');
const downloadRepository = require('../bash/downloadRepository');
const saveCommonLog = require('../bash/saveCommonLog');
const removeFolders = require('../bash/removeFolders');
const Errors = require('../errors/index');
const { createFolder, getFolderNameByUrl } = require('../../helpers/files');
const getTasks = require('../configs/getTasks');
const log = require('../../helpers/logger')('Crawler');

class Crawler {
  constructor(config) {
    this.config = config;
    this.isProcessing = false;
    this.errors = new Errors();
    this.createFolders()
  }

  createFolders() {
    const { input, output } = this.config;
    if (input.needCreateAfterInit !== false) {
      createFolder(`input/${this.config.input.folder}`);
    }
    if (output.needCreateAfterInit !== false) {
      createFolder(`output/${this.config.output.folder}`);
    }
  }

  async startLogUpdate() {
    if (this.isProcessing) return false;
    getTasks().then((tasks) => {
      this.applyTasks(tasks, this.config);
    })
    return true;
  }

  async applyTasks(tasks, config) {
    this.isProcessing = true;
    log.info('Started to log update.');

    for (let i = 0, l = tasks.length; i < l; i+= 1) {
      const task = tasks[i];

      log.info(`Task processing has been started (${i + 1} / ${l || 0}, code: ${task?.code})`);

      if (typeof task.status === 'number' && task.status !== 1) {
        log.warning(`Task "status" is not 1 (ready to parse).`);
        continue;
      }

      if (!task.code) {
        log.warning(`Task have not "code" for save result.`);
        continue;
      }

      if (!task.repositories?.length) {
        log.warning(`Task have not "repositories" for processing.`);
        continue;
      }

      await this.applyTask(task, config);
    }

    log.info(`Logs has been updated.`);
    this.isProcessing = false;
  }

  async applyTask(task, config) {
    let errorMessage = '';
    const folders = [];
    const foldersForRemove = [];

    for (let i = 0, l = task.repositories.length; i < l; i+= 1) {
      const repository = task.repositories[i];
      const parentFolder = repository.folder
        ? `./input/${config.input.folder}/${repository.folder}`
        : `./input/${config.input.folder}`;
      const folder = `${parentFolder}/${getFolderNameByUrl(repository.url)}`;

      log.info(`Repository processing has been started (${i + 1} / ${l}).`);
      log.debug(`URL: ${repository.url}`);

      errorMessage = createFolder(parentFolder);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      errorMessage = await downloadRepository(parentFolder, folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      if (repository.needClearAfterUse) {
        foldersForRemove.push(folder);
      }

      errorMessage = await fetchAndUpdateBranch(folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
      }

      errorMessage = await createLogForRepository(folder, config, task);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      const needClearAfterUse = config.input.needClearAfterUse
        || task.needClearAfterUse
        || repository.needClearAfterUse;

      if (needClearAfterUse) {
        
      }

      folders.push(folder);
    }

    log.info(`Creating common log file has been started.`);

    errorMessage = await saveCommonLog(folders, task, config, task.repositories);
    if (errorMessage) {
      this.errors.push(errorMessage);
    }

    errorMessage = await removeFolders(folders, foldersForRemove, task);
    if (errorMessage) {
      this.errors.push(...errorMessage);
    }
  }
}

module.exports = Crawler;

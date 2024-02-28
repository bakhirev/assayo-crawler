const createLogForRepository = require('../bash/createLogForRepository');
const fetchAndUpdateBranch = require('../bash/fetchAndUpdateBranch');
const downloadRepository = require('../bash/downloadRepository');
const saveCommonLog = require('../bash/saveCommonLog');
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
      createFolder(this.config.input.folder);
    }
    if (output.needCreateAfterInit !== false) {
      createFolder(this.config.output.folder);
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
    let index = 0;
    log.info(`Started to log update. Number of tasks: ${tasks?.length || 0}`);
    for (const task of tasks) {
      if (!task.code) {
        log.warn(`Task №${index + 1} have not "code" for save result.`);
        continue;
      }
      log.info(`Started to complete task №${index + 1} / ${tasks?.length || 0} (code: ${task?.code})`);
      await this.applyTask(task, config);
      index++;
    }
    log.info(`Logs has been updated.`);
    this.isProcessing = false;
  }

  async applyTask(task, config) {
    let errorMessage = '';
    const folders = [];

    for (const repository of task.repositories) {
      const parentFolder = repository.folder
        ? `./${config.input.folder}/${repository.folder}`
        : `./${config.input.folder}`;
      const folder = `${parentFolder}/${getFolderNameByUrl(repository.url)}`;

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

      errorMessage = await fetchAndUpdateBranch(folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      errorMessage = await createLogForRepository(folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      folders.push(folder);
    }

    errorMessage = await saveCommonLog(folders, task, config, task.repositories);
    if (errorMessage) {
      this.errors.push(errorMessage);
    }
  }
}

module.exports = Crawler;

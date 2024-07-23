const {
  createLogForRepository,
  fetchAndUpdateBranch,
  downloadRepository,
  saveCommonLog,
  removeFolders
} = require('../bash');
const Errors = require('../Errors');
const log = require('../Logger')('Crawler');
const Tasks = require('../Tasks');
const { createFolder, getFolderNameByUrl } = require('../../helpers/files');
const defaultTasks = require("../../configs/tasks.json");

const Progress = require('./Progress');

class Crawler {
  constructor(config) {
    this.config = config;
    this.isProcessing = false;
    this.isStopped = false;
    this.errors = new Errors();
    this.progress = new Progress();
    this.tasks = new Tasks();
    this.tasks.update(defaultTasks);
    this.createFolders();
  }

  stop() {
    this.isStopped = true;
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

  async start() {
    if (this.isProcessing) return false;

    this.progress.start(this.tasks.get());
    this.tasks
      .load(this.config.loadTasksFromUrl)
      .then(() => {
        this.applyTasks();
      });

    return true;
  }

  async applyTasks() {
    this.isProcessing = true;
    log.info(`Tasks processing has been started.`);

    const config = this.config;
    const tasks = this.tasks.get();

    for (let i = 0, l = tasks.length; i < l; i+= 1) {
      const task = tasks[i];

      log.info(`Task #${task?.code} (${i + 1} / ${l || 0}) has been started.`);

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

      if (this.isStopped) return;
      await this.applyTask(task, config);
    }

    log.info(`Tasks processing has been ended. Logs has been updated.`);
    this.progress.update();
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

      this.progress.update(`${task.code} | ${repository.url}`);
      log.info(`Repository processing has been started (${i + 1} / ${l}).`);
      log.debug(`URL: ${repository.url}`);

      if (this.isStopped) return;
      errorMessage = createFolder(parentFolder);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      if (this.isStopped) return;
      errorMessage = await downloadRepository(parentFolder, folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      const needClearAfterUse = config.input.needClearAfterUse
        || task.needClearAfterUse
        || repository.needClearAfterUse;

      if (needClearAfterUse) {
        foldersForRemove.push(folder);
      }

      if (this.isStopped) return;
      errorMessage = await fetchAndUpdateBranch(folder, config, repository);
      if (errorMessage) {
        this.errors.push(errorMessage);
      }

      if (this.isStopped) return;
      errorMessage = await createLogForRepository(folder, config, task);
      if (errorMessage) {
        this.errors.push(errorMessage);
        continue;
      }

      folders.push(folder);
    }

    log.info(`Creating common log file has been started.`);

    if (this.isStopped) return;
    errorMessage = await saveCommonLog(folders, task, config, task.repositories);
    if (errorMessage) {
      this.errors.push(errorMessage);
    }

    if (this.isStopped) return;
    errorMessage = await removeFolders(folders, foldersForRemove, task);
    if (errorMessage) {
      this.errors.push(...errorMessage);
    }
  }
}

module.exports = Crawler;

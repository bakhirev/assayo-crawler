const log = require('../Logger')('Crawler');
const Tasks = require('../Tasks');
const { createFolder } = require('../../helpers/files');
const defaultTasks = require("../../configs/tasks.json");

const Queue = require('./Queue');

const STATUS = {
  PROCESSING: 1,
  PAUSE: 2,
  WAITING: 3,
}

class Crawler {
  constructor(config) {
    this.config = config;
    this.status = STATUS.WAITING;
    this.errors = [];
    this.queue = null;
    this.tasks = new Tasks();
    this.tasks.update(defaultTasks);
    this.createFolders();
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

  start() {
    if (this.status === STATUS.PROCESSING) return false;
    this.status = STATUS.PROCESSING;
    log.info('Processing was started.');
    this._runProcessing();
    return true;
  }

  pause() {
    if (this.status !== STATUS.PROCESSING) return false;
    this.status = STATUS.PAUSE;
    log.info('Processing was stopped.');
    return true;
  }

  restart() {
    if (this.status !== STATUS.WAITING) return false;
    this.status = STATUS.PROCESSING;
    log.info('Processing was restarted.');
    this._updateQueue();
    this._runProcessing();
    return true;
  }

  _updateQueue() {
    const tasks = this.tasks.get();
    this.queue = new Queue(tasks);
  }

  _clearErrors() {
    if (!this.queue?.stepIndex) {
      this.errors = [];
    }
  }

  async _runProcessing() {
    this._clearErrors()
    while (!this.queue.isEnd && this.status === STATUS.PROCESSING) {
      await this.queue.next(this.config, this.errors);
    }
    if (this.status === STATUS.PROCESSING) {
      log.info('Processing was finished. Waiting a trigger for start.');
      this._updateQueue();
      this.status = STATUS.WAITING;
    }
  }

  getStatus() {
    const queue = this.queue;
    const step = queue.steps[queue.stepIndex];
    const progressInPercent = Math.ceil(100 * queue.stepIndex / queue.steps.length);

    const title = [step?.task?.code];
    if (step?.task?.repository?.url) {
      title.push(step?.task?.repository?.url);
    }

    return {
      status: this.status,
      title: title.join(' | '),
      progressInPercent,
    }
  }
}

module.exports = Crawler;

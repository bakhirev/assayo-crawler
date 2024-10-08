const log = require('../Logger')('Crawler');
const Reports = require('../Tasks');
const { createFolder } = require('../../helpers/files');
const defaultReports = require("../../configs/reports.json");

const Statistic = require('./Statistic');
const Queue = require('./Queue');

const STATUS = {
  PROCESSING: 1,
  PAUSE: 2,
  WAITING: 3,
  RESTART: 4,
  STOP: 5,
}

class Crawler {
  constructor(config) {
    this.config = config;
    this.status = STATUS.WAITING;
    this.errors = [];
    this.queue = null;
    this.reports = new Reports();
    this.statistic = new Statistic();
    this.reports.update(defaultReports);
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
    if (this.status === STATUS.PROCESSING
      || this.status === STATUS.RESTART
      || this.status === STATUS.STOP) return false;
    this.status = STATUS.PROCESSING;
    log.info('Processing was started.');
    if (!this.queue) this._updateQueue();
    this._runProcessing();
    return true;
  }

  pause() {
    if (this.status !== STATUS.PROCESSING) return false;
    this.status = STATUS.PAUSE;
    log.info('Processing was stopped.');
    return true;
  }

  stop() {
    if (this.status === STATUS.STOP
      || this.status === STATUS.RESTART
      || this.status === STATUS.WAITING) return false;

    log.info('Processing was stopped.');
    if (this.status === STATUS.PAUSE) {
      this._finished();
    } else {
      this.status = STATUS.STOP;
    }

    return true;
  }

  restart() {
    if (this.status === STATUS.RESTART) return false;
    if (this.status === STATUS.WAITING) return this.start();

    log.info('Processing was restarted.');
    if (this.status === STATUS.PAUSE) {
      this._finished();
      setTimeout(() => this.start());
    } else {
      this.status = STATUS.RESTART;
    }
    return true;
  }

  _updateQueue() {
    const reports = this.reports.get();
    this.queue = new Queue(reports);
  }

  _clearErrors() {
    if (!this.queue?.stepIndex) {
      this.errors = [];
    }
  }

  _finished() {
    log.info('Processing was finished. Waiting a trigger for start.');
    this.statistic.end();
    this.queue = null;
    this.status = STATUS.WAITING;
  }

  async _runProcessing() {
    this._clearErrors();
    this.statistic.start();

    while (!this.queue.isEnd && this.status === STATUS.PROCESSING) {
      await this.queue.next(this.config, this.errors);
    }

    if (this.status === STATUS.PROCESSING || this.status === STATUS.STOP) {
      this._finished();
    } else if (this.status === STATUS.RESTART) {
      this._finished();
      setTimeout(() => this.start());
    }
  }

  getStatus() {
    const queue = this.queue;
    if (!queue) {
      return {
        status: this.status,
        progressInPercent: 0,
        ...this.statistic.get(),
      };
    }

    const step = queue.steps[queue.stepIndex];
    const progressInPercent = Math.ceil(100 * queue.stepIndex / queue.steps.length);
    const repository = (step?.repository?.url || '').replace(/\/[^@]+@/, '//'); // remove login:pass

    return {
      status: this.status,
      report: step?.report?.log?.name || null,
      repository: repository || null,
      phase: step?.id || null,
      progressInPercent,
      ...this.statistic.get(),
    }
  }
}

module.exports = Crawler;

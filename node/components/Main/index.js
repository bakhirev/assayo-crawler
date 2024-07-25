const Configs = require("../Configs");
const Crawler = require("../Crawler");
const defaultApplicationConfig = require("../../configs/app.json");

class Main {
  constructor() {
    this.crawler = null;
    this.config = new Configs();
  }

  init() {
    this.config.setFromEnvironment();
    this.config.merge(defaultApplicationConfig);
    this.config.load().then(() => {
      this.crawler = new Crawler(this.config.get());
      this.crawler.start();
    });
  }

  start() {
    return this.crawler.start();
  }

  pause() {
    return this.crawler.pause();
  }

  restart() {
    return this.crawler.restart();
  }

  updateConfig(json) {
    if (!this.config.get()?.canUpdateConfigFromUI) return false;
    this.config.merge(json).load().then(() => {
      this.crawler.pause();
      this.crawler = new Crawler(this.config.get());
      this.crawler.start();
    });
    return true;
  }

  updateReports(json) {
    if (!this.config.get()?.canUpdateReportsFromUI) return false;
    this.crawler.reports.update(json);
    this.crawler.restart();
    return true;
  }

  getProgress() {
    return this.crawler.getStatus();
  }
}

module.exports = Main;

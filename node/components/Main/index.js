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
      this.crawler.restart();
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
      this.crawler.stop();
      this.crawler = new Crawler(this.config.get());
      this.crawler.start();
    });
    return true;
  }

  updateTasks(json) {
    if (!this.config.get()?.canUpdateTasksFromUI) return false;
    this.crawler.tasks.update(json);
    this.crawler.restart();
    return true;
  }

  getProgress() {
    return this.crawler.getStatus();
  }
}

module.exports = Main;

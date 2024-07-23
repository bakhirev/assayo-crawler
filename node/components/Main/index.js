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
    this.crawler.start();
    return true;
  }

  getProgress() {
    if (this.crawler.isProcessing) {
      const title = this.crawler.progress.title;
      const percent = this.crawler.progress.getInPercent();
      return { status: 'processing', percent, title };
    } else {
      return { status: 'waiting' };
    }
  }
}

module.exports = Main;

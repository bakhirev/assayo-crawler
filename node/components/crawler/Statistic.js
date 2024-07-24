class Statistic {
  constructor() {
    this.startUpdateTime = new Date();
    this.lastUpdateTime = new Date();
  }

  start() {
    this.startUpdateTime = new Date();
  }

  end() {
    this.lastUpdateTime = new Date();
  }

  get() {
    return {
      startUpdateTime: this.startUpdateTime.toISOString(),
      lastUpdateTime: this.lastUpdateTime.toISOString(),
    };
  }
}

module.exports = Statistic;

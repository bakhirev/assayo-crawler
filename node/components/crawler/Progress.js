class Progress {
  constructor() {
    this.startDate = new Date();
    this.steps = 0;
    this.step = 0;
    this.message = '';
  }

  start(tasks) {
    this.steps = (tasks || [])
      .reduce((total, task) => (total + (task?.repositories?.length || 0)), 0) + 1;
    this.step = 0;
    this.title = '';
  }

  update(title) {
    this.title = title || '';
    this.step += 1;
    if (this.step >= this.steps) {
      this.step = this.steps;
    }
  }

  getInPercent() {
    return Math.ceil(100 * this.step / this.steps);
  }
}

module.exports = Progress;

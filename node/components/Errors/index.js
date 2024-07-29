class Errors {
  constructor() {
    this.list = [];
  }

  push(message) {
    this.list.push(message);
  }

  get(message) {
    this.list.push(message);
  }
}

module.exports = Errors;

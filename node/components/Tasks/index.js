const log = require('../Logger')('TaskConfig');
const request = require("../../helpers/fetch");

class Tasks {
  constructor() {
    this.tasks = [];
  }

  update(json) {
    if (!json || typeof json !== 'object') {
      log.warning(`JSON with tasks has an invalid format. The task list has been cleared.`);
      this.tasks = [];
      return this;
    }

    const list = Array.isArray(json) ? json : [json];

    this.tasks = list
      .map((task, id) => this.getFormattedTask(task, id))
      .filter((repository) => !!repository);

    log.info(`The task list has been updated. Length: ${this.tasks.length} tasks.`);

    return this;
  }

  getFormattedTask(json, id) {
    if (!json?.code
      || typeof json?.code !== 'string'
      || (/[^A-Z0-9_-]/gim).test(json?.code)) {
      log.warning(`Task #${id} have incorrect property "code".`);
      return null;
    }

    const repositories = (json?.repositories || [])
      .map((repository, index) => this.getFormattedRepository(repository, `${index} in task #${json?.code || id}`))
      .filter((repository) => !!repository);

    if (!repositories?.length)  {
      log.warning(`Task #${id} (${json?.code}) have not correct repositories.`);
      return null;
    }

    return {
      code: json?.code,
      folder: json?.folder,
      status: json?.status ?? 1,
      repositories,
    };
  }

  getFormattedRepository(json, id) {
    if (!json?.url || typeof json?.url !== 'string')  {
      log.warning(`Repository #${id} have incorrect property "url".`);
      return null;
    }

    if (json?.folder && typeof json?.folder !== 'string')  {
      log.warning(`Repository #${id} have incorrect property "folder".`);
      return null;
    }

    return {
      url: json?.url,
      folder: json?.folder,
      needRemoveAfterUse: !!json?.needRemoveAfterUse
    };
  }

  async load(parameters) {
    if (!parameters?.url) {
      return Promise.resolve();
    }

    let json;
    try {
      json = await request[parameters?.method](parameters?.url, parameters?.body, parameters?.headers);
    } catch (e) {
      log.error(`Cant load tasks from URL: "${parameters?.url}".`);
    }

    if (json && typeof json === 'object' && Array.isArray(json)){
      this.update(json);
    } else {
      log.error(`Response from URL "${parameters?.url}" have incorrect format.`);
    }

    return Promise.resolve();
  }

  get() {
    return this.tasks;
  }
}

module.exports = Tasks;

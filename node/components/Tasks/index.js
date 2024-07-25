const log = require('../Logger')('ReportConfig');
const request = require("../../helpers/fetch");

class Reports {
  constructor() {
    this.reports = [];
  }

  update(json) {
    if (!json || typeof json !== 'object') {
      log.warning(`JSON with reports has an invalid format. The report list has been cleared.`);
      this.reports = [];
      return this;
    }

    const list = Array.isArray(json) ? json : [json];

    this.reports = list
      .map((report, id) => this.getFormattedReport(report, id))
      .filter((repository) => !!repository);

    log.info(`The report list has been updated. Length: ${this.reports.length} reports.`);

    return this;
  }

  getFormattedReport(json, id) {
    if (!json?.code
      || typeof json?.code !== 'string'
      || (/[^A-Z0-9_-]/gim).test(json?.code)) {
      log.warning(`Report #${id} have incorrect property "code".`);
      return null;
    }

    const repositories = (json?.repositories || [])
      .map((repository, index) => this.getFormattedRepository(repository, `${index} in report #${json?.code || id}`))
      .filter((repository) => !!repository);

    if (!repositories?.length)  {
      log.warning(`Report #${id} (${json?.code}) have not correct repositories.`);
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
      log.error(`Cant load reports from URL: "${parameters?.url}".`);
    }

    if (json && typeof json === 'object' && Array.isArray(json)){
      this.update(json);
    } else {
      log.error(`Response from URL "${parameters?.url}" have incorrect format.`);
    }

    return Promise.resolve();
  }

  get() {
    return this.reports;
  }
}

module.exports = Reports;

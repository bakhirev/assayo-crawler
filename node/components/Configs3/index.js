const request = require('../../helpers/fetch');

class Configs {
  constructor() {
    this.config = {};
  }

  setFromEnvironment() {
    const env = process?.env || {};
    this.config = {
      canUpdateConfigFromUI: env?.LOAD_CONFIG_UI ?? true,
      loadConfigFromUrl: {
        url: env?.LOAD_CONFIG_URL,
        method: env?.LOAD_CONFIG_METHOD,
        headers: env?.LOAD_CONFIG_HEADERS,
        body: env?.LOAD_CONFIG_BODY,
      },

      canUpdateReportsFromUI: env?.LOAD_REPORTS_UI ?? true,
      loadReportsFromUrl: {
        url: env?.LOAD_REPORTS_URL,
        method: env?.LOAD_REPORTS_METHOD,
        headers: env?.LOAD_REPORTS_HEADERS,
        body: env?.LOAD_REPORTS_BODY,
      },

      output: {
        folder: env?.OUTPUT_FOLDER,
        needCreateAfterInit: env?.OUTPUT_NEED_CREATE_AFTER_INIT,
      },

      input: {
        folder: env?.INPUT_FOLDER,
        needCreateAfterInit: env?.INPUT_NEED_CREATE_AFTER_INIT,
        needRemoveAfterUse: env?.INPUT_NEED_CLEAR_AFTER_USE,
      }
    };
    return this;
  }

  merge(json = {}) {
    this.config = {
      canUpdateConfigFromUI: json?.canUpdateReportsFromUI ?? this.config?.canUpdateReportsFromUI,
      loadConfigFromUrl: {
        url: json?.loadConfigFromUrl?.url ?? this.config?.loadConfigFromUrl?.url,
        method: json?.loadConfigFromUrl?.method ?? this.config?.loadConfigFromUrl?.method,
        headers: json?.loadConfigFromUrl?.headers ?? this.config?.loadConfigFromUrl?.headers,
        body: json?.loadConfigFromUrl?.body ?? this.config?.loadConfigFromUrl?.body,
      },

      canUpdateReportsFromUI: json?.canUpdateReportsFromUI ?? this.config?.canUpdateReportsFromUI,
      loadReportsFromUrl: {
        url: json?.loadReportsFromUrl?.url ?? this.config?.loadReportsFromUrl?.url,
        method: json?.loadReportsFromUrl?.method ?? this.config?.loadReportsFromUrl?.method,
        headers: json?.loadReportsFromUrl?.headers ?? this.config?.loadReportsFromUrl?.headers,
        body: json?.loadReportsFromUrl?.body ?? this.config?.loadReportsFromUrl?.body,
      },

      output: {
        folder: json?.output?.folder ?? this.config?.output?.folder,
        needCreateAfterInit: json?.output?.needCreateAfterInit ?? this.config?.output?.needCreateAfterInit,
      },

      input: {
        folder: json?.input?.folder ?? this.config?.input?.folder,
        needCreateAfterInit: json?.input?.needCreateAfterInit ?? this.config?.input?.needCreateAfterInit,
        needRemoveAfterUse: json?.input?.needRemoveAfterUse ?? this.config?.input?.needRemoveAfterUse,
      }
    };
    return this;
  }

  async load() {
    const parameters = this.config.loadConfigFromUrl;
    if (!parameters?.url) {
      return Promise.resolve();
    }

    let json;
    try {
      json = await request[parameters?.method](parameters?.url, parameters?.body, parameters?.headers);
    } catch (e) {
    }

    if (json && typeof json === 'object' && !Array.isArray(json)){
      this.merge(json);
    }

    return Promise.resolve();
  }

  get() {
    return this.config;
  }
}

module.exports = Configs;

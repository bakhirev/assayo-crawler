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

      canUpdateTasksFromUI: env?.LOAD_TASKS_UI ?? true,
      loadTasksFromUrl: {
        url: env?.LOAD_TASKS_URL,
        method: env?.LOAD_TASKS_METHOD,
        headers: env?.LOAD_TASKS_HEADERS,
        body: env?.LOAD_TASKS_BODY,
      },

      output: {
        folder: env?.OUTPUT_FOLDER,
        needCreateAfterInit: env?.OUTPUT_NEED_CREATE_AFTER_INIT,
      },

      input: {
        folder: env?.INPUT_FOLDER,
        needCreateAfterInit: env?.INPUT_NEED_CREATE_AFTER_INIT,
        needClearAfterUse: env?.INPUT_NEED_CLEAR_AFTER_USE,
      }
    };
    return this;
  }

  merge(json = {}) {
    this.config = {
      canUpdateConfigFromUI: json?.canUpdateTasksFromUI ?? this.config?.canUpdateTasksFromUI,
      loadConfigFromUrl: {
        url: json?.loadConfigFromUrl?.url ?? this.config?.loadConfigFromUrl?.url,
        method: json?.loadConfigFromUrl?.method ?? this.config?.loadConfigFromUrl?.method,
        headers: json?.loadConfigFromUrl?.headers ?? this.config?.loadConfigFromUrl?.headers,
        body: json?.loadConfigFromUrl?.body ?? this.config?.loadConfigFromUrl?.body,
      },

      canUpdateTasksFromUI: json?.canUpdateTasksFromUI ?? this.config?.canUpdateTasksFromUI,
      loadTasksFromUrl: {
        url: json?.loadTasksFromUrl?.url ?? this.config?.loadTasksFromUrl?.url,
        method: json?.loadTasksFromUrl?.method ?? this.config?.loadTasksFromUrl?.method,
        headers: json?.loadTasksFromUrl?.headers ?? this.config?.loadTasksFromUrl?.headers,
        body: json?.loadTasksFromUrl?.body ?? this.config?.loadTasksFromUrl?.body,
      },

      output: {
        folder: json?.output?.folder ?? this.config?.output?.folder,
        needCreateAfterInit: json?.output?.needCreateAfterInit ?? this.config?.output?.needCreateAfterInit,
      },

      input: {
        folder: json?.input?.folder ?? this.config?.input?.folder,
        needCreateAfterInit: json?.input?.needCreateAfterInit ?? this.config?.input?.needCreateAfterInit,
        needClearAfterUse: json?.input?.needClearAfterUse ?? this.config?.input?.needClearAfterUse,
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

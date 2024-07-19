const getRequestParameters = require('./getRequestParameters');
const log = require('../../helpers/logger')('getConfig');
const request = require('../../helpers/fetch');
const app = require('../../configs/app.json');

function getFormattedConfig(externalJson = {}) {
  const env = process?.env || {};
  return {
    output: {
      folder: externalJson?.output?.folder
        || env?.OUTPUT_FOLDER
        || app?.output?.folder,

      needCreateAfterInit: externalJson?.output?.needCreateAfterInit
        ?? env?.OUTPUT_NEED_CREATE_AFTER_INIT
        ?? app?.output?.needCreateAfterInit,
    },
    input: {
      folder: externalJson?.input?.folder
        || env?.INPUT_FOLDER
        || app?.input?.folder,

      needCreateAfterInit: externalJson?.input?.needCreateAfterInit
        ?? env?.INPUT_NEED_CREATE_AFTER_INIT
        ?? app?.input?.needCreateAfterInit,

      needClearAfterUse: externalJson?.input?.needClearAfterUse
        ?? env?.INPUT_NEED_CLEAR_AFTER_USE
        ?? app?.input?.needClearAfterUse,
    }
  };
}

async function getConfigs() {
  const requestParameters = getRequestParameters(app?.loadConfigFromUrl, [
    'LOAD_CONFIG_URL',
    'LOAD_CONFIG_METHOD',
    'LOAD_CONFIG_HEADERS',
    'LOAD_CONFIG_BODY',
  ]);
  if (!requestParameters) {
    return Promise.resolve(getFormattedConfig());
  }

  console.dir(requestParameters);
  let json;
  try {
    json = await request[requestParameters.method](
      requestParameters.url,
      requestParameters.body,
      requestParameters.headers,
    );
  } catch (e) {
  }

  return json && typeof json === 'object'
    ? Promise.resolve(getFormattedConfig(json))
    : Promise.resolve(getFormattedConfig());
}

module.exports = getConfigs;

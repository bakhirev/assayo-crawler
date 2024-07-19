const getRequestParameters = require('./getRequestParameters');
const app = require('../../configs/app.json');
const tasks = require('../../configs/tasks.json');
const request = require("../../helpers/fetch");

async function getTasks() {
  const requestParameters = getRequestParameters(app?.loadTasksFromUrl, [
    'LOAD_TASKS_URL',
    'LOAD_TASKS_METHOD',
    'LOAD_TASKS_HEADERS',
    'LOAD_TASKS_BODY',
  ]);
  if (!requestParameters) {
    return Promise.resolve([...tasks]);
  }

  let json;
  try {
    json = await request[requestParameters.method](
      requestParameters.url,
      requestParameters.body,
      requestParameters.headers,
    );
  } catch (e) {
  }

  return Array.isArray(json)
    ? Promise.resolve(json)
    : Promise.resolve([...tasks]);
}

module.exports = getTasks;

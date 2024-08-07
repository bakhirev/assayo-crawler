const STEPS = {
  REPORT_VALIDATION: 1,
  REPO_INIT: 2,
  REPO_CREATE_FOLDERS: 3,
  REPO_CLONE: 4,
  REPO_SET_FLAGS: 5,
  REPO_FETCH: 6,
  REPO_GET_LOG: 7,
  REPORT_GET_LOG: 8,
  REPORT_REMOVE_FOLDER: 9,
}

const STEP_NAME_BY_ID = [null, ...Object.keys(STEPS)];

const STEP_TYPE = {
  REPORT: 1,
  REPO: 2,
}

module.exports = {
  STEPS,
  STEP_NAME_BY_ID,
  STEP_TYPE,
};

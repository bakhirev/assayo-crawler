const {
  STEP_TYPE,
  STEPS,
  STEP_NAME_BY_ID
} = require('./constants');
const actions = require('./actions');
const log = require('../Logger')('Crawler');

class Queue {
  constructor(reports) {
    this.steps = this.getStepsList(reports);
    this.stepIndex = 0;
    this.isEnd = false;
  }

  getStepsList(reports) {
    const list = [];
    reports.forEach((report, reportIndex) => {
      const meta = {
        reportIndex: reportIndex,
        skipRepoSteps: false,
        skipReportSteps: false,
        parentFolder: '',
        folder: '',
        foldersForRemove: [],
        foldersWithLogFiles: [],
      };

      list.push({
        id: STEPS.REPORT_VALIDATION,
        type: STEP_TYPE.REPORT,
        report,
        meta,
      });

      const common = report?.repositories;
      report?.repositories?.list?.forEach((repository) => {
        const step = {
          type: STEP_TYPE.REPO,
          report,
          repository: {
            folder: common?.folder,
            needRemoveAfterUse: common?.needRemoveAfterUse,
            ...repository,
          },
          meta,
        };

        list.push({ ...step, id: STEPS.REPO_INIT });
        list.push({ ...step, id: STEPS.REPO_CREATE_FOLDERS });
        list.push({ ...step, id: STEPS.REPO_CLONE });
        list.push({ ...step, id: STEPS.REPO_SET_FLAGS });
        list.push({ ...step, id: STEPS.REPO_FETCH });
        list.push({ ...step, id: STEPS.REPO_GET_LOG });
        list.push({ ...step, id: STEPS.REPORT_GET_LOG });
        list.push({ ...step, id: STEPS.REPORT_REMOVE_FOLDER });
      });
    });

    return list;
  }

  async next(configs = {}, errors = []) {
    if (this.isEnd) return;

    const step = this.steps[this.stepIndex];
    this.updateIndex();
    if (!step
      || (step?.type === STEP_TYPE.REPORT && step?.meta?.skipReportSteps)
      || (step?.type === STEP_TYPE.REPO && step?.meta?.skipRepoSteps)
    ) return;

    log.debug(`Step ${this.stepIndex} (${STEP_NAME_BY_ID[step.id]}) from ${this.steps?.length} is started.`);

    let status;
    switch (step.id) {
      case STEPS.REPORT_VALIDATION:
        status = actions.reportValidation(step);
        step.meta.skipReportSteps = !status;
        step.meta.skipRepoSteps = !status;
        break;

      case STEPS.REPO_INIT:
        actions.initRepository(step, configs);
        break;

      case STEPS.REPO_CREATE_FOLDERS:
        status = actions.createFoldersForRepository(step, configs, errors);
        step.meta.skipRepoSteps = !status;
        break;

      case STEPS.REPO_CLONE:
        status = await actions.downloadRepository(step, configs, errors);
        step.meta.skipRepoSteps = !status;
        break;

      case STEPS.REPO_SET_FLAGS:
        actions.setFlagsForRepository(step, configs);
        break;

      case STEPS.REPO_FETCH:
        await actions.fetchRepository(step, configs, errors);
        break;

      case STEPS.REPO_GET_LOG:
        status = await actions.getRepositoryLog(step, configs, errors);
        step.meta.skipRepoSteps = !status;
        break;

      case STEPS.REPORT_GET_LOG:
        await actions.getReportLog(step, configs, errors);
        break;

      case STEPS.REPORT_REMOVE_FOLDER:
        await actions.removeReportFolders(step, configs, errors);
        break;

      default:
        log.warning(`Action for phase "${step.id}" not found.`);
    }
  }

  updateIndex() {
    this.stepIndex += 1;
    if (this.stepIndex >= this.steps.length) {
      this.isEnd = true;
    }
  }
}

module.exports = Queue;

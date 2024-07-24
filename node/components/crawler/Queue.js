const {
  STEP_TYPE,
  STEPS,
  STEP_NAME_BY_ID
} = require('./constants');
const actions = require('./actions');
const log = require('../Logger')('Crawler');

class Queue {
  constructor(tasks) {
    this.steps = this.getStepsList(tasks);
    this.stepIndex = 0;
    this.isEnd = false;
  }

  getStepsList(tasks) {
    const list = [];
    tasks.forEach((task, taskIndex) => {
      const meta = {
        taskIndex: taskIndex,
        skipRepoSteps: false,
        skipTaskSteps: false,
        parentFolder: '',
        folder: '',
        foldersForRemove: [],
        foldersWithLogFiles: [],
      };

      list.push({
        id: STEPS.TASK_VALIDATION,
        type: STEP_TYPE.TASK,
        task,
        meta,
      });

      task?.repositories?.forEach((repository) => {
        const step = {
          type: STEP_TYPE.REPO,
          task,
          repository,
          meta,
        };

        list.push({ ...step, id: STEPS.REPO_INIT });
        list.push({ ...step, id: STEPS.REPO_CREATE_FOLDERS });
        list.push({ ...step, id: STEPS.REPO_CLONE });
        list.push({ ...step, id: STEPS.REPO_SET_FLAGS });
        list.push({ ...step, id: STEPS.REPO_FETCH });
        list.push({ ...step, id: STEPS.REPO_GET_LOG });
        list.push({ ...step, id: STEPS.TASK_GET_LOG });
        list.push({ ...step, id: STEPS.TASK_REMOVE_FOLDER });
      });
    });

    return list;
  }

  async next(configs = {}, errors = []) {
    if (this.isEnd) return;

    const step = this.steps[this.stepIndex];
    this.updateIndex();
    if (!step
      || (step?.type === STEP_TYPE.TASK && step?.meta?.skipTaskSteps)
      || (step?.type === STEP_TYPE.REPO && step?.meta?.skipRepoSteps)
    ) return;

    log.debug(`Step ${this.stepIndex} (${STEP_NAME_BY_ID[step.id]}) from ${this.steps?.length} is started.`);

    let status;
    switch (step.id) {
      case STEPS.TASK_VALIDATION:
        status = actions.taskValidation(step);
        step.meta.skipTaskSteps = !status;
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

      case STEPS.TASK_GET_LOG:
        await actions.getTaskLog(step, configs, errors);
        break;

      case STEPS.TASK_REMOVE_FOLDER:
        await actions.removeTaskFolders(step, configs, errors);
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

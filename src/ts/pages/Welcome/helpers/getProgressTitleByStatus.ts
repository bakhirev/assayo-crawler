import IStatus from 'ts/interfaces/Status';
import { getDateWithTime } from 'ts/helpers/formatter';

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
};

const STEP_NAME_BY_ID = [null, ...Object.keys(STEPS)];

export default function getText(response: IStatus) {
  if (!response?.progressInPercent) {
    if (response?.lastUpdateTime) {
      const time = getDateWithTime(response?.lastUpdateTime);
      return `последнее обновление завершилось ${time}`;
    } else {
      return 'ожидание запуска';
    }
  }

  const step = [
    response?.report,
    response?.repository,
    STEP_NAME_BY_ID[response?.phase ?? 0],
  ].filter(v => v).join(':');
  const suffix = `завершён на ${response?.progressInPercent}%, текущий шаг ${step}`;

  if (response?.startUpdateTime) {
    const time = getDateWithTime(response?.startUpdateTime);
    return `процесс запущен ${time}, ${suffix}`;
  } else {
    return suffix;
  }
}

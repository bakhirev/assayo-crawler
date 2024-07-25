import IStatus from 'ts/interfaces/Status';

export default {
  updateSettings(json: any): Promise<any> {
    return fetch('/api/v1.0/update/configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(json),
    });
  },
  updateReports(json: any): Promise<any> {
    return fetch('/api/v1.0/update/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(json),
    });
  },
  getProgress(): Promise<IStatus> {
    return fetch('/api/v1.0/get/progress')
      .then((response) => response?.json());
  },
  start(): Promise<any> {
    return fetch('/api/v1.0/start');
  },
  pause(): Promise<any> {
    return fetch('/api/v1.0/pause');
  },
  stop(): Promise<any> {
    return fetch('/api/v1.0/stop');
  },
  restart(): Promise<any> {
    return fetch('/api/v1.0/restart');
  },
};

export default {
  updateSettings(json: any): Promise<any> {
    return fetch('/api/v1.0/update/configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(json)
    });
  },
  updateTasks(json: any): Promise<any> {
    return fetch('/api/v1.0/update/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(json)
    });
  },
  getProgress(): Promise<any> {
    // return Promise.resolve({ percent: Math.random() * 100, title: 'sa' });
    return fetch('/api/v1.0/get/progress')
      .then((response) => response?.json());
  },
  start(): Promise<any> {
    // return Promise.resolve();
    return fetch('/api/v1.0/start');
  },
};

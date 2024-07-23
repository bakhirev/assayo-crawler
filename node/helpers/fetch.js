const log = require('../components/Logger')('Fetch');

function getString(data, callback) {
  if (!data) return data;
  if (data instanceof Blob) return data;
  if (data instanceof File
    || data instanceof FileList
    || (data instanceof Array && data[0] instanceof File)) return data;
  if (typeof data === 'object') return callback(data);
  if (typeof data.toString === 'function') return data.toString();
  return data;
}

function getFormData(data) {
  if (!data) return data;
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const values = data[key];
    if (values instanceof FileList
      || (values instanceof Array && values[0] instanceof File)) {
      Array.from(values).forEach(file => formData.append(key, file));
    } else {
      formData.append(key, HttpClient.getLikeString(data[key],
        item => new Blob([JSON.stringify(item)], { type: 'application/json' })));
    }
  });
  return formData;
}

function getUrlWithData(url, data) {
  if (!data || typeof data !== 'object') return url;
  const formattedUrl = url.includes('?') ? `${url}&` : `${url}?`;
  const parameters = Object.entries(data)
    .filter((item) => (item[1] || item[1] === 0 || item[1] === false))
    .map(([key, value]) => {
      const formattedValue = value instanceof Array
        ? value.join(',')
        : encodeURIComponent(`${value}`);
      return `${key}=${formattedValue}`;
    })
    .join('&');
  if (!parameters) return url;
  return `${formattedUrl}${parameters}`;
}

function getHeaders(method, options) {
  const headers = new Headers();
  if (options && typeof options === 'object') {
    Object.entries(options).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.append(key, value);
      }
    });
  }
  return headers;
}

function getBody(data, isMultipart) {
  if (!data) return null;
  return isMultipart
    ? getFormData(data)
    : getString(data, item => JSON.stringify(item));
}

function sendRequest(method, url, sourceBody, sourceHeaders) {
  const headers = getHeaders(method, sourceHeaders);
  const body = getBody(sourceBody);
  log.debug(`${method} ${url}`);
  return fetch(url, {
    method,
    headers,
    body,
  }).then((response) => {
    if (response?.status > 299) {
      log.error(response);
      return Promise.reject(response);
    }
    const contentType = response.headers.get('Content-Type');
    if ((/json/gim).test(contentType)) {
      return response.json();
    }
    if ((/image/gim).test(contentType)) {
      return response.blob()
        .then((file) => Promise.resolve({ file })).catch(() => {});
    }
    return response.text();
  }).then((response) => {
    log.debug(response);
    return Promise.resolve(response);
  });
}

module.exports = {
  get(url, body, headers) {
    const urlWithData = getUrlWithData(url, body);
    return sendRequest('get', urlWithData, null, headers);
  },
  post(url, body, headers) {
    return sendRequest('post', url, body, headers);
  },
  put(url, body, headers) {
    return sendRequest('put', url, body, headers);
  },
  delete(url, body, headers) {
    const urlWithData = getUrlWithData(url, body);
    return sendRequest('delete', urlWithData, null, headers);
  }
};

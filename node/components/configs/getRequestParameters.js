function getRequestHeader(json = {}, ENV_HEADERS) {
  const env = process?.env || {};
  const headers = env?.[ENV_HEADERS || ''] || json?.headers;
  return typeof headers === 'string'
    ? JSON.parse(headers)
    : null;
}

function getCorrectMethod(text) {
  const method = (text || '').trim().toLowerCase();
  return {
    get: 'get',
    post: 'post',
  }[method] || 'get';
}

function getRequestParameters(json = {}, list) {
  const [
    ENV_URL,
    ENV_METHOD,
    ENV_HEADERS,
    ENV_BODY,
  ] = list;
  const env = process?.env || {};
  const url = env?.[ENV_URL || ''] || json?.url;
  const method = env?.[ENV_METHOD || ''] || json?.method;
  if (!url) return null;

  return {
    url,
    method: getCorrectMethod(method),
    headers: getRequestHeader(json, ENV_HEADERS),
    body: env?.[ENV_BODY || ''] || json?.body,
  };
}

module.exports = getRequestParameters;

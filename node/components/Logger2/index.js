const { colors, THEME } = require('./colors');

function logToConsole(level, module, message) {
  const color = colors[level || ''] || THEME.fg.white;
  const formattedMessage = message && typeof message === 'object'
    ? JSON.stringify(message)
    : message;
  console.log(`${color}%s${THEME.reset}`, `${module}: ${formattedMessage}`);
}

let history = [];
function logToJson(level, module, message) {
  const time = (new Date()).toISOString();
  const item = { time, level, module, message };
  history.push(item);
  if (history?.length > 50) history.shift();
  if (!['warning', 'error'].includes(level)) return;
  history.forEach((point) => {
    console.log(point);
  });
  history = [];
}

function getLogger(module) {
  const levels = Object.keys(colors)
    .map((level) => [level, (message) => true
      ? logToConsole(level, module, message)
      : logToJson(level, module, message)]);
  return Object.fromEntries(levels);
}

module.exports = getLogger;

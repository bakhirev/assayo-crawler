const controller = require('./Controller');
const log = require('./components/Logger')('Index');

const port = process.env.PORT || 3007;
controller.listen(port, () => {
  log.info(`Assayo Crawler is running on http://localhost:${port}`);
});

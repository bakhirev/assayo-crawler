const app = require('./app');
const log = require('./helpers/logger')('Index');

const port = process.env.PORT || 3007;
app.listen(port, () => {
  log.info(`Assayo Crawler is running on http://localhost:${port}`);
});

const Koa = require('koa');
const KoaStatic = require('koa-static');
const Router = require('koa-router');
const path = require('path');

const getConfigs = require('./components/configs/getConfigs');
const Crawler = require('./components/crawler');

const app = new Koa();
const router = new Router();

let crawler;
getConfigs().then((config) => {
  crawler = new Crawler(config);
  crawler.startLogUpdate();
});

app.use(require('koa-bodyparser')());

function sendResponse(context, status, message) {
  context.status = status;
  context.body = { message };
}

router.get('/start', async (ctx, next) => {
  const status = crawler?.startLogUpdate();
  if (status) {
    sendResponse(ctx, 200, 'The process has been running.');
  } else if (crawler) {
    sendResponse(ctx, 503, 'Can\'t start the process because it\'s already running.');
  } else {
    sendResponse(ctx, 503, 'Can\'t start the process because Crawler not created.');
  }
  next();
});

router.get('/check', async (ctx, next) => {
  sendResponse(ctx, 200, 'ok');
  next();
});

app.use(KoaStatic(path.resolve('./html/')));

app.use(router.routes());

module.exports = app;

const Koa = require('koa');
const KoaStatic = require('koa-static');
const Router = require('koa-router');
const path = require('path');

const getTranslation = require('./components/Translation');
const Main = require('./components/Main');

const controller = new Koa();
const router = new Router();
const app = new Main();

app.init();

controller.use(require('koa-bodyparser')());

function sendResponse(context, status, message) {
  context.status = status;
  context.body = typeof message !== 'object' ? { message } : message;
}

router.get('/api/v1.0/start', async (ctx, next) => {
  const t = getTranslation(ctx);
  const status = app?.crawler?.start();
  if (status) {
    sendResponse(ctx, 200, t('start.running'));
  } else if (app.crawler) {
    sendResponse(ctx, 503, t('start.already'));
  } else {
    sendResponse(ctx, 503, t('start.notFound'));
  }
  next();
});

router.get('/api/v1.0/stop', async (ctx, next) => {
  const t = getTranslation(ctx);
  const status = app?.crawler?.pause();
  if (status) {
    sendResponse(ctx, 200, t('stop.stopped'));
  } else if (app.crawler) {
    sendResponse(ctx, 503, t('stop.already'));
  } else {
    sendResponse(ctx, 503, t('stop.notFound'));
  }
  next();
});

router.get('/api/v1.0/restart', async (ctx, next) => {
  const t = getTranslation(ctx);
  const status = app?.crawler?.restart();
  if (status) {
    sendResponse(ctx, 200, t('restart.restarted'));
  } else if (app.crawler) {
    // TODO: ситуация абсурд
    sendResponse(ctx, 503, t('start.already'));
  } else {
    sendResponse(ctx, 503, t('start.notFound'));
  }
  next();
});

router.post('/api/v1.0/update/configs', async (ctx, next) => {
  const t = getTranslation(ctx);
  if (app.updateConfig(ctx.request.body)) {
    sendResponse(ctx, 200, t('configs.changed'));
  } else {
    sendResponse(ctx, 403, t('configs.forbidden'));
  }
  next();
});

router.post('/api/v1.0/update/tasks', async (ctx, next) => {
  const t = getTranslation(ctx);
  if (app.updateTasks(ctx.request.body)) {
    sendResponse(ctx, 200, t('tasks.changed'));
  } else {
    sendResponse(ctx, 403, t('tasks.forbidden'));
  }
  next();
});

router.get('/api/v1.0/get/progress', async (ctx, next) => {
  sendResponse(ctx, 200, app.getProgress());
  next();
});

router.get('/api/v1.0/check', async (ctx, next) => {
  sendResponse(ctx, 200, 'ok');
  next();
});

controller.use(KoaStatic(path.resolve(__dirname, './html/')));

controller.use(router.routes());

module.exports = controller;

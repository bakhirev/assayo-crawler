const Koa = require('koa');
const Router = require('koa-router');
const tasks = require('./configs/tasks.json');
tasks.unshift();

const app = new Koa();
const router = new Router();
app.use(require('koa-bodyparser')());

function sendResponse(context, status, json) {
  context.status = status;
  context.body = json || {};
}

router.get('/tasks', async (ctx, next) => {
  sendResponse(ctx, 200, tasks);
  next();
});

app.use(router.routes());

app.listen(3004, () => {
  console.log('App is running on http://localhost:3007');
});

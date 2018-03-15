const path = require('path'),
  Koa = require('koa'),
  logger = require('koa-logger'),
  bodyparser = require('koa-bodyparser'),
  jwt = require('koa-jwt'),
  serve = require('koa-static'),
  historyapifallback = require('koa-history-api-fallback');

//all router
const allRouter = require('./server/routes/all');

const app = new Koa();

app.use(logger());
app.use(bodyparser());

//logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

//logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

//check authorization
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (401 === err.status) {
      this.status = 401;
      this.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access',
      };
    } else {
      throw err;
    }
  }
});

//error
app.on('error', err => {
  console.log('sever err: ' + err);
});

//router
app.use(allRouter.routes());

//static server
app.use(historyapifallback());
app.use(serve(path.resolve('./dist')));

app.listen(8889, () => {
  console.log('Koa is listening on port 8889');
});

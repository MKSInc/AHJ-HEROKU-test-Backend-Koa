const Koa = require('koa');
const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(async (ctx, next) => {
   const origin = ctx.request.get('Origin');
   console.log(`--- ${ctx.url} ---`);
   console.log('origin: ', origin);
   if (origin) {
      console.log('origin true');
   } else {
      console.log('origin false');
   }

   console.log('method: ', ctx.request.method);
   await next();
});

app.use(async (ctx, next) => {
   console.log('start 1');
   await next();
   console.log('continue 1');
   const rt = ctx.response.get('X-Response-Time');
   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
   console.log('end 1');
});

app.use(async (ctx, next) => {
   console.log('start 2');
   const start = Date.now();
   await next();
   console.log('continue 2');
   const ms = Date.now() - start;
   ctx.set('X-Response-Time', `${ms}ms`);
   ctx.set('Access-Control-Allow-Origin', '*');
   ctx.set('Access-Control-Allow-Methods', 'PUT');
   console.log('end 2');
});

app.use(async (ctx) => {
   console.log('start 3');
   ctx.body = 'Hello world!';
   console.log('end 3');
});

app.listen(PORT, () => {
   console.log(`Koa server has been started on port ${PORT} ...`);
});

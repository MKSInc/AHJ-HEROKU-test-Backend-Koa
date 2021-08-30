/* eslint-disable no-unused-vars */
const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const WS = require("ws");
const User = require("./User");
const Message = require("./Message");

const app = new Koa();
app.use(cors());
app.use(koaBody({
   urlencoded: true,
   multipart: true,
   text: true,
   json: true,
}));

// const users = [
//   new User("Oleg"),
//   new User("Max"),
// ];
const users = ["oleg", "Max"];
const messages = [
   new Message("Oleg", "I am first"),
   new Message("Max", "I am second"),
];

const router = new Router();

app.use(router.routes()).use(router.allowedMethods());
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

wsServer.on("connection", (ws, req) => {
   const errCallback = (err) => {
      if (err) {
         ws.send(JSON.stringify({ type: "error", text: "что-то пошло не так" }));
      }
   };

   ws.on("message", (message) => {
      const body = JSON.parse(message);
      console.log(body);

      if (body.type === "login") {
         if (users.includes(body.value)) {
            ws.send(JSON.stringify({ type: "error", text: "Этот псевдоним занят, выберите другой" }));
         } else {
            users.push(body.value);
            const response = {
               type: "users",
               users,
            };
            ws.send(JSON.stringify(response));
            if (messages) {
               console.log(messages);
               const response = {
                  type: "messages",
                  messages,
               };
               ws.send(JSON.stringify(response));
            }
         }
      }

      if (body.type === "newMessage") {
         messages.push(new Message(body.user, body.value));
         console.log(messages);
         const response = {
            type: "messages",
            messages,
         };
         ws.send(JSON.stringify(response));
      }
      // [...wsServer.users]
      //   .filter((c) => c.readyState === WS.OPEN)
      //   .forEach((c) => c.send('to all', msg));
   });

   // ws.send("welcome", errCallback);
});

const port = process.env.PORT || 7070;
server.listen(port, () => console.log("server started"));


/*
const Koa = require('koa');
const koaCORS = require('@koa/cors');
const app = new Koa();

app.use(koaCORS());
/*
app.use(async (ctx, next) => {
   ctx.response.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT',
   });
   await next();
});*/
/*
app.use((ctx) => {
   console.log('test');
   ctx.response.body = 'test';
});

/*
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
*/
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Koa server has been started on port ${PORT} ...`);
});
*/

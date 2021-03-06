import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
// node module에서 express를 찾아냄.
// === const express = require("express");

// console.log(process.cwd());

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
// express에게 view engine으로 pug를 사용하겠다고 선언.
app.set("views", process.cwd() + "/src/views");
// views의 디렉토리를 /src/views로 변경

app.use(logger);
// 미들웨어 morgan("dev")를 사용.

app.use(express.urlencoded({ extended: true }));
// express app이 form의 value들을 이해할 수 있도록 하고, JS 형식으로 변형시켜줌.

app.use(express.json());
// string을 받아서 JS Object로 바꿔줌.
// 이전에 request의 content-type을 바꿔줄 필요가 있음. => headers

// 단순히 text 하나만 보내면 express.text()를 써도 무방
// express.text(): It parses the incoming request payloads into a string and is based on body-parser.

app.use(
   session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
         mongoUrl: process.env.DB_URL,
      }),
   })
);
// express에서 세션을 사용하기 위한 middleware. 라우터 이전에 써야함.
// 'secret'이란 기억하기 위한 텍스트.
// saveUninitialized: false => initialize 되어야 쿠키 생성, 즉 backend가 로그인 사용자에게만 쿠키 허용.
// token authentication 을 통해서도 해결 가능함. ex) iOS, Android app.
// store : MongoStore.create({}) 부분을 지우면 세션이 서버의 메모리에 저장됨.

/*
app.use((req, res, next) => {
   req.sessionStore.all((error, sessions) => {
      console.log(sessions);
      next();
   });
});

app.get("/add-one", (req, res, next) => {
   req.session.count += 1;
   return res.send(`${req.session.id}\n${req.session.count}`);
});
*/

app.use(flash());
// flash() 미들웨어를 설치한 순간부터 req.flash라는 함수 사용 가능
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
// app.use("경로명", express.static("폴더명"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
// "/"로 시작하는 url에 접근하면 콜백 라우터에 있는 컨트롤러를 찾게 함.

// express app의 내용을 구성하고, app에게 get request에 응답하는 방법 등을 입력

export default app;

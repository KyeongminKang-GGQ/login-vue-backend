import "reflect-metadata";

import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import injectDependency from "@common/dependency-container";
import { RouterFactory } from "@routes/RouterFactory";
import logger from "@common/logger";
import morganHandler from "@config/morgan";
import { container } from "tsyringe";
import { ErrorHandler } from "@workers/ErrorHandler";
import passport from "passport";
import session from "express-session";
import { PassportLocalStrategy } from "@workers/PassportLocalStrategy";
import MongoStore from "connect-mongo";
import cors from "cors";

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setMiddleWare();
    this.initializeContainers();
    this.setPassport();
    this.setErrorHandler();
    this.setRouter();
  }

  private setMiddleWare = (): void => {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser("cookieSecret"));
    this.app.use(morganHandler);
    this.app.use(
      session({
        resave: false, // 매번 세션 강제 저장
        saveUninitialized: false, // 빈 값도 저장
        secret: "cookieSecret", // cookie 암호화 키. dotenv 라이브러리로 감춤
        // cookie: {
        //     httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
        //     secure: false, // https 프로토콜만 허락하는 지 여부
        //     //sameSite: "none",
        // },
        store: MongoStore.create({
          mongoUrl:
            process.env.MONGODB_CONNECTION_STRING +
            "/" +
            process.env.MONGODB_NAME,
        }),
      })
    );
  };

  private initializeContainers = (): void => {
    try {
      injectDependency();
    } catch (error) {
      process.exit(1);
    }
  };

  private setRouter = (): void => {
    try {
      const routerFactory = container.resolve(RouterFactory);
      this.app.use(routerFactory.create());
    } catch (error) {
      process.exit(1);
    }
  };

  private setErrorHandler = (): void => {
    try {
      const errorHandler = container.resolve(ErrorHandler);
      this.app.use(errorHandler.handle);
    } catch (error) {
      process.exit(1);
    }
  };

  private setPassport = (): void => {
    try {
      this.app.use(passport.initialize());
      this.app.use(passport.session());
      // express-session 모듈 아래에 코드를 작성해야 한다. 미들웨어 간에 서로 의존관계가 있는 경우 순서가 중요
      const passportLocalStrategy = container.resolve(PassportLocalStrategy);
      passportLocalStrategy.config();
    } catch (error) {
      process.exit(1);
    }
  };
}

import moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@config": `${__dirname}/config`,
  "@controllers": `${__dirname}/controllers`,
  "@repositories": `${__dirname}/models/repositories`,
  "@models": `${__dirname}/models`,
  "@routes": `${__dirname}/routes`,
  "@workers": `${__dirname}/workers`,
  "@common": `${__dirname}`,
});

import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { App } from "@common/app";

const app = new App().app;
const server = createServer(app);

server.listen(3000, () => {
  console.log("ENVIRONMENT: localhost");
  console.log("Listening on :[3000]...");
});

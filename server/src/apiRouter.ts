import Router, { IMiddleware, RouterContext } from "koa-router";
import request from "request-promise-native";

import { initDB, companies } from "./shared/db";
import { logger } from "./logger";

const PAGE_SIZE = 10;

const apiRouter = new Router({
  prefix: "/api",
});

// Load data from companies.csv into LokiJS collection
initDB();

enum HttpVerb {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

type RouteConfig = {
  method: HttpVerb;
  path: string;
  handler: IMiddleware;
};

const routesConfig: Array<RouteConfig> = [
  {
    method: HttpVerb.GET,
    path: "/",
    handler(context) {
      context.body = "Welcome to the companies API. 🎉";
    },
  },

  {
    method: HttpVerb.GET,
    path: "/companies",
    async handler(ctx) {
      let result;
      if (ctx.query) {
        const { page = 0, pageSize = PAGE_SIZE, q = "" } = ctx.query;
        result = companies
          .chain()
          .find({ name: { $regex: q } })
          .offset(page * pageSize)
          .limit(pageSize)
          .data();
      } else {
        result = companies.chain().limit(PAGE_SIZE).data();
      }
      ctx.body = result;
    },
  },
  {
    method: HttpVerb.GET,
    path: "/company/:companyName",
    handler(ctx: RouterContext<{}, { companyName: string }>) {
      ctx.body = companies.findOne({ name: { $eq: ctx.params.companyName } });
    },
  },
  {
    method: HttpVerb.GET,
    path: "/twitter/details/:companyName",
    async handler(ctx: RouterContext<{}, { companyName: string }>) {
      const { request: req, response: res } = ctx;
      console.log(ctx.querystring, req.headers);
      try {
        const response = await request(
          `https://api.twitter.com/2/users/by/username/${ctx.params.companyName}?${ctx.querystring}`,
          {
            headers: { authorization: req.headers.authorization },
            strictSSL: false,
            resolveWithFullResponse: true,
          }
        );

        ctx.body = response.body;
        ctx.status = response.statusCode;
      } catch (e) {
        ctx.status = e.statusCode;
        logger.error(e);
      }
    },
  },
];

routesConfig.forEach(({ method, path, handler }: RouteConfig) => {
  apiRouter[method](path, handler);
});

export default apiRouter;

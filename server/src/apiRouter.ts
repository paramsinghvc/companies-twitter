import Router, { IMiddleware, RouterContext } from "koa-router";
import { initDB, companies } from "./shared/db";

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
];

routesConfig.forEach(({ method, path, handler }: RouteConfig) => {
  apiRouter[method](path, handler);
});

export default apiRouter;

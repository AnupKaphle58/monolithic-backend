import { IRouteInterface } from "@src/interfaces";
import { Router } from "express";
import { AuthRouter } from "./authRoutes";
import { StripeRouter } from "./stripeRoutes";
import { EstimateAmountRouter } from "./estimateAmountRoutes";

class ProxyRouter {
  private static instance: ProxyRouter;
  private router: Router = Router();
  private readonly routes = [
    {
      segment: "/user",
      provider: AuthRouter
    },
    {
      segment: "/estimate",
      provider: EstimateAmountRouter
    },
    {
      segment: '/stripe',
      provider: StripeRouter
    }
  ];

  private constructor() {}

  static get(): ProxyRouter {
    if (!ProxyRouter.instance) {
      ProxyRouter.instance = new ProxyRouter();
    }
    return ProxyRouter.instance;
  }

  map(): Router {
    this.routes.forEach((route: IRouteInterface) => {
      const instance = new route.provider() as { router: Router };
      this.router.use(route.segment, instance.router);
    });
    return this.router;
  }
}

const proxyRouter = ProxyRouter.get();

export { proxyRouter as ProxyRouter };

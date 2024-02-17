import { RouterClass } from "@src/classes";
import { StripeController } from "@src/controllers";
import exceptionHandler from "@src/middlewares/exceptionHandler";



export class StripeRouter extends RouterClass {
    constructor() {
      super();
    }

    define(): void {
        this.router
      .route("/create-customer")
      .post(
        exceptionHandler(StripeController.createCustomer)
      );

      this.router
      .route("/create-subscription")
      .post(
        exceptionHandler(StripeController.createSubscription)
      );

      this.router
      .route("/create-payment-intent")
      .post(
        exceptionHandler(StripeController.createPaymentIntent)
      );
    }
}
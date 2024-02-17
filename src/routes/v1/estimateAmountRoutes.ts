import { NextFunction, Response } from 'express';
import { RouterClass } from "@src/classes";
import { EstimateAmountController } from "@src/controllers";
import { UserRequestInterface } from "@src/interfaces";
import { Guard } from "@src/middlewares";
import exceptionHandler from "@src/middlewares/exceptionHandler";


export class EstimateAmountRouter extends RouterClass {
    constructor() {
      super();
    }

    define(): void {
        this.router
      .route("/plan-subscription")
      .post(
        exceptionHandler(Guard.grant),
        exceptionHandler(EstimateAmountController.estimatePlanSubscription)
      );
    }
}
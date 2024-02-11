import { Request, Response } from "express";

import { StripePayment } from "@src/utils";


export class StripeController {
    public constructor() { }

    public static async createCustomer(req: Request, res: Response): Promise<Response> {
        const {name, email, paymentMethod} = req.body;
        const customer = await StripePayment.createCustomer({
            name: name,
            email: email,
            paymentMethod: paymentMethod
        })
        return res.status(200).json({
            message: 'Customer created successfully',
            customer: customer.customer,
            paymentIntent: customer.createIntent
        }); 
    }

    public static async createSubscription(req: Request, res: Response): Promise<Response> {
        const {customerId, priceId} = req.body;

        const subscriptions = await StripePayment.createSubscription(customerId, priceId);

        return res.status(200).json({
            message: 'Subscription created successfully',
            subscriptions: subscriptions
        }); 
    }
}
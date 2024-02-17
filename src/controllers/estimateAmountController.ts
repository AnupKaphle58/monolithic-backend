import { Request, Response } from "express";
import * as Boom from '@hapi/boom';

import { PlanService } from "@src/services";


export class EstimateAmountController {
    public constructor() { }

    public static async estimatePlanSubscription(req: Request, res: Response): Promise<Response> { 
        const {planId}= req.body
        let priceAmount;
        try{
            const {price} = await new PlanService().findOne({planSlug: planId});
            priceAmount = price
        }catch(err){
            throw Boom.badRequest(`Failed to estimate amount`, [
                {
                    name: "estimatePlanSubscription",
                    path: ["estimatePlanSubscription"],
                },
            ]);
        }

        return res.status(200).json({
            message: 'Plan subscription estimated amount',
            estimatedAmount: priceAmount
        }); 
    }
}
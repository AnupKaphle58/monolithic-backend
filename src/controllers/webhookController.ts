import { Request, Response } from "express";
import { Stripe } from "stripe";

import { stripe } from "@src/config";


const stripeinit = new Stripe(stripe.secretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
});
// https://github.com/JacobMGEvans/stripe-with-webhooks-and-metadata/blob/main/src/app/api/stripe-webhook/route.ts


export class WebhookController {

    public static async subscribeStripeEvents(req: Request, res: Response): Promise<Response> {
        const stripeSignature = req.headers["stripe-signature"];
        if (stripeSignature === undefined) throw new Error("stripeSignature is null");
        let event;
        try {
            event = stripeinit.webhooks.constructEvent(
                await req.body(),
                stripeSignature,
                stripe.webhookSecret
              );
          
        } catch (error) { }
        const { event_type: eventType, content } = req.body;

        switch (eventType) {

        }
        return res.json({
            message: "HEllo"
        })
    }
}


// import { clerkClient } from "@clerk/nextjs";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2023-10-16",
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   if (req === null)
//     throw new Error(`Missing userId or request`, { cause: { req } });

//   const stripeSignature = req.headers.get("stripe-signature");

//   if (stripeSignature === null) throw new Error("stripeSignature is null");

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       await req.text(),
//       stripeSignature,
//       webhookSecret
//     );
//   } catch (error) {
//     if (error instanceof Error)
//       return NextResponse.json(
//         {
//           error: error.message,
//         },
//         {
//           status: 400,
//         }
//       );
//   }

//   if (event === undefined) throw new Error(`event is undefined`);
//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       console.log(`Payment successful for session ID: ${session.id}`);
//       clerkClient.users.updateUserMetadata(
//         event.data.object.metadata?.userId as string,
//         {
//           publicMetadata: {
//             stripe: {
//               status: session.status,
//               payment: session.payment_status,
//             },
//           },
//         }
//       );

//       break;
//     default:
//       console.warn(`Unhandled event type: ${event.type}`);
//   }

//   NextResponse.json({ status: 200, message: "success" });
// }
import { Stripe } from "stripe";

import { frontEndURL, stripe } from "@src/config";
import { PaymentIntentEnum } from "@src/enums";

class StripePayment {
    private static instance: StripePayment;
    private stripe;

    private constructor() {
        this.stripe = new Stripe(stripe.secretKey, {
            apiVersion: '2023-10-16',
            typescript: true,
        });
    }

    static get(): StripePayment {
        if (!StripePayment.instance) {
            StripePayment.instance = new StripePayment();
        }
        return StripePayment.instance;
    };

    public createCustomer = async ({ name, email, paymentMethod }: { name: string, email: string, paymentMethod: string }) => {
        return this.stripe.customers.create({
            name: name,
            email: email,
            payment_method: paymentMethod,
            invoice_settings: {
                default_payment_method: paymentMethod,
            },
        });
    }

    public createSubscription = (customerId: string, priceId: string) => {
        return this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            expand: ["latest_invoice.payment_intent"],
            payment_settings: {
                save_default_payment_method: 'on_subscription',
                payment_method_options: {
                    card: {
                        request_three_d_secure: 'any',
                    },
                },
            },
        });
    };

    public createPaymentIntent = (amount: number) => {
        this.stripe.tokens.create()
        return this.stripe.paymentIntents.create({
            payment_method_types: ["card"],
            amount: amount,
            currency: "USD",
            // automatic_payment_methods: {
            //     enabled: true,
            //   },          
        })
    };

    public createCustomerPortal = () => {
        return this.stripe.billingPortal.configurations.create({
            business_profile: {
                headline: 'Organization Name - Customer Portal',
            },
            features: {
                customer_update: {
                    enabled: true,
                    allowed_updates: ['address', 'email'],
                },
                invoice_history: { enabled: true },
                payment_method_update: { enabled: true },
                subscription_pause: { enabled: false },
                subscription_cancel: { enabled: true },
                subscription_update: {
                    enabled: true,
                    default_allowed_updates: ['price'],
                    proration_behavior: 'always_invoice',
                    products: [], // Need to figure this out
                },
            },
        });
    };

    public createStripeCheckoutSession = (customerId: string) => {
        return this.stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            // line_items: [{ price: priceId, quantity: 1 }], // Need to figure this out
            payment_method_types: ['card'],
            success_url: `${frontEndURL}/checkout`,
            cancel_url: `${frontEndURL}/plans`,
        });
    };

    public cancelSubscription = (subscriptionId: string) => {
        return this.stripe.subscriptions.cancel(subscriptionId);
    };

    public deleteCustomer = (customerId: string) => {
        return this.stripe.customers.del(customerId);
    };
}

const stripePayment = StripePayment.get();

export { stripePayment as StripePayment };


//https://github.com/dev-xo/stripe-stack
//https://github.com/stripe-samples/subscriptions-with-card-and-direct-debit
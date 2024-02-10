export interface CreateSubscriptionInterface {
    name: string,
    email: string,
    paymentMethod: string,
    invoiceSettings: StripeInvoiceSettingsInterface
    priceId: string
}

export interface StripeInvoiceSettingsInterface {
    defaultPaymentMethod: string
}
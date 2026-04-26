import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.stripe_secret_key as string);

export const initiateSSLPayment = async (
  paymentData: any,
  bookingType: "bookings" | "event-bookings",
) => {
  const transactionId = paymentData.transactionId;

  const baseUrl = `${config.serverUrl}/api/v1/${bookingType}/confirm-payment/${transactionId}`;

  const data = {
    total_amount: paymentData.totalPrice,
    currency: "BDT",
    tran_id: transactionId,

    success_url: `${baseUrl}?status=success`,
    fail_url: `${baseUrl}?status=fail`,
    cancel_url: `${baseUrl}?status=cancel`,

    shipping_method: "NO",
    product_name: paymentData.productName || "Service",
    product_category: "Service",
    product_profile: "general",

    cus_name: paymentData.customerName || "Customer",
    cus_email: paymentData.customerEmail || "customer@example.com",
    cus_phone: paymentData.customerPhone || "01700000000",
    cus_add1: "Dhaka",
    cus_country: "Bangladesh",
  };

  const sslcz = new (SSLCommerzPayment as any)(
    config.store_id,
    config.store_passwd,
    false,
  );

  const apiResponse = await sslcz.init(data);

  if (apiResponse?.GatewayPageURL) {
    return apiResponse.GatewayPageURL;
  }

  throw new Error(
    "SSLCommerz initiation failed: " + JSON.stringify(apiResponse),
  );
};

export const initiateStripePayment = async (
  paymentData: any,
  bookingType: "bookings" | "event-bookings",
) => {
  const transactionId = paymentData.transactionId;

  const baseUrl = `${config.serverUrl}/api/v1/${bookingType}/confirm-payment/${transactionId}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: paymentData.productName,
          },
          unit_amount: Math.round(paymentData.totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    success_url: `${baseUrl}?status=success`,
    cancel_url: `${baseUrl}?status=cancel`,

    customer_email: paymentData.customerEmail,

    metadata: {
      transactionId,
    },
  });

  return session.url;
};

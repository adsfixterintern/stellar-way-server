import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.stripe_secret_key as string);

export const initiateSSLPayment = async (paymentData: any) => {
  const transactionId = paymentData.transactionId;

  const data = {
    total_amount: paymentData.totalPrice,
    currency: "BDT",
    tran_id: transactionId,
    // --- এখানে আপডেট করা হয়েছে ---
    success_url: `${config.clientUrl}/event-booking/success/${transactionId}`,
    fail_url: `${config.clientUrl}/event-booking/fail/${transactionId}`,
    cancel_url: `${config.clientUrl}/event-booking/cancel/${transactionId}`,
    // ----------------------------
    shipping_method: "No",
    product_name: paymentData.productName || "Event Ticket",
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
  } else {
    throw new Error(
      "SSLCommerz initiation failed: " + JSON.stringify(apiResponse),
    );
  }
};

export const initiateStripePayment = async (paymentData: any) => {
  const transactionId = paymentData.transactionId;

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
    success_url: `${config.clientUrl}/event-booking/success/${transactionId}`,
    cancel_url: `${config.clientUrl}/event-booking/cancel/${transactionId}`,
    customer_email: paymentData.customerEmail,
    metadata: {
      transactionId: transactionId,
    },
  });

  return session.url;
};

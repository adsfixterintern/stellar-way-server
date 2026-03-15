import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const serverUrl = config.serverUrl;
const clientUrl = config.clientUrl;
export const initiateSSLPayment = async (paymentData: any) => {
  const data = {
    total_amount: paymentData.totalPrice,
    currency: "BDT",
    tran_id: paymentData.transactionId,
    success_url: `${serverUrl}/api/v1/payment/success/${paymentData.transactionId}`,
    fail_url: `${serverUrl}/api/v1/payment/fail/${paymentData.transactionId}`,
    cancel_url: `${serverUrl}/api/v1/payment/cancel/${paymentData.transactionId}`,
    shipping_method: "No",
    product_name: paymentData.productName || "Service Payment",
    product_category: "Service",
    product_profile: "general",
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_phone: paymentData.customerPhone,
    cus_add1: "Dhaka",
    cus_country: "Bangladesh",
  };

  const sslcz = new (SSLCommerzPayment as any)(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  );

  const apiResponse = await sslcz.init(data);
  return apiResponse.GatewayPageURL;
};

export const initiateStripePayment = async (paymentData: any) => {
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
    success_url: `${clientUrl}/payment/success/${paymentData.transactionId}`,
    cancel_url: `${clientUrl}/payment/cancel`,
    customer_email: paymentData.customerEmail,
    metadata: {
      transactionId: paymentData.transactionId,
    },
  });

  return session.url;
};
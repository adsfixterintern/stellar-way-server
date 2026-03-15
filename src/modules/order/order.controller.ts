import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { Order } from "./order.model";
import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// ১. ড্যাশবোর্ডের জন্য সব অর্ডার
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // ২. ডাটাবেজ থেকে নির্দিষ্ট পরিমাণ ডাটা আনা
  const result = await Order.find()
    .populate("customerInfo.user")
    .populate("items.menuId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // ৩. মোট অর্ডারের সংখ্যা বের করা (প্যাগিনেশন মেটার জন্য)
  const total = await Order.countDocuments();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All orders fetched successfully!",
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  });
});

// ২. নির্দিষ্ট ইউজারের অর্ডার (Email দিয়ে)
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // ExactOptionalPropertyTypes এরর এড়াতে টাইপ কাস্টিং করা হয়েছে
  const result = await Order.find({
    "customerInfo.email": email as string,
  }).sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your orders fetched successfully!",
    data: result,
  });
});

// ৩. অর্ডার ক্রিয়েট এবং পেমেন্ট ইনিশিয়েট
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const transactionId = `TXN-${Date.now()}`;

  const finalOrderData = {
    ...orderData,
    transactionId,
    paymentStatus: "unpaid",
  };

  const result = await Order.create(finalOrderData);

  const data = {
    total_amount: orderData.totalPrice,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `http://localhost:8000/api/v1/payment/success/${transactionId}`,
    fail_url: `http://localhost:8000/api/v1/payment/fail/${transactionId}`,
    cancel_url: `http://localhost:8000/api/v1/payment/cancel/${transactionId}`,
    shipping_method: "Courier",
    product_name: "Food Order",
    product_category: "Food",
    product_profile: "general",
    cus_name: orderData.customerInfo.name,
    cus_email: orderData.customerInfo.email,
    cus_add1: orderData.address,
    cus_country: "Bangladesh",
    cus_phone: orderData.phone,
  };

  const sslcz = new (SSLCommerzPayment as any)(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false,
  );

  const apiResponse = await sslcz.init(data);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order placed, redirecting to payment gateway...",
    data: { order: result, paymentUrl: apiResponse.GatewayPageURL },
  });
});
const createStripeOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const transactionId = `STXP-${Date.now()}`; // Stripe এর জন্য আলাদা প্রিফিক্স

  // ১. ডাটাবেজে অর্ডার সেভ করা
  const finalOrderData = {
    ...orderData,
    transactionId,
    paymentStatus: "unpaid",
    paymentMethod: "Stripe",
  };

  const result = await Order.create(finalOrderData);

  // ২. Stripe Checkout Session তৈরি করা
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderData.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Savory Nest Food Order",
        },
        unit_amount: Math.round(orderData.totalPrice * 100), // সেন্টে কনভার্ট
      },
      quantity: 1,
    })),
    mode: "payment",
    // আপনার ফ্রন্টএন্ডের URL অনুযায়ী নিচের লিঙ্কগুলো সেট করুন
    success_url: `http://localhost:3000/payment/success/${transactionId}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
    metadata: {
      orderId: result._id.toString(),
      transactionId: transactionId,
    },
    customer_email: orderData.customerInfo.email,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Stripe order initiated successfully!",
    data: {
      order: result,
      paymentUrl: session.url, // এই URL-এ ইউজারকে পাঠাতে হবে
    },
  });
});
// ৪. ডেলিভারি স্ট্যাটাস আপডেট
const updateDeliveryStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await Order.findByIdAndUpdate(
    id,
    { deliveryStatus: status },
    { new: true, runValidators: true },
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delivery status updated!",
    data: result,
  });
});

// ৫. পেমেন্ট স্ট্যাটাস চেঞ্জ
const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await Order.findByIdAndUpdate(
    id,
    { paymentStatus: status },
    { new: true, runValidators: true },
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment status updated!",
    data: result,
  });
});

// ৬. সিঙ্গেল অর্ডার ডিটেইলস
const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Order.findById(id).populate("items.menuId");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order details fetched!",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  createStripeOrder,
  getAllOrders,
  getMyOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  getOrderDetails,
};

import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { Order } from "./order.model";
import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
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

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const transactionId = `TXN-${Date.now()}`;

  // ১. ডাটাবেজে অর্ডার সেভ করা
  const finalOrderData = {
    ...orderData,
    transactionId,
    paymentStatus: "unpaid",
  };
  
  const result = await Order.create(finalOrderData);

  // ২. SSLCommerz ডাটা অবজেক্ট (Fixed for Sandbox)
  // স্যান্ডবক্সে amount অবশ্যই string এবং ০.০০ ফরম্যাটে হতে হয়
const amount = Number(orderData.totalPrice).toFixed(2);
const data = {
  total_amount: amount, 
  currency: 'BDT',
  tran_id: transactionId,
  success_url: `http://localhost:8000/api/v1/payment/success/${transactionId}`,
  fail_url: `http://localhost:8000/api/v1/payment/fail/${transactionId}`,
  cancel_url: `http://localhost:8000/api/v1/payment/cancel/${transactionId}`,
  shipping_method: 'Courier',
  product_name: 'Food Order',
  product_category: 'Food',
  product_profile: 'general',
  cus_name: orderData.customerInfo?.name || 'Customer',
  cus_email: orderData.customerInfo?.email || 'test@test.com',
  cus_add1: orderData.address || 'Dhaka',
  cus_city: 'Dhaka',
  cus_country: 'Bangladesh',
  cus_phone: orderData.phone || '01700000000',
  // শিপিং ডাটা বাধ্যতামূলক
  ship_name: 'Customer',
  ship_add1: 'Dhaka',
  ship_city: 'Dhaka',
  ship_state: 'Dhaka',
  ship_postcode: '1000',
  ship_country: 'Bangladesh',
};
  // ৩. SSLCommerz ইনিশিয়ালাইজেশন
  // IS_LIVE=false মানে আপনি স্যান্ডবক্স আইডি ব্যবহার করছেন। 
  // sslcommerz-lts লাইব্রেরিতে স্যান্ডবক্সের জন্য ৩য় প্যারামিটার true দিতে হয়।
  const isSandbox = process.env.IS_LIVE !== "true"; 

  const sslcz = new (SSLCommerzPayment as any)(
    process.env.STORE_ID, // adsfi69a9602610ea7
    process.env.STORE_PASSWORD, // adsfi69a9602610ea7@ssl
    isSandbox 
  );

  try {
    const apiResponse = await sslcz.init(data);
    
    if (apiResponse?.GatewayPageURL) {
      // সাকসেস হলে গেটওয়ে লিঙ্ক পাঠানো হচ্ছে
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed, redirecting to payment gateway...",
        data: { order: result, paymentUrl: apiResponse.GatewayPageURL },
      });
    } else {
      // যদি FAILED আসে (আপনার আগের এররটি এখানে ধরা পড়বে)
      console.error("--- SSLCommerz Detailed Error ---", apiResponse);
      
      return res.status(400).json({
        success: false,
        message: apiResponse.failedreason || "SSLCommerz validation failed",
        error: apiResponse
      });
    }
  } catch (err) {
    console.error("SSL Init Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment initialization",
    });
  }
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
const updatePaymentStatusByTransactionId = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  const result = await Order.findOneAndUpdate(
    { transactionId }, // আইডি নয়, ট্রানজেকশন আইডি দিয়ে খোঁজা হচ্ছে
    { paymentStatus: status },
    { new: true }
  );

  if (!result) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order payment status updated successfully!",
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
  updatePaymentStatusByTransactionId,
};

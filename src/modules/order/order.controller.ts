import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { Order } from "./order.model";
import SSLCommerzPayment from "sslcommerz-lts";
import Stripe from "stripe";
import { sendEmail } from "../../app/utils/sendEmail";
import { io } from "../../app/utils/socket";
import { Notification } from "../notification/notification.model";
import { model } from "mongoose";
import { Rider } from "../rider/rider.model";
import { User } from "../user/user.model";
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

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email as string;
    
    const orders = await Order.find({ 
      "customerInfo.email": userEmail 
    } as any)
      .populate({
        path: "riderId",
        select: "lastLocation userId phoneNumber status",
        populate: { 
          path: "userId", 
          select: "name image" 
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: orders 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const transactionId = `TXN-${Date.now()}`;

  // ১. ডাটাবেজে অর্ডার সেভ করা (orderId যদি null আসে তবে সেটা বাদ দিয়ে সেভ হবে)
  const finalOrderData = {
    ...orderData,
    transactionId,
    paymentStatus: "unpaid",
  };

  // যদি ফ্রন্টএন্ড থেকে orderId: null আসে, তবে সেটি ডিলিট করে দিন যাতে মঙ্গুজে এরর না দেয়
  if (!finalOrderData.orderId) delete (finalOrderData as any).orderId;

  const result = await Order.create(finalOrderData);

  const amount = Number(orderData.totalPrice).toFixed(2);
  
  // ২. SSLCommerz ডাটা অবজেক্ট
  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `http://localhost:3000/payment/success/${transactionId}`,
    fail_url: `http://localhost:3000/payment/fail/${transactionId}`,
    cancel_url: `http://localhost:3000/payment/cancel/${transactionId}`,
    shipping_method: "Courier",
    product_name: "Food Order",
    product_category: "Food",
    product_profile: "general",
    cus_name: orderData.customerInfo?.name || "Customer",
    cus_email: orderData.customerInfo?.email || "test@test.com",
    cus_add1: orderData.address || "Dhaka",
    cus_city: orderData.town || "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: orderData.phone || "01700000000",
    ship_name: "Customer",
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  // ৩. SSLCommerz ইনিশিয়ালাইজেশন ফিক্স
  const isSandbox = process.env.IS_LIVE !== "true"; // IS_LIVE=false হলে true হবে

  const sslcz = new SSLCommerzPayment(
    process.env.STORE_ID as string,
    process.env.STORE_PASSWORD as string,
    isSandbox,
  );

  try {
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed, redirecting to payment gateway...",
        data: { order: result, paymentUrl: apiResponse.GatewayPageURL },
      });
    } else {
      // গেটওয়ে থেকে কোনো এরর আসলে সেটি ব্যাকএন্ড কনসোলে প্রিন্ট হবে
      console.error("--- SSLCommerz Initialization Failed ---", apiResponse);
      return res.status(400).json({
        success: false,
        message: apiResponse.failedreason || "SSLCommerz validation failed",
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
  const transactionId = `STXP-${Date.now()}`; 

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
        unit_amount: Math.round(orderData.totalPrice * 100),
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: `http://localhost:3000/payment/success/${transactionId}`,
    cancel_url: `http://localhost:3000/payment/cancel/${transactionId}`,
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
      paymentUrl: session.url, 
    },
  });
});


export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { status, riderId, riderName, currentLocation, otp } = req.body; 


    const orderExists: any = await Order.findById(id);
    if (!orderExists) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (status === 'delivered') {
      if (!otp) return res.status(400).json({ success: false, message: "OTP required" });
      if (orderExists.deliveryOTP !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP code" });
      }
    }


    let finalRiderId = orderExists.riderId; 
    
   
    if (riderId) {
      const riderProfile = await Rider.findOne({ userId: riderId });
      if (riderProfile) {
        finalRiderId = riderProfile._id; 
      }
    }


    const updatedOrder: any = await Order.findByIdAndUpdate(
      id,
      { 
        deliveryStatus: status, 
        riderId: finalRiderId, 
      },
      { new: true }
    ).populate("customerInfo.user");

    const socketio = req.app.get("socketio");
    const customerId = updatedOrder.customerInfo?.user?._id || updatedOrder.customerInfo?.user;

    if (socketio) {
     
      if (customerId) {
        let title = "Order Update";
        let message = `Your order status: ${status}`;
        if (status === 'on-the-way') {
          title = "Rider is moving! 🛵";
          message = `${riderName || 'Rider'} has picked up your order.`;
        } else if (status === 'delivered') {
          title = "Order Received! 🎉";
          message = "Your delivery is complete. Enjoy!";
        }

        socketio.to(customerId.toString()).emit("new-notification", { title, message, status: "unread" });
      }

      socketio.to(id).emit("location-updates", {
        status,
        riderName,
        currentLocation
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Order updated successfully", 
      data: updatedOrder 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


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


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const updatePaymentStatusByTransactionId = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const { status } = req.body;

    const otp = generateOTP();
    let updateData: any = { paymentStatus: status };

    if (status === 'paid') {
      updateData.deliveryOTP = otp;
      updateData.deliveryStatus = 'preparing'; 
    }

    const result = await Order.findOneAndUpdate(
      { transactionId: transactionId as string } as any,
      updateData,
      { new: true },
    ).populate("customerInfo.user");

    if (!result) return res.status(404).json({ success: false, message: "Order not found" });

    if (status === 'paid') {
      const notifTitle = "Order Confirmed! 🎉";
      const notifMessage = `Payment successful for Order #${result.transactionId.slice(-6)}. OTP: ${otp}.`;
      
      if (result.customerInfo?.user) {
        const notification = await Notification.create({
          title: notifTitle,
          message: notifMessage,
          type: 'order',
          userId: result.customerInfo.user,
          status: 'unread'
        });
        if (io) io.to(result.customerInfo.user.toString()).emit('new-notification', notification);
      }

      if (io) {
        io.to("all-riders").emit("new-order-available", {
          title: "New Order Waiting! 🍔",
          message: `Order at ${result.address || 'Customer Location'}. Accept now!`,
          orderId: result._id,
          transactionId: result.transactionId
        });
      }
      const otpHtml = `<div style="text-align: center;"><h2>OTP: ${otp}</h2></div>`;
      try { await sendEmail(result.customerInfo.email, otpHtml, "Delivery OTP"); } catch (e) {}
    }

    sendResponse(res, { statusCode: 200, success: true, message: "Success!", data: result });
  },
);


// admin dashboard
const getOrderStats = catchAsync(async (req: Request, res: Response) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  
  // গত ১ বছরের ডাটার জন্য (জানুয়ারি থেকে ডিসেম্বর চার্টের জন্য)
  const oneYearAgo = new Date(now.getFullYear(), 0, 1); // বর্তমান বছরের ১লা জানুয়ারি থেকে

  const stats = await Order.aggregate([
    {
      $facet: {
        // ১. আপনার আগের বর্তমান টোটাল
        currentTotals: [
          {
            $group: {
              _id: null,
              totalPaidOrders: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] } },
              totalRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalPrice", 0] } },
              totalPendingOrders: { $sum: { $cond: [{ $eq: ["$paymentStatus", "unpaid"] }, 1, 0] } },
            },
          },
        ],
        // ২. আপনার আগের ট্রেন্ড ক্যালকুলেশন ডাটা
        last30Days: [
          { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
          { $group: { _id: null, revenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
        ],
        prev30Days: [
          { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, paymentStatus: "paid" } },
          { $group: { _id: null, revenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
        ],
        // --- ৩. নতুন অংশ: মান্থলি চার্টের জন্য ডাটা ---
        monthlyOverview: [
          { $match: { createdAt: { $gte: oneYearAgo }, paymentStatus: "paid" } },
          {
            $group: {
              _id: { month: { $month: "$createdAt" } },
              revenue: { $sum: "$totalPrice" },
              orders: { $count: {} }
            }
          },
          { $sort: { "_id.month": 1 } }
        ]
      },
    },
  ]);

  const current = stats[0].currentTotals[0] || { totalPaidOrders: 0, totalRevenue: 0, totalPendingOrders: 0 };
  const lastMonth = stats[0].last30Days[0] || { revenue: 0, count: 0 };
  const prevMonth = stats[0].prev30Days[0] || { revenue: 0, count: 0 };

  // মাসের নাম ম্যাপ করার জন্য
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesChartData = stats[0].monthlyOverview.map((item: any) => ({
    name: monthNames[item._id.month - 1],
    revenue: item.revenue,
    orders: item.orders
  }));

  const calculateTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return parseFloat((((curr - prev) / prev) * 100).toFixed(2));
  };

  const result = {
    totalPaidOrders: current.totalPaidOrders,
    orderTrend: calculateTrend(lastMonth.count, prevMonth.count),
    totalRevenue: current.totalRevenue,
    revenueTrend: calculateTrend(lastMonth.revenue, prevMonth.revenue),
    totalPendingOrders: current.totalPendingOrders,
    pendingTrend: 0,
    salesChartData 
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Full Dashboard statistics fetched!",
    data: result,
  });
});



const paymentFailed = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const result = await Order.findOneAndUpdate(
    { transactionId: transactionId as string } as any,
    { paymentStatus: "failed" },
    { new: true }
  );

  if (!result) {
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/payment/fail`);
  }

  res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/payment/fail?tranId=${transactionId}`);
});

const paymentCancelled = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  await Order.findOneAndUpdate(
    { transactionId: transactionId as string } as any,
    { paymentStatus: "cancelled" }
  );
  res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/payment/cancel`);
});



export const getRiderStatsAndOrders = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

  
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const riderProfile = await Rider.findOne({ userId: user._id });
    if (!riderProfile) {
      return res.status(404).json({ success: false, message: "Rider profile not found" });
    }

    const riderProfileId = riderProfile._id;


    const myAcceptedOrders = await Order.find({ riderId: riderProfileId })
      .populate("customerInfo.user")
      .sort({ updatedAt: -1 });

   
    const completedOrders = myAcceptedOrders.filter(o => o.deliveryStatus === 'delivered');
    const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const completedCount = completedOrders.length;
    const pendingCount = myAcceptedOrders.filter(o => o.deliveryStatus === 'on-the-way').length;

  
    const availableOrders = await Order.find({ 
      deliveryStatus: { $in: ["confirmed", "cooking", "preparing"] }, 
      paymentStatus: "paid",
      riderId: null 
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        completedCount,
        pendingCount,
        availableOrders,     
        myAcceptedOrders     
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const OrderControllers = {
  createOrder,
  createStripeOrder,
  getAllOrders,
  getMyOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  getOrderDetails,
  updatePaymentStatusByTransactionId,
  getOrderStats,
  paymentFailed,
  paymentCancelled,
  getRiderStatsAndOrders
};

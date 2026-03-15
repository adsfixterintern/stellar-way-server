"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const order_model_1 = require("./order.model");
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// ১. ড্যাশবোর্ডের জন্য সব অর্ডার
const getAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // ২. ডাটাবেজ থেকে নির্দিষ্ট পরিমাণ ডাটা আনা
    const result = await order_model_1.Order.find()
        .populate('customerInfo.user')
        .populate('items.menuId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    // ৩. মোট অর্ডারের সংখ্যা বের করা (প্যাগিনেশন মেটার জন্য)
    const total = await order_model_1.Order.countDocuments();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All orders fetched successfully!',
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
const getMyOrders = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    // ExactOptionalPropertyTypes এরর এড়াতে টাইপ কাস্টিং করা হয়েছে
    const result = await order_model_1.Order.find({
        'customerInfo.email': email
    }).sort({ createdAt: -1 });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Your orders fetched successfully!',
        data: result,
    });
});
// ৩. অর্ডার ক্রিয়েট এবং পেমেন্ট ইনিশিয়েট
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const orderData = req.body;
    const transactionId = `TXN-${Date.now()}`;
    const finalOrderData = {
        ...orderData,
        transactionId,
        paymentStatus: 'unpaid',
    };
    const result = await order_model_1.Order.create(finalOrderData);
    const data = {
        total_amount: orderData.totalPrice,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `http://localhost:8000/api/v1/payment/success/${transactionId}`,
        fail_url: `http://localhost:8000/api/v1/payment/fail/${transactionId}`,
        cancel_url: `http://localhost:8000/api/v1/payment/cancel/${transactionId}`,
        shipping_method: 'Courier',
        product_name: 'Food Order',
        product_category: 'Food',
        product_profile: 'general',
        cus_name: orderData.customerInfo.name,
        cus_email: orderData.customerInfo.email,
        cus_add1: orderData.address,
        cus_country: 'Bangladesh',
        cus_phone: orderData.phone,
    };
    const sslcz = new sslcommerz_lts_1.default(process.env.STORE_ID, process.env.STORE_PASSWORD, false);
    const apiResponse = await sslcz.init(data);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Order placed, redirecting to payment gateway...',
        data: { order: result, paymentUrl: apiResponse.GatewayPageURL },
    });
});
const createStripeOrder = (0, catchAsync_1.default)(async (req, res) => {
    const orderData = req.body;
    const transactionId = `STXP-${Date.now()}`; // Stripe এর জন্য আলাদা প্রিফিক্স
    // ১. ডাটাবেজে অর্ডার সেভ করা
    const finalOrderData = {
        ...orderData,
        transactionId,
        paymentStatus: 'unpaid',
        paymentMethod: 'Stripe',
    };
    const result = await order_model_1.Order.create(finalOrderData);
    // ২. Stripe Checkout Session তৈরি করা
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: orderData.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Savory Nest Food Order',
                },
                unit_amount: Math.round(orderData.totalPrice * 100), // সেন্টে কনভার্ট
            },
            quantity: 1,
        })),
        mode: 'payment',
        // আপনার ফ্রন্টএন্ডের URL অনুযায়ী নিচের লিঙ্কগুলো সেট করুন
        success_url: `http://localhost:3000/payment/success/${transactionId}`,
        cancel_url: `http://localhost:3000/payment/cancel`,
        metadata: {
            orderId: result._id.toString(),
            transactionId: transactionId,
        },
        customer_email: orderData.customerInfo.email,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Stripe order initiated successfully!',
        data: {
            order: result,
            paymentUrl: session.url // এই URL-এ ইউজারকে পাঠাতে হবে
        },
    });
});
// ৪. ডেলিভারি স্ট্যাটাস আপডেট
const updateDeliveryStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await order_model_1.Order.findByIdAndUpdate(id, { deliveryStatus: status }, { new: true, runValidators: true });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Delivery status updated!',
        data: result,
    });
});
// ৫. পেমেন্ট স্ট্যাটাস চেঞ্জ
const updatePaymentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await order_model_1.Order.findByIdAndUpdate(id, { paymentStatus: status }, { new: true, runValidators: true });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment status updated!',
        data: result,
    });
});
// ৬. সিঙ্গেল অর্ডার ডিটেইলস
const getOrderDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await order_model_1.Order.findById(id).populate('items.menuId');
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order details fetched!',
        data: result,
    });
});
exports.OrderControllers = {
    createOrder,
    createStripeOrder,
    getAllOrders,
    getMyOrders,
    updateDeliveryStatus,
    updatePaymentStatus,
    getOrderDetails,
};

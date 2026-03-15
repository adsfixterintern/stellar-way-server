"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../../app/utils/sendEmail");
const registerUserIntoDB = async (payload) => {
    // password hash kora
    if (payload.password) {
        const salt = await bcrypt_1.default.genSalt(10);
        payload.password = await bcrypt_1.default.hash(payload.password, salt);
    }
    const result = await user_model_1.User.create(payload);
    return result;
};
const loginUserFromDB = async (payload) => {
    // user finding
    const user = await user_model_1.User.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new Error("User not found!");
    }
    if (user.status === "blocked") {
        throw new Error("This user is blocked!");
    }
    // password check kora
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Password do not match!");
    }
    return user;
};
// for forgate password
const forgetPasswordIntoDB = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found!");
    }
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const htmlContent = `
  <div style="background-color: #f4f4f4; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <div style="background-color: #1A4E11F0; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">Stellar</h1>
      </div>

      <div style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #333333; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Hello, <br>
          We received a request to reset the password for your Staller account. 
          No changes have been made yet. You can reset your password by clicking the button below.
        </p>

        <a href="${resetLink}" style="background-color: #1A4E11; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; transition: background-color 0.3s;">
          Reset My Password
        </a>

        <p style="color: #999999; font-size: 14px; margin-top: 30px;">
          This link will expire in <strong>10 minutes</strong>. <br>
          If you did not request this, please ignore this email.
        </p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
          &copy; 2026 Stellar. All rights reserved. <br>
          Barishal, Bangladesh.
        </p>
      </div>
    </div>
  </div>
`;
    await (0, sendEmail_1.sendEmail)(user.email, htmlContent);
    return null;
};
const resetPasswordIntoDB = async (token, password) => {
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await user_model_1.User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new Error("Token is invalid or expired!");
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    await user_model_1.User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
    }, { runValidators: false });
    return null;
};
const changePasswordIntoDB = async (userId, payload) => {
    const user = await user_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new Error("User not found!");
    }
    const isMatch = await bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password is incorrect!");
    }
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hash(payload.newPassword, salt);
    await user.save();
    return null;
};
exports.UserService = {
    registerUserIntoDB,
    loginUserFromDB,
    forgetPasswordIntoDB,
    resetPasswordIntoDB,
    changePasswordIntoDB,
};

import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../../app/utils/sendEmail";

const registerUserIntoDB = async (payload: IUser) => {
  // 1. Check if user already exists
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new Error("User already exists with this email!");
  }

  // 2. Hash password
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }

  // 3. Create user
  try {
    const result = await User.create(payload);
    return result;
  } catch (error: any) {
    // Handling Mongoose unique constraint error (e.g. if two requests hit at the same time)
    if (error.code === 11000) {
      throw new Error("This email is already in use!");
    }
    throw error;
  }
};

const loginUserFromDB = async (payload: Pick<IUser, "email" | "password">) => {
  // user finding
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new Error("User not found!");
  }

  if (user.status === "blocked") {
    throw new Error("This user is blocked!");
  }

  // password check kora
  const isPasswordMatched = await bcrypt.compare(
    payload.password as string,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new Error("Password do not match!");
  }

  return user;
};

// for forgate password
const forgetPasswordIntoDB = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found!");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });
  console.log(resetToken)

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

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

  await sendEmail(user.email, htmlContent);
  return null;
};

const resetPasswordIntoDB = async (token: string, password: any) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Token is invalid or expired!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    },
    { runValidators: false },
  );

  return null;
};

const changePasswordIntoDB = async (userId: string, payload: any) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found!");
  }

  const isMatch = await bcrypt.compare(
    payload.oldPassword,
    user.password as string,
  );
  if (!isMatch) {
    throw new Error("Old password is incorrect!");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(payload.newPassword, salt);
  await user.save();

  return null;
};

const updateProfileInDB = async (userId: string, payload: Partial<IUser>) => {

  if (!payload) {
    throw new Error("Payload is missing!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }


  const { email, password, role, ...updateData } = payload;

  const result = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const UserService = {
  registerUserIntoDB,
  loginUserFromDB,
  forgetPasswordIntoDB,
  resetPasswordIntoDB,
  changePasswordIntoDB,
  updateProfileInDB
};

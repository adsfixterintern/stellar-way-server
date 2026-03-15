import { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendToken } from "../../app/utils/jwtToken";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";


// Register
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUserIntoDB(req.body);

  sendToken(result, 201, res);
});

// Login
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.loginUserFromDB(req.body);

  sendToken(result, 200, res);
});

// Logout
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await UserService.forgetPasswordIntoDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reset link sent to your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  await UserService.resetPasswordIntoDB(token as string, password);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successful!",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  await UserService.changePasswordIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: null,
  });
});


const getAdminData = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Welcome to the Admin Dashboard!",
    data: {
      adminInfo: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secretStats: {
        totalUsers: 150,
        revenue: "$5000",
        message: "This data is only visible to Admins.",
      },
    },
  });
});


const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const updateData = req.body; 

 
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Please provide data to update your profile.");
  }

  const result = await UserService.updateProfileInDB(userId, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  registerUser,
  loginUser,
  logoutUser,
  getAdminData,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile
};

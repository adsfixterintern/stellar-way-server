import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserService } from "./user.service";
import { refreshAccessToken, sendToken } from "../../app/utils/jwtToken";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { User } from "./user.model";
import { UploadService } from "../upload/upload.service";
import config from "../../app/config";


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
  res.cookie("refreshToken", null, {
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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Refresh token missing",
      data: null,
    });
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid refresh token",
      data: null,
    });
  }

  const userId = decoded.id || decoded._id || (decoded as any).sub;
  const user = await User.findById(userId);

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }

  if (user.status === "blocked") {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Your account has been blocked by admin! Logging out...",
      data: null,
    });
  }

  const accessToken = refreshAccessToken(user);

  res.cookie("token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully",
    data: {
      token: accessToken,
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    },
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


//get users

const getMe = catchAsync(async (req: Request, res: Response) => {
 
  const userId = req.query.userId;
  console.log(userId);

  const result = await UserService.getMeFromDB(userId as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});



// user.controller.ts

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (req.file) {
    const uploadResult = await UploadService.processSingleFile(req.file as Express.Multer.File);
    if (uploadResult) {
      req.body.image = uploadResult.url; 
    }
  }

  const updateData = { ...req.body };
  delete updateData.userId;

  if (Object.keys(updateData).length === 0 && !req.file) {
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



const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query; 
  const result = await UserService.getAllUsersFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});



const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUserFromDB(id as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: 'after' }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role updated successfully",
    data: user,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; 

  const result = await UserService.updateUserStatusInDB(id as string, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
    data: result,
  });
});

export const UserController = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getAdminData,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getMe,
  getAllUsers ,
  deleteUser,
  updateUserRole,
  updateUserStatus
};

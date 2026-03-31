import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";
import sendResponse from "./sendResponse";



export const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_secret as string,
    { expiresIn: "7d" },
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    path: "/",
  };

 

  const userObj = user.toObject ? user.toObject() : { ...user };

  const {
    password,
    resetPasswordToken,
    resetPasswordExpires,
    createdAt,
    updatedAt,
    __v,
    ...cleanUser
  } = userObj;

  res.cookie("token", token, cookieOptions);

  sendResponse(res, {
    statusCode,
    success: true,
    message:
      statusCode === 201 ? "Registered Successfully" : "Logged in Successfully",
    data: {
      user: cleanUser,
      token,
    },
  });
};  
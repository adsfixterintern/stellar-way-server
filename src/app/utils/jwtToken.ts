import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";
import sendResponse from "./sendResponse";
import { Rider } from "../../modules/rider/rider.model";

const parseExpiryToMs = (value: string) => {
  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 15 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const createAccessToken = (user: any) =>
  jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as string },
  );

const createRefreshToken = (user: any) =>
  jwt.sign({ id: user._id }, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in as string,
  });

export const sendToken = async (
  user: any,
  statusCode: number,
  res: Response,
) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const accessCookieOptions = {
    expires: new Date(
      Date.now() + parseExpiryToMs(config.jwt_access_expires_in as string),
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    path: "/",
  };

  const refreshCookieOptions = {
    expires: new Date(
      Date.now() + parseExpiryToMs(config.jwt_refresh_expires_in as string),
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    path: "/",
  };

  const userObj = user.toObject ? user.toObject() : { ...user };
  let riderId = null;
  if (userObj.role === "rider") {
    const riderProfile = await Rider.findOne({ userId: user._id }).lean();
    riderId = riderProfile ? riderProfile._id : null;
  }

  const {
    password,
    resetPasswordToken,
    resetPasswordExpires,
    createdAt,
    updatedAt,
    __v,
    ...cleanUser
  } = userObj;

  const finalUser = {
    ...cleanUser,
    riderId: riderId,
  };

  res.cookie("token", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode,
    success: true,
    message:
      statusCode === 201 ? "Registered Successfully" : "Logged in Successfully",
    data: {
      user: finalUser,
      token: accessToken,
      refreshToken,
    },
  });
};

export const refreshAccessToken = (user: any) => {
  return createAccessToken(user);
};

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/index";
import { User } from "../../modules/user/user.model";
import catchAsync from "../utils/catchAsync";


export const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let bearerToken: string | null = null;
    if (req.headers.authorization?.startsWith("Bearer")) {
      bearerToken = req.headers.authorization.split(" ")[1];
    }

    const cookieToken = req.cookies?.token || null;
    const refreshTokenHeader = req.headers["x-refresh-token"];
    const refreshToken =
      typeof refreshTokenHeader === "string" ? refreshTokenHeader : null;
    // Always prefer server-set httpOnly cookie token over Authorization header.
    const tokenCandidates = [cookieToken, bearerToken].filter(
      (token): token is string => !!token && token !== "undefined",
    );

    if (tokenCandidates.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing or invalid",
      });
    }

    let decoded: JwtPayload | null = null;
    try {
      for (const candidate of tokenCandidates) {
        try {
          decoded = jwt.verify(
            candidate,
            config.jwt_access_secret as string,
          ) as JwtPayload;
          if (decoded) break;
        } catch {
          // Try next token source (e.g. cookie after expired bearer).
        }
      }

      if (!decoded) {
        if (refreshToken) {
          const refreshDecoded = jwt.verify(
            refreshToken,
            config.jwt_refresh_secret as string,
          ) as JwtPayload;
          decoded = {
            id: refreshDecoded.id || refreshDecoded._id || (refreshDecoded as any).sub,
          } as JwtPayload;
        }
      }

      if (!decoded) {
        throw new Error("All token candidates are invalid or expired");
      }
    } catch (error: any) {
      console.error("JWT Verify Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const userId = decoded.id || decoded._id || (decoded as any).sub;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by admin! Logging out...",
      });
    }

    const tokenRole = (decoded as any)?.role;
    if (tokenRole && tokenRole !== user.role) {
      return res.status(401).json({
        success: false,
        message: "Your role has been updated. Please login again.",
      });
    }

    (req as any).user = user;
    next();
  }
);
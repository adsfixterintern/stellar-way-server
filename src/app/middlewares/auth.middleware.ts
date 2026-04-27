import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/index";
import { User } from "../../modules/user/user.model";
import catchAsync from "../utils/catchAsync";


export const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    

    let token = null;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

   
    if (!token) {
      token = req.cookies?.token;
    }


    if (!token || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing or invalid",
      });
    }

    try {

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      const userId = decoded.id || decoded._id || (decoded as any).sub;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.status === "blocked") {
        return res.status(403).json({ 
          success: false, 
          message: "Your account has been blocked by admin! Logging out..." 
        });
      }

      (req as any).user = user;
      next();
    } catch (error: any) {
      console.error("JWT Verify Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }
);
import { NextFunction, Request, Response } from 'express';
type TUserRole = 'admin' | 'user' | 'rider' | 'chef';
interface CustomRequest extends Request {
  user?: {
    _id: string;
    role: TUserRole;
    [key: string]: any;
  };
}

export const authorizeRoles = (...roles: TUserRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: ${user?.role || 'unknown'} is not allowed to access this resource`,
      });
    }

    next();
  };
};
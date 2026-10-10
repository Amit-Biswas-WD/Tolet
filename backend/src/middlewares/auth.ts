import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    sendError(res, 'Invalid or expired session token', 401);
    return;
  }

  req.user = decoded;
  next();
}

export function authorize(...allowedRoles: ('tenant' | 'landlord' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Access forbidden: Insufficient permissions', 403);
      return;
    }

    next();
  };
}

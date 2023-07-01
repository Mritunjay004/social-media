import { RequestHandler, Request } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../util/index";

interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  username?: string;
}

export const requiresAuth: RequestHandler = (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    throw createHttpError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(
      token.toString(),
      env.SESSION_SECRET
    ) as JwtPayload;

    req.body.username = decoded.username as string;
    next();
  } catch (error) {
    throw createHttpError(401, "Invalid token");
  }
};

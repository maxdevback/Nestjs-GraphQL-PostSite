import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { config } from "src/config";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx: any = GqlExecutionContext.create(context);
    const token = ctx.args[2].req.cookies.token;
    console.log(token);
    if (!token) return false;
    try {
      const data: any = verify(token, config.tokenSecret);
      if (data.id) return true;
    } catch {
      return false;
    }
  }
}

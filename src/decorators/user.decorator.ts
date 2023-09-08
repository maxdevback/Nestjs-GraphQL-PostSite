import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { verify } from "jsonwebtoken";
import { config } from "src/config";

export const UserData = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const ctx: any = GqlExecutionContext.create(context);
    const token = ctx.args[2].req.cookies.token;
    if (!token) throw new Error("Something went wrong");
    return verify(token, config.tokenSecret);
  }
);

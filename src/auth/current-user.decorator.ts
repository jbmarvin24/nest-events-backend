import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    if (gqlContext) {
      return gqlContext.getContext().req.user;
    }

    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);

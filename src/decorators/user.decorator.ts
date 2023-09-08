import { ExecutionContext, NotFoundException, createParamDecorator } from '@nestjs/common';

export const Users = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new NotFoundException('User not found.');
    return request.user;
  },
);

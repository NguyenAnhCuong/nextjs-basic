import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/decorator/customize";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Invalid Token");
    }
    //check permissions
    const currentMethod = req.method;
    const currentEndpoint = req.route?.path as string;

    const permissions = user?.permissions ?? [];
    let isExist = permissions.find((permission: any) => {
      return (
        currentMethod === permission.method &&
        currentEndpoint === permission.apiPath
      );
    });
    if (currentEndpoint.startsWith("/api/v1/auth")) isExist = true;

    if (!isExist) {
      throw new ForbiddenException(
        "You don't have permission to access this resource"
      );
    }
    return user;
  }
}

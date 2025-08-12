import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response, Request } from "express";
import { IUser } from "src/users/user.interface";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ResponseMessage("Login user")
  handleLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Post("/register")
  @Public()
  @ResponseMessage("Register new user")
  getRegister(@Body() register: RegisterUserDto) {
    return this.authService.register(register);
  }

  @Get("/account")
  @ResponseMessage("Get user information")
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Get("/refresh")
  @Public()
  @ResponseMessage("Get user by refresh token")
  handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refresh = req.cookies["refresh_token"];
    return this.authService.proccessNewToken(refresh, res);
  }

  @Post("/logout")
  @ResponseMessage("Logout user")
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(user, res);
  }
}

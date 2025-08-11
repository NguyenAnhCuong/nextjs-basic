import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";

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
}

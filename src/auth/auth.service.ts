import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/user.interface";
import { UsersService } from "src/users/users.service";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);

    //update user with refreshToken
    await this.usersService.updateUserToken(refreshToken, _id);

    //set refreshToken as cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
    });

    return {
      access_token: this.jwtService.sign(payload),
      User: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(user: RegisterUserDto) {
    const res = await this.usersService.register(user);

    return {
      _id: res?._id,
      createdAt: res?.createdAt,
    };
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn:
        ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000,
    });

    return refreshToken;
  };
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/user.interface";
import { UsersService } from "src/users/users.service";
import { Response } from "express";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        };
        return objUser;
      }
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const { _id, name, email, role, permissions } = user;
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
      user: {
        _id,
        name,
        email,
        role,
        permissions,
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

  proccessNewToken = async (refreshToken: string, res: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });

      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        //update refreshToken
        const { _id, name, email, role } = user;
        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          name,
          email,
          role,
        };

        const refreshToken = this.createRefreshToken(payload);

        //update user with refreshToken
        await this.usersService.updateUserToken(refreshToken, _id.toString());

        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        //set refreshToken as cookie
        res.clearCookie("refresh_token");

        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      } else {
        throw new BadRequestException("Invalid refresh token");
      }
    } catch (error) {
      throw new BadRequestException("Invalid refresh token.Pls login agian");
    }
  };

  logout = async (user: IUser, res: Response) => {
    await this.usersService.updateUserToken("", user._id);
    res.clearCookie("refresh_token");
    return "ok";
  };
}

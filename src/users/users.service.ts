import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User as UserM, UserDocument } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "./user.interface";
import { User } from "src/decorator/customize";
import aqp from "api-query-params";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private UserModel: SoftDeleteModel<UserDocument>
  ) {}
  async create(data: CreateUserDto, @User() user: IUser) {
    const { email, name, age, role, gender, address, company } = data;
    const hashPassword = await this.hashPassword(data.password);

    const isExist = await this.UserModel.findOne({ email: data.email });

    if (isExist) {
      throw new BadRequestException(`Email ${data.email} already exists`);
    }
    const newUser = await this.UserModel.create({
      email,
      password: hashPassword,
      name,
      age,
      role,
      gender,
      address,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  hashPassword = async (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  // async create(email: string, password: string, name: string) {
  //   const hashPassword = await this.hashPassword(password);
  //   const user = await this.UserModel.create({
  //     email,
  //     password: hashPassword,
  //     name,
  //   });
  //   return user;
  // }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select("-password")
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    return this.UserModel.findById({ _id: id }).select("-password");
  }

  findOneByUsername(username: string) {
    return this.UserModel.findOne({ email: username });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
      {
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Not found user";
    }

    await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );

    return this.UserModel.softDelete({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const hashPassword = await this.hashPassword(user.password);

    const isExist = await this.UserModel.findOne({ email: user.email });

    if (isExist) {
      throw new BadRequestException(`Email ${user.email} already exists`);
    }
    const newUser = await this.UserModel.create({
      ...user,
      password: hashPassword,
      role: "USER",
    });
    return newUser;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.UserModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken });
  };
}

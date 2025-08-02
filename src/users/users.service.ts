import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async create(data: CreateUserDto) {
    const hashPassword = await this.hashPassword(data.password);
    const user = await this.UserModel.create({
      email: data.email,
      password: hashPassword,
      name: data.name,
    });
    return user;
  }

  hashPassword = async (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  // async create(email: string, password: string, name: string) {
  //   const hashPassword = await this.hashPassword(password);
  //   const user = await this.UserModel.create({
  //     email,
  //     password: hashPassword,
  //     name,
  //   });
  //   return user;
  // }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user';
    }

    return this.UserModel.findById({ _id: id });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user';
    }

    return this.UserModel.deleteOne({ _id: id });
  }
}

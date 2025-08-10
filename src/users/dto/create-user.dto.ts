import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Id is required" })
  _id: mongoose.Schema.Types.ObjectId;
}

export class CreateUserDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Age is required" })
  age: number;

  @IsNotEmpty({ message: "Role is required" })
  role: string;

  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @IsNotEmpty({ message: "Gender is required" })
  gender: string;

  @IsNotEmptyObject({}, { message: "Company is required" })
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Age is required" })
  age: number;

  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @IsNotEmpty({ message: "Gender is required" })
  gender: string;
}

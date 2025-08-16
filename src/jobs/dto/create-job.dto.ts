import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Id is required" })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "Logo is required" })
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Skill is required" })
  @IsString({ each: true, message: "Skill must be a string" })
  @IsArray({ message: "Skill must be an array" })
  skill: string[];

  @IsNotEmpty({ message: "Salary is required" })
  salary: number;

  @IsNotEmpty({ message: "Quantity is required" })
  quantity: number;

  @IsNotEmpty({ message: "Level is required" })
  level: string;

  @IsNotEmpty({ message: "Description is required" })
  description?: string;

  @IsNotEmpty({ message: "Location is required" })
  location: string;

  @IsNotEmpty({ message: "Start date is required" })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: "Start date must be a valid date" })
  startDate: Date;

  @IsNotEmpty({ message: "End date is required" })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: "End date must be a valid date" })
  endDate: Date;

  @IsNotEmpty({ message: "IsActive is required" })
  @IsBoolean({ message: "IsActive must be a boolean" })
  isActive: boolean;

  @IsNotEmptyObject({}, { message: "Company is required" })
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

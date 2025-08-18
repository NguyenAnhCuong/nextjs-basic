import { PartialType } from "@nestjs/mapped-types";
import { CreateResumeDto } from "./create-resume.dto";
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import mongoose from "mongoose";

class UpdatedBy {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  @IsNotEmpty({ message: "status is required" })
  status: string;

  @IsNotEmpty({ message: "updatedAt is required" })
  updatedAt: string;

  @IsNotEmpty({ message: "updatedBy is required" })
  @ValidateNested()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNotEmpty({ message: "History is required" })
  @ValidateNested()
  @IsArray({ message: "History is must be an array" })
  @Type(() => History)
  history: History[];
}

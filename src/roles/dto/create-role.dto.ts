import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty({ message: "jobId is required" })
  @IsMongoId({ each: true, message: "jobId is a mongoId" })
  @IsArray({ message: "Permissions is an array" })
  permissions: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty({ message: "jobId is required" })
  name: string;

  @IsNotEmpty({ message: "description is required" })
  description: string;

  @IsNotEmpty({ message: "isActive is required" })
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive: boolean;
}

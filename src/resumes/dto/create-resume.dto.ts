import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "userId is required" })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "url is required" })
  url: string;

  @IsNotEmpty({ message: "status is required" })
  status: string;

  @IsNotEmpty({ message: "companyId is required" })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "jobId is required" })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: "companyId is required" })
  @IsMongoId({ message: "companyId is a mongoId" })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "jobId is required" })
  @IsMongoId({ message: "jobId is a mongoId" })
  jobId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "url is required" })
  url: string;
}

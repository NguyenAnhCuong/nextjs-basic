import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({ message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Skills are required" })
  @IsArray({ message: "Skills must be an array" })
  @IsString({ each: true, message: "Skills must be an array of strings" })
  skills: string[];
}
